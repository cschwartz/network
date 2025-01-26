import { PortChecked } from "../models/portChecked";
import { Port } from "../models/switchStatus";
import PortCheckedCell from "./PortCheckedCell";
import ProbeActivCell from "./ProbeActivCell";

type PortRowProps = {
  port: Port;
  active: boolean;
  portsChecked: PortChecked[];
  setPortsChecked: (portsChecked: PortChecked[]) => void;
};

const PortRow = ({
  port,
  active,
  portsChecked,
  setPortsChecked,
}: PortRowProps) => {
  return (
    <tr key={port.id}>
      <td className="whitespace-nowrap text-right px-3 py-4 text-sm font-medium text-gray-900">
        {port.id}
      </td>
      <td className="whitespace-normal text-center px-3 py-4 text-sm text-gray-500">
        {port.name}
      </td>
      <td className="whitespace-nowrap  px-3 py-4 text-sm text-gray-500">
        <ProbeActivCell active={active} />
      </td>
      <td className="relativewhitespace-nowrap px-3 py-4 text-center text-sm font-medium">
        <PortCheckedCell
          port={port}
          portsChecked={portsChecked}
          setPortsChecked={setPortsChecked}
        />
      </td>
    </tr>
  );
};

export default PortRow;
