import Image from "next/image";
import React, { Fragment, useContext } from "react";
import { IoArrowForward, IoChevronBack, IoLocationSharp } from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { getAvatarFromName, getFormattedDate } from "../../utils/helper";
import ContentHeader from "./ContentHeader";
import OrganizationCard from "./OrganizationCard";
import Separator from "./Seperator";
import StatusLabel from "./StatusLabel";
import { useRouter } from "next/router";
import { HiStatusOnline } from "react-icons/hi";
import { CampaignFormats } from "../../constants/CampaignFormats";
import { CampaignContext, CustomerCampaignContext } from "../../context/CampaignContext";
import EmptySection from "./EmptySection";
import { useQuery } from "@tanstack/react-query";
import { BookProductService } from "../../services/BookProductService";
import Link from "next/link";
import { Roles } from "../../constants/Roles";
import { IOrganization } from "../../types/Organization/IOrganization";
import { ISchedule } from "../../types/Campaign_Organization/ICampaignOrganization";
import { Tab } from "@headlessui/react";
import ProductCard from "../ProductCard";
import CustomerProductCard from "../CustomerProductCard";

const MainContent: React.FC = () => {
    const { loginUser } = useAuth();

    const router = useRouter();
    const isAdmin = loginUser?.role === Roles.SYSTEM.id;
    const isIssuer = loginUser?.role === Roles.ISSUER.id;
    const isCustomer = loginUser?.role === Roles.CUSTOMER.id;

    const campaign = useContext(CampaignContext);
    const customerCampaign = useContext(CustomerCampaignContext);

    const campaignOrganizations = (isAdmin || isIssuer) ?
        campaign?.campaignOrganizations || [] :
        customerCampaign?.organizations?.map((o, idx) => {
            return {
                id: idx,
                organizationId: o?.id,
                campaignId: customerCampaign?.id,
                organization: o as IOrganization,
                schedules: o?.schedules as ISchedule[],
            };
        }) || [];

    const campaignLevels = (isAdmin || isIssuer) ?
        campaign?.campaignLevels?.map(({ level }) => level) || [] : customerCampaign?.levels || [];

    const bookProductService = new BookProductService(loginUser?.accessToken);


    const getProductsParams = {
        page: 1,
        size: 6,
        sort: "CreatedDate desc, UpdatedDate desc",
        campaignId: campaign?.id,
    };

    const {
        data: productData,
        isInitialLoading: isProductsLoading,
    } = useQuery(
        [isAdmin ? "admin_products" : "issuer_products",
            getProductsParams],
        () => {
            if (isAdmin) {
                return bookProductService.getBookProducts(getProductsParams);
            } else if (isIssuer) {
                return bookProductService.getBookProductsByIssuer(getProductsParams);
            }
            return Promise.reject();
        },
        {
            enabled: !!campaign?.id && (isAdmin || isIssuer),
        },
    );


    return (
        <div>
            <div className="mb-6">
                <button
                    className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                    onClick={() => router.back()}
                >
                    <IoChevronBack size={"17"} />
                    <span>Quay lại</span>
                </button>
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-1 text-sm font-semibold uppercase text-indigo-500">
                {getFormattedDate((campaign || customerCampaign)?.startDate).fullDate}
                <IoArrowForward className={"fill-indigo-500"} />
                {getFormattedDate((campaign || customerCampaign)?.endDate).fullDate}
            </div>
            <header className="mb-4">
                {/* Title */}
                <h1 className="mb-2 text-2xl font-bold text-slate-800 md:text-3xl">
                    {(campaign || customerCampaign)?.name}
                </h1>
            </header>

            {/* Meta */}
            <div className="mb-6 space-y-3 sm:flex flex-wrap gap-4 sm:items-center sm:justify-between sm:space-y-0">
                {/* Location */}
                <div className="flex items-center gap-1 sm:mr-4">
                    {(campaign || customerCampaign)?.format === CampaignFormats.OFFLINE.id && (
                        <>
                            <IoLocationSharp
                                size={20}
                                className={"fill-red-700"}
                            />
                            <div className="whitespace-nowrap text-sm">
                                Diễn ra tại{" "}
                                <span className="font-semibold text-slate-800">
                                    {(campaign || customerCampaign)?.address}
                                </span>
                            </div>
                        </>
                    )}

                    {(campaign || customerCampaign)?.format === CampaignFormats.ONLINE.id && (
                        <>
                            <HiStatusOnline
                                size={20}
                                className={"fill-green-700"}
                            />
                            <div className="whitespace-nowrap text-sm">
                                <span className="font-semibold text-slate-800">
                                    Hội sách tổ chức trực tuyến
                                </span>
                            </div>
                        </>
                    )}
                </div>
                {/* Right side */}
                <StatusLabel statusId={(campaign || customerCampaign)?.status} />
            </div>

            {/* Image */}
            <figure className="mb-6">
                <Image
                    className="w-full rounded"
                    src={
                        (campaign || customerCampaign)?.imageUrl ||
                        `https://picsum.photos/1920/1080?random={${Math.random()}}`
                    }
                    width={1000}
                    height={1000}
                    alt=""
                />
            </figure>

            {/* Description */}
            <div>
                <ContentHeader text={"Mô tả hội sách"} />
                <p className="mt-2 mb-6 break-words">{(campaign || customerCampaign)?.description}</p>
            </div>

            {/*Organizations*/}
            {(campaign || customerCampaign)?.format === CampaignFormats.OFFLINE.id &&
                <Fragment>
                    <Separator />
                    <div>
                        <ContentHeader
                            text={`${
                                (campaign || customerCampaign)?.isRecurring
                                    ? "Tổ chức và lịch trình"
                                    : "Tổ chức"
                            } (${campaignOrganizations?.length || 0})`}
                        />
                        {campaignOrganizations && campaignOrganizations?.length > 0 && (
                            <div className="my-6 space-y-4">
                                {campaignOrganizations.map((org) => (
                                    <OrganizationCard
                                        campaignOrganization={org}
                                        key={org.id}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </Fragment>
            }

            {/*Commissions*/}
            {(isAdmin || isIssuer) &&
                <Fragment>
                    <Separator />
                    <div>
                        <ContentHeader
                            text={`Thể loại sách và chiết khấu (${campaign?.campaignCommissions?.length || 0})`}
                        />
                        {campaign?.campaignCommissions && campaign?.campaignCommissions?.length > 0 ? (
                            <div className="my-6 space-y-4">
                                {campaign?.campaignCommissions.map((commission) => (
                                    <div
                                        key={commission?.id}
                                        className="relative flex h-full w-full space-x-4 rounded border border-slate-200 bg-white px-4 py-6 shadow-sm transition duration-300 hover:shadow">
                                        <Image
                                            src={
                                                getAvatarFromName(
                                                    commission?.genre?.name,
                                                )
                                            }
                                            width={500}
                                            height={500}
                                            alt=""
                                            className="rounded-full object-cover h-12 w-12"
                                        />
                                        {/*Org Info*/}
                                        <div
                                            className={`grow min-w-0`}
                                        >
                                            <div className={"mb-1 text-base font-bold text-slate-700"}>
                                                {commission?.genre?.name}
                                            </div>
                                            <div className={"text-sm text-slate-500"}>
                                                Chiết khấu: <span
                                                className={"font-semibold"}>{commission?.minimalCommission}%</span>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptySection
                                text={""}
                            />
                        )}
                    </div>
                </Fragment>
            }

            {/*Groups*/}
            {(campaign?.format === CampaignFormats.ONLINE.id && (isAdmin || isIssuer)) && (
                <Fragment>
                    <Separator />
                    <div>
                        <ContentHeader
                            text={`Nhóm đề tài (${campaign?.campaignGroups?.length || 0})`}
                        />
                        {campaign?.campaignGroups && campaign?.campaignGroups?.length > 0 ? (
                            <div className="my-6 space-y-4">
                                {campaign?.campaignGroups.map((cg) => (
                                    <div
                                        key={cg?.id}
                                        className="relative flex h-full w-full space-x-4 rounded border border-slate-200 bg-white px-4 py-6 shadow-sm transition duration-300 hover:shadow">
                                        <Image
                                            src={
                                                getAvatarFromName(
                                                    cg?.group?.name,
                                                )
                                            }
                                            width={500}
                                            height={500}
                                            alt=""
                                            className="rounded-full object-cover h-12 w-12"
                                        />
                                        {/*Org Info*/}
                                        <div
                                            className={`grow min-w-0`}
                                        >
                                            <div className={"mb-1 text-base font-bold text-slate-700"}>
                                                {cg?.group?.name}
                                            </div>
                                            <div className={"text-sm text-slate-500"}>
                                                {cg?.group?.description}
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptySection
                                text={"Hội sách này chưa có nhóm đề tài được thêm."}
                            />
                        )}
                    </div>


                </Fragment>
            )}

            {/*Levels*/}
            {(campaign || customerCampaign)?.format === CampaignFormats.ONLINE.id && (
                <Fragment>
                    <Separator />
                    <div>
                        <ContentHeader
                            text={`Cấp độ khách hàng yêu cầu (${campaignLevels?.length || 0})`}
                        />
                        {campaignLevels?.length > 0 ? (
                            <div className="my-6 space-y-4">
                                {campaignLevels.map((l) => (
                                    <div
                                        key={l?.id}
                                        className="relative flex h-full w-full space-x-4 rounded border border-slate-200 bg-white px-4 py-6 shadow-sm transition duration-300 hover:shadow">
                                        <Image
                                            src={
                                                getAvatarFromName(
                                                    l?.name, 1,
                                                )
                                            }
                                            width={500}
                                            height={500}
                                            alt=""
                                            className="rounded-full object-cover h-12 w-12"
                                        />
                                        <div
                                            className={`grow min-w-0`}
                                        >
                                            <div className={"mb-1 text-base font-bold text-slate-700"}>
                                                <span>
                                                    {l?.name}
                                                </span>
                                                {/*<span className={"ml-2 bg-indigo-500 text-white font-medium p-2 rounded text-xs uppercase"}>*/}
                                                {/*   Cấp độ của bạn*/}
                                                {/*</span>*/}

                                            </div>
                                            <div className={"text-sm text-slate-500"}>
                                                Điểm: <span
                                                className={"font-semibold"}>{l?.conditionalPoint}</span>
                                            </div>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptySection
                                text={"Hội sách này chưa có cấp độ khách hàng yêu cầu."}
                            />
                        )}
                    </div>
                </Fragment>
            )}

            {/*Products*/}
            {(isAdmin || isIssuer) &&
                <Fragment>
                    <Separator />
                    <div>
                        <ContentHeader
                            text={`${isAdmin ? "Sách được thêm bởi NPH" : "Sách bạn đã thêm"} ${isProductsLoading ? "" : `(${productData?.metadata?.total || 0})`}`}
                        />
                        {/*See all*/}
                        {!isProductsLoading && productData?.metadata && productData?.metadata?.total > 0 &&
                            <div className="flex">
                                <Link className="text-indigo-500 hover:text-indigo-700 font-medium"
                                      href={`../products?campaign=${campaign?.id}`}>
                                    Xem tất cả
                                </Link>
                            </div>}
                        {isProductsLoading ? (<div>Loading...</div>)
                            : productData?.data && productData?.data?.length > 0 ? (
                                <div className="my-6">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {productData?.data?.map((product) => {
                                            return <ProductCard product={product} key={product?.id} />;
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <EmptySection
                                    text={isAdmin ? "Hội sách này chưa có sách được thêm." : "Bạn chưa thêm sách nào vào hội sách này."}
                                />
                            )}

                    </div>
                </Fragment>
            }

            {customerCampaign?.hierarchicalBookProducts &&
                customerCampaign?.hierarchicalBookProducts.map((hierarchicalBookProduct, index) => {
                    return <Fragment key={index}>
                        <Separator />
                        <div>
                            <ContentHeader
                                text={hierarchicalBookProduct?.title}
                            />
                            <Tab.Group>
                                <Tab.List className={"flex flex-wrap gap-2"}>
                                    {hierarchicalBookProduct?.subHierarchicalBookProducts && hierarchicalBookProduct?.subHierarchicalBookProducts.map((subHierarchicalBookProduct, index) => {
                                        return <Tab
                                            as={"div"}
                                            className={"focus:outline-none"}
                                            key={index}>
                                            <div
                                                className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm">
                                                {subHierarchicalBookProduct?.subTitle}
                                            </div>
                                        </Tab>;
                                    })}
                                </Tab.List>
                                <Tab.Panels className={"mt-4"}>
                                    {hierarchicalBookProduct?.subHierarchicalBookProducts && hierarchicalBookProduct?.subHierarchicalBookProducts.map((subHierarchicalBookProduct, index) => {
                                        return <Tab.Panel key={index}>
                                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                                {subHierarchicalBookProduct?.bookProducts && subHierarchicalBookProduct?.bookProducts.map((bookProduct, index) => {
                                                    return <CustomerProductCard product={bookProduct}
                                                                                key={bookProduct?.id} />;
                                                })}
                                            </div>
                                            <div className={"mt-8"}>
                                                <Link
                                                    href={{
                                                        pathname: "/products",
                                                        query: {
                                                            campaign: customerCampaign?.id,
                                                            issuer: subHierarchicalBookProduct?.issuerId || null,
                                                            genre: subHierarchicalBookProduct?.genreId || null,
                                                        },
                                                    }}
                                                    className="block font-medium text-blue-700 text-right"
                                                >
                                                    Xem thêm
                                                    sách {(subHierarchicalBookProduct?.issuer?.name && `từ ${subHierarchicalBookProduct?.issuer?.name}`) || (subHierarchicalBookProduct?.genre?.name && `thuộc ${subHierarchicalBookProduct?.genre?.name}`)}
                                                    <span aria-hidden="true"> &rarr;</span>
                                                </Link>
                                            </div>
                                        </Tab.Panel>;
                                    })}

                                </Tab.Panels>
                            </Tab.Group>
                        </div>
                    </Fragment>;
                })
            }



            {customerCampaign?.unhierarchicalBookProducts &&
                customerCampaign?.unhierarchicalBookProducts.map((ubp, index) => {
                    return <Fragment key={index}>
                        <Separator />
                        <div>
                            <ContentHeader
                                text={ubp?.title}
                            />
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                                {ubp?.bookProducts && ubp?.bookProducts.map((bookProduct, index) => {
                                    return (
                                        <CustomerProductCard product={bookProduct} key={bookProduct?.id} />
                                    );
                                })}
                            </div>
                        </div>
                    </Fragment>
                        ;
                })
            }

             {((customerCampaign?.hierarchicalBookProducts && customerCampaign?.hierarchicalBookProducts.length > 0)
                || (customerCampaign?.unhierarchicalBookProducts && customerCampaign?.unhierarchicalBookProducts.length > 0))
                ? <div className={"mt-8"}>
                    <Link
                        href={{
                            pathname: "/products",
                            query: {
                                campaign: customerCampaign?.id,
                            },
                        }}
                        className="block font-medium text-blue-700 text-right"
                    >
                        Xem tất cả sách từ hội sách này
                        <span aria-hidden="true"> &rarr;</span>
                    </Link>
                </div> : null}


            {isCustomer && <Fragment>
                <Separator />
                <div>
                    <ContentHeader
                        text={"Lưu ý và điều khoản"}
                    />
                    <div
                        className="my-6 text-slate-700 border border-slate-200 bg-slate-50 rounded-md p-4">
                        Boek không chịu trách nhiệm về việc đơn hàng đổi trả sách của khách hàng.
                        Xin vui lòng liên hệ
                        với NPH để được hỗ trợ về việc đổi trả sách.
                    </div>
                </div>
            </Fragment>}
        </div>
    );
};

export default MainContent;
;