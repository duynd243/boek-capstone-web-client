import React from "react";
import Image from "next/image";
import { IOrderDetail } from "../../../types/Order/IOrder";

type Props = {
    orderItem: IOrderDetail
}

const OrderItem: React.FC<Props> = ({ orderItem }) => {
    return (
        <div
            className="border-b border-slate-200 bg-slate-50 px-4 space-y-3 py-3 sm:space-y-0 sm:flex items-center justify-between">
            <div className="flex items-center">
                <div
                    className="mr-2 block shrink-0 xl:mr-4"
                >
                    <Image
                        className="h-20 w-16 object-cover xl:h-24 xl:w-20"
                        src={orderItem?.bookProduct?.imageUrl}
                        width="1000"
                        height="1000"
                        alt={orderItem?.bookProduct?.title || ""}
                    />
                </div>
                <div className="grow">
                    <h4 className="text-sm font-medium leading-tight text-slate-800">
                        {orderItem?.bookProduct?.title}
                    </h4>
                    <div className="mt-2 space-y-2">
                        <h5 className="text-xs font-medium text-slate-500">
                            Số lượng: {orderItem.quantity}
                        </h5>
                        <h5 className="text-xs font-medium text-slate-500">
                            Giá bìa: {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(orderItem?.bookProduct?.book?.coverPrice || 0)
                        }
                        </h5>

                        <h5 className="text-xs font-medium text-slate-500">
                            Giá PDF: {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(5000)
                        }
                        </h5>
                        <h5 className="text-xs font-medium text-slate-500">
                            Giá Audio: {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(5000)
                        }
                        </h5>
                    </div>
                </div>
            </div>

            <div
                className="text-right text-sm font-medium text-slate-800 flex flex-col">
               <span className="line-through text-slate-500">
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(
                        (20000),
                    )}
               </span>
                <div>
                    <span className={"mr-2 bg-rose-600 text-white p-1 rounded"}>-25%</span>
                    <span>
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(
                        (15000),
                    )}
                    </span>
                </div>
            </div>

        </div>
    );
};

export default OrderItem;