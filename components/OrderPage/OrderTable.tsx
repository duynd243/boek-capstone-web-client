import React from "react";
import TableHeading from "../Admin/Table/TableHeading";
import TableHeader from "../Admin/Table/TableHeader";
import TableBody from "../Admin/Table/TableBody";
import TableRowSkeleton from "../Admin/Table/TableRowSkeleton";
import { getOrderStatusById } from "../../constants/OrderStatuses";
import TableData from "../Admin/Table/TableData";
import Image from "next/image";
import DefaultAvatar from "../../assets/images/default-avatar.png";
import { getFormattedTime } from "../../utils/helper";
import { OrderTypes } from "../../constants/OrderTypes";
import Link from "next/link";
import EmptyState, { EMPTY_STATE_TYPE } from "../EmptyState";
import TableFooter from "../Admin/Table/TableFooter";
import TableWrapper from "../Admin/Table/TableWrapper";
import { IBaseListResponse } from "../../types/Commons/IBaseListResponse";
import { IOrder } from "../../types/Order/IOrder";

type Props = {
    isInitialLoading: boolean;
    orderData: IBaseListResponse<IOrder> | undefined;
    search: string;
    setSearch: (value: string) => void;
    pageSizeOptions: number[];
    page: number;
    setPage: (value: number) => void;
    size: number;
    onSizeChange: (value: number) => void;

}

const OrderTable: React.FC<Props> = ({
                                         isInitialLoading, orderData,
                                         search, setSearch, page, setPage, pageSizeOptions, onSizeChange, size,
                                     }) => {
    return (
        <TableWrapper>
            <TableHeading>
                <TableHeader>Mã đơn hàng</TableHeader>
                <TableHeader>Khách hàng</TableHeader>
                <TableHeader>Thời gian đặt hàng</TableHeader>
                <TableHeader>Địa chỉ giao / nhận hàng</TableHeader>
                <TableHeader>Tổng tiền</TableHeader>
                <TableHeader>Hội sách</TableHeader>
                <TableHeader>Trạng thái</TableHeader>
                <TableHeader>
                    <span className="sr-only">Edit</span>
                </TableHeader>
            </TableHeading>
            <TableBody>

                {isInitialLoading
                    ? new Array(8).fill(0).map((_, index) => (
                        <TableRowSkeleton numberOfColumns={8} key={index} />
                    ))
                    : orderData?.data && orderData?.data?.length > 0
                        ? orderData?.data?.map((order) => {
                            const orderStatus = getOrderStatusById(order.status);
                            return <tr key={order?.id}>
                                <TableData className="text-sm font-medium uppercase text-blue-500">
                                    {order?.code}
                                </TableData>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full"
                                                src={order?.customer?.user?.imageUrl || DefaultAvatar.src}
                                                alt={order?.customerName || "Khách hàng"}
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order?.customerName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order?.customerEmail}
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData className="text-sm text-gray-500">
                                    {getFormattedTime(order?.orderDate, " HH:mm - dd/MM/yyyy")}
                                </TableData>
                                <TableData>
                                    <div className="text-sm text-gray-500 truncate w-[300px]">
                                        {order.type === OrderTypes.DELIVERY.id ? (order?.address || "-") : "Nhận tại quầy"}
                                    </div>
                                </TableData>
                                <TableData className="text-sm font-semibold text-emerald-600">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order?.total || 0)}
                                </TableData>
                                <TableData className="text-sm text-gray-700 font-medium">
                                    <Link href={`campaigns/${order?.campaignId}`}>
                                        {order?.campaign?.name || "-"}
                                    </Link>
                                </TableData>
                                <TableData>
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase leading-5 ${orderStatus?.labelColor}`}>
                                            {orderStatus?.displayName}
                                    </span>
                                </TableData>
                                <TableData className="text-right text-sm font-medium">
                                    <Link
                                        href={`${order.type === OrderTypes.DELIVERY.id ? "delivery" : "pickup"}/${order?.id}`}
                                        className="text-indigo-600 hover:text-indigo-700"
                                    >
                                        Chi tiết
                                    </Link>
                                </TableData>
                            </tr>;
                        })
                        : <td colSpan={8} className="py-12">
                            {search ? <EmptyState status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND} /> :
                                <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />}
                        </td>
                }
            </TableBody>
            {orderData?.data && orderData?.data?.length > 0 && <TableFooter
                colSpan={8}
                size={size}
                onSizeChange={onSizeChange}
                page={page}
                onPageChange={(page) => setPage(page)}
                totalElements={orderData?.metadata?.total || 0}
                pageSizeOptions={pageSizeOptions}
            />}
        </TableWrapper>
    );
};

export default OrderTable;