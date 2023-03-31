import Image from "next/image";

import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { findRole, Roles } from "../constants/Roles";
import Link from "next/link";
import CustomerHomePage from "../components/CustomerHomePage";
import CustomerLayout from "../components/Layout/CustomerLayout";

const Index = () => {
    const router = useRouter();
    const { loginUser, logOut } = useAuth();

    return (
        <>
            {loginUser && loginUser?.role === Roles.CUSTOMER.id ?
                <CustomerLayout>
                    <CustomerHomePage />
                </CustomerLayout>
                :
                <section>
                    <div className="mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div
                                className="relative overflow-hidden rounded-lg bg-blue-600 p-8  shadow-lg md:p-12 lg:px-16 lg:py-24">
                                <div className="mx-auto max-w-xl text-center">
                                    <h2 className="text-2xl font-bold text-white md:text-3xl">
                                        Lorem, ipsum dolor sit amet consectetur adipisicing elit
                                    </h2>
                                    <p className="hidden text-white/90 sm:mt-4 sm:block ">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Et,
                                        egestas tempus tellus etiam sed. Quam a scelerisque amet
                                        ullamcorper eu enim et fermentum, augue. Aliquet amet volutpat
                                        quisque ut interdum tincidunt duis.
                                    </p>
                                    <div className="mt-4 md:mt-8">
                                        <div
                                            onClick={loginUser ? logOut : () => router.push("/login")}
                                            className="inline-block transform cursor-pointer rounded border border-white bg-white px-12 py-3 text-sm font-medium text-blue-500 transition transition duration-500 ease-in-out focus:outline-none focus:ring focus:ring-yellow-400"
                                        >
                                            {loginUser ? "Logout" : "Login"}
                                        </div>
                                    </div>
                                    {loginUser && (
                                        <Link
                                            href={findRole(loginUser?.role)?.defaultRoute || "/"}
                                            className="mt-4 block text-white underline"
                                        >
                                            Go to {findRole(loginUser?.role)?.name} page
                                        </Link>
                                    )}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 md:grid-cols-1 lg:grid-cols-2">
                                <Image
                                    width={600}
                                    height={400}
                                    alt="Student"
                                    src="https://images.unsplash.com/photo-1621274790572-7c32596bc67f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=654&q=80"
                                    //Hold the mouse to enlarge the image
                                    className="h-40 w-full transform cursor-pointer rounded object-cover shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl sm:h-56 md:h-full"
                                />
                                <Image
                                    width={600}
                                    height={400}
                                    alt="Student"
                                    src="https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                                    className="h-40 w-full transform cursor-pointer rounded object-cover shadow-lg transition duration-300 ease-in-out hover:scale-105 hover:shadow-2xl sm:h-56 md:h-full"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            }
        </>
    )
        ;
};

export default Index;
