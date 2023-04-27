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
                <div
                    className={`${
                        t.visible ? "animate-enter" : "animate-leave"
                    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
                >
                    <div className="flex-1 w-0 p-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 pt-0.5">
                                <Image
                                    className="h-10 w-10 object-cover"
                                    width={40}
                                    height={40}
                                    src="https://i.upanh.org/2023/04/03/boek-logoa702ffa1a5d22adf.png"
                                    alt=""
                                />
                            </div>
                            <div className="ml-3 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    Bạn có thông báo mới!
                                </p>
                                <p className="mt-1 text-sm font-medium text-gray-600">
                                    {Message}
                                </p>
                                {/*Timestamp*/}
                                <div className="mt-4 flex-shrink-0 flex">
                                    <p className="text-sm font-medium text-gray-500">
                                        {formatDistance(new Date(), new Date(), {
                                            addSuffix: true,
                                            locale: vi,
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex border-l border-gray-200">
                        <Link
                            href={viewUrl ? findRole(loginUser?.role)?.baseUrl + viewUrl : "#"}
                            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            Xem
                        </Link>
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
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
