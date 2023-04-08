import React from "react";
import CustomerNavbar from "./Navbar/CustomerNavbar";
import { SignalRContext } from "../ProtectedRouteWrapper";
import { toast } from "react-hot-toast";

type Props = {
    backgroundClassName?: string
    children: React.ReactNode
    childrenWrapperClassName?: string
}

const CustomerLayout: React.FC<Props> = ({ backgroundClassName, children, childrenWrapperClassName }) => {
    SignalRContext.useSignalREffect("ReceiveMess",
        (NotificationType, NotificationTypeName, Status, StatusName, Message) => {
            toast.success(`Bạn có thông báo mới!
        Nội dung: ${Message}`, {
                icon: "📩",
                duration: 10000,
            });
        },
        []);
    return (
        <div className={`${backgroundClassName || "bg-white"} h-screen overflow-y-scroll`}>
            <CustomerNavbar />
            <div className={childrenWrapperClassName || "max-w-screen-xl mx-auto px-2 sm:px-6 lg:px-8 py-8"}>
                {children}
            </div>
        </div>
    );
};

export default CustomerLayout;