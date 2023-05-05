import { ICartItem, useCartStore } from "../../stores/CartStore";
import React, { Fragment, useState } from "react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { getSlug } from "../../utils/helper";
import { faker } from "@faker-js/faker/locale/vi";
import { IoClose } from "react-icons/io5";
import ConfirmModal from "../Modal/ConfirmModal";

type Props = {
    cartItem: ICartItem,
    isSelected: boolean,
    onSelectedChange: (item: ICartItem, value: boolean) => void,
    notifyChange: (item: ICartItem) => void,
    onRemove: (item: ICartItem) => void,
}
const CartItem: React.FC<Props> = ({
                                       cartItem,
                                       isSelected = false,
                                       onSelectedChange,
                                       onRemove,
                                       notifyChange,
                                   }) => {
    const {
        removeItem,
        updateQuantity,
        updateWithAudio,
        updateWithPdf,
    } = useCartStore(state => state);
    const { quantity, product } = cartItem;
    const [quantityInput, setQuantityInput] = useState(quantity || 1);

    const handleQuantityChange = (value: number | string) => {
        // must be integer and greater than 0
        if (!isNaN(Number(value)) && Number(value) > 0) {
            let quantity = Math.round(Number(value));
            if (product?.saleQuantity && product?.saleQuantity < quantity) {
                toast(`${product?.title} chỉ còn lại ${product?.saleQuantity} sản phẩm`, {
                    id: `toast-${product?.id}`,
                    position: "top-center",
                });
                quantity = product?.saleQuantity;
            }
            setQuantityInput(quantity);
            updateQuantity(product?.id, quantity);
            notifyChange({
                ...cartItem,
                quantity: quantity,
            });
        } else {
            setQuantityInput(1);
            updateQuantity(product?.id, 1);
            notifyChange({
                ...cartItem,
                quantity: 1,
            });
        }
    };
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    return (
        <Fragment>
            <li key={product?.id} className="flex py-6">
                <input
                    type="checkbox"
                    className="h-4 w-4 rounded-full border-gray-300 text-blue-600 flex-shrink-0 mr-3 self-center"
                    checked={isSelected}
                    onChange={(e) => {
                        if (onSelectedChange) {
                            onSelectedChange(cartItem, e.target.checked);
                        }
                    }}
                />
                <div className="flex-shrink-0">
                    <Image
                        width={500}
                        height={500}
                        src={
                            product?.imageUrl || ""
                        }
                        alt={""}
                        className="h-36 w-24 rounded object-cover object-center sm:h-40 sm:w-28"
                    />
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between gap-4 sm:ml-6">
                    <div>
                        <div className="flex justify-between">
                            <h4 className="text-base">
                                <Link
                                    href={`/products/${getSlug(product?.title)}/${product?.id}`}
                                    className="font-medium text-gray-700 hover:text-gray-800 line-clamp-2"
                                >
                                    {product?.title}
                                </Link>
                            </h4>
                            <p className="ml-4 text-base font-semibold text-indigo-700">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(
                                    product?.salePrice && quantity ? quantity * (product?.salePrice + (cartItem?.withPdf === true && isSelected && product?.pdfExtraPrice ? product?.pdfExtraPrice : 0)
                                        + (cartItem?.withAudio === true && isSelected && product?.audioExtraPrice ? product?.audioExtraPrice : 0)) : 0,
                                )}
                            </p>
                        </div>
                        <div className="mt-2 gap-4 space-y-3 md:space-y-0 md:flex items-center">
                            <div className="flex items-center gap-2">
                                <div className={`text-red-500 font-medium`}>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(product?.salePrice || 0)}
                                </div>
                                {product?.discount && product?.discount > 0 &&
                                    <div className={`text-xs text-gray-500 line-through`}>
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
                                            .format(((product?.salePrice || 0) * 100) / (100 - product?.discount))}
                                    </div>}
                            </div>

                            <div
                                className="flex flex-row w-fit h-9 relative bg-white border rounded overflow-hidden border-gray-200">
                                <button
                                    onClick={() => {
                                        handleQuantityChange(quantityInput - 1);
                                    }}
                                    className="text-indigo-600 hover:bg-gray-50 h-full w-9 cursor-pointer">
                                    <span className="m-auto text-xl font-normal">−</span>
                                </button>
                                <input type="text"
                                       className="border-none text-sm m-0 w-14 rounded-md focus:!ring-0 focus:!border-none focus:!outline-none !outline-none text-center bg-white flex items-center text-gray-700"
                                       value={quantityInput}
                                       onChange={(e) => {
                                           handleQuantityChange(e.target.value);
                                       }}
                                />
                                <button
                                    onClick={() => {
                                        handleQuantityChange(quantityInput + 1);
                                    }}
                                    className="text-indigo-600 hover:bg-gray-50 h-full w-9 cursor-pointer">
                                    <span className="m-auto text-xl font-normal">+</span>
                                </button>
                            </div>
                        </div>

                        {/*Bonus formats*/}

                        {product?.withPdf ?
                            <label className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700 w-fit">
                                <input
                                    checked={cartItem?.withPdf && isSelected}
                                    disabled={!isSelected}
                                    onChange={(e) => {
                                        updateWithPdf(product?.id, e.target.checked);
                                        notifyChange({
                                            ...cartItem,
                                            withPdf: e.target.checked,
                                        });
                                    }}
                                    type="checkbox"
                                    className="form-checkbox rounded border border-gray-200 bg-gray-100 h-4 w-4 text-blue-600 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span className="ml-1">
                            <span className="text-gray-900 font-medium">
                                PDF
                            </span>
                            <span className="text-gray-500">
                                {" "}
                                +{new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(product?.pdfExtraPrice || 0)}
                            </span>
                        </span>
                            </label>
                            : null}

                        {product?.withAudio ?
                            <label className="mt-2 flex items-center gap-2 text-sm font-medium text-gray-700 w-fit">
                                <input
                                    checked={cartItem?.withAudio && isSelected}
                                    disabled={!isSelected}
                                    onChange={(e) => {
                                        updateWithAudio(product?.id, e.target.checked);
                                        notifyChange({
                                            ...cartItem,
                                            withAudio: e.target.checked,
                                        });
                                    }}
                                    type="checkbox"
                                    className="form-checkbox rounded border border-gray-200 bg-gray-100 h-4 w-4 text-blue-600 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <span className="ml-1">
                            <span className="text-gray-900 font-medium">
                                Audio
                            </span>
                            <span className="text-gray-500">
                                {" "}
                                +{new Intl.NumberFormat("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            }).format(product?.audioExtraPrice || 0)}
                            </span>
                        </span>
                            </label>
                            : null}

                    </div>

                    <div className="flex flex-wrap justify-between gap-y-3">
                        <div
                            className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                            <Image
                                width={22}
                                height={22}
                                className="rounded-full"
                                src={

                                    product?.issuer?.user?.imageUrl ||
                                    faker.image.avatar()
                                }
                                alt={
                                    ""
                                }
                            />
                            {product?.issuer?.user?.name}
                        </div>
                        <div>
                            <button
                                onClick={() => {
                                    setIsConfirmModalOpen(true);
                                }}
                                type="button"
                                className="flex items-center gap-1 rounded bg-slate-100 py-1 px-2 text-sm font-medium text-slate-600 hover:text-slate-500"
                            >
                                <IoClose />
                                <span>Xoá</span>
                            </button>
                        </div>
                    </div>
                </div>
            </li>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={() => {
                    if (onRemove) {
                        onRemove(cartItem);
                    }
                    removeItem(product?.id);
                }}
                title={"Xoá sản phẩm"}
                content={"Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?"}
                confirmText={"Xoá"} />
        </Fragment>
    );
};

export default CartItem;