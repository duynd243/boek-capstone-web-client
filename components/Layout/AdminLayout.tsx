import React, { useState } from "react";
import AdminHeader from "../Header/AdminHeader";
import AdminSidebar from "../Sidebar/AdminSidebar";
import { SignalRContext } from "../ProtectedRouteWrapper";
import { toast } from "react-hot-toast";

type Props = {
    children: React.ReactElement;
    containerClassName?: string;
    bgClassName?: string;
};

const AdminLayout: React.FC<Props> = ({ children, containerClassName, bgClassName }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    const commonProps = {
        isSidebarOpen,
        setIsSidebarOpen,
    };

    SignalRContext.useSignalREffect("ReceiveMess",
        (NotificationType, NotificationTypeName, Status, StatusName, Message) => {
            toast.success(`Bạn có thông báo mới!
        Nội dung: ${Message}`,{
                icon: "📩",
                duration: 10000,
            });
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
