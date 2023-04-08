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
import { AiFillFilePdf } from "react-icons/ai";
import { FaFileAudio } from "react-icons/fa";
import { getAvatarFromName } from "../../../../utils/helper";
import { BookTypes } from "../../../../constants/BookTypes";

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
    ];

    if (productLoading) return <LoadingSpinnerWithOverlay label={"Đang tải thông tin sản phẩm"} />;
    return (
        <div>
            {/*Product overview section*/}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-y-0 bg-white p-4">
                <div className={"max-h-[512px]"}>
                    <Image
                        src={product?.imageUrl} alt={"Product image"}
                        width={500} height={500}
                        className={"h-auto max-h-full object-cover rounded-sm shadow-md"}
                    />
                </div>
                <div className={"col-span-2 px-8"}>

                    {/*Category tag card*/}
                    <div className={"flex items-center gap-2"}>
                        <div className={"text-sm font-medium bg-indigo-500 text-white rounded-sm py-1 px-3"}>
                            {product?.book?.genre?.name}
                        </div>
                        {/*<div className={"text-xs font-medium bg-gray-100 text-gray-500 rounded-sm py-1 px-1.5"}>*/}
                        {/*    {product?.subCategory?.name}*/}
                        {/*</div>*/}
                    </div>

                    {/*Book title*/}
                    <h1 className={"text-2xl mt-2 font-medium text-gray-900"}>
                        {product?.title}
                    </h1>
                    <div className={"lg:flex gap-2 mt-3 justify-between"}>
                        <div className={"grow shrink-0"}>
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
                                null
                                : <div className={"mt-4"}>
                                    <div className={"flex gap-4 mt-2"}>
                                        <div className={"bg-white rounded border overflow-hidden"}>
                                            <div
                                                className={"py-2 px-8 flex items-center gap-2 text-gray-700 bg-slate-50"}>
                                                <AiFillFilePdf className="flex-shrink-0 h-5 w-5 text-rose-600" />
                                                PDF
                                            </div>
                                            <div className={"flex flex-col justify-between items-center py-1 px-8"}>
                                                <div className={"text-green-600 my-2"}>
                                                    +{new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(15000 || 0)}
                                                </div>
                                                <button
                                                    className={"text-blue-600 text-sm"}>
                                                    Xem trước
                                                </button>
                                            </div>
                                        </div>
                                        <div className={"bg-white rounded border overflow-hidden"}>
                                            <div
                                                className={"py-2 px-8 flex items-center gap-2 text-gray-700 bg-slate-50"}>
                                                <FaFileAudio className="flex-shrink-0 h-5 w-5 text-amber-500" />
                                                Audio
                                            </div>
                                            <div className={"flex flex-col justify-between items-center py-1 px-8"}>
                                                <div className={"text-green-600 my-2"}>
                                                    +{new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(15000 || 0)}
                                                </div>
                                                <button
                                                    className={"text-blue-600 text-sm"}>
                                                    Nghe thử
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>}

                            {/* Author */}
                            {product?.type === BookTypes.Single.id && <>
                                <div className="text-gray-600 font-medium mt-6">Tác giả</div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {product?.book?.bookAuthors?.map((author) => (
                                            <div key={author?.author?.id}
                                                 className="flex items-center w-fit p-1 rounded-full bg-slate-50 shadow-sm">
                                                <Image
                                                    src={author?.author?.imageUrl || getAvatarFromName(author?.author?.name)}
                                                    alt={""} width={100} height={100}
                                                    className={"w-10 h-10 object-cover rounded-full flex-shrink-0"}
                                                />
                                                <span className="text-sm px-3 text-slate-700 font-medium">
                                    {author?.author?.name}
                                    </span>
                                            </div>
                                        ),
                                    )}
                                </div>
                            </>}
                        </div>
                        {/*Campaign and Issuer*/}
                        <div className={"border rounded h-fit lg:w-[40%]"}>
                            <div className={"flex gap-2 p-4 items-center"}>
                                <Image
                                    width={100}
                                    height={100}
                                    src={product?.issuer?.user?.imageUrl || getAvatarFromName(product?.issuer?.name)}
                                    className={"w-10 h-10 object-cover rounded-full flex-shrink-0"}
                                    alt={""} />
                                <div className={"text-sm font-medium text-gray-900"}>
                                    <span>{product?.issuer?.user?.name}</span>
                                    <span className={"text-xs text-gray-500 block line-clamp-1 break-words"}>
                                        {product?.issuer?.user?.email}
                                    </span>
                                </div>
                            </div>

                            <div className={"flex gap-2 p-4 items-center"}>
                                <Image
                                    width={100}
                                    height={100}
                                    src={product?.campaign?.imageUrl}
                                    className={"w-10 h-10 object-cover rounded-full flex-shrink-0"}
                                    alt={""} />
                                <div className={"text-sm font-medium text-gray-900"}>
                                    <span>{product?.campaign?.name}</span>
                                    {/*<span className={"text-xs text-gray-500 block"}>*/}
                                    {/*    {product?.issuer?.user?.email}*/}
                                    {/*</span>*/}
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
                    <div className={"grid grid-cols-4 gap-4 mt-4"}>
                        {product?.otherMobileBookProducts?.map((book) => (
                            <div key={book?.id}
                                 className={"bg-white flex items-stretch rounded overflow-hidden shadow-sm"}>
                                <div className={"shrink-0 w-1/3"}>
                                    <Image
                                        src={product?.campaign?.imageUrl}
                                        alt={""}
                                        width={500} height={500}
                                        className={"w-full h-full object-cover flex-shrink-0"}
                                    />
                                </div>

                                <div className={"p-3 flex flex-col gap-2 justify-between"}>
                                    <div>
                                        <div className={"text-sm font-medium text-gray-900"}>
                                            <span>{book?.campaignName}</span>
                                        </div>

                                        {/*<div className={"flex gap-1 items-center"}>*/}
                                        {/*    <Image*/}
                                        {/*        width={100}*/}
                                        {/*        height={100}*/}
                                        {/*        src={product?.issuer?.user?.imageUrl || getAvatarFromName(product?.issuer?.name)}*/}
                                        {/*        className={"w-8 h-8 object-cover rounded-full flex-shrink-0"}*/}
                                        {/*        alt={""} />*/}
                                        {/*    <div className={"text-xs font-medium text-gray-500"}>*/}
                                        {/*        <span>{product?.issuer?.user?.name}</span>*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>


                                    <div>
                                        <div>
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(book?.salePrice || 0)}

                                        </div>

                                        {book?.salePrice > product?.salePrice &&
                                            <div className={"w-fit rounded mt-3 text-xs text-white bg-rose-500 p-2"}>
                                                Đắt hơn{' '}
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(book?.salePrice - product?.salePrice || 0)}
                                            </div>}

                                         {book?.salePrice < product?.salePrice &&
                                            <div className={"w-fit rounded mt-3 text-xs text-white bg-green-500 p-2"}>
                                                Rẻ hơn{' '}
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format( product?.salePrice - book?.salePrice  || 0)}
                                            </div>}
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </>
            }

            {/*Product details section*/
            }
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


            {/*Product description section*/
            }
            <h2 className={"text-gray-900 text-2xl font-semibold mt-8"}>
                Mô tả sản phẩm
            </h2>

            <div className={"mt-4 text-gray-700"}>
                {product?.description}
            </div>


            {/*Similar products section*/
            }
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