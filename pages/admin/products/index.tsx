import React, { Fragment, ReactElement, useState } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { Tab } from "@headlessui/react";
import { BookProductStatuses, getBookProductStatusById } from "../../../constants/BookProductStatuses";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import Chip from "../../../components/Admin/Chip";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableFooter from "../../../components/Admin/Table/TableFooter";
import { useRouter } from "next/router";
import { BookProductService } from "../../../services/BookProductService";
import { CampaignStatuses } from "../../../constants/CampaignStatuses";
import { getBookTypeById } from "../../../constants/BookTypes";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import { isValidImageSrc } from "../../../utils/helper";
import Link from "next/link";
import DefaultAvatar from "../../../assets/images/default-avatar.png";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import TableRowSkeleton from "../../../components/Admin/Table/TableRowSkeleton";
import { CampaignService } from "../../../services/CampaignService";
import { Roles } from "../../../constants/Roles";
import SelectBox from "../../../components/SelectBox";
import { ICampaign } from "../../../types/Campaign/ICampaign";

const BookProductTabs = [
    BookProductStatuses.Pending,
    BookProductStatuses.Rejected,
    BookProductStatuses.Selling,
    {
        id: "Stopped",
        displayName: "Ngừng bán",
    },
];
const NotSaleStatusTabs = [
    BookProductStatuses.NotSale,
    BookProductStatuses.OutOfStock,
    BookProductStatuses.NotSaleDueCancelledCampaign,
    BookProductStatuses.NotSaleDueEndDate,
    BookProductStatuses.NotSaleDuePostponedCampaign,
    BookProductStatuses.Unreleased,
];
const AdminBookProductsPage: NextPageWithLayout = () => {
    const router = useRouter();

    const { loginUser } = useAuth();
    const bookProductService = new BookProductService(loginUser?.accessToken);
    const campaignService = new CampaignService(loginUser?.accessToken);

    const { data: campaigns, isInitialLoading: isCampaignsLoading } = useQuery(
        [loginUser?.role === Roles.SYSTEM.id ? "admin_campaigns" : "issuer_campaigns"],
        loginUser?.role === Roles.SYSTEM.id ?
            () => campaignService.getCampaignsByAdmin({
                size: 100,
                sort: "CreatedDate desc, UpdatedDate desc",
            })
            :
            () => campaignService.getCampaignsByCustomer({
                size: 100,
                sort: "CreatedDate desc, UpdatedDate desc",
            }),
    );
    const campaignIdFromUrl = router.query["campaign"] as string;
    const [campaignId, setCampaignId] = useState<number | null>(Number(campaignIdFromUrl) || null);

    const [status, setStatus] = useState(BookProductTabs[0].id);
    const [notSaleStatus, setNotSaleStatus] = useState(NotSaleStatusTabs[0].id);
    const {
        search,
        setSearch,
        page,
        size,
        onSizeChange,
        pageSizeOptions,
        setPage,
    } = useTableManagementPage();

    const handleStatusChange = (tab: typeof BookProductTabs[number]) => {
        setStatus(tab.id);
        setPage(1);
    };

    const handleNotSaleStatusChange = (tab: typeof NotSaleStatusTabs[number]) => {
        setNotSaleStatus(tab.id);
        setPage(1);
    };

    const params = {
        title: search,
        page,
        size,
        status: status === "Stopped" ? notSaleStatus : status,
        sort: "CreatedDate desc, UpdatedDate desc",
        "Campaign.Status": status === BookProductStatuses.Pending.id ? CampaignStatuses.NOT_STARTED.id : undefined,
        campaignId: campaignId || undefined,
    };

    const {
        data: productData,
        isLoading,
        isFetching,
        isInitialLoading,
    } = useQuery(
        ["admin_products", params],
        () =>
            bookProductService.getBookProducts(params),
    );
    return (
        <Fragment>
            <PageHeading label="Sách bán tại hội sách">
                <SearchForm
                    placeholder="Tìm kiếm sách bán"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
            </PageHeading>

            <div className="bg-white rounded mb-3">
                <div className="border-b px-4 border-gray-200 flex items-center justify-between">
                    <Tab.Group>
                        <ul className="flex flex-wrap gap-2">
                            {BookProductTabs.map((tab) => (
                                <Tab
                                    onClick={() => handleStatusChange(tab)}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.id}
                                >
                                    <div
                                        className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-6 px-4 border-b-2 font-medium text-sm">
                                        {tab.displayName}
                                    </div>
                                </Tab>
                            ))}
                        </ul>
                    </Tab.Group>

                    <div className={"w-72"}>
                        <SelectBox<Partial<ICampaign>>
                            value={
                                campaigns?.data?.find((c) => c?.id === campaignId) || null
                            }
                            placeholder={isCampaignsLoading ? "Đang tải..." : "Tất cả hội sách"}
                            dataSource={[{
                                id: undefined,
                                name: "Tất cả hội sách",
                            }, ...campaigns?.data || []]}
                            onValueChange={async (c) => {
                                if (c) {
                                    if (c?.id === campaignId) return;
                                    setCampaignId(c?.id || null);
                                    await router.push({
                                        pathname: router.pathname,
                                        query: {
                                            ...router.query,
                                            "campaign": c?.id,
                                        },
                                    });
                                }
                            }}
                            disabled={isCampaignsLoading}
                            displayKey={"name"} />
                    </div>
                </div>
                {status === "Stopped" &&
                    <Tab.Group>
                        <div className="py-6 px-4">
                            <ul className="flex flex-wrap gap-2">
                                {NotSaleStatusTabs.map((tab) => (
                                    <Tab
                                        onClick={() => handleNotSaleStatusChange(tab)}
                                        as={"div"}
                                        className={"focus:outline-none"}
                                        key={tab.displayName}
                                    >
                                        {({ selected }) => {
                                            return (
                                                <Chip active={selected}>
                                                    {/*{tab?.statusColor && (*/}
                                                    {/*    <span*/}
                                                    {/*        className={`mr-2 inline-block h-2 w-2 rounded-full bg-${tab.statusColor}-500`}*/}
                                                    {/*    />*/}
                                                    {/*)}*/}
                                                    {tab.displayName}
                                                </Chip>
                                            );
                                        }}
                                    </Tab>
                                ))}
                            </ul>
                        </div>
                    </Tab.Group>
                }


            </div>
            <div className="mt-3">
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Tên sách</TableHeader>
                        <TableHeader>Giá bán</TableHeader>
                        <TableHeader>Được tạo bởi</TableHeader>
                        <TableHeader>Hội sách</TableHeader>
                        <TableHeader>Loại sách</TableHeader>
                        <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
                        <TableHeader>
                            <span className="sr-only">Edit</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {isInitialLoading
                            ? new Array(8).fill(0).map((_, index) => (
                                <TableRowSkeleton numberOfColumns={7} key={index} />
                            ))
                            : productData?.data && productData?.data?.length > 0 ?
                                productData?.data?.map((book) => {
                                    const bookType = getBookTypeById(book?.type);
                                    const bookStatus = getBookProductStatusById(book?.status);

                                    return (
                                        <tr key={book?.id}>

                                            <TableData className="max-w-72">
                                                <div title={book?.title}
                                                     className="flex items-center gap-4 w-72 truncate">
                                                    <Image
                                                        width={500}
                                                        height={500}
                                                        className="h-20 w-16 object-cover rounded-sm shadow-sm"
                                                        src={book?.imageUrl || ""}
                                                        alt=""
                                                    />
                                                    <div
                                                        className="overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                                                        {book?.title}
                                                    </div>
                                                </div>
                                            </TableData>
                                            <TableData className="text-sm font-semibold text-emerald-600">
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(book?.salePrice || 0)}
                                            </TableData>
                                            <TableData>
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            className="h-10 w-10 rounded-full object-cover"
                                                            src={book?.issuer?.user?.imageUrl && isValidImageSrc(book?.issuer?.user?.imageUrl)
                                                                ? book?.issuer?.user?.imageUrl
                                                                : DefaultAvatar.src}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm text-gray-900">
                                                            {book?.issuer?.user?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableData>
                                            <TableData className="text-sm text-gray-700 font-medium">
                                                <Link href={`campaigns/${book?.campaignId}`}>
                                                    {book?.campaign?.name || "-"}
                                                </Link>
                                            </TableData>

                                            <TableData className="text-sm text-gray-600">
                                                <div
                                                    className="w-fit px-3 py-2 flex items-center justify-center rounded-full border bg-gray-50">
                                                    {bookType?.icon} {bookType?.displayName}
                                                </div>
                                            </TableData>
                                            <TableData className="text-sm">
                                                <span
                                                    className={`w-fit flex items-center h-6 px-3 text-xs font-semibold ${bookStatus?.label?.classNames}`}>
                                                {bookStatus?.commonDisplayName || bookStatus?.displayName}
                                            </span>
                                            </TableData>

                                            <TableData className="text-right text-sm font-medium">
                                                <Link
                                                    href={`products/${book?.id}`}
                                                    className="text-indigo-600 hover:text-indigo-700"
                                                >
                                                    Chi tiết
                                                </Link>
                                            </TableData>
                                        </tr>
                                    );
                                })
                                : <td colSpan={7} className="py-12">
                                    {search ? <EmptyState status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND} /> :
                                        <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />}
                                </td>
                        }
                    </TableBody>
                    {productData?.data && productData?.data?.length > 0 && <TableFooter
                        colSpan={10}
                        size={size}
                        onSizeChange={onSizeChange}
                        page={page}
                        onPageChange={setPage}
                        totalElements={productData?.metadata?.total || 0}
                        pageSizeOptions={pageSizeOptions}
                    />}
                </TableWrapper>
            </div>
        </Fragment>
    );
};
AdminBookProductsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AdminBookProductsPage;