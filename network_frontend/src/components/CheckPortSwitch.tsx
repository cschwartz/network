import { Switch } from "@headlessui/react";
import { PortChecked } from "../models/portChecked";
import { Port } from "../models/switchStatus";

type CheckPortSwitchProps = {
  port: Port;
  portsChecked: PortChecked[];
  setPortsChecked: (portsChecked: PortChecked[]) => void;
};

const CheckPortSwitch = ({
  port,
  portsChecked,
  setPortsChecked,
}: CheckPortSwitchProps) => {
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

export default CheckPortSwitch;
