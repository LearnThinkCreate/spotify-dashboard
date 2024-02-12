"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import SidebarLinkGroup from "./SidebarLinkGroup";
import SidebarItem from "./SidebarItem";
import SidebarHeader from "./SidebarHeader";
import DashboardIcon from "./SidebarIcons/DashboardIcon";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  let storedSidebarExpanded = "true";

  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const toggleSideBar = (func) => {
    sidebarExpanded
      ? func()
      : setSidebarExpanded(true);
  };

  const onLinkClick = (open) => {if (sidebarExpanded) {setSidebarOpen(false)}}; 

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <SidebarHeader trigger={trigger} sidebarOpen={sidebarOpen} onSideBarClick={() => setSidebarOpen(!sidebarOpen)} />
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        {/* <!-- Sidebar Menu --> */}
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          {/* <!-- Others Group --> */}
          <ul className="mb-6 flex flex-col gap-1.5">
            {/* <!-- Dashboard --> */}
            <SidebarLinkGroup
              activeCondition={
                pathname === "/" || pathname.includes("chart")
              }
              icon={<DashboardIcon />}
              label="Dashboard"
              path="/"
              onLinkClick={toggleSideBar}
            >
              <SidebarItem title="Basic Chart" path="/" pathname={pathname} onLinkClick={onLinkClick} />
              <SidebarItem title="Advanced Chart" path="/chart/advanced-chart" pathname={pathname} onLinkClick={onLinkClick} />
              <SidebarItem title="Tables" path="/tables" pathname={pathname} onLinkClick={onLinkClick} />
            </SidebarLinkGroup>
            <SidebarItem title="Test Chart" path="/testChart" pathname={pathname} onLinkClick={onLinkClick} />


          </ul>
        </nav>
        {/* <!-- Sidebar Menu --> */}
      </div>
    </aside>
  );
};

export default Sidebar;
