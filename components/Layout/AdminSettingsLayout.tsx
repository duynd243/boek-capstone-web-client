import Link from "next/link";
import {useRouter} from "next/router";
import React, {useMemo} from "react";
import {findRole} from "../../constants/Roles";
import {useAuth} from "../../context/AuthContext";

type Props = {
    children: React.ReactNode;
    childrenWrapperClassName?: string;
};

const AdminSettingsLayout = ({children, childrenWrapperClassName}: Props) => {
    const router = useRouter();
    const {loginUser} = useAuth();
    const menus = useMemo(() => {
        return findRole(loginUser?.role)?.settingsMenus || [];
    }, [loginUser]);

    return (
        <main className="relative">
            <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
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

                        <div className={childrenWrapperClassName || 'py-6 px-4 sm:p-6 lg:col-span-9'}>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default AdminSettingsLayout;
