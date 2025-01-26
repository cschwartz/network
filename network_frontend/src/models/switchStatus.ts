enum PortStatus {
  not_used = "not_used",
  pre_validated = "pre_validated",
  need_validation = "need_validation",
}

type Port = {
  id: number;
  name: string;
  port_status: PortStatus;
};

type SwitchStatus = {
  ports: Port[];
  target_port: number | null;
};

export { type Port, PortStatus, type SwitchStatus };
