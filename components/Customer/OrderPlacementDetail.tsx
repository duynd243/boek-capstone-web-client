import React, { PropsWithChildren } from "react";
import { FaCity } from "react-icons/fa";
import { SiOpenstreetmap } from "react-icons/si";
import { BsCheckCircleFill } from "react-icons/bs";

const ListItem: React.FC<PropsWithChildren & { sub?: boolean, icon?: React.ReactNode }> = ({
                                                                                               children,
                                                                                               sub = false,
                                                                                               icon,
                                                                                           }) => {
    return <li className={`flex items-center ${sub ? "ml-8" : ""}`}>
        {icon ? icon : <BsCheckCircleFill className="text-blue-500 w-5 h-5 flex-shrink-0" />}
        <p className="ml-4 text-slate-900">
            {children}
        </p>
    </li>;
};

type Props = {
    orderType: "delivery" | "pickup";
}

const OrderPlacementDetail: React.FC<Props> = ({ orderType }) => {
    return (
        <ul className="space-y-4">
            {orderType === "delivery" && <>
                <ListItem>
                    Nhà phát hành sẽ phụ trách giao hàng đến địa chỉ của bạn.
                </ListItem>
                <ListItem>
                    Phí vận chuyển của đơn phụ thuộc vào nội
                    thành hay ngoại thành đối với các nơi hội
                    sách đang tổ chức.
                </ListItem>
                <ListItem
                    icon={<FaCity className="text-gray-700 w-5 h-5 flex-shrink-0" />}
                    sub={true}>
                    Nội thành: <span
                    className="ml-2 bg-green-100 text-green-800 inline-flex rounded-full px-3 py-1 text-center text-sm font-medium uppercase">{new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(15000)}</span>
                </ListItem>
                <ListItem
                    icon={<SiOpenstreetmap className="text-gray-700 w-5 h-5 flex-shrink-0" />}
                    sub={true}>
                    Ngoại thành: <span
                    className="ml-2 bg-amber-100 text-amber-800 inline-flex rounded-full px-3 py-1 text-center text-sm font-medium uppercase">{new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(30000)}</span>
                </ListItem>
            </>}

            {orderType === "pickup" && <>
                <ListItem>
                    Nhà phát hành sẽ phụ trách thông báo địa điểm của
                    đơn nhận tại quầy cho bạn khi đơn hàng
                    sẵn sàng.
                </ListItem>
                <ListItem>
                    Nếu bạn không nhận hàng tại quầy trong
                    thời gian hội sách diễn ra, thì đơn hàng sẽ
                    bị hủy.
                </ListItem></>}
        </ul>
    );
};

export default OrderPlacementDetail;