import React from "react";
import { NextPageWithLayout } from "../../../_app";
import CustomerLayout from "../../../../components/Layout/CustomerLayout";
import { useRouter } from "next/router";
import { BookProductService } from "../../../../services/BookProductService";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinnerWithOverlay from "../../../../components/LoadingSpinnerWithOverlay";
import { Tab } from "@headlessui/react";
import CustomerProductCard from "../../../../components/CustomerProductCard";
import EmptySection from "../../../../components/CampaignDetails/EmptySection";
import Image from "next/image";
import { AiFillBook, AiFillFilePdf } from "react-icons/ai";
import { FaFileAudio } from "react-icons/fa";
import { getAvatarFromName, getSlug } from "../../../../utils/helper";
import { BookTypes } from "../../../../constants/BookTypes";
import Link from "next/link";
import NoImagePlaceholder from "../../../../assets/images/no-image.png";
import { BsBagPlusFill } from "react-icons/bs";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { motion } from "framer-motion";

const BonusFormatCard = (
    {
        type,
        price,
    }: {
        type: "PDF" | "AUDIO";
        price: number;
    },
) => {
    return (
        <div className={"bg-white rounded border overflow-hidden"}>
            <div
                className={"py-2 px-8 flex items-center gap-2 text-gray-600 font-medium bg-gray-100"}>
                {type === "PDF" ?
                    <AiFillFilePdf className="flex-shrink-0 h-5 w-5 text-rose-600" />
                    :
                    <FaFileAudio className="flex-shrink-0 h-5 w-5 text-amber-500" />
                }
                {type === "PDF" ? "PDF" : "Audio"}
            </div>
            <div
                className={"flex flex-col justify-between items-center py-1 px-8"}>
                <div className={"text-green-600 text-sm font-medium my-2"}>
                    +{new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                }).format(price)}
                </div>
                <Link
                    href={"#"}
                    target={"_blank"}
                    className={"text-indigo-600 text-sm"}>
                    {type === "PDF" ? "Xem thử" : "Nghe thử"}
                </Link>
            </div>
        </div>
    );
};

