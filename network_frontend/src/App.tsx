import { useEffect, useState } from "react";
import { useInterval, useLocalStorage } from "react-use";
import LoadingSpinner from "./components/LoadingSpinner";
import NavBar from "./components/NavBar";
import PortTable from "./components/PortTable";
import { SwitchStatus } from "./models/switchStatus";
import { makeDefaultPortChecked } from "./models/portChecked";

type AppProps = {
  backendUrl: string;
  numPorts: number;
  updateInterval: number;
};

function App({ backendUrl, numPorts, updateInterval }: AppProps) {
  const defaultPortsChecked = makeDefaultPortChecked(numPorts);

  const [switchStatus, setSwitchStatus] = useState<SwitchStatus>();

  const [portsChecked = defaultPortsChecked, setPortsChecked] = useLocalStorage(
    "portsChecked",
    defaultPortsChecked
  );

  useInterval(async () => {
    const response = await fetch(`${backendUrl}/`);
    const data = await response.json();
    setSwitchStatus(data);
  }, updateInterval);

  useEffect(() => {
    const updateData = async () => {
      const response = await fetch(`${backendUrl}/`);
      const data = await response.json();
      setSwitchStatus(data);
    };

    updateData();
  }, [backendUrl]);

  return (
    <>
      <NavBar
        backendUrl={backendUrl}
        probeActive={switchStatus?.target_port !== undefined}
      />
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
