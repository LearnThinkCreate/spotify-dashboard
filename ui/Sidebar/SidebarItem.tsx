"use client";
import Link from "next/link";

interface SidebarLinkGroupProps {
    title: string;
    pathname: string;
    path: string;
    onLinkClick?: (e) => void;
}

const SidebarItem = ({ title, pathname, path, onLinkClick }: SidebarLinkGroupProps) => {
    return (
        <>
            <li>
                <Link
                    href={path}
                    className={`group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ${pathname === path &&
                        "text-white"
                        }`}
                    onClick={onLinkClick}
                >
                    {title}
                </Link>
            </li>
        </>
    );
}

export default SidebarItem;