const ProductDetailsPage: NextPageWithLayout = () => {
    const router = useRouter();
    const id = router.query.id as string;
    const bookProductService = new BookProductService();

    const {
        data: product,
        isInitialLoading: productLoading,
    } = useQuery(
        ["product", id],
        () => bookProductService.getBookProductByIdByCustomer(id),
        {
            enabled: !!id,
        },
    );

    const details = [
        {
            label: "Nhà xuất bản",
            value: product?.book?.publisher?.name,
        }, {
            label: "ISBN10",
            value: product?.book?.isbn10,
        }, {
            label: "ISBN13",
            value: product?.book?.isbn13,
        }, {
            label: "Năm phát hành",
            value: product?.book?.releasedYear,
        }, {
            label: "Số trang",
            value: product?.book?.page,
        }, {
            label: "Kích thước",
            value: product?.book?.size,
        }, {
            label: "Dịch giả",
            value: product?.book?.translator,
        },
        {
            label: "Ngôn ngữ",
            value: product?.book?.language,
        },
    ];

    if (productLoading) return <LoadingSpinnerWithOverlay label={"Đang tải thông tin sản phẩm"} />;
    return (
        <div>
            {/*Product overview section*/}
            <div className="grid grid-cols-1 md:gap-x-8 md:grid-cols-3 gap-y-4 md:gap-y-0 bg-white px-8 py-6">
                <div className={"max-h-[512px] relative"}>
                    <Image
                        src={product?.imageUrl || NoImagePlaceholder.src} alt={"Product image"}
                        width={1000} height={1000}
                        className={"h-auto max-h-full object-cover rounded-sm shadow-md"}
                    />
                </div>
                <div className={"col-span-2"}>

                    {/*Category tag card*/}
                    <div className={"flex items-center gap-2"}>
                        <div className={"text-sm font-medium bg-blue-500 text-white rounded-sm py-1 px-3"}>
                            {product?.typeName}
                        </div>
                        <div className={"text-sm font-medium bg-amber-500 text-white rounded-sm py-1 px-3"}>
                            {product?.genre?.name}
                        </div>
                        {/*<div className={"text-xs font-medium bg-gray-100 text-gray-500 rounded-sm py-1 px-1.5"}>*/}
                        {/*    {product?.subCategory?.name}*/}
                        {/*</div>*/}
                    </div>

                    {/*Book title*/}
                    <h1 className={"text-2xl mt-2 font-medium text-gray-900"}>
                        {product?.title}
                    </h1>
                    <div className={"grid grid-cols-5 mt-5 gap-y-3"}>
                        <div className={"col-span-5 lg:col-span-3"}>
                            {/*Price section*/}
                            <div className={"flex items-center gap-4"}>
                                {/*Discount price*/}
                                {product?.discount && product?.discount > 0 ?
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="text-xs font-medium bg-rose-500 text-white rounded-sm py-1 px-1.5">
                                            -{product?.discount}%
                                        </div>
                                        <div className="text-2xl font-medium text-green-600">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(product?.salePrice || 0)}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500 line-through">
                                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
                                                .format((product?.salePrice || 0) + (product?.salePrice || 0) * (product?.discount || 0) / 100)}
                                        </div>
                                    </div>
                                    :
                                    <div className="text-2xl font-medium text-green-600">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(product?.salePrice || 0)}
                                    </div>
                                }
                            </div>


                            {/*Other formats*/}
                            {product?.withPdf || product?.withAudio ?
                                <div className={"mt-4"}>
                                    <div className={"flex gap-4 mt-2"}>
                                        {product?.withPdf ?
                                            <BonusFormatCard
                                                type={"PDF"}
                                                price={product?.pdfExtraPrice || 0}
                                            />
                                            : null}
                                        {product?.withAudio ?
                                            <BonusFormatCard
                                                type={"AUDIO"}
                                                price={product?.audioExtraPrice || 0}
                                            />
                                            : null}
                                    </div>
                                </div>
                                : null}

                            {/* Author */}
                            {product?.type === BookTypes.Single.id && <>
                                <div className="text-gray-600 font-medium mt-6">Tác giả</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {product?.book?.bookAuthors?.map((author) => (
                                            <Link
                                                href={`/products?author=${author?.author?.id}`}
                                                key={author?.author?.id}
                                                className="flex items-center w-fit p-1 rounded-full bg-slate-50 shadow-sm">
                                                <Image
                                                    src={author?.author?.imageUrl || getAvatarFromName(author?.author?.name)}
                                                    alt={""} width={100} height={100}
                                                    className={"w-10 h-10 object-cover rounded-full flex-shrink-0"}
                                                />
                                                <span className="text-sm px-3 text-slate-700 font-medium">
                                    {author?.author?.name}
                                    </span>
                                            </Link>
                                        ),
                                    )}
                                </div>
                            </>}


                            <div className={"mt-6"}>
                                {/*<div className={"flex items-center gap-4"}>*/}
                                {/*    <div className={"flex items-center gap-2"}>*/}
                                {/*        <div className={"flex items-center gap-2"}>*/}
                                {/*            <button*/}
                                {/*                onClick={() => {*/}
                                {/*                }}*/}
                                {/*                className={"bg-gray-100 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center"}>*/}
                                {/*                <IoRemove className={"inline-block"} />*/}
                                {/*            </button>*/}
                                {/*            <div className={"text-gray-600 font-medium"}>3</div>*/}
                                {/*            <button*/}
                                {/*                onClick={() => {*/}

                                {/*                }}*/}
                                {/*                className={"bg-gray-100 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center"}>*/}
                                {/*                <IoAdd className={"inline-block"} />*/}
                                {/*            </button>*/}
                                {/*            </div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <button
                                    onClick={() => {

                                    }}
                                    className={"bg-indigo-600 text-sm text-white font-medium py-3 px-6 flex items-center rounded hover:bg-indigo-700"}>
                                    <BsBagPlusFill className={"inline-block mr-2"} />
                                    {/*<IoBagAdd className={"inline-block mr-2"} />*/}
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </div>
                        {/*Campaign and Issuer*/}
                        <div className={"col-span-5 lg:col-span-2 divide-y rounded border h-fit"}>
                            <div className={"p-3"}>
                                <div className={"flex items-center gap-2"}>
                                    <Image
                                        src={product?.issuer?.user?.imageUrl || getAvatarFromName(product?.issuer?.user?.name)}
                                        alt={""} width={100} height={100}
                                        className={"w-10 h-10 object-cover rounded-full flex-shrink-0"}
                                    />
                                    <div className={"flex flex-col"}>
                                        <div className={"text-sm font-medium text-gray-900"}>
                                            {product?.issuer?.user?.name}
                                        </div>
                                        <div className={"text-xs font-medium text-gray-500"}>
                                            {product?.issuer?.user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={"p-3"}>
                                <div className={"flex items-center gap-2"}>
                                    <Image
                                        src={product?.campaign?.imageUrl || NoImagePlaceholder.src}
                                        alt={""} width={100} height={100}
                                        className={"w-10 h-10 object-cover rounded-sm flex-shrink-0"}
                                    />
                                    <div className={"text-sm font-medium text-gray-900 line-clamp-1 break-words"}>
                                        {product?.campaign?.name}
                                    </div>
                                </div>
                                <div className={"flex flex-col mt-3 gap-2"}>
                                    <Link
                                        className={" font-medium bg-indigo-500 text-white py-1.5 text-sm text-center rounded hover:bg-indigo-600"}
                                        href={`/campaigns/${product?.campaign?.id}`}
                                    >Chi tiết
                                    </Link>
                                    <Link

                                        className={`border-slate-200 text-slate-600 border bg-slate-50 text-center text-sm font-medium rounded py-1.5 hover:bg-slate-100`}
                                        href={`/products?campaign=${product?.campaign?.id}`}
                                    >Xem sách bán</Link>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>


            {product?.otherMobileBookProducts && product?.otherMobileBookProducts.length > 0 &&
                <>
                    <h2 className={"text-gray-900 text-2xl font-semibold mt-8"}>
                        Sản phẩm này tại các hội sách khác
                    </h2>
                    <Swiper
                        breakpoints={{
                            640: {
                                slidesPerView: 1.4,
                            },
                            768: {
                                slidesPerView: 1.68,
                            },
                            1024: {
                                slidesPerView: 2.4,
                            },
                            1280: {
                                slidesPerView: 3.4,
                            },
                        }}
                        spaceBetween={30}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                    >
                        {product?.otherMobileBookProducts?.map((book) => (
                            <SwiperSlide
                                className={"py-10"}
                                key={book?.id}>
                                <Link
                                    href={{
                                        pathname: `/products/[slug]/[id]`,
                                        query: {
                                            slug: getSlug(product?.title),
                                            id: book?.id,
                                        },
                                    }}
                                    key={book?.id}>
                                    <div className={"flex gap-2"}>
                                        <Image
                                            src={product?.imageUrl || NoImagePlaceholder.src}
                                            alt={""}
                                            width={500} height={500}
                                            className={"w-28 h-32 object-cover rounded-sm flex-shrink-0"}
                                        />
                                        <div className={"grow min-w-0 flex flex-col justify-between pb-4"}>
                                            <div>
                                                <div
                                                    className={"font-medium text-gray-900 line-clamp-2 break-words"}>
                                                    {book?.campaignName}
                                                </div>
                                                <div
                                                    className={"mt-2 text-green-600 font-medium text-gray-500 line-clamp-2 break-words"}>
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(book?.salePrice || 0)}
                                                </div>
                                            </div>

                                            <div
                                                className={"text-sm line-clamp-2 break-words text-white w-fit rounded"}>
                                                {book?.salePrice === product?.salePrice &&
                                                    <span className={"bg-blue-500 px-2.5 py-2"}>
                                                        Đồng giá
                                                    </span>
                                                }
                                                {book?.salePrice && product?.salePrice && book?.salePrice < product?.salePrice &&
                                                    <span className={"bg-green-500 px-2.5 py-2"}>
                                                        Rẻ hơn {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(product?.salePrice - book?.salePrice || 0)}
                                                    </span>
                                                }
                                                {book?.salePrice && product?.salePrice && book?.salePrice > product?.salePrice &&
                                                    <span className={"bg-rose-500 px-2.5 py-2"}>
                                                        Đắt hơn {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(book?.salePrice - product?.salePrice || 0)}
                                                    </span>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
            }

            {/*Product details section*/
            }

            {product?.type === BookTypes.Single.id ?
                <div className="mt-8 bg-gray-50 shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Thông tin sản phẩm
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Thông tin chi tiết về sản phẩm
                        </p>
                    </div>
                    <div className="border-t border-gray-200">
                        {details.filter(d => d.value).map((detail, index) => (
                            <dl key={index}>
                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <dt className="text-sm font-medium text-gray-500">
                                        {detail.label}
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                        {detail.value}
                                    </dd>
                                </div>
                            </dl>
                        ))}
                    </div>
                </div>
                : null}


            {/*Items of series, combo*/}
            {product?.type === BookTypes.Series.id || product?.type === BookTypes.Combo.id ?
                <>
                    <h2 className={"text-gray-900 text-2xl font-semibold mt-8"}>
                        Sản phẩm trong {product?.type === BookTypes.Series.id ? "series" : "combo"}
                    </h2>

                    <Swiper
                        breakpoints={{
                            640: {
                                slidesPerView: 2,
                            },
                            768: {
                                slidesPerView: 2.4,
                            },
                            1024: {
                                slidesPerView: 3.2,
                            },
                            1280: {
                                slidesPerView: 4,
                            },
                        }}
                        spaceBetween={30}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                    >
                        {product?.bookProductItems?.map((item) => (
                            <SwiperSlide
                                className={"py-10"}
                                key={item?.id}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className={"h-full flex flex-col bg-white rounded-md overflow-hidden"}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                    layout>
                                    <div
                                        className="relative grow group">
                                        <div className="relative w-full h-80 overflow-hidden">
                                            <Image
                                                width={1000}
                                                height={1000}
                                                src={item?.book?.imageUrl || NoImagePlaceholder.src}
                                                alt=""
                                                className="w-full h-full object-center object-cover group-hover:scale-110 transition-all duration-[400ms] ease-in-out" />
                                        </div>

                                        <div
                                            className="absolute top-0 inset-x-0 h-80 p-4 flex items-end justify-end overflow-hidden">
                                            <div aria-hidden="true"
                                                 className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"></div>
                                            <div className="relative flex flex-col items-end">
                                                <Image
                                                    width={500}
                                                    height={500}
                                                    src={product?.issuer?.user?.imageUrl || ""}
                                                    alt={""}
                                                    className="w-10 h-10 object-cover rounded-full border-2 border-white" />
                                                <p className="mt-2 text-sm font-medium text-white drop-shadow">
                                                    {product?.issuer?.user?.name}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="relative p-4">
                                            <h3 className="text-lg font-medium text-gray-900 line-clamp-2 break-words">
                                                {item?.book?.name}
                                            </h3>
                                            {/*{product?.createdDate &&*/}
                                            {/*    <h2 className={"text-sm text-slate-600"}>*/}
                                            {/*        {item?.book?.releasedYear}*/}
                                            {/*    </h2>*/}
                                            {/*}*/}
                                            {/*Book formats*/}
                                            <div className={"flex mt-3 items-stretch gap-4"}>
                                                {/*Paper*/}
                                                <div
                                                    className="flex flex-col gap-1 justify-center items-center text-xs text-slate-400">
                                                    <AiFillBook className="flex-shrink-0 h-5 w-5 text-blue-600" />
                                                    <p className="font-medium text-slate-600">Giấy</p>
                                                </div>

                                                {/*Ebook*/}
                                                {item?.withPdf ?
                                                    <div
                                                        className="flex flex-col gap-1 justify-center items-center text-xs text-slate-400">
                                                        <AiFillFilePdf
                                                            className="flex-shrink-0 h-5 w-5 text-rose-600" />
                                                        <p className="font-medium text-slate-600">PDF</p>
                                                    </div>
                                                    : null}

                                                {/*Audio*/}
                                                {item?.withAudio ?
                                                    <div
                                                        className="flex flex-col gap-1 justify-center items-center text-xs text-slate-400">
                                                        <FaFileAudio className="flex-shrink-0 h-5 w-5 text-amber-500" />
                                                        <p className="font-medium text-slate-600">Audio</p>
                                                    </div>
                                                    : null}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </>
                : null}


            {/*Product description section*/
            }
            <h2 className={"text-gray-900 text-2xl font-semibold mt-8"}>
                Mô tả sản phẩm
            </h2>

            <div className={"mt-4 text-gray-700"}>
                {product?.description}
            </div>

            {product?.unhierarchicalBookProducts && product?.unhierarchicalBookProducts.length > 0 &&
                <>
                    <h2 className={"text-gray-900 text-2xl font-semibold mt-8"}>
                        Khám phá thêm
                    </h2>
                    <Tab.Group>
                        <Tab.List className={"flex flex-wrap gap-2"}>
                            {product?.unhierarchicalBookProducts?.map((ubp, index) => {
                                return (
                                    <Tab
                                        as={"div"}
                                        className={"focus:outline-none"}
                                        key={index}>
                                        <div
                                            className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm">
                                            {ubp?.title}
                                        </div>
                                    </Tab>
                                );
                            })
                            }
                        </Tab.List>
                        <Tab.Panels className={"mt-4"}>

                            {product?.unhierarchicalBookProducts?.map((ubp, index) => {
                                return (
                                    <Tab.Panel key={index}>
                                        {ubp?.bookProducts && ubp?.bookProducts.length > 0 ?
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                                                {ubp?.bookProducts.map((bookProduct, index) => {
                                                    return <CustomerProductCard product={bookProduct}
                                                                                key={bookProduct?.id} />;
                                                })}
                                            </div>
                                            : <EmptySection
                                                text={"Không có sản phẩm nào trong danh mục này"}
                                            />
                                        }
                                    </Tab.Panel>
                                );
                            })
                            }
                        </Tab.Panels>
                    </Tab.Group>
                </>
            }


            {/*        <pre>*/}
            {/*    {JSON.stringify(product, null, 2)}*/}
            {/*</pre>*/}
        </div>
    );
};

ProductDetailsPage.getLayout = (page) => {
    return (
        <CustomerLayout
            backgroundClassName={"bg-gray-50"}
        >
            {page}
        </CustomerLayout>
    );
};

export default ProductDetailsPage;