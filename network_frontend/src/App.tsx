import { useEffect, useState } from "react";
import { useInterval, useLocalStorage } from "react-use";
import { Switch } from "@headlessui/react";
import { BoltIcon, PowerIcon } from "@heroicons/react/20/solid";

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

type PortChecked = {
  checked: boolean;
};

const ProbeActiveIcon = ({ active }: { active: boolean }) => {
  return active ? <BoltIcon className="size-6 text-green-500" /> : null;
};

type PortCheckSwitchProps = {
  port: Port;
  portsChecked: PortChecked[];
  setPortsChecked: (portsChecked: PortChecked[]) => void;
};

const PortCheckSwitch = ({
  port,
  portsChecked,
  setPortsChecked,
}: PortCheckSwitchProps) => {
  const thisPortChecked = portsChecked[port.id - 1];

  return (
    <Switch
      checked={thisPortChecked.checked}
      onChange={() => {
        setPortsChecked(
          portsChecked.map((portChecked, index) =>
            index === port.id - 1
              ? { checked: !thisPortChecked.checked }
              : portChecked
          )
        );
      }}
      className="group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
      />
    </Switch>
  );
};

const RenderPortStatus = ({
  port,
  portsChecked,
  setPortsChecked,
}: {
  port: Port;
  portsChecked: PortChecked[];
  setPortsChecked: (portsChecked: PortChecked[]) => void;
}) => {
  switch (port.port_status) {
    case PortStatus.not_used:
      return <span className="text-sm text-gray-500">Not used</span>;
    case PortStatus.pre_validated:
      return <span className="text-sm text-green-500">Pre-validated</span>;
    case PortStatus.need_validation:
      return (
        <PortCheckSwitch
          port={port}
          portsChecked={portsChecked}
          setPortsChecked={setPortsChecked}
        />
      );
  }
};

type PortProps = {
  port: Port;
  active: boolean;
  portsChecked: PortChecked[];
  setPortsChecked: (portsChecked: PortChecked[]) => void;
};

const Port = ({ port, active, portsChecked, setPortsChecked }: PortProps) => {
  return (
    <tr key={port.id}>
      <td className="whitespace-nowrap text-right px-3 py-4 text-sm font-medium text-gray-900">
        {port.id}
      </td>
      <td className="whitespace-normal text-center px-3 py-4 text-sm text-gray-500">
        {port.name}
      </td>
      <td className="whitespace-nowrap  px-3 py-4 text-sm text-gray-500">
        <div className="flex justify-center">
          <ProbeActiveIcon active={active} />
        </div>
      </td>
      <td className="relativewhitespace-nowrap px-3 py-4 text-center text-sm font-medium">
        <RenderPortStatus
          port={port}
          portsChecked={portsChecked}
          setPortsChecked={setPortsChecked}
        />
      </td>
    </tr>
  );
};

type AppProps = {
  numPorts: number;
  updateInterval: number;
};

type PortTableProps = {
  switchStatus: SwitchStatus;
  portsChecked: PortChecked[];
  setPortsChecked: (portsChecked: PortChecked[]) => void;
};

const PortTable = ({
  switchStatus,
  portsChecked,
  setPortsChecked,
}: PortTableProps) => {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="text-right px-4 text-sm font-semibold text-gray-900"
          >
            ID
          </th>
          <th
            scope="col"
            className="text-left px-4 text-sm font-semibold text-gray-900"
          >
            Name
          </th>
          <th
            scope="col"
            className="text-center px-4 text-sm font-semibold text-gray-900"
          >
            Probe
          </th>
          <th
            scope="col"
            className="text-center px-4 text-sm font-semibold text-gray-900"
          >
            Checked
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {switchStatus.ports.map((port) => (
          <Port
            key={port.id}
            port={port}
            active={switchStatus.target_port === port.id}
            portsChecked={portsChecked}
            setPortsChecked={setPortsChecked}
          />
        ))}
      </tbody>
    </table>
  );
};

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <svg
        aria-hidden="true"
        className="inline size-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

type NavBarProps = {
  probeActive: boolean;
};

const NavBar = ({ probeActive }: NavBarProps) => {
  const [busy, setBusy] = useState(false);

  const handleShutdown = async () => {
    setBusy(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "/api";
    await fetch(`${backendUrl}/probe/shutdown`, {
      method: "POST",
    });
  };

  useEffect(() => {
    if (!probeActive) {
      setBusy(false);
    }
  }, [probeActive]);

  return (
    <nav className="bg-gray-300 shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex shrink-0 items-center">
              <h1 className="text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
                Checklist
              </h1>
            </div>
          </div>
          <div className="flex items-center">
            {probeActive ? (
              busy ? (
                <button
                  type="button"
                  className="relative inline-flex items-center gap-x-1.5 rounded-md bg-orange-200 px-3 py-2 text-sm font-semibold text-white shadow-sm cursor-not-allowed"
                  disabled
                >
                  <LoadingSpinner />
                  Shutdown
                </button>
              ) : (
                <button
                  type="button"
                  className="relative inline-flex items-center gap-x-1.5 rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                  onClick={handleShutdown}
                >
                  <PowerIcon aria-hidden="true" className="-ml-0.5 size-5" />
                  Shutdown
                </button>
              )
            ) : (
              <button
                type="button"
                className="relative inline-flex items-center gap-x-1.5 rounded-md bg-gray-400 px-3 py-2 text-sm font-semibold text-white shadow-sm cursor-not-allowed"
                disabled
              >
                <PowerIcon aria-hidden="true" className="-ml-0.5 size-5" />
                Shutdown
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

function App({ numPorts, updateInterval }: AppProps) {
  const makeDefaultPortChecked = (numPorts: number): PortChecked[] => {
    return Array.from({ length: numPorts }, () => ({
      checked: false,
    }));
  };

  const defaultPortsChecked = makeDefaultPortChecked(numPorts);

  const [switchStatus, setSwitchStatus] = useState<SwitchStatus>();

  const [portsChecked = defaultPortsChecked, setPortsChecked] = useLocalStorage(
    "portsChecked",
    defaultPortsChecked
  );

  const fetchData = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "/api";
    const response = await fetch(`${backendUrl}/`);
    const data = await response.json();
    setSwitchStatus(data);
  };

  useInterval(fetchData, updateInterval);
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <NavBar probeActive={switchStatus?.target_port !== undefined} />
      <div className="py-4">
        {switchStatus ? (
          <PortTable
            switchStatus={switchStatus}
            portsChecked={portsChecked}
            setPortsChecked={setPortsChecked}
          />
        ) : (
          <LoadingSpinner />
        )}
      </div>
    </>
  );
}

export default App;
