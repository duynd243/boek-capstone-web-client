import React from "react";
import { IOrderDetail } from "../../types/Order/IOrder";
import Image from "next/image";
import Link from "next/link";
import { getSlug } from "../../utils/helper";

type Props = {
    orderDetail: IOrderDetail;
}

const OrderDetailCard: React.FC<Props> = ({ orderDetail }) => {
    const { bookProduct: product } = orderDetail;
    const coverPrice = ((orderDetail?.price || 0) * 100) / (100 - (orderDetail?.discount || 0)) || 0;
    return (
        <div
            className="flex py-6 px-4 justify-between">
            <div className="flex-shrink-0 flex gap-3">
                <Image
                    width={500}
                    height={500}
                    src={product?.imageUrl || ""}
                    alt=""
                    className="flex-shrink-0 w-28 h-36 object-center object-cover bg-gray-200 rounded-sm shadow-sm"
                />
                <div className="space-y-3">
                    <div className="text-sm font-medium">
                        <Link
                            href={{
                                pathname: "/products/[slug]/[id]",
                                query: {
                                    slug: getSlug(product?.title),
                                    id: product?.id,
                                },
                            }}
                            className="text-gray-700 font-semibold">
                            {product?.title}
                        </Link>
                        <div className="text-gray-600 mt-2">
                                                    <span className={"text-red-500 font-medium"}>
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(orderDetail?.price || 0)}
                                                    </span>
                            {(orderDetail?.discount && orderDetail?.discount > 0) ? (
                                <span
                                    className="text-gray-500 ml-2 text-xs line-through">
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            }).format(coverPrice)}
                                                        </span>
                            ) : null}
                        </div>
                        <div className={"space-y-1 mt-3"}>
                            {orderDetail?.withPdf ? (
                                <p className="text-gray-500">
                                    PDF: +{new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(product?.pdfExtraPrice || 0)}
                                </p>
                            ) : null}

                            {orderDetail?.withAudio ? (
                                <p className="text-gray-500">
                                    Audio: +{new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(product?.audioExtraPrice || 0)}
                                </p>
                            ) : null}
                            <p className="text-gray-500">Số
                                lượng: {orderDetail?.quantity || 0}</p>
                        </div>
                    </div>
                </div>


            </div>
            <div className="flex">
                <div
                    className="font-medium text-indigo-700"
                >
                    {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    }).format(orderDetail?.total || 0)}
                </div>

            </div>
        </div>
    );
};

export default OrderDetailCard;