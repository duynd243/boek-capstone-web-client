import React, { useState } from "react";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Sidebar/AdminSidebar";
import { SignalRContext } from "../ProtectedRouteWrapper";
import { toast } from "react-hot-toast";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";
import { NotificationTypes } from "../../constants/NotificationTypes";
import { useAuth } from "../../context/AuthContext";
import { findRole } from "../../constants/Roles";
import { useQueryClient } from "@tanstack/react-query";
import BoekLogo from "../../assets/images/logo/boek-logo.png";

type Props = {
    children: React.ReactElement;
    containerClassName?: string;
    bgClassName?: string;
};

const AdminLayout: React.FC<Props> = ({ children, containerClassName, bgClassName }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const { loginUser } = useAuth();
    const commonProps = {
        isSidebarOpen,
        setIsSidebarOpen,
    };

    const queryClient = useQueryClient();

    SignalRContext.useSignalREffect("ReceiveMess",
        async (NotificationType, NotificationTypeName, Status, StatusName, Message) => {
            let viewUrl = "";
            if (NotificationType === NotificationTypes.CheckingBookProduct.id
                || NotificationType === NotificationTypes.DoneCheckingBookProduct.id
            ) {
                viewUrl = "/products";
            } else if (NotificationType === NotificationTypes.ParticipantInvitation.id ||
                NotificationType === NotificationTypes.ParticipantStatus.id
            ) {
                viewUrl = "/participants";
            } else if (NotificationType === NotificationTypes.ParticipantRequest.id) {
                viewUrl = "/participants?tab=request";
            }


            toast.custom((t) => (
                <div aria-live="assertive"
                     className={`${
                         t.visible ? "animate-enter" : "animate-leave"
                     } max-w-md w-full bg-white rounded-lg pointer-events-auto flex`}>
                    <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
                        <div
                            className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">
                            <div className="w-0 flex-1 p-4 my-auto">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 pt-0.5">
                                        <Image
                                            className="h-10 w-10 object-cover"
                                            width={40}
                                            height={40}
                                            src={BoekLogo.src}
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-3 w-0 flex-1">
                                        <p className="text-sm font-medium text-gray-900">Bạn có thông báo mới!</p>
                                        <p className="mt-1 text-sm text-gray-500">{Message}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col border-l border-gray-200">
                                <Link
                                    href={viewUrl ? findRole(loginUser?.role)?.baseUrl + viewUrl : "#"}
                                    className="w-full border border-transparent rounded-none rounded-tr-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">Xem
                                </Link>
                                <button
                                    onClick={() => toast.dismiss(t.id)}
                                    className="w-full border border-transparent rounded-none rounded-br-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">Ẩn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            ), {

                duration: 10000,
            });

            await queryClient.invalidateQueries(["admin_participants"]);
            await queryClient.invalidateQueries(["issuer_participants"]);

            await queryClient.invalidateQueries(["admin_products"]);
            await queryClient.invalidateQueries(["issuer_products"]);


            await queryClient.invalidateQueries(["issuer_campaign"]);

            await queryClient.invalidateQueries(["campaigns"]);
        },
        []);

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <AdminSidebar {...commonProps} />
            {/* Content */}
            <div
                className={`relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden ${bgClassName || "bg-slate-100"}`}>
                <AdminHeader {...commonProps} />
                <main>
                    <div
                        className={
                            containerClassName ||
                            "max-w-9xl mx-auto w-full px-4 py-8 sm:px-6 lg:px-8"
                        }
                    >
                        {/*<button*/}
                        {/*    onClick={() => {*/}
                        {/*        toast.custom((t) => (*/}
                        {/*            <div aria-live="assertive"*/}
                        {/*                 className={`${*/}
                        {/*                     t.visible ? "animate-enter" : "animate-leave"*/}
                        {/*                 } max-w-md w-full bg-white rounded-lg pointer-events-auto flex`}>*/}
                        {/*                <div className="w-full flex flex-col items-center space-y-4 sm:items-end">*/}
                        {/*                    <div*/}
                        {/*                        className="max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5">*/}
                        {/*                        <div className="w-0 flex-1 p-4 my-auto">*/}
                        {/*                            <div className="flex items-start">*/}
                        {/*                                <div className="flex-shrink-0 pt-0.5">*/}
                        {/*                                    <Image*/}
                        {/*                                        className="h-10 w-10 object-cover"*/}
                        {/*                                        width={40}*/}
                        {/*                                        height={40}*/}
                        {/*                                        src={BoekLogo.src}*/}
                        {/*                                        alt=""*/}
                        {/*                                    />*/}
                        {/*                                </div>*/}
                        {/*                                <div className="ml-3 w-0 flex-1">*/}
                        {/*                                    <p className="text-sm font-medium text-gray-900">Emilia*/}
                        {/*                                        Gates</p>*/}
                        {/*                                    <p className="mt-1 text-sm text-gray-500">Sure! 8:30pm works*/}
                        {/*                                        great!</p>*/}
                        {/*                                </div>*/}
                        {/*                            </div>*/}
                        {/*                        </div>*/}
                        {/*                        <div className="flex flex-col border-l border-gray-200">*/}
                        {/*                            <button*/}
                        {/*                                className="w-full border border-transparent rounded-none rounded-tr-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500">Xem*/}
                        {/*                            </button>*/}
                        {/*                            <button*/}
                        {/*                                onClick={() => toast.dismiss(t.id)}*/}
                        {/*                                className="w-full border border-transparent rounded-none rounded-br-lg p-4 flex items-center justify-center text-sm font-medium text-red-600 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">Ẩn*/}
                        {/*                            </button>*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        ), {*/}

                        {/*            duration: 10000,*/}
                        {/*        });*/}
                        {/*    }}*/}
                        {/*    className={"bg-blue-500 p-3 text-white"}>*/}
                        {/*    Test thông báo*/}
                        {/*</button>*/}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
