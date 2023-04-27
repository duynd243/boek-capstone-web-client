import React, { Fragment, useMemo, useState } from "react";
import { NextPageWithLayout } from "../_app";
import CustomerLayout from "../../components/Layout/CustomerLayout";
import { HiQuestionMarkCircle } from "react-icons/hi2";
import { ICartItem, useCartStore } from "../../stores/CartStore";
import CartItem from "../../components/ShoppingCart/CartItem";
import { useQuery } from "@tanstack/react-query";
import { OrderCalculationService } from "../../services/OrderCalculationService";
import useDebounce from "../../hooks/useDebounce";
import { useAuth } from "../../context/AuthContext";
import { CampaignFormats } from "../../constants/CampaignFormats";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import SelectOrderPlacementTypeModal from "../../components/Modal/SelectOrderPlacementTypeModal";
import { getOrderParams, useOrderStore } from "../../stores/OrderStore";
import Link from "next/link";


const chartdata2 = [
    {
        topic: "Topic 1",
        "Group A": 890,
        "Group B": 338,
        "Group C": 538,
        "Group D": 396,
        "Group E": 138,
        "Group F": 436,
    },
    {
        topic: "Topic 2",
        "Group A": 289,
        "Group B": 233,
        "Group C": 253,
        "Group D": 333,
        "Group E": 133,
        "Group F": 533,
    },
];
const CartPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const cart = useCartStore(state => state.cart);
    const getGroupedByCampaignCart = useCartStore(state => state.getGroupedByCampaignCart);

    const setOrderType = useOrderStore(state => state.setOrderType);
    const setOrderItems = useOrderStore(state => state.setOrderItems);
    const orderItems = useOrderStore(state => state.orderItems);

    const [selectedItems, setSelectedItems] = useState<ICartItem[]>([]);

    const [showOrderTypesModal, setShowOrderTypesModal] = useState<boolean>(false);


    const onSelectedChange = (item: ICartItem, value: boolean) => {
        if (value) {
            if (selectedItems.length === 0) {
                setSelectedItems([item]);
            } else {
                const campaignId = selectedItems[0]?.product?.campaign?.id;
                if (campaignId === item?.product?.campaign?.id) {
                    setSelectedItems([...selectedItems, item]);
                } else {
                    setSelectedItems([item]);
                }
            }
        } else {
            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem?.product?.id !== item?.product?.id));
        }
    };

    const notifySelectedItemQuantityChange = (item: ICartItem, quantity: number) => {
        if (selectedItems.some((selectedItem) => selectedItem?.product?.id === item?.product?.id)) {
            setSelectedItems(selectedItems.map((selectedItem) => {
                if (selectedItem?.product?.id === item?.product?.id) {
                    return {
                        ...selectedItem,
                        quantity,
                    };
                }
                return selectedItem;
            }));
        }
    };


    const orderCalculationService = new OrderCalculationService();
    const cartCalcRequestParams = useMemo(() => getOrderParams(selectedItems), [selectedItems]);
    console.log("cartCalcRequestParams", cartCalcRequestParams);
    const debouncedCartCalcRequestParams = useDebounce(cartCalcRequestParams, 500);

    const {
        data: cartCalculation,
        isInitialLoading: isCartCalculationLoading,
    } = useQuery(["cart_calculation", debouncedCartCalcRequestParams],
        () => orderCalculationService.getCartCalculation(debouncedCartCalcRequestParams),
        {
            enabled: debouncedCartCalcRequestParams.orderDetails.length > 0,
            onError: (error: any) => {
                setSelectedItems([]);
                toast.error(error?.message || "Có lỗi xảy ra, vui lòng chọn sản phẩm khác hoặc thử lại sau");
            },
        },
    );

    const handlePlaceOrder = async () => {
        if (selectedItems.length === 0) {
            return;
        }
        setOrderItems(selectedItems);

        console.log("orderItems", orderItems);

        const campaign = selectedItems[0]?.product?.campaign;
        if (campaign?.format === CampaignFormats.OFFLINE.id) {
            setShowOrderTypesModal(true);
        } else if (campaign?.format === CampaignFormats.ONLINE.id) {
            setOrderType("delivery");
            await router.push("/checkout");
        }
    };

    return (
        <Fragment>
            <h1 className="text-3xl font-bold tracking-tight text-slate-700 sm:text-4xl">
                Giỏ hàng
            </h1>
            <div
                className="mt-10 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16"
            >
                <section
                    aria-labelledby="cart-heading"
                    className="space-y-6 lg:col-span-7"
                >
                    {getGroupedByCampaignCart(cart)?.map((item) => {
                        const allSelected = item.items?.every((cartItem) => selectedItems.some((selectedItem) => selectedItem?.product?.id === cartItem?.product?.id));
                        return <div key={item.campaign?.id}>
                            <div
                                className="mb-2 flex items-center justify-between gap-2 bg-white shadow-sm border py-3 px-6 rounded">
                                <Link
                                    href={`/campaigns/${item.campaign?.id}`}
                                    className="text-lg font-medium text-slate-700 hover:text-slate-800 hover:underline underline-offset-2"
                                >
                                    {item.campaign?.name}
                                </Link>
                                <div>
                                    <input
                                        id={`cart-${item.campaign?.id}`}
                                        checked={allSelected}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedItems([...item.items]);
                                            } else {
                                                setSelectedItems([]);
                                            }
                                        }}
                                        type="checkbox"
                                        className="h-4 w-4 rounded-full border-gray-300 text-blue-600"
                                    />
                                    <label htmlFor={`cart-${item.campaign?.id}`} className="ml-2 text-sm text-gray-500">
                                        Chọn tất cả
                                    </label>
                                </div>
                            </div>
                            <ul
                                role="list"
                                className="divide-y divide-gray-200  border-gray-200"
                            >
                                {item.items?.map((cartItem) => {
                                    const isSelected = selectedItems?.findIndex((item) => item?.product?.id === cartItem?.product?.id) !== -1;
                                    return <CartItem
                                        isSelected={isSelected}
                                        notifySelectedItemQuantityChange={notifySelectedItemQuantityChange}
                                        onSelectedChange={onSelectedChange}
                                        key={cartItem?.product?.id}
                                        cartItem={cartItem}
                                        onRemove={() => {
                                            setSelectedItems(selectedItems.filter((selectedItem) => selectedItem?.product?.id !== cartItem?.product?.id));
                                        }}
                                    />;
                                })}
                            </ul>

                        </div>;
                    })}
                </section>

                {/* Order summary */}
                <section
                    aria-labelledby="summary-heading"
                    className="mt-16 rounded-lg border bg-gray-50 px-4 py-6 sm:p-6 lg:sticky lg:top-20 lg:col-span-5 lg:mt-0 lg:p-8"
                >
                    <h2
                        id="summary-heading"
                        className="text-lg font-medium text-gray-900"
                    >
                        Tóm tắt đơn hàng
                    </h2>

                    <dl className="mt-6 space-y-4">
                        <div className="flex items-center justify-between ">
                            <dt className="text-sm font-medium text-gray-700">
                                Tạm tính
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(
                                    cartCalculation?.subTotal || 0,
                                )}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="flex text-sm font-medium text-gray-700">
                                <span>Phí tạm tính</span>
                                <a
                                    href="#"
                                    className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                                >
                                    <HiQuestionMarkCircle
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </a>
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(
                                    cartCalculation?.freight || 0,
                                )}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between ">
                            <dt className="text-sm font-medium text-gray-700">
                                Giảm giá
                            </dt>
                            <dd className="text-sm font-medium text-gray-900">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(
                                    cartCalculation?.discountTotal || 0,
                                )}
                            </dd>
                        </div>
                        {/*<div className="border-t border-gray-200 pt-4">*/}
                        {/*    <dt className=" text-base font-medium text-gray-700">*/}
                        {/*        Hình thức nhận hàng*/}
                        {/*    </dt>*/}
                        {/*    <div className={"mt-3"}>*/}
                        {/*        <div className="flex items-center gap-2">*/}
                        {/*            <input*/}

                        {/*                className="hidden"*/}
                        {/*                type="radio"*/}
                        {/*                id={"pickup-order"}*/}
                        {/*            />*/}
                        {/*            <label*/}
                        {/*                className={"text-gray-700"}*/}
                        {/*                htmlFor={"pickup-order"}*/}
                        {/*            >*/}
                        {/*                Nhận tại sự kiện*/}
                        {/*            </label>*/}
                        {/*        </div>*/}
                        {/*        <div className="mt-2 flex items-center gap-2">*/}
                        {/*            <input*/}
                        {/*                className="hidden"*/}
                        {/*                type="radio"*/}
                        {/*                id={"ship-order"}*/}
                        {/*            />*/}
                        {/*            <label*/}
                        {/*                className={"text-gray-700"}*/}
                        {/*                htmlFor={"ship-order"}*/}
                        {/*            >*/}
                        {/*                Giao hàng*/}
                        {/*            </label>*/}
                        {/*        </div>*/}


                        {/*    </div>*/}
                        {/*</div>*/}
                        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                            <dt className="text-base font-medium text-gray-900">
                                Tổng cộng
                            </dt>
                            <dd className="text-lg font-semibold text-gray-900">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(
                                    cartCalculation?.total || 0,
                                )}
                            </dd>
                        </div>
                    </dl>


                    {(loginUser?.accessToken && cartCalculation?.plusPoint) ? (
                        <div className="mt-6">
                            Bạn sẽ nhận được <span className={"font-semibold"}>{
                            new Intl.NumberFormat("vi-VN").format(cartCalculation?.plusPoint || 0)
                        }</span> điểm tích lũy khi đặt hàng
                        </div>
                    ) : null}

                    <div className="mt-6">
                        <button
                            onClick={handlePlaceOrder}
                            disabled={isCartCalculationLoading || !selectedItems?.length || !cartCalculation}
                            type="submit"
                            className="w-full rounded-md border border-transparent bg-indigo-600 py-3 px-4 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Mua
                            hàng {!isCartCalculationLoading && cartCalculation?.orderDetails && cartCalculation?.orderDetails?.length > 0 ? `(${cartCalculation?.orderDetails?.length})` : null}
                        </button>
                    </div>
                </section>
            </div>
            <SelectOrderPlacementTypeModal isOpen={showOrderTypesModal} onClose={() => {
                setOrderItems([]);
                setShowOrderTypesModal(false);
            }} />

        </Fragment>
    );
};

CartPage.getLayout = (page) => {
    return <CustomerLayout>
        {page}
    </CustomerLayout>;
};

export default CartPage;