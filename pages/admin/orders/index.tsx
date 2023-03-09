import React, {Fragment, ReactElement, useState} from "react";
import {NextPageWithLayout} from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import {ImBoxAdd, ImTruck} from "react-icons/im";
import Image from "next/image";
import {vi} from "date-fns/locale";
import {format} from "date-fns";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableData from "../../../components/Admin/Table/TableData";
import SearchForm from "../../../components/Admin/SearchForm";
import Form from "../../../components/Form";
import DateRangePickerModal from "../../../components/Modal/DateRangePickerModal";
import {DateRange} from "react-day-picker";
import OrderDetailsModal, {IMockOrder, mockOrders} from "../../../components/Modal/OrderDetailsModal";
import {OrderTypes} from "../../../constants/OrderTypes";
import {getOrderStatusById, OrderStatuses} from "../../../constants/OrderStatuses";
import {Tab} from "@headlessui/react";
import Chip from "../../../components/Admin/Chip";

const OrderTypeTabs = [
    {
        id: undefined,
        name: "All",
        displayName: "Tất cả loại đơn hàng",
    },
    {
        ...OrderTypes.PICKUP,
    }, {
        ...OrderTypes.SHIPPING,
    }
];

const OrderStatusTabs = [
    {
        id: undefined,
        name: "All",
        displayName: "Tất cả trạng thái",
    }, ...Object.values(OrderStatuses)
];
const AdminOrdersPage: NextPageWithLayout = () => {
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [showDetails, setShowDetails] = useState(false);
    const [showDateRangeModal, setShowDateRangeModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<IMockOrder | undefined>(undefined);

    return (
        <Fragment>
            <PageHeading className='mb-0' label="Đơn hàng">
                <SearchForm placeholder={'Tìm kiếm đơn hàng'}/>
            </PageHeading>

            <div className='bg-white px-4 rounded mb-2'>
                <Tab.Group>
                    <div className="border-b pt-2 border-gray-200 flex items-center justify-between">
                        <ul className="flex flex-wrap gap-2">
                            {OrderTypeTabs.map((tab) => (
                                <Tab
                                    onClick={() => {
                                    }}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.name}
                                >
                                    <div
                                        className='cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm'>
                                        {tab.displayName}
                                    </div>
                                </Tab>
                            ))}
                        </ul>
                        <Form.DateTimeInputField
                            onClick={() => setShowDateRangeModal(true)}
                            placeholder='Từ ngày - Đến ngày'
                            value={dateRange && dateRange?.from && dateRange?.to ? `${format(dateRange.from, 'dd/MM/yyyy')} - ${format(dateRange.to, 'dd/MM/yyyy')}` : ''}
                            id={'213'}
                        />
                    </div>
                </Tab.Group>

                <Tab.Group>
                    <div className="py-6">
                        <ul className="flex flex-wrap gap-2">
                            {OrderStatusTabs.map((tab) => (
                                <Tab
                                    onClick={() => {
                                    }}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.name}
                                >
                                    {({selected}) => {
                                        console.log(tab.statusColor)
                                        return (
                                            <Chip active={selected}>
                                                {tab?.statusColor && (
                                                    <span
                                                        className={`mr-2 inline-block h-2 w-2 rounded-full ${tab.statusColor}`}
                                                    />
                                                )}
                                                {tab.displayName}
                                            </Chip>
                                        );
                                    }}
                                </Tab>
                            ))}
                        </ul>
                    </div>
                </Tab.Group>
            </div>
            <TableWrapper>
                <TableHeading>
                    <TableHeader>Mã đơn hàng</TableHeader>
                    <TableHeader>Khách hàng</TableHeader>
                    <TableHeader>Ngày đặt hàng</TableHeader>
                    <TableHeader>Địa chỉ giao / nhận hàng</TableHeader>
                    <TableHeader>Tổng tiền</TableHeader>
                    <TableHeader>Loại đơn hàng</TableHeader>
                    <TableHeader>Trạng thái</TableHeader>
                    <TableHeader>
                        <span className="sr-only">Edit</span>
                    </TableHeader>
                </TableHeading>
                <TableBody>
                    {mockOrders.map((order, index) => {
                        return (
                            <tr key={index}>
                                <TableData className="text-sm font-medium uppercase text-blue-500">
                                    {order.id}
                                </TableData>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full"
                                                src={order.customer.imageUrl}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {order.customer.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {order.customer.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData className="text-sm text-gray-500">
                                    {format(
                                        order.createdAt,
                                        "eeee, dd/MM/yyyy",
                                        {locale: vi}
                                    )}
                                </TableData>

                                <TableData className="text-sm text-gray-500">
                                    {order.address}
                                </TableData>
                                <TableData className="text-sm font-semibold text-emerald-600">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order.total)}
                                </TableData>
                                <TableData>
                  <span
                      className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase leading-5 text-slate-600">
                    {order.orderType === OrderTypes.SHIPPING.id ? (
                        <>
                            <ImTruck/>
                            Giao hàng
                        </>
                    ) : (
                        <>
                            <ImBoxAdd/>
                            Nhận tại hội sách
                        </>
                    )}
                  </span>
                                </TableData>
                                <TableData>
                  <span
                      className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase leading-5 text-green-800">
                    {getOrderStatusById(order.status)?.displayName}
                  </span>
                                </TableData>
                                <TableData className="text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setShowDetails(true);
                                            setSelectedOrder(order);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-700"
                                    >
                                        Chi tiết
                                    </button>
                                </TableData>
                            </tr>
                        );
                    })}
                </TableBody>
            </TableWrapper>

            <OrderDetailsModal isOpen={showDetails}
                               order={selectedOrder}
                               onClose={() => setShowDetails(false)}
                               afterLeave={() => selectedOrder && setSelectedOrder(undefined)}
            />

            <DateRangePickerModal
                value={dateRange}
                title={'Chọn khoảng thời gian'}
                isOpen={showDateRangeModal}
                onDismiss={() => setShowDateRangeModal(false)}
                onClose={(value) => {
                    setDateRange(value);
                    setShowDateRangeModal(false);
                }}
            />
        </Fragment>
    );
};

AdminOrdersPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminOrdersPage;
