import React, { Fragment, useMemo, useState } from "react";
import { NextPageWithLayout } from "../_app";
import CustomerLayout from "../../components/Layout/CustomerLayout";
import CustomerSettingsLayout from "../../components/Layout/CustomerSettingsLayout";
import { Tab } from "@headlessui/react";
import Chip from "../../components/Admin/Chip";
import { DeliveryOrderTabs, getOrderStatusById, PickupOrderTabs } from "../../constants/OrderStatuses";
import { OrderTypes } from "../../constants/OrderTypes";
import { useAuth } from "../../context/AuthContext";
import { OrderService } from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import EmptyState, { EMPTY_STATE_TYPE } from "../../components/EmptyState";
import { getFormattedTime } from "../../utils/helper";
import Image from "next/image";
import Link from "next/link";
import OrderDetailCard from "../../components/CustomerOrder/OrderDetailCard";
import Pagination from "../../components/Pagination";
import SearchForm from "../../components/Admin/SearchForm";

const CustomerOrdersPage: NextPageWithLayout = () => {


    const { loginUser } = useAuth();
    const orderService = new OrderService(loginUser?.accessToken);
    const [orderType, setOrderType] = useState(Object.values(OrderTypes)[0].id);
    const [orderStatus, setOrderStatus] = useState(DeliveryOrderTabs[0].id);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");

    const requestParams = useMemo(() => {
        return {
            Type: orderType,
            Status: orderStatus,
            Page: currentPage,
            Size: 5,
            Sort: "OrderDate desc",
            Code: searchValue,
        };
    }, [orderType, orderStatus, currentPage, searchValue]);

    const {
        data: orderData,
        isInitialLoading,
    } = useQuery(["customer_orders", requestParams],
        () => orderService.getOrdersByCustomer(requestParams),
    );




    return (
        <div className="p-4 sm:p-6">
            <h1 className="text-2xl font-bold">
                Lịch sử đơn hàng
            </h1>

            <div className={"flex justify-end"}>
                <SearchForm
                    value={searchValue}
                    onSearchSubmit={setSearchValue}
                    placeholder={"Tìm kiếm đơn hàng..."}
                />
            </div>


            <Tab.Group
                onChange={(index) => setOrderType(Object.values(OrderTypes)[index].id)}
            >
                {/* Tabs */}
                <Tab.List as={"div"} className="relative my-6">
                    <div className="absolute bottom-0 w-full h-px bg-slate-200" aria-hidden="true"></div>
                    <ul className="relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
                        {Object.values(OrderTypes).map((tab) => (
                            <Tab
                                key={tab.id}
                                as={"div"}
                                className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8 focus:outline-none cursor-pointer">
                                <span
                                    className="block pb-3 ui-selected:text-indigo-500 text-slate-500 ui-selected:hover:text-slate-600 whitespace-nowrap ui-selected:border-b-2 ui-selected:border-indigo-500">
                                    {tab.displayName}
                                </span>
                            </Tab>
                        ))}
                    </ul>
                </Tab.List>
                <Tab.Panels>
                    <Tab.Panel>
                        <Tab.Group onChange={(index) => {
                            setOrderStatus(DeliveryOrderTabs[index].id);
                        }}>
                            <Tab.List>
                                <div className="">
                                    <ul className="flex flex-wrap gap-2">
                                        {DeliveryOrderTabs.map((tab) => (<Tab
                                                as={"div"}
                                                key={tab.id}
                                                className={"focus:outline-none"}
                                            >
                                                {({ selected }) => {
                                                    return (
                                                        <Chip active={selected}>
                                                            {tab.displayName}
                                                        </Chip>
                                                    );
                                                }}
                                            </Tab>
                                        ))}

                                    </ul>
                                </div>
                            </Tab.List>
                        </Tab.Group>
                    </Tab.Panel>
                    <Tab.Panel>
                        <Tab.Group onChange={(index) => {
                            setOrderStatus(PickupOrderTabs[index].id);
                        }}>
                            <Tab.List>
                                <div className="">
                                    <ul className="flex flex-wrap gap-2">
                                        {PickupOrderTabs.map((tab) => (<Tab
                                                as={"div"}
                                                key={tab.id}
                                                className={"focus:outline-none"}
                                            >
                                                {({ selected }) => {
                                                    return (
                                                        <Chip active={selected}>
                                                            {tab.displayName}
                                                        </Chip>
                                                    );
                                                }}
                                            </Tab>
                                        ))}

                                    </ul>
                                </div>
                            </Tab.List>
                        </Tab.Group>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>

            <div className="mt-4">
                {isInitialLoading ? <div>Đang tải...</div> :
                    orderData?.data && orderData?.data?.length > 0 ?
                        <Fragment>
                            <div className="space-y-8">
                                {orderData?.data?.map((order) => {
                                    const status = getOrderStatusById(order?.status);
                                    return <div key={order?.id || order?.code}
                                                className={"bg-white rounded-md border"}
                                    >
                                        {/*Header*/}
                                        <div className={"flex justify-between items-center p-4"}>
                                            <div>
                                                <h2 className={"text-lg font-semibold text-gray-600"}>
                                                    {order?.code}
                                                </h2>
                                                <p className={"text-sm text-gray-600"}>
                                                    Ngày đặt
                                                    hàng: {getFormattedTime(order?.orderDate, "HH:mm dd/MM/yyyy")}
                                                </p>
                                            </div>

                                            {/*Status*/}
                                            <div className={"flex items-center"}>
                                                <div className={"flex items-center space-x-2"}>
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${status?.dotColor || "bg-slate-400"}`} />
                                                    <p className={"text-sm text-gray-600"}>
                                                        {order?.statusName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>


                                        <div className="bg-indigo-50">
                                            <div className={"flex justify-between items-center px-4 py-2"}>
                                                <div className={"flex items-center gap-2"}>
                                                    <Image
                                                        src={order?.campaign?.imageUrl || ""}
                                                        width={200}
                                                        height={200}
                                                        className={"rounded-full object-cover w-6 h-6"}
                                                        alt={
                                                            ""
                                                        } />
                                                    <div className={"text-sm text-indigo-500 font-medium"}>
                                                        Hội sách: {order?.campaign?.name}
                                                    </div>
                                                </div>

                                                <Link href={`/campaigns/${order?.campaign?.id}`}
                                                      className={"text-sm text-indigo-600 font-medium"}
                                                >
                                                    Xem hội sách
                                                </Link>
                                            </div>
                                        </div>


                                        {/*Products*/}
                                        <div className={"divide-y divide-gray-200"}>
                                            {order?.orderDetails?.map((orderDetail) => {
                                                return (
                                                    <OrderDetailCard
                                                        key={orderDetail?.id}
                                                        orderDetail={orderDetail} />
                                                );
                                            })}
                                        </div>


                                        {/*Footer with grand total*/}

                                        <div className={"flex justify-between items-center p-4 border-t"}>
                                            <div>
                                                <div className="flex items-center space-x-2">
                                                    <p className={"text-lg text-gray-600"}>
                                                        Tổng tiền:
                                                    </p>
                                                    <p className={"text-lg text-indigo-600 font-medium"}>
                                                        {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }).format(order?.total || 0)}
                                                    </p>
                                                </div>
                                                <p className={"text-sm text-gray-500"}>
                                                    (Đã bao gồm phí vận chuyển và VAT nếu có)
                                                </p>
                                            </div>

                                            <Link href={`/orders/${order?.id}`}
                                                  className={"text-sm bg-indigo-600 text-white px-4 py-2 rounded-md font-medium"}
                                            >
                                                Xem chi tiết
                                            </Link>

                                        </div>
                                    </div>;
                                })}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <Pagination
                                    currentPage={currentPage}
                                    pageSize={5}
                                    totalItems={orderData?.metadata?.total || 0}
                                    onPageChange={p => setCurrentPage(p)}
                                    visiblePageButtonLimit={4}
                                />
                            </div>
                        </Fragment>
                        :
                        <div className={"py-32"}>
                            <EmptyState
                                status={EMPTY_STATE_TYPE.NO_DATA}
                            />
                        </div>
                }
            </div>
        </div>
    );
};

CustomerOrdersPage.getLayout = (page) => <CustomerLayout><CustomerSettingsLayout>
    {page}
</CustomerSettingsLayout></CustomerLayout>;

export default CustomerOrdersPage;