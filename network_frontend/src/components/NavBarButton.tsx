import classNames from "classnames";

type NavBarButtonProps = {
  children: React.ReactNode;
  primaryColor: string;
  hoverColor: string;
  onClick: () => void;
  disabled: boolean;
};

const NavBarButton = ({
  children,
  primaryColor,
  hoverColor,
  disabled,
  onClick,
}: NavBarButtonProps) => {
  const btnClass = classNames(
    "relative",
    "inline-flex",
    "items-center",
    "gap-x-1.5",
    "rounded-md",
    "px-3",
    "py-2",
    "text-sm",
    "font-semibold",
    "text-white",
    "shadow-sm",
    { "cursor-not-allowed": disabled },
    primaryColor,
    `hover:${hoverColor}`
  );
  return (
    <button
      type="button"
      className={btnClass}
      onClick={disabled ? () => {} : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default NavBarButton;
