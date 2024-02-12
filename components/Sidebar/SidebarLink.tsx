"use client";
import Link from "next/link";

interface SidebarLinkProps {
    path: string;
    onLinkClick: (e) => void;
    children: React.ReactNode;
}

const SidebarLink = ({ path, onLinkClick,children }: SidebarLinkProps) => {
    return (
        <Link
            href={path}
            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 "bg-graydark dark:bg-meta-4"`}
            onClick={onLinkClick}
        >

            {children}
        </Link>
    )
}

export default SidebarLink;