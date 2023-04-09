import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { findRole } from "../../constants/Roles";
import Link from "next/link";

type Props = {
    children: React.ReactNode;
}

const CustomerSettingsLayout: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    const { loginUser } = useAuth();
    const menus = useMemo(() => {
        return findRole(loginUser?.role)?.settingsMenus || [];
    }, [loginUser]);
    return (
        <div
            className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x bg-white overflow-hidden rounded-lg shadow">
            <aside className="py-6 lg:col-span-3">
                <nav className="space-y-1">
                    {menus.map((menu) => (
                        <Link
                            key={menu?.path}
                            href={menu?.path}
                            className={`${
                                menu?.path === router.pathname
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700"
                                    : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900"
                            }  group flex items-center border-l-4 px-3 py-2 text-sm font-medium py-3`}
                            // aria-current={
                            //     item.current ? "page" : undefined
                            // }
                        >
                            {/*<item.icon*/}
                            {/*  className={classNames(*/}
                            {/*    item.current*/}
                            {/*      ? 'text-indigo-500 group-hover:text-indigo-500'*/}
                            {/*      : 'text-gray-400 group-hover:text-gray-500',*/}
                            {/*    'flex-shrink-0 -ml-1 mr-3 h-6 w-6'*/}
                            {/*  )}*/}
                            {/*  aria-hidden="true"*/}
                            {/*/>*/}
                            <div className={"mr-2"}>
                                {menu.icon}
                            </div>
                            <span className="truncate">
                                            {menu.name}
                                        </span>
                        </Link>
                    ))}
                </nav>
            </aside>

            <div className={"lg:col-span-9"}>
                {children}
            </div>
        </div>
    );
};

export default CustomerSettingsLayout;