import subprocess
from typing import Optional, Dict
from fastapi.staticfiles import StaticFiles
import requests
from fastapi.middleware.cors import CORSMiddleware
import paramiko
from enum import Enum
from pydantic.networks import IPv4Address
from pydantic_extra_types.mac_address import MacAddress
from pydantic_settings import BaseSettings, SettingsConfigDict
import logging
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)


logger = logging.getLogger('uvicorn.error')

class PortStatus(str, Enum):
    not_used = "not_used"
    pre_validated = "pre_validated"
    need_validation = "need_validation"

class Settings(BaseSettings):
    controller_url: str
    username: str
    password: str
    site_name: str
    switch_mac: MacAddress
    target_ip: IPv4Address 
    target_username: str
    target_password: str
    num_ports: int

    port_statuses: Dict[int, PortStatus]

    model_config = SettingsConfigDict(env_file="../.env", env_nested_delimiter='__', extra="ignore")


settings = Settings()

def make_authenticate(username, password, controller_url):
    def authenticate(session: requests.Session):
        login_payload = {"username": username, "password": password, "rememberMe": False, "token": ""}
        auth_url = f"{controller_url}/api/auth/login"
        
        logger.info("Authenticating...")
        response = session.post(auth_url, json=login_payload, verify=False)

        if response.status_code == 200:
            logger.info("Authentication successful.")
        else:
            logger.error("Authentication failed: '%s'", response.text)
            exit()

    return authenticate

authenticate = make_authenticate(settings.username, settings.password, settings.controller_url)

def make_get(settings: Settings, api_prefix = "/proxy/network"):
    controller_url = settings.controller_url
    site_name = settings.site_name
    def get(session, path):
        full_path = f"{controller_url}{api_prefix}/api/s/{site_name}{path}"
        response = session.get(full_path, verify=False)
        if response.status_code in [401, 403]:
            logger.info("Re-authenticating...")
            authenticate(session)
            response = session.get(full_path, verify=False)
            if response.status_code in [401, 403]:
                logger.fatal("Authentication failed: '%s'", response.text)
                exit()

        try:
            return response.json()
        except:
            logger.fatal("Failed to parse response: '%s'", response.text)
    return get


get = make_get(settings)

def get_switch_port_for_ip(session, target_ip, switch_mac) -> Optional[int]:
    clients_url = f"/stat/sta"
    clients_response = get(session, clients_url)


    clients = clients_response.get("data", [])

    client_device = next((client for client in clients if client.get("ip") == str(target_ip)), None)
    if client_device is None:
        return None
    else:
        last_uplink_mac = client_device.get("last_uplink_mac", None)

        if last_uplink_mac != switch_mac:
            return None

        switch_port = client_device.get("sw_port", None)

        return switch_port

def is_reachable(ip: IPv4Address) -> bool:
    try:
        result = subprocess.run(['ping', '-c', '1', str(ip)], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        return result.returncode == 0
    except Exception as e:
        return False


def get_port_idx_to_name(session: requests.Session, switch_mac: MacAddress, port_statuses: Dict[int, PortStatus]) -> Optional[Dict[int, str]]:
    portconf_url = f"/stat/device/{switch_mac}"
    device_root = get(session, portconf_url)

    devices_data = device_root.get("data", [])

    if len(devices_data) == 1:
        device_data = devices_data[0]
        port_table = device_data.get("port_table", [])

        return [{
            "id": port.get("port_idx"),
              "name": port.get("name"),
              "port_status": port_statuses.get(port.get("port_idx"))} for port in port_table]
    else:
        return []


session = requests.Session() 
authenticate(session)

from fastapi import FastAPI

app = FastAPI()

api_app = FastAPI(title="api")

origins = [
    "http://localhost",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@api_app.get("/")
def read_root():
    target_is_reachable = is_reachable(settings.target_ip)
    target_port = get_switch_port_for_ip(session, settings.target_ip, settings.switch_mac)

    target_available = target_is_reachable and target_port is not None

    return {
        "ports": get_port_idx_to_name(session, settings.switch_mac, settings.port_statuses)
    } | (
        {"target_port": get_switch_port_for_ip(session, settings.target_ip, settings.switch_mac) } if target_available else {}
    )

@api_app.post("/probe/shutdown")
def shutdown():
    try:
        logger.info("Shutting down target machine...")
        ssh = paramiko.SSHClient()
        ssh.load_system_host_keys()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        ssh.connect(str(settings.target_ip), username=settings.target_username, password=settings.target_password)
        
        _, stdout, _ = ssh.exec_command('sudo shutdown -h now')
        
        stdout.channel.recv_exit_status()
        
        ssh.close()
        logger.info("Shutdown command sent.")
        return {"status": "ok"}
    except Exception as e:
        logger.error("Error shutting down target machine: %s", e)
        return {"status": "error"}
   
   
app.mount("/api", api_app)
app.mount("/", StaticFiles(directory="static", html=True), name="frontend")