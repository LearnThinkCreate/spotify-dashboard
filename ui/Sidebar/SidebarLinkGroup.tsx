"use client";
import { ReactNode, useState } from "react";
import SidebarLink from "./SidebarLink";
import DropdownIcon from "./SidebarIcons/DropdownIcon";

interface SidebarLinkGroupProps {
  icon: ReactNode;
  label: string;
  path: string;
  onLinkClick?: (e) => void;
  children: ReactNode;
  activeCondition: boolean;
}

const SidebarLinkGroup = ({
  icon,
  label,
  path,
  onLinkClick,
  children,
  activeCondition,
}: SidebarLinkGroupProps) => {
  const [open, setOpen] = useState<boolean>(activeCondition);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <SidebarLink
        path={path}
        onLinkClick={(e) => {
          e.preventDefault();
          onLinkClick(handleClick);
        }}
      >
        {icon}
        <span>{label}</span>
        <DropdownIcon open={open} />
      </SidebarLink>
      <div
        className={`translate transform overflow-hidden ${
          !open && "hidden"
        }`}
      >
        <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
          {children}
        </ul>
      </div>
</>
  );
};

export default SidebarLinkGroup;
