import React, { Fragment, useState } from "react";
import { ISidebarMenu } from "../../constants/SidebarMenus";
import Link from "next/link";
import { useRouter } from "next/router";

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
    activeMenu: ISidebarMenu | undefined;
    data: ISidebarMenu;
    isActive: boolean;
};


const SubMenu: React.FC<Omit<Props, "activeMenu">> = ({ data, isActive }) => {
    return (
        <Link
            href={data.path}
            className={`block truncate font-medium text-sm transition duration-150 py-2 ${isActive ? "text-indigo-500" : "text-slate-400 hover:text-slate-100"}`}
        >
            {data?.name}
        </Link>
    );
};

const AdminSidebarMenu: React.FC<Props> = ({ data, isActive, activeMenu }) => {
    const router = useRouter();
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const hasSubMenus = data?.subMenus && data?.subMenus?.length > 0;

    // useEffect(() => {
    //     if (isSubMenuOpen &&
    //         hasSubMenus &&
    //         data?.subMenus?.findIndex((subMenu) => subMenu.path === router.pathname) === -1
    //     ) {
    //         setIsSubMenuOpen(false);
    //     }
    // }, [data?.subMenus, hasSubMenus, isSubMenuOpen, router.pathname]);


    return (
        <li
            className={`mb-0.5 select-none rounded px-3.5 py-1.5 last:mb-0 ${
                isActive && "bg-gray-900"
            }`}
        >
            {!hasSubMenus ?
                <Link
                    className={`block truncate text-slate-200 transition duration-150 hover:text-white ${isActive && "hover:text-slate-200"}`}
                    href={data.path}
                >
                    <div className="flex items-center py-2">
                        {data?.icon && (
                            <SidebarMenuIcon icon={data.icon} isActive={isActive} />
                        )}
                        <div className="ml-3 text-sm font-medium duration-200 flex-1">
                            {data?.name}
                        </div>

                    </div>
                </Link>
                : <Fragment>
                    <button
                        onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
                        className={`block w-full cursor-pointer truncate text-slate-200 transition duration-150 hover:text-white ${isActive && "hover:text-slate-200"}`}
                    >
                        <div className="flex items-center py-2">
                            {data?.icon && (
                                <SidebarMenuIcon icon={data.icon} isActive={isActive} />
                            )}
                            <div className="ml-3 text-sm font-medium duration-200 flex-1 min-w-0">
                                    <span className={"text-left break-words line-clamp-1"}>
                                        {data?.name}
                                    </span>
                            </div>
                            <div className={"ml-3 flex items-center justify-center text-slate-400"}>
                                <svg
                                    className={`w-3 h-3 flex-shrink-0 fill-current ${isSubMenuOpen ? "transform rotate-180" : ""}`}
                                    viewBox="0 0 12 12">
                                    <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z"></path>
                                </svg>
                            </div>
                        </div>
                    </button>

                    {isSubMenuOpen && <ul className={"ml-6"}>
                        {data?.subMenus?.map((subMenu, index) => (
                            <SubMenu key={index} data={subMenu} isActive={
                                isActive && (subMenu?.path === activeMenu?.path || router.asPath.startsWith(subMenu?.path))
                            } />
                        ))}
                    </ul>}
                </Fragment>
            }

        </li>
    );
};

export default AdminSidebarMenu;
