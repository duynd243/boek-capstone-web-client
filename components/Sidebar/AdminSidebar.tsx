import React, {useEffect, useRef, useState} from "react";
import {ISidebarMenu, ISidebarMenuGroup} from "../../constants/SidebarMenus";
import {useAuth} from "../../context/AuthContext";
import {findRole} from "../../constants/Roles";
import Link from "next/link";
import AdminSidebarMenu from "./AdminSidebarMenu";
import {useRouter} from "next/router";

type Props = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const AdminSidebar: React.FC<Props> = ({isSidebarOpen, setIsSidebarOpen}) => {
    const router = useRouter();
    const [sidebarMenuGroups, setSidebarMenuGroups] = useState<
        ISidebarMenuGroup[]
    >([]);
    const [activeMenu, setActiveMenu] = useState<ISidebarMenu | undefined>(
        undefined
    );
    const {loginUser} = useAuth();

    // create ref for sidebar
    const sidebarRef = useRef<HTMLDivElement>(null);
    const trigger = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const role = findRole(loginUser?.role);
        if (role?.sidebarMenuGroups) {
            setSidebarMenuGroups(role.sidebarMenuGroups);
        }
    }, [loginUser?.role]);

    useEffect(() => {
        //let activeMenu = sidebarMenus.find(menu => 'path' in menu && menu.path === router.pathname);
        const sidebarMenus = sidebarMenuGroups.map((group) => group.menus).flat();
        let activeMenu = sidebarMenus.find((menu) => menu.path === router.pathname);
        if (!activeMenu) {
            const role = findRole(loginUser?.role);
            activeMenu = sidebarMenus.find(
                (menu) =>
                    menu.path !== role?.defaultRoute &&
                    router.pathname.startsWith(menu.path)
            );
        }
        setActiveMenu(activeMenu);
    }, [loginUser?.role, router.pathname, sidebarMenuGroups]);

    // close on click outside
    useEffect(() => {
        const clickHandler = ({target}: { target: any }) => {
            if (!sidebarRef.current || !trigger.current) return;
            if (
                !isSidebarOpen ||
                sidebarRef.current.contains(target) ||
                trigger.current.contains(target)
            )
                return;
            setIsSidebarOpen(false);
        };
        document.addEventListener("click", clickHandler);
        return () => document.removeEventListener("click", clickHandler);
    });
    return (
        <div>
            {/* Sidebar backdrop (mobile only) */}
            <div
                className={`fixed inset-0 z-40 bg-slate-900 bg-opacity-30 transition-opacity duration-200 lg:z-auto lg:hidden ${
                    isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                aria-hidden="true"
            ></div>
            {/* Sidebar */}
            <div
                ref={sidebarRef}
                className={`no-scrollbar absolute left-0 top-0 z-40 flex h-screen w-64 shrink-0 flex-col overflow-y-scroll bg-gray-800 p-4 transition-all duration-200 ease-in-out lg:static lg:left-auto lg:top-auto lg:!w-64 lg:translate-x-0 lg:overflow-y-auto 2xl:!w-64 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-64"
                }`}
            >
                {/*Sidebar header*/}
                <div className="mb-10 flex justify-between pr-3 sm:px-2">
                    {/* Close button */}
                    <button
                        ref={trigger}
                        className="text-slate-500 hover:text-slate-400 lg:hidden"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        aria-controls="sidebar"
                        aria-expanded={isSidebarOpen}
                    >
                        <span className="sr-only">Close sidebar</span>
                        <svg
                            className="h-6 w-6 fill-current"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z"/>
                        </svg>
                    </button>
                    {/* Logo */}
                    <Link href={"/"} className="block">
                        <svg width="32" height="32" viewBox="0 0 32 32">
                            <defs>
                                <linearGradient
                                    x1="28.538%"
                                    y1="20.229%"
                                    x2="100%"
                                    y2="108.156%"
                                    id="logo-a"
                                >
                                    <stop stopColor="#A5B4FC" stopOpacity="0" offset="0%"/>
                                    <stop stopColor="#A5B4FC" offset="100%"/>
                                </linearGradient>
                                <linearGradient
                                    x1="88.638%"
                                    y1="29.267%"
                                    x2="22.42%"
                                    y2="100%"
                                    id="logo-b"
                                >
                                    <stop stopColor="#38BDF8" stopOpacity="0" offset="0%"/>
                                    <stop stopColor="#38BDF8" offset="100%"/>
                                </linearGradient>
                            </defs>
                            <rect fill="#6366F1" width="32" height="32" rx="16"/>
                            <path
                                d="M18.277.16C26.035 1.267 32 7.938 32 16c0 8.837-7.163 16-16 16a15.937 15.937 0 01-10.426-3.863L18.277.161z"
                                fill="#4F46E5"
                            />
                            <path
                                d="M7.404 2.503l18.339 26.19A15.93 15.93 0 0116 32C7.163 32 0 24.837 0 16 0 10.327 2.952 5.344 7.404 2.503z"
                                fill="url(#logo-a)"
                            />
                            <path
                                d="M2.223 24.14L29.777 7.86A15.926 15.926 0 0132 16c0 8.837-7.163 16-16 16-5.864 0-10.991-3.154-13.777-7.86z"
                                fill="url(#logo-b)"
                            />
                        </svg>
                    </Link>
                </div>
                {/*Sidebar content*/}
                <div>
                    {sidebarMenuGroups.map((group) => {
                        return (
                            <div className="mt-3.5 first:mt-0" key={group.groupName}>
                                <div className="mb-2 px-3.5 text-xs font-medium uppercase text-slate-400">
                                    {group.groupName}
                                </div>
                                <ul>
                                    {group.menus.map((menu) => (
                                        <AdminSidebarMenu
                                            isActive={activeMenu?.path === menu.path}
                                            data={menu}
                                            key={menu?.path}
                                        />
                                    ))}
                                </ul>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AdminSidebar;
