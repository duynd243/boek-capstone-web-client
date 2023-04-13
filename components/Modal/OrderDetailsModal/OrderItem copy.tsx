import React from "react";
import Image from "next/image";
import { IMockOrderItem } from "./index";

type Props = {
    orderItem: IMockOrderItem
}

const OrderItem: React.FC<Props> = ({ orderItem }) => {
    return (
        <div className="border-b border-slate-200 space-y-3 py-3 sm:space-y-0 sm:flex items-center justify-between">
            <div className="flex items-center">
                <div
                    className="mr-2 block shrink-0 xl:mr-4"
                >
                    <Image
                        className="h-20 w-16 object-cover xl:h-24 xl:w-20"
                        src={orderItem.imageUrl}
                        width="1000"
                        height="1000"
                        alt={orderItem.name}
                    />
                </div>
                <div className="grow">
                    <h4 className="text-sm font-medium leading-tight text-slate-800">
                        {orderItem.name}
                    </h4>
                    <div className="mt-2 space-y-2">
                        <h5 className="text-xs font-medium text-slate-500">
                            Số lượng: {orderItem.quantity}
                        </h5>
                        <h5 className="text-xs font-medium text-slate-500">
                            Đơn giá: {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(orderItem.price)
                        }
                        </h5>
                    </div>
                </div>
            </div>

            <div
                className="text-right text-sm font-medium text-slate-800">
                {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(orderItem.price * orderItem.quantity)}
            </div>
        </div>
    );
};

export default OrderItem;