import React, { useMemo } from "react";
import Image from "next/image";
import { IBookProduct } from "../../types/Book/IBookProduct";
import { BookProductStatuses, getBookProductStatusById } from "../../constants/BookProductStatuses";
import { AiFillBook, AiFillFilePdf } from "react-icons/ai";
import { FaFileAudio } from "react-icons/fa";
import { motion } from "framer-motion";
import { BsBagPlusFill } from "react-icons/bs";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import { getFormattedTime, getSlug, isAddToCartDisabled } from "../../utils/helper";
import NoImagePlaceholder from "../../assets/images/no-image.png";
import { useCartStore } from "../../stores/CartStore";
import { CampaignStatuses } from "../../constants/CampaignStatuses";

const StatusBadge: React.FC<{ bgColor: string, label: string, title?: string }> = ({ bgColor, label, title }) => {

    return (
        <div
            title={title || ""}
            className={`absolute z-0 top-2 left-2 text-center rounded-sm text-white px-2.5 py-1 ${bgColor}`}
        >
            <span className="text-sm font-medium">
                {label}
            </span>
        </div>
    );
};

type Props = {
    showAddToCart?: boolean;
    product: IBookProduct | undefined;
};

const CustomerProductCard: React.FC<Props> = ({
                                                  showAddToCart = true,
                                                  product,
                                              }) => {
    const bookProductStatus = getBookProductStatusById(product?.status);
    console.log(product?.id, product?.campaign?.status !== CampaignStatuses.STARTING.id)

    const { addToCart } = useCartStore((state) => state);

    const href = useMemo(() => {
        return {
            pathname: "/products/[slug]/[id]",
            query: { slug: getSlug(product?.title), id: product?.id },
        };
    }, [product]);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={
                "h-full flex flex-col bg-white rounded-md overflow-hidden"
            }
            transition={{ duration: 0.4, ease: "easeInOut" }}
            layout
        >
            <Link href={href} className="relative grow group">
                <div className="relative w-full h-80 overflow-hidden">
                    <Image
                        width={1000}
                        height={1000}
                        src={product?.imageUrl || NoImagePlaceholder.src}
                        alt=""
                        className="w-full h-full object-center object-cover group-hover:scale-110 transition-all duration-[400ms] ease-in-out"
                    />
                </div>


                {product?.status === BookProductStatuses.OutOfStock.id &&
                    <StatusBadge bgColor={"bg-rose-600"} label={"Hết hàng"} />}

                {product?.status !== BookProductStatuses.Selling.id && product?.status !== BookProductStatuses.OutOfStock.id &&
                    <StatusBadge bgColor={"bg-gray-600"} label={"Ngừng bán"} />}

                {product?.status === BookProductStatuses.Selling.id && product?.campaign?.status === CampaignStatuses.NOT_STARTED.id &&
                    <StatusBadge
                        title={product?.campaign?.startDate ? `Sách sẽ đuợc mở bán từ ${getFormattedTime(product?.campaign?.startDate, "dd/MM/yyyy")}` : ""}
                        bgColor={"bg-green-600"}
                        label={product?.campaign?.startDate ? `Mở bán sau ${formatDistance(new Date(product?.campaign?.startDate), new Date(), {
                            addSuffix: true,
                            locale: vi,
                        })}` : "Mở bán sau"} />
                }


                <div className="absolute top-0 inset-x-0 h-80 p-4 flex items-end justify-end overflow-hidden">
                    <div
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                    ></div>
                    <div className="relative flex flex-col items-end">
                        <Image
                            width={500}
                            height={500}
                            src={product?.issuer?.user?.imageUrl || ""}
                            alt={""}
                            className="w-10 h-10 object-cover rounded-full border-2 border-white"
                        />
                        <p className="mt-2 text-sm font-medium text-white drop-shadow">
                            {product?.issuer?.user?.name}
                        </p>
                    </div>
                </div>

                <div className="relative p-4">
                    <h3
                        title={product?.title}
                        className="text-lg font-medium text-gray-900 line-clamp-1 break-words">
                        {product?.title}
                    </h3>
                    {product?.createdDate && (
                        <h2 className={"text-sm text-slate-600"}>
                            Đăng bán vào:{" "}
                            {formatDistance(
                                new Date(product?.createdDate),
                                new Date(),
                                {
                                    addSuffix: true,
                                    locale: vi,
                                },
                            )}
                        </h2>
                    )}
                    {/*Book formats*/}
                    <div className={"flex mt-3 items-stretch gap-4"}>
                        {/*Paper*/}
                        <div className="flex flex-col gap-1 justify-center items-center text-xs text-slate-400">
                            <AiFillBook className="flex-shrink-0 h-5 w-5 text-blue-600" />
                            <p className="font-medium text-slate-600">Giấy</p>
                        </div>

                        {/*Ebook*/}
                        {product?.withPdf ? (
                            <div className="flex flex-col gap-1 justify-center items-center text-xs text-slate-400">
                                <AiFillFilePdf className="flex-shrink-0 h-5 w-5 text-rose-600" />
                                <p className="font-medium text-slate-600">
                                    PDF
                                </p>
                            </div>
                        ) : null}

                        {/*Audio*/}
                        {product?.withAudio ? (
                            <div className="flex flex-col gap-1 justify-center items-center text-xs text-slate-400">
                                <FaFileAudio className="flex-shrink-0 h-5 w-5 text-amber-500" />
                                <p className="font-medium text-slate-600">
                                    Audio
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {/*Price on right*/}
                    <div className="mt-2">
                        {/*Discount price*/}
                        {product?.discount && product?.discount > 0 ? (
                            <div className="flex justify-end items-center gap-2">
                                <div className="text-xs font-medium bg-rose-500 text-white rounded-sm py-1 px-1.5">
                                    -{product?.discount}%
                                </div>
                                <p className="text-sm font-medium text-gray-500 line-through">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(
                                        ((product?.salePrice || 0) * 100) /
                                        (100 - product?.discount),
                                    )}
                                </p>
                            </div>
                        ) : null}
                        {/*Sale price*/}
                        <div className="flex mt-2 justify-end">
                            <p className="text-xl font-semibold text-gray-700">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(product?.salePrice || 0)}
                            </p>
                        </div>
                    </div>
                </div>
            </Link>
            <div className="mt-2 p-2 empty:hidden">
                {showAddToCart ? (
                    <button
                        disabled={isAddToCartDisabled(product)}
                        onClick={() => {
                            if (product) {
                                addToCart(product);
                            }
                        }}
                        className="relative w-full flex bg-indigo-500 text-white border rounded border-transparent py-3 items-center gap-2 justify-center text-sm font-medium hover:bg-indigo-600 disabled:opacity-50"
                    >
                        <BsBagPlusFill className={"fill-white"} />
                        Thêm vào giỏ hàng
                    </button>
                ) : null}
            </div>
        </motion.div>
    );
};

export default CustomerProductCard;
