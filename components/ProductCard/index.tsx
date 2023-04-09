import React from "react";
import { IBookProduct } from "../../types/Book/IBookProduct";
import Image from "next/image";
import Link from "next/link";
import { getBookProductStatusById } from "../../constants/BookProductStatuses";

type Props = {
    product: IBookProduct | undefined;
}

const ProductCard: React.FC<Props> = ({ product }) => {
    const productStatus = getBookProductStatusById(product?.status);
    return (
        <Link
            href={`../products/${product?.id}`}
            key={product?.id}
            className="rounded-md overflow-hidden relative bg-white border flex flex-col">

            {/*status tag*/}
            <div
                className={`absolute top-0 right-0 rounded-bl-md rounded-tr-md px-2 py-1 text-xs font-medium text-white ${productStatus?.campaignCardTag?.bgClassNames || "bg-slate-500"}`}>
                {productStatus?.commonDisplayName || productStatus?.displayName}
            </div>

            {/* Image */}
            <Image src={product?.imageUrl || ""}
                   alt={""} width={500} height={500}
                   className={"w-auto h-64 object-cover border-b"}
            />
            {/* Content */}
            <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                <div>
                    <div
                        className="text-sm font-medium text-slate-800 line-clamp-2 break-words">{product?.title}
                    </div>
                    <div
                        className="mt-2 flex items-center text-sm font-medium text-slate-600">
                        <Image
                            src={product?.issuer?.user?.imageUrl || ""}
                            alt={""} width={500} height={500}
                            className={"w-6 h-6 object-cover rounded-full"}
                        />
                        <div className="ml-2">
                            {product?.issuer?.user?.name}
                        </div>
                    </div>
                </div>
                {/*Price on right*/}
                <div className="flex justify-end items-center mt-2">
                    <div className="text-emerald-600 font-medium">
                        {new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            },
                        ).format(product?.salePrice || 0)}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;