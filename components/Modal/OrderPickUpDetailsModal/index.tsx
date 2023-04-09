import React, {Fragment, useState} from 'react'
import {Dialog, Transition} from "@headlessui/react";
import {HiXMark} from "react-icons/hi2";
import Image from "next/image";
import {faker} from "@faker-js/faker/locale/vi";
import {OrderPickUpTypes} from "../../../constants/OrderPickUpTypes";
import OrderItem from "./OrderItem";
import {getNextPickUpUpdateStatus, getOrderPickUpStatusById, OrderPickUpStatuses} from "../../../constants/OrderPickUpStatuses";
import {useAuth} from "../../../context/AuthContext";
import {Roles} from "../../../constants/Roles";
import ConfirmModal from "../ConfirmModal";
import CancelOrderModal from "../CancelOrderModal";
import SectionHeader from "./SectionHeader";
import OrderGeneralInfo from "./OrderGeneralInfo";

export interface IMockOrderItem {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
    quantity: number;
}

export interface IMockOrder {
    id: string;
    campaignName: string;
    staffEmail: string;
    customer: {
        name: string;
        email: string;
        phone: string;
        imageUrl: string;
    },
    items: Array<IMockOrderItem>,
    total: number;
    address: string,
    orderType: number,
    status: number,
    createdAt: Date;
    paymentMethod: number;
}

function getMockOrder(): IMockOrder {
    const randomBoolean = faker.datatype.boolean();
    // true => pickup
    // false => delivery
    const pickupStatusIds = OrderPickUpTypes.PICKUP.availableStatuses.map(status => status.id);
    // const shippingStatusIds = OrderTypes.SHIPPING.availableStatuses.map(status => status.id);
    return {
        id: faker.datatype.uuid(),
        campaignName: "Hội sách chào mừng 20/11",
        staffEmail: faker.internet.email(),
        customer: {
            name: faker.name.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            imageUrl: faker.image.avatar(),
        },
        items: [
            {
                id: 1,
                name: "Có Hai Con Mèo Ngồi Bên Cửa Sổ",
                imageUrl: "https://salt.tikicdn.com/cache/w1200/ts/product/8a/c3/a9/733444596bdb38042ee6c28634624ee5.jpg",
                price: faker.datatype.number(),
                quantity: faker.datatype.number({min: 1, max: 5}),
            },
            {
                id: 2,
                name: "Thao Túng Tâm Lý",
                imageUrl: "https://salt.tikicdn.com/cache/w1200/ts/product/90/49/97/ec88ab408c1997378344486c94dbac40.jpg",
                price: faker.datatype.number(),
                quantity: faker.datatype.number({min: 1, max: 5}),
            },
            {
                id: 3,
                name: "Cây Cam Ngọt Của Tôi",
                imageUrl: "https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg",
                price: faker.datatype.number(),
                quantity: faker.datatype.number({min: 1, max: 5}),
            },

        ],
        total: faker.datatype.number(),
        address: randomBoolean ? "Hội sách" : faker.address.streetAddress(),
        orderType: randomBoolean ? 1 : 2,

        // random from array
        status: faker.helpers.arrayElement(pickupStatusIds),
        // status: faker.helpers.arrayElement(shippingStatusIds),
        createdAt: faker.date.past(),
        paymentMethod: faker.datatype.number({min: 1, max: 2}),
    }
}

export const mockOrders = Array.from({length: 10}, () => getMockOrder());


type Props = {
    isOpen: boolean;
    order?: IMockOrder;
    onClose: () => void;
    afterLeave?: () => void;
}

