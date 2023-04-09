import React from "react";
import { Tab } from "@headlessui/react";
// import { IOrderStatus } from "../constants/OrderStatuses";
// import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
// import { IOrder } from "../types/Order/IOrder";
 import { IOrderStatus } from "../../constants/OrderStatuses";
 import { IBaseListResponse } from "../../types/Commons/IBaseListResponse";
 import { IOrder } from "../../types/Order/IOrder";
 
type Props = {
    tabs: Partial<IOrderStatus>[];
    orderData: IBaseListResponse<IOrder> | undefined;
    onStatusChange: (statusId: number | undefined) => void;
    isInitialLoading: boolean;
}

const OrderTabs: React.FC<Props> = ({ tabs, orderData, onStatusChange, isInitialLoading }) => {
    return (
        <div className="bg-white rounded mb-3">
            <Tab.Group>
                <div className="border-b px-4 border-gray-200 flex items-center justify-between">
                    <ul className="flex flex-wrap gap-2">
                        {tabs.map((tab) => (
                            <Tab
                                onClick={() => {
                                    onStatusChange(tab.id);
                                }}
                                as={"div"}
                                className={"focus:outline-none"}
                                key={tab.id}
                            >

                                {({ selected }) => (
                                    /* Use the `selected` state to conditionally style the selected tab. */
                                    <div
                                        className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm">
                                        {tab.displayName}
                                        {selected && !isInitialLoading ? (
                                            <span
                                                className="ml-2 py-0.5 px-2.5 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full">
                                                    {orderData?.metadata?.total || 0}
                                                </span>
                                        ) : null}
                                    </div>
                                )}

                            </Tab>
                        ))}
                    </ul>
                    {/*<Form.DateTimeInputField*/}
                    {/*    onClick={() => setShowDateRangeModal(true)}*/}
                    {/*    placeholder="Từ ngày - Đến ngày"*/}
                    {/*    value={dateRange && dateRange?.from && dateRange?.to ? `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}` : ""}*/}
                    {/*    id={"213"}*/}
                    {/*/>*/}
                </div>
            </Tab.Group>
        </div>
    );
};

export default OrderTabs;