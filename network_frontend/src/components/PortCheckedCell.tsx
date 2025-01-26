import { PortChecked } from "../models/portChecked";
import { Port, PortStatus } from "../models/switchStatus";
import CheckPortSwitch from "./CheckPortSwitch";

type PortCheckedCellProps = {
  port: Port;
  portsChecked: PortChecked[];
  setPortsChecked: (portsChecked: PortChecked[]) => void;
};

const PortCheckedCell = ({
  port,
  portsChecked,
  setPortsChecked,
}: PortCheckedCellProps) => {
  switch (port.port_status) {
    case PortStatus.not_used:
      return <span className="text-sm text-gray-500">Not used</span>;
    case PortStatus.pre_validated:
      return <span className="text-sm text-green-500">Pre-validated</span>;
    case PortStatus.need_validation:
      return (
        <CheckPortSwitch
          port={port}
          portsChecked={portsChecked}
          setPortsChecked={setPortsChecked}
        />
      );
  }
};

export default PortCheckedCell;
