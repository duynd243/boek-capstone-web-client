import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import OrderGeneralInfo from "../../../components/Modal/OrderDetailsModal/OrderGeneralInfo";
import SectionHeader from "../../../components/Modal/OrderDetailsModal/SectionHeader";
import OrderItem from "../../../components/Modal/OrderDetailsModal/OrderItem";
import Image from "next/image";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { OrderService } from "../../../services/OrderService";
import { getOrderPaymentMethodById } from "../../../constants/OrderPaymentMethods";
import StatusCard from "../../../components/Modal/OrderDetailsModal/StatusCard";


const AdminOrderDetailsPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { loginUser } = useAuth();
    const ids = router.query.id as string[];
    const id = ids[ids.length - 1];
    const orderService = new OrderService(loginUser?.accessToken);
    console.log(router.query);
    console.log(id);

    const { data: order } = useQuery(["order", id],
        () => orderService.getOrderByIdByIssuer(id),
        {
            enabled: !!id,
        },
    );
    const orderPaymentMethod = getOrderPaymentMethodById(order?.payment);
    return (
        <div className="max-w-5xl mx-auto rounded py-8 px-4 lg:px-8 2xl:px-12 bg-white">
            <div className="mx-auto">

                <StatusCard order={order} />
                <h1 className="mb-6 text-2xl font-bold text-slate-800">
                    Chi tiết đơn hàng
                    <span className="ml-2 text-xl font-medium text-slate-500">
                        {order?.code}
                    </span>
                </h1>
                <div className="space-y-6">
                    {/* Order Info */}
                    <OrderGeneralInfo order={order} />

                    {/* Order Details */}
                    <div>
                        <SectionHeader label={"Danh sách sản phẩm"} />
                        {/* Cart items */}
                        <div className={"grid md:grid-cols-2 gap-4"}>
                            {/* Cart item */}
                            {order?.orderDetails?.map((item) => <OrderItem orderItem={item}
                                                                           key={item?.id} />)}
                        </div>
                        <div>
                            <div className="mb-4 font-semibold text-slate-800">
                                Phương thức thanh toán
                            </div>

                            <div
                                className="rounded border border-slate-200 p-3 text-sm">
                                <div
                                    className="flex items-center justify-between space-x-2">
                                    {/* CC details */}
                                    <div className="flex items-center">
                                        <Image
                                            width={500}
                                            height={500}
                                            className="mr-2 h-8 w-8"
                                            src={orderPaymentMethod?.logo?.src || ""}
                                            alt=""
                                        />
                                        <div className="font-medium text-slate-600">
                                            {order?.paymentName}
                                        </div>
                                    </div>
                                    {/* Expiry */}
                                    {/*<div className="ml-2">******7344</div>*/}
                                </div>
                            </div>
                            {/*{order?.orderType === 1 ?*/}
                            {/*    <div*/}
                            {/*        className="rounded border border-slate-200 p-3 text-sm">*/}
                            {/*        <div*/}
                            {/*            className="flex items-center justify-between space-x-2">*/}
                            {/*            /!* CC details *!/*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                /!*</svg>*!/*/}
                            {/*                <svg xmlns="http://www.w3.org/2000/svg"*/}
                            {/*                     xmlnsXlink="http://www.w3.org/1999/xlink"*/}
                            {/*                     height="32" width="32" version="1.1"*/}
                            {/*                     viewBox="0 0 511.999 511.999"*/}
                            {/*                     className={"mr-2 h-8 w-8"}*/}
                            {/*                     xmlSpace="preserve">*/}
                            {/*                    <circle style={{ fill: "#FEE187" }}*/}
                            {/*                            cx="255.997"*/}
                            {/*                            cy="255.997" r="167.991" />*/}
                            {/*                    <g>*/}
                            {/*                        <path style={{ fill: "#FFC61B" }}*/}
                            {/*                              d="M255.999,0c-7.663,0-13.877,6.213-13.877,13.877s6.214,13.877,13.877,13.877   c57.945,0,110.905,21.716,151.199,57.422l-32.782,32.781c-32.95-28.356-74.49-43.824-118.416-43.824   c-45.157,0-86.517,16.549-118.35,43.892L95.044,75.42c-0.074-0.074-0.155-0.136-0.23-0.208c-0.072-0.075-0.135-0.157-0.208-0.23   c-5.42-5.419-14.204-5.419-19.626,0C26.628,123.334,0,187.622,0,255.999c0,141.159,114.842,255.999,255.999,255.999   c68.38,0,132.668-26.628,181.02-74.981s74.98-112.64,74.98-181.018C512,114.842,397.158,0,255.999,0z M365.043,147.093   c5.415,5.423,14.2,5.427,19.624,0.011c0.402-0.402,0.766-0.828,1.109-1.264c0.029-0.029,0.061-0.053,0.09-0.082l40.958-40.957   c32.834,37.053,53.823,84.82,56.987,137.322h-15.439c-7.663,0-13.877,6.213-13.877,13.877s6.214,13.877,13.877,13.877h15.445   c-3.047,51.144-22.905,99.081-56.914,137.401l-32.929-32.929c27.344-31.833,43.892-73.192,43.892-118.35   c0-7.664-6.214-13.877-13.877-13.877s-13.877,6.213-13.877,13.877c0,84.978-69.135,154.114-154.114,154.114   s-154.114-69.135-154.114-154.114s69.135-154.114,154.114-154.114C297.201,101.887,335.926,117.942,365.043,147.093z    M255.999,453.157c-7.663,0-13.877,6.213-13.877,13.877v16.777c-52.502-3.165-100.27-24.154-137.322-56.987l32.85-32.849   c31.833,27.344,73.192,43.892,118.35,43.892s86.517-16.549,118.35-43.892l32.929,32.929   c-38.319,34.009-86.257,53.866-137.402,56.914v-16.782C269.876,459.37,263.663,453.157,255.999,453.157z M28.188,269.876h46.47   c3.011,39.73,18.85,75.932,43.367,104.473l-32.85,32.85C52.341,370.146,31.353,322.38,28.188,269.876z M85.096,104.722   l32.929,32.929c-24.516,28.542-40.355,64.743-43.367,104.473H28.182C31.229,190.98,51.087,143.042,85.096,104.722z" />*/}
                            {/*                        <path style={{ fill: "#FFC61B" }}*/}
                            {/*                              d="M320.125,334.171H191.875c-1.632,0-2.954,1.322-2.954,2.954v17.601c0,1.631,1.322,2.953,2.953,2.953   h128.251c1.631,0,2.953-1.322,2.953-2.953v-17.603C323.078,335.493,321.755,334.171,320.125,334.171z" />*/}
                            {/*                        <path style={{ fill: "#FFC61B" }}*/}
                            {/*                              d="M320.616,166.7h-9.919v-9.919c0-1.359-1.102-2.46-2.46-2.46H289.65c-1.36,0-2.462,1.102-2.462,2.462   v9.919h-9.916c-1.36,0-2.462,1.102-2.462,2.462v18.584c0,1.359,1.102,2.46,2.46,2.46h9.918v33.384l-3.149-1.878   c-8.126-4.847-18.038-7.517-27.911-7.517c-30.326,0-54.997,24.698-54.997,55.056c0,30.361,24.657,55.063,54.964,55.063   c30.105,0,54.599-24.742,54.599-55.151c0.001-0.5,0.003-71.143,0.003-78.958h9.919c1.359,0,2.46-1.102,2.46-2.46v-18.585   C323.078,167.802,321.976,166.7,320.616,166.7z M287.305,267.263c0.003,0.237-0.019,0.518-0.053,0.871   c-0.033,0.401-0.064,0.792-0.064,1.121c0,17.4-14.015,31.554-31.242,31.554c-17.314,0-31.399-14.156-31.399-31.554   c0-17.396,14.19-31.549,31.632-31.549C273.038,237.706,286.42,250.425,287.305,267.263z" />*/}
                            {/*                    </g>*/}
                            {/*                </svg>*/}

                            {/*                <div className="font-medium text-slate-600">*/}
                            {/*                    Thanh toán bằng tiền mặt*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*            /!* Expiry *!/*/}
                            {/*            /!*<div className="ml-2">******7344</div>*!/*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*    :*/}
                            {/*    <div*/}
                            {/*        className="rounded border border-slate-200 p-3 text-sm">*/}
                            {/*        <div*/}
                            {/*            className="flex items-center justify-between space-x-2">*/}
                            {/*            /!* CC details *!/*/}
                            {/*            <div className="flex items-center">*/}
                            {/*                <Image*/}
                            {/*                    width={1000}*/}
                            {/*                    height={1000}*/}
                            {/*                    className="mr-2 h-8 w-8"*/}
                            {/*                    src={*/}
                            {/*                        "https://cdn.chanhtuoi.com/uploads/2020/10/zalo-pay.jpg"*/}
                            {/*                    }*/}
                            {/*                    alt=""*/}
                            {/*                />*/}
                            {/*                <div className="font-medium text-slate-600">*/}
                            {/*                    ZaloPay*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*            /!* Expiry *!/*/}
                            {/*            /!*<div className="ml-2">******7344</div>*!/*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*}*/}

                        </div>
                        {/* Fees, discount and total */}
                        <ul>
                            <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                <div className="text-sm">Tạm tính</div>
                                <div
                                    className="ml-2 text-sm font-medium text-slate-800">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(
                                        order?.subTotal || 0,
                                    )}
                                </div>
                            </li>
                            <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                <div className="text-sm">
                                    <span className={"mr-2"}>Phí vận chuyển</span>
                                    <span
                                        className="inline-flex whitespace-nowrap rounded-full bg-slate-200 px-2.5 py-1 text-center text-xs font-medium uppercase text-slate-500">
                                      Nội thành
                                    </span></div>
                                <div
                                    className="ml-2 text-sm font-medium text-slate-800">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order?.freight || 0)}
                                </div>
                            </li>

                            <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                <div className="text-sm">
                                    <span className={"mr-2"}>Giảm giá</span>

                                </div>
                                <div
                                    className="ml-2 text-sm font-medium text-slate-800">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order?.discountTotal || 0)}
                                </div>
                            </li>
                            <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                <div className="font-medium">Tổng tiền</div>
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


                    {/*{loginUser?.role === Roles.ISSUER.id &&*/}
                    {/*    <>*/}
                    {/*        <div>*/}
                    {/*            /!* Update order status *!/*/}
                    {/*            {nextStatus &&*/}
                    {/*                <button*/}
                    {/*                    onClick={() => setShowConfirmUpdateModal(true)}*/}
                    {/*                    className="m-btn w-full bg-indigo-500 text-white !py-3">*/}
                    {/*                    Chuyển trạng thái*/}
                    {/*                    sang {nextStatus.displayName.toLowerCase()}*/}
                    {/*                </button>*/}
                    {/*            }*/}

                    {/*            /!* Cancel order *!/*/}
                    {/*            {order?.status === OrderStatuses.PROCESSING.id &&*/}
                    {/*                <button*/}
                    {/*                    onClick={() => setShowCancelModal(true)}*/}
                    {/*                    className="mt-3 m-btn w-full bg-red-50 text-red-500 !py-3 disabled:opacity-50">*/}
                    {/*                    Hủy đơn hàng*/}
                    {/*                </button>*/}
                    {/*            }*/}
                    {/*        </div>*/}
                    {/*        {order?.status &&*/}
                    {/*            <ConfirmModal*/}
                    {/*                color={"indigo"}*/}
                    {/*                isOpen={showConfirmUpdateModal}*/}
                    {/*                onClose={() => setShowConfirmUpdateModal(false)}*/}
                    {/*                onConfirm={() => setShowConfirmUpdateModal(false)}*/}
                    {/*                title={`Cập nhật trạng thái đơn hàng`}*/}
                    {/*                content={`Bạn có chắc chắn muốn chuyển trạng thái đơn hàng từ ${getOrderStatusById(order?.status)?.displayName} sang ${nextStatus?.displayName}?`}*/}
                    {/*                confirmText={"Xác nhận"} />*/}
                    {/*        }*/}

                    {/*        <CancelOrderModal isOpen={showCancelModal}*/}
                    {/*                          onClose={() => setShowCancelModal(false)}*/}
                    {/*                          order={order}*/}
                    {/*        />*/}
                    {/*    </>*/}
                    {/*}*/}
                </div>
            </div>
        </div>
    );
};


AdminOrderDetailsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AdminOrderDetailsPage;