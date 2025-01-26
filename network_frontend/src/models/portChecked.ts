type PortChecked = {
  checked: boolean;
};

const makeDefaultPortChecked = (numPorts: number): PortChecked[] => {
  return Array.from({ length: numPorts }, () => ({
    checked: false,
  }));
};

export { makeDefaultPortChecked };
export type { PortChecked };
