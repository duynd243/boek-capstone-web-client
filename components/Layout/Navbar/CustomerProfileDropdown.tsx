import React, { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import DefaultAvatar from "../../../assets/images/default-avatar.png";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

type Props = {}

const CustomerProfileDropdown: React.FC<Props> = ({}) => {
    const { loginUser, user, logOut } = useAuth();
    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button
                    className="flex rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <Image
                        width={500} height={500}
                        className="h-8 w-8 rounded-full object-cover"
                        src={loginUser?.imageUrl || user?.photoURL || DefaultAvatar.src}
                        alt=""
                    />
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <Menu.Item>
                        {({ active }) => (
                            <Link
                                href="/profile"
                                className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}
                            >
                                Hồ sơ
                            </Link>
                        )}
                    </Menu.Item>
                    {/*<Menu.Item>*/}
                    {/*    {({ active }) => (*/}
                    {/*        <a*/}
                    {/*            href="#"*/}
                    {/*            className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}*/}
                    {/*        >*/}
                    {/*            Settings*/}
                    {/*        </a>*/}
                    {/*    )}*/}
                    {/*</Menu.Item>*/}
                    <Menu.Item>
                        {({ active }) => (
                            <button
                                onClick={logOut}
                                className={classNames(active ? "bg-gray-100" : "", "block px-4 py-2 text-sm text-gray-700")}
                            >
                                Đăng xuất
                            </button>
                        )}
                    </Menu.Item>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default CustomerProfileDropdown;