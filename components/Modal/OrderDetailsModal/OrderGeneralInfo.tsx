import React from "react";
import SectionHeader from "./SectionHeader";
import Image from "next/image";
import { getOrderStatusById } from "../../../constants/OrderStatuses";
import { IOrder } from "../../../types/Order/IOrder";
import { getFormattedTime } from "../../../utils/helper";
import { OrderTypes } from "../../../constants/OrderTypes";
import { getOrderPaymentMethodById } from "../../../constants/OrderPaymentMethods";

type Props = {
    order: IOrder | undefined;
}

const labelClasses = "text-sm min-w-fit text-slate-700 font-medium";
const wrapperClasses = "space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:gap-3 py-3 border-b border-slate-200";

const OrderGeneralInfo: React.FC<Props> = ({ order }) => {
    const orderStatus = getOrderStatusById(order?.status);

    return (
        <div>
            <SectionHeader label={"Thông tin chung"} />
            {/* Fees, discount and total */}
            <ul>
                <li className={wrapperClasses}>
                    <div className={labelClasses}>Khách hàng</div>
                    <div className={"flex items-center gap-2"}>
                        <Image
                            className="rounded-full object-cover w-8 h-8"
                            src={order?.customer?.user?.imageUrl || ""} alt={""}
                            width={100} height={100} />
                        <div className={"truncate"}>
                            <div className="text-sm font-medium text-slate-800">{order?.customerName}</div>
                            <div className="text-xs text-slate-500">
                                {order?.customerEmail}</div>
                        </div>
                    </div>
                </li>
                <li className={wrapperClasses}>
                    <div className={labelClasses}>Hội sách</div>
                    <div
                        className="text-sm font-medium text-slate-800 sm:text-right">
                        {order?.campaign?.name}
                    </div>
                </li>
                <li className={wrapperClasses}>
                    <div className={labelClasses}>Trạng thái</div>
                    <div
                        className={`w-fit text-sm font-medium px-3 py-1 rounded ${orderStatus?.labelColor}`}>
                        {orderStatus && orderStatus?.displayName}
                    </div>
                </li>

                <li className={wrapperClasses}>
                    <div className={labelClasses}>Ngày đặt hàng</div>
                    <div
                        className="text-sm font-medium text-slate-800 sm:text-right">
                        {getFormattedTime(order?.orderDate, " HH:mm - dd/MM/yyyy")}
                    </div>
                </li>
                <li className={wrapperClasses}>
                    <div className={labelClasses}>Địa chỉ giao hàng</div>
                    <div
                        className="text-sm font-medium text-slate-800 sm:text-right">
                        {order?.type === OrderTypes.DELIVERY.id ? (order?.address || "-") : "Nhận tại quầy"}
                    </div>
                </li>

            </ul>
        </div>
    );
};

export default OrderGeneralInfo;