import React from "react";
import { Disclosure } from "@headlessui/react";
import { HiBars3, HiBell, HiXMark } from "react-icons/hi2";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import CustomerProfileDropdown from "./CustomerProfileDropdown";
import { FiLogIn } from "react-icons/fi";

const navigation = [
    { name: "Trang chủ", href: "/", current: false },
    { name: "Hội sách", href: "/campaigns", current: false },
    { name: "Sách", href: "/products", current: false },
    { name: "Đơn hàng", href: "/orders", current: false },
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

type Props = {}

const CustomerNavbar: React.FC<Props> = ({}) => {
    const { loginUser, user, logOut } = useAuth();
    return (
        <header className={"sticky top-0 left-0 right-0 z-30 bg-white/70 shadow backdrop-blur-lg transition-transform"}>
            <Disclosure as="nav" className="">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-[4.5rem] items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button
                                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <HiXMark className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <HiBars3 className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div
                                    className="flex flex-1 items-center justify-center sm:justify-start">
                                    <Link
                                        href={"/"}
                                        className="flex flex-shrink-0 items-center">
                                        <Image
                                            width={600} height={600}
                                            className="block h-12 w-auto lg:hidden"
                                            src="https://i.upanh.org/2023/04/03/boek-logoa702ffa1a5d22adf.png"
                                            alt="Your Company"
                                        />
                                        <Image
                                            width={600} height={600}
                                            className="hidden h-14 w-auto lg:block"
                                            src="https://i.upanh.org/2023/04/03/boek-logoa702ffa1a5d22adf.png"
                                            alt="Your Company"
                                        />
                                    </Link>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current ? "bg-gray-100 text-gray-800" : "text-gray-800 hover:bg-gray-50",
                                                        "rounded-md px-3 py-2 text-sm font-medium",
                                                    )}
                                                    aria-current={item.current ? "page" : undefined}
                                                >
                                                    {item.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    {loginUser?.accessToken &&
                                        <button
                                            type="button"
                                            className="rounded-full p-1 text-slate-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="sr-only">View notifications</span>
                                            <HiBell className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    }

                                    {loginUser?.accessToken ? <CustomerProfileDropdown /> : <div>
                                        <Link href={"/login"}
                                              className="flex items-center gap-2 text-slate-800 hover:bg-gray-50 rounded-md px-3 py-2 font-medium">
                                            <FiLogIn className="h-4 w-4" aria-hidden="true" />
                                            <span className="hidden md:block">Đăng nhập</span>
                                        </Link>
                                    </div>}
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => (
                                    <Disclosure.Button
                                        key={item.name}
                                        as="a"
                                        href={item.href}
                                        className={classNames(
                                            item.current ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                                            "block rounded-md px-3 py-2 text-base font-medium",
                                        )}
                                        aria-current={item.current ? "page" : undefined}
                                    >
                                        {item.name}
                                    </Disclosure.Button>
                                ))}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </header>
    );
};

export default CustomerNavbar;