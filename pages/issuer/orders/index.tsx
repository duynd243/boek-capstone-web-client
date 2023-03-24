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
import OrderDetailsModal, {IMockOrder, mockOrders} from "../../../components/Modal/OrderDetailsModal";
import {OrderTypes} from "../../../constants/OrderTypes";
import {getOrderStatusById, OrderStatuses} from "../../../constants/OrderStatuses";
import {FiMoreHorizontal} from "react-icons/fi";
import {Menu, Tab} from "@headlessui/react";
import {MdBlock, MdEdit, MdSort} from "react-icons/md";
import OrderStatusModal from "../../../components/Modal/OrderStatusModal";
import CancelOrderModal from "../../../components/Modal/CancelOrderModal";
import Form from "../../../components/Form";
import Chip from "../../../components/Admin/Chip";
import {DateRange} from "react-day-picker";

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

const IssuerOrdersPage: NextPageWithLayout = () => {
        const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
        const [showDetails, setShowDetails] = useState(false);
        const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
        const [showCancelModal, setShowCancelModal] = useState(false);
        const [showDateRangeModal, setShowDateRangeModal] = useState(false);
        const [selectedOrder, setSelectedOrder] = useState<IMockOrder | undefined>(undefined);


        const OrderActions = [
            {
                icon: <MdSort className={'text-indigo-700'}/>,
                label: "Chi tiết",
                onClick: (order: IMockOrder) => {
                    setShowDetails(true);
                    setSelectedOrder(order);
                }
            }, {
                icon: <MdEdit className={'text-indigo-700'}/>,
                label: "Câp nhật trạng thái",
                onClick: (order: IMockOrder) => {
                    setShowUpdateStatusModal(true);
                    setSelectedOrder(order);
                }
            }, {
                icon: <MdBlock className={'text-rose-600'}/>,
                label: "Huỷ đơn hàng",
                isDanger: true,
                onClick: (order: IMockOrder) => {
                    setShowCancelModal(true);
                    setSelectedOrder(order);
                }
            }
        ]
        return (
            <Fragment>
                <PageHeading label="Đơn hàng"></PageHeading>
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
                                        {/*<Menu as={'div'} className={'relative'}>*/}
                                        {/*    <Menu.Button*/}
                                        {/*        className='bg-slate-100 w-6 h-6 flex items-center rounded-full justify-center hover:bg-slate-200'*/}
                                        {/*        as={'div'}>*/}
                                        {/*        <FiMoreHorizontal*/}
                                        {/*            className={"cursor-pointer text-slate-600 w-4 h-4"}*/}
                                        {/*        />*/}
                                        {/*    </Menu.Button>*/}
                                        {/*    <Menu.Items*/}
                                        {/*        className="absolute right-0 z-10 mt-2 origin-top-right overflow-hidden rounded-lg bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">*/}
                                        {/*        <div className="relative flex flex-col gap-2 bg-white">*/}
                                        {/*            {OrderActions.map((action, index) => {*/}
                                        {/*                    const disabled = (action?.isDanger === true && order.status !== OrderStatuses.PROCESSING.id) || order.status === OrderStatuses.CANCELLED.id && action?.label !== 'Chi tiết';*/}
                                        {/*                    return <Menu.Item*/}
                                        {/*                        onClick={action?.onClick ? () => action.onClick(order) : undefined}*/}
                                        {/*                        as={'button'}*/}
                                        {/*                        disabled={disabled}*/}
                                        {/*                        className={`flex items-center gap-2 p-2 rounded-md ui-active:bg-slate-50 disabled:cursor-not-allowed cursor-pointer ${action?.isDanger ? 'text-rose-500' : 'text-indigo-600'} ${disabled ? 'opacity-50' : ''}`}*/}
                                        {/*                        key={index}>*/}
                                        {/*                        {action.icon}*/}
                                        {/*                        <span>*/}
                                        {/*                        {action.label}*/}
                                        {/*                    </span>*/}
                                        {/*                    </Menu.Item>*/}
                                        {/*                }*/}
                                        {/*            )}*/}

                                        {/*        </div>*/}
                                        {/*    </Menu.Items>*/}
                                        {/*</Menu>*/}

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

                <OrderStatusModal isOpen={showUpdateStatusModal}
                                  onClose={() => setShowUpdateStatusModal(false)}
                                  order={selectedOrder}/>

                <CancelOrderModal isOpen={showCancelModal}
                                  onClose={() => setShowCancelModal(false)}
                                  order={selectedOrder}
                />
            </Fragment>
        );
    }
;

IssuerOrdersPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerOrdersPage;
