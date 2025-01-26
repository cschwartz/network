import { BoltIcon } from "@heroicons/react/16/solid";

const ProbeActivCell = ({ active }: { active: boolean }) => {
  return (
    <div className="flex justify-center">
      {active ? <BoltIcon className="size-6 text-green-500" /> : " "};
    </div>
  );
};

export default ProbeActivCell;
