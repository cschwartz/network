import { type PortChecked } from "../models/portChecked";
import { type SwitchStatus } from "../models/switchStatus";
import PortRow from "./PortRow";

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
          <PortRow
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

export default PortTable;
