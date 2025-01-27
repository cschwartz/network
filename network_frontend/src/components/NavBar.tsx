import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import { PowerIcon } from "@heroicons/react/20/solid";
import NavBarButton from "./NavBarButton";

type NavBarProps = {
  probeActive: boolean;
  backendUrl: string;
};

const NavBar = ({ backendUrl, probeActive }: NavBarProps) => {
  const [busy, setBusy] = useState(false);

  const handleShutdown = async () => {
    setBusy(true);

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
            <NavBarButton
              primaryColor={probeActive ? "bg-orange-200" : "bg-gray-500"}
              hoverColor={probeActive ? "bg-orange-300" : "bg-gray-600"}
              disabled={busy || !probeActive}
              onClick={handleShutdown}
            >
              {busy ? (
                <LoadingSpinner />
              ) : (
                <>
                  <PowerIcon aria-hidden="true" className="-ml-0.5 size-5" />{" "}
                  Shutdown
                </>
              )}
            </NavBarButton>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
