import React from "react";
import { Disclosure } from "@headlessui/react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import CustomerProfileDropdown from "./CustomerProfileDropdown";
import { FiLogIn } from "react-icons/fi";
import { IoBag } from "react-icons/io5";
import { useCartStore } from "../../../stores/CartStore";
import { classNames } from "../../../utils/helper";
import { useRouter } from "next/router";

const guestNavigation = [
    { name: "Trang chủ", href: "/"},
    { name: "Hội sách", href: "/campaigns"},
    { name: "Sách", href: "/products"},
];

const userNavigation = [
    ...guestNavigation,
    { name: "Đơn hàng", href: "/orders"},
];

type Props = {};

const CustomerNavbar: React.FC<Props> = ({}) => {
    const router = useRouter();
    const { loginUser, user, logOut } = useAuth();
    const { cart } = useCartStore((state) => state);

    const navigation = loginUser?.accessToken
        ? userNavigation
        : guestNavigation;

    const isActive = (href: string) => {
        return router.pathname === href;
    };
    return (
        <header
            className={
                "sticky top-0 left-0 right-0 z-30 bg-white/70 shadow backdrop-blur-lg transition-transform"
            }
        >
            <Disclosure as="nav" className="">
                {({ open }) => (
                    <>
                        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                            <div className="relative flex h-[4.5rem] items-center justify-between">
                                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                                    {/* Mobile menu button*/}
                                    <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                                        <span className="sr-only">
                                            Open main menu
                                        </span>
                                        {open ? (
                                            <HiXMark
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <HiBars3
                                                className="block h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </Disclosure.Button>
                                </div>
                                <div className="flex flex-1 items-center justify-center sm:justify-start">
                                    <Link
                                        href={"/"}
                                        className="flex flex-shrink-0 items-center"
                                    >
                                        <Image
                                            width={600}
                                            height={600}
                                            className="block h-12 w-auto lg:hidden"
                                            src="https://i.upanh.org/2023/04/03/boek-logoa702ffa1a5d22adf.png"
                                            alt="Your Company"
                                        />
                                        <Image
                                            width={600}
                                            height={600}
                                            className="hidden h-14 w-auto lg:block"
                                            src="https://i.upanh.org/2023/04/03/boek-logoa702ffa1a5d22adf.png"
                                            alt="Your Company"
                                        />
                                    </Link>
                                    <div className="hidden sm:ml-6 sm:block">
                                        <div className="flex space-x-4">
                                            {navigation.map((item) => {
                                                const active = isActive(
                                                    item.href
                                                );
                                                return (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={classNames(
                                                            active
                                                                ? "text-indigo-600"
                                                                : "hover:bg-gray-50",
                                                            "text-gray-800 px-3 py-2 text-sm font-medium"
                                                        )}
                                                        aria-current={
                                                            active
                                                                ? "page"
                                                                : undefined
                                                        }
                                                    >
                                                        {item.name}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                                    <Link
                                        href={"/cart"}
                                        type="button"
                                        className="rounded-full p-1 text-slate-600 relative focus:outline-none"
                                    >
                                        <IoBag
                                            className="h-6 w-6"
                                            aria-hidden="true"
                                        />
                                        <span className="absolute top-0 -right-2 inline-flex items-center justify-center px-1.5 py-1 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
                                            {cart?.length || 0}
                                        </span>
                                    </Link>

                                    {loginUser?.accessToken ? (
                                        <CustomerProfileDropdown />
                                    ) : (
                                        <div>
                                            <Link
                                                href={"/login"}
                                                className="flex items-center gap-2 text-slate-800 hover:bg-gray-50 rounded-md px-3 py-2 font-medium"
                                            >
                                                <FiLogIn
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                                <span className="hidden md:block">
                                                    Đăng nhập
                                                </span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Disclosure.Panel className="sm:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2">
                                {navigation.map((item) => {
                                    const active = isActive(item.href);
                                    return (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="div"
                                        >
                                            <Link
                                                href={item.href}
                                                className={classNames(
                                                    active
                                                        ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                                                        : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700",
                                                    "block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                                                )}
                                                aria-current={
                                                    active ? "page" : undefined
                                                }
                                            >
                                                {item.name}
                                            </Link>
                                        </Disclosure.Button>
                                    );
                                })}
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </header>
    );
};

export default CustomerNavbar;
