import React from "react";
import { ISidebarMenu } from "../../constants/SidebarMenus";
import Link from "next/link";

const SidebarMenuIcon: React.FC<{
  icon: React.ReactNode;
  isActive: boolean;
}> = ({ icon, isActive }) => {
  return (
    <span className={`${isActive ? "text-indigo-500" : "text-indigo-300"}`}>
      {icon}
    </span>
  );
};

type Props = {
  data: ISidebarMenu;
  isActive: boolean;
};

const AdminSidebarMenu: React.FC<Props> = ({ data, isActive }) => {
  return (
    <li
      className={`mb-0.5 select-none rounded px-3.5 py-1.5 last:mb-0 ${
        isActive && "bg-gray-900"
      }`}
    >
      <Link
        className={`block truncate text-slate-200 transition duration-150 hover:text-white
                ${isActive && "hover:text-slate-200"}`}
        href={data.path}
      >
        <div className="flex items-center py-2">
          {data?.icon && (
            <SidebarMenuIcon icon={data.icon} isActive={isActive} />
          )}
          <span className="ml-3 text-sm font-medium duration-200">
            {data?.name}
          </span>
        </div>
      </Link>
    </li>
  );
};

export default AdminSidebarMenu;