const OrderDetailsModal: React.FC<Props> = ({order, afterLeave, isOpen, onClose}) => {
    const {loginUser} = useAuth();
    const nextStatus = getNextPickUpUpdateStatus(order?.status, order?.orderType);

    const [showConfirmUpdateModal, setShowConfirmUpdateModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                onClose={onClose}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={afterLeave}
                >
                    <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"/>
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div
                                            className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                                                onClick={onClose}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <HiXMark className="h-6 w-6" aria-hidden="true"/>
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="py-8 px-4 lg:px-8 2xl:px-12">
                                            <div className="mx-auto max-w-sm lg:max-w-none">
                                                <h1 className="mb-6 text-2xl font-bold text-slate-800">
                                                    Chi tiết đơn hàng
                                                </h1>
                                                <div className="space-y-6">
                                                    {/* Order Info */}
                                                    <OrderGeneralInfo order={order}/>

                                                    {/* Order Details */}
                                                    <div>
                                                        <SectionHeader label={'Danh sách sản phẩm'}/>
                                                        {/* Cart items */}
                                                        <div>
                                                            {/* Cart item */}
                                                            {order?.items.map((item) => <OrderItem orderItem={item}
                                                                                                   key={item?.id}/>)}
                                                        </div>
                                                        {/* Fees, discount and total */}
                                                        <ul>
                                                            <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                                                <div className="text-sm">Tổng cộng</div>
                                                                <div
                                                                    className="ml-2 text-sm font-medium text-slate-800">
                                                                    {new Intl.NumberFormat("vi-VN", {
                                                                        style: "currency",
                                                                        currency: "VND",
                                                                    }).format(205000)}
                                                                </div>
                                                            </li>
                                                            {order?.orderType === 2 &&
                                                                <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                                                    <div className="text-sm">
                                                                        <span className={'mr-2'}>Phí vận chuyển</span>
                                                                        <span
                                                                            className="inline-flex whitespace-nowrap rounded-full bg-slate-200 px-2.5 py-1 text-center text-xs font-medium uppercase text-slate-500">
                                      Nội thành
                                    </span></div>
                                                                    <div
                                                                        className="ml-2 text-sm font-medium text-slate-800">
                                                                        {new Intl.NumberFormat("vi-VN", {
                                                                            style: "currency",
                                                                            currency: "VND",
                                                                        }).format(15000)}
                                                                    </div>
                                                                </li>}
                                                            {/*                        <li className="flex items-center justify-between border-b border-slate-200 py-3">*/}
                                                            {/*                            <div className="flex items-center">*/}
                                                            {/*<span className="mr-2 text-sm">*/}
                                                            {/*  Giảm giá*/}
                                                            {/*</span>*/}
                                                            {/*                                <span*/}
                                                            {/*                                    className="inline-flex whitespace-nowrap rounded-full bg-slate-200 px-2.5 py-1 text-center text-xs font-medium uppercase text-slate-500">*/}
                                                            {/*  Gói Tiết Kiệm*/}
                                                            {/*</span>*/}
                                                            {/*                            </div>*/}
                                                            {/*                            <div*/}
                                                            {/*                                className="ml-2 text-sm font-medium text-slate-800">*/}
                                                            {/*                                -*/}
                                                            {/*                                {new Intl.NumberFormat("vi-VN", {*/}
                                                            {/*                                    style: "currency",*/}
                                                            {/*                                    currency: "VND",*/}
                                                            {/*                                }).format(30000)}*/}
                                                            {/*                            </div>*/}
                                                            {/*                        </li>*/}
                                                            <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                                                <div className="font-medium">Thành tiền</div>
                                                                <div className="ml-2 font-medium text-emerald-600">
                                                                    {new Intl.NumberFormat("vi-VN", {
                                                                        style: "currency",
                                                                        currency: "VND",
                                                                    }).format(order?.total || 0)}
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    {/* Payment Details */}
                                                    <div>
                                                        <div className="mb-4 font-semibold text-slate-800">
                                                            Phương thức thanh toán
                                                        </div>
                                                        {order?.orderType === 1 ?
                                                            <div
                                                                className="rounded border border-slate-200 p-3 text-sm">
                                                                <div
                                                                    className="flex items-center justify-between space-x-2">
                                                                    {/* CC details */}
                                                                    <div className="flex items-center">
                                                                        {/* Mastercard icon */}
                                                                        {/*<svg className="shrink-0 mr-3" width="32"*/}
                                                                        {/*     height="24"*/}
                                                                        {/*     xmlns="http://www.w3.org/2000/svg">*/}
                                                                        {/*    <rect fill="#1E293B" width="32" height="24"*/}
                                                                        {/*          rx="3"/>*/}
                                                                        {/*    <ellipse fill="#E61C24" cx="12.522" cy="12"*/}
                                                                        {/*             rx="5.565" ry="5.647"/>*/}
                                                                        {/*    <ellipse fill="#F99F1B" cx="19.432" cy="12"*/}
                                                                        {/*             rx="5.565" ry="5.647"/>*/}
                                                                        {/*    <path*/}
                                                                        {/*        d="M15.977 7.578A5.667 5.667 0 0 0 13.867 12c0 1.724.777 3.353 2.11 4.422A5.667 5.667 0 0 0 18.087 12a5.667 5.667 0 0 0-2.11-4.422Z"*/}
                                                                        {/*        fill="#F26622"*/}
                                                                        {/*    />*/}
                                                                        {/*</svg>*/}
                                                                        <svg xmlns="http://www.w3.org/2000/svg"
                                                                             xmlnsXlink="http://www.w3.org/1999/xlink"
                                                                             height="32" width="32" version="1.1"
                                                                             viewBox="0 0 511.999 511.999"
                                                                             className={'mr-2 h-8 w-8'}
                                                                             xmlSpace="preserve">
                                                                            <circle style={{fill: '#FEE187'}}
                                                                                    cx="255.997"
                                                                                    cy="255.997" r="167.991"/>
                                                                            <g>
                                                                                <path style={{fill: '#FFC61B'}}
                                                                                      d="M255.999,0c-7.663,0-13.877,6.213-13.877,13.877s6.214,13.877,13.877,13.877   c57.945,0,110.905,21.716,151.199,57.422l-32.782,32.781c-32.95-28.356-74.49-43.824-118.416-43.824   c-45.157,0-86.517,16.549-118.35,43.892L95.044,75.42c-0.074-0.074-0.155-0.136-0.23-0.208c-0.072-0.075-0.135-0.157-0.208-0.23   c-5.42-5.419-14.204-5.419-19.626,0C26.628,123.334,0,187.622,0,255.999c0,141.159,114.842,255.999,255.999,255.999   c68.38,0,132.668-26.628,181.02-74.981s74.98-112.64,74.98-181.018C512,114.842,397.158,0,255.999,0z M365.043,147.093   c5.415,5.423,14.2,5.427,19.624,0.011c0.402-0.402,0.766-0.828,1.109-1.264c0.029-0.029,0.061-0.053,0.09-0.082l40.958-40.957   c32.834,37.053,53.823,84.82,56.987,137.322h-15.439c-7.663,0-13.877,6.213-13.877,13.877s6.214,13.877,13.877,13.877h15.445   c-3.047,51.144-22.905,99.081-56.914,137.401l-32.929-32.929c27.344-31.833,43.892-73.192,43.892-118.35   c0-7.664-6.214-13.877-13.877-13.877s-13.877,6.213-13.877,13.877c0,84.978-69.135,154.114-154.114,154.114   s-154.114-69.135-154.114-154.114s69.135-154.114,154.114-154.114C297.201,101.887,335.926,117.942,365.043,147.093z    M255.999,453.157c-7.663,0-13.877,6.213-13.877,13.877v16.777c-52.502-3.165-100.27-24.154-137.322-56.987l32.85-32.849   c31.833,27.344,73.192,43.892,118.35,43.892s86.517-16.549,118.35-43.892l32.929,32.929   c-38.319,34.009-86.257,53.866-137.402,56.914v-16.782C269.876,459.37,263.663,453.157,255.999,453.157z M28.188,269.876h46.47   c3.011,39.73,18.85,75.932,43.367,104.473l-32.85,32.85C52.341,370.146,31.353,322.38,28.188,269.876z M85.096,104.722   l32.929,32.929c-24.516,28.542-40.355,64.743-43.367,104.473H28.182C31.229,190.98,51.087,143.042,85.096,104.722z"/>
                                                                                <path style={{fill: '#FFC61B'}}
                                                                                      d="M320.125,334.171H191.875c-1.632,0-2.954,1.322-2.954,2.954v17.601c0,1.631,1.322,2.953,2.953,2.953   h128.251c1.631,0,2.953-1.322,2.953-2.953v-17.603C323.078,335.493,321.755,334.171,320.125,334.171z"/>
                                                                                <path style={{fill: '#FFC61B'}}
                                                                                      d="M320.616,166.7h-9.919v-9.919c0-1.359-1.102-2.46-2.46-2.46H289.65c-1.36,0-2.462,1.102-2.462,2.462   v9.919h-9.916c-1.36,0-2.462,1.102-2.462,2.462v18.584c0,1.359,1.102,2.46,2.46,2.46h9.918v33.384l-3.149-1.878   c-8.126-4.847-18.038-7.517-27.911-7.517c-30.326,0-54.997,24.698-54.997,55.056c0,30.361,24.657,55.063,54.964,55.063   c30.105,0,54.599-24.742,54.599-55.151c0.001-0.5,0.003-71.143,0.003-78.958h9.919c1.359,0,2.46-1.102,2.46-2.46v-18.585   C323.078,167.802,321.976,166.7,320.616,166.7z M287.305,267.263c0.003,0.237-0.019,0.518-0.053,0.871   c-0.033,0.401-0.064,0.792-0.064,1.121c0,17.4-14.015,31.554-31.242,31.554c-17.314,0-31.399-14.156-31.399-31.554   c0-17.396,14.19-31.549,31.632-31.549C273.038,237.706,286.42,250.425,287.305,267.263z"/>
                                                                            </g>
                                                                        </svg>

                                                                        <div className="font-medium text-slate-600">
                                                                            Thanh toán bằng tiền mặt
                                                                        </div>
                                                                    </div>
                                                                    {/* Expiry */}
                                                                    {/*<div className="ml-2">******7344</div>*/}
                                                                </div>
                                                            </div>
                                                            :
                                                            <div
                                                                className="rounded border border-slate-200 p-3 text-sm">
                                                                <div
                                                                    className="flex items-center justify-between space-x-2">
                                                                    {/* CC details */}
                                                                    <div className="flex items-center">
                                                                        {/* Mastercard icon */}
                                                                        {/*<svg className="shrink-0 mr-3" width="32"*/}
                                                                        {/*     height="24"*/}
                                                                        {/*     xmlns="http://www.w3.org/2000/svg">*/}
                                                                        {/*    <rect fill="#1E293B" width="32" height="24"*/}
                                                                        {/*          rx="3"/>*/}
                                                                        {/*    <ellipse fill="#E61C24" cx="12.522" cy="12"*/}
                                                                        {/*             rx="5.565" ry="5.647"/>*/}
                                                                        {/*    <ellipse fill="#F99F1B" cx="19.432" cy="12"*/}
                                                                        {/*             rx="5.565" ry="5.647"/>*/}
                                                                        {/*    <path*/}
                                                                        {/*        d="M15.977 7.578A5.667 5.667 0 0 0 13.867 12c0 1.724.777 3.353 2.11 4.422A5.667 5.667 0 0 0 18.087 12a5.667 5.667 0 0 0-2.11-4.422Z"*/}
                                                                        {/*        fill="#F26622"*/}
                                                                        {/*    />*/}
                                                                        {/*</svg>*/}
                                                                        <Image
                                                                            width={1000}
                                                                            height={1000}
                                                                            className="mr-2 h-8 w-8"
                                                                            src={
                                                                                "https://cdn.chanhtuoi.com/uploads/2020/10/zalo-pay.jpg"
                                                                            }
                                                                            alt=""
                                                                        />
                                                                        <div className="font-medium text-slate-600">
                                                                            ZaloPay
                                                                        </div>
                                                                    </div>
                                                                    {/* Expiry */}
                                                                    <div className="ml-2">******7344</div>
                                                                </div>
                                                            </div>
                                                        }

                                                    </div>

                                                    {loginUser?.role === Roles.ISSUER.id &&
                                                        <>
                                                            <div>
                                                                {/* Update order status */}
                                                                {nextStatus &&
                                                                    <button
                                                                        onClick={() => setShowConfirmUpdateModal(true)}
                                                                        className="m-btn w-full bg-indigo-500 text-white !py-3">
                                                                        Chuyển trạng thái
                                                                        sang {nextStatus.displayName.toLowerCase()}
                                                                    </button>
                                                                }

                                                                {/* Cancel order */}
                                                                {order?.status === OrderPickUpStatuses.PROCESSING.id &&
                                                                    <button
                                                                        onClick={() => setShowCancelModal(true)}
                                                                        className="mt-3 m-btn w-full bg-red-50 text-red-500 !py-3 disabled:opacity-50">
                                                                        Hủy đơn hàng
                                                                    </button>
                                                                }
                                                            </div>
                                                            {order?.status &&
                                                                <ConfirmModal
                                                                    color={'indigo'}
                                                                    isOpen={showConfirmUpdateModal}
                                                                    onClose={() => setShowConfirmUpdateModal(false)}
                                                                    onConfirm={() => setShowConfirmUpdateModal(false)}
                                                                    title={`Cập nhật trạng thái đơn hàng`}
                                                                    content={`Bạn có chắc chắn muốn chuyển trạng thái đơn hàng từ ${getOrderPickUpStatusById(order?.status)?.displayName} sang ${nextStatus?.displayName}?`}
                                                                    confirmText={'Xác nhận'}/>
                                                            }

                                                            <CancelOrderModal isOpen={showCancelModal}
                                                                              onClose={() => setShowCancelModal(false)}
                                                                              order={order}
                                                            />
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default OrderDetailsModal