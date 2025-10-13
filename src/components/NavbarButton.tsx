import { cn } from "../lib/utils";

type NavbarButtonProps = {
  icon?: React.ReactNode;
  children: React.ReactNode;
  clasName?: string;
};

const NavbarButton = ({ children, icon, clasName }: NavbarButtonProps) => {
  return (
    <div
      className={cn(
        "w-[195px] h-[52px] bg-gray-400 flex items-center gap-[19px] rounded-sm",
        clasName
      )}
    >
      {icon}
      <p>{children}</p>
    </div>
  );
};

export default NavbarButton;
