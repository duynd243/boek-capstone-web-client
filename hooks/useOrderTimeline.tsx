import { IOrder } from "../types/Order/IOrder";
import { OrderTypes } from "../constants/OrderTypes";

export default function useOrderTimeline(
    order: IOrder | undefined,
) {
    const deliveryOrderTimeline = [
        {
            title: "Đặt hàng",
            date: order?.orderDate,
        },
        {
            title: "Đang giao hàng",
            date: order?.shippingDate,
        }, {
            title: "Đã giao hàng",
            date: order?.shippedDate,
        }, {
            title: "Đã huỷ",
            date: order?.cancelledDate,
            cancelled: true,
        },
    ];
    const pickupOrderTimeline = [
        {
            title: "Đặt hàng",
            date: order?.orderDate,
        },
        {
            title: "Chờ nhận hàng",
            date: order?.availableDate,
        }, {
            title: "Đã nhận hàng",
            date: order?.receivedDate,
        }, {
            title: "Đã huỷ",
            date: order?.cancelledDate,
            cancelled: true,
        },
    ];
    const orderTimeline = order?.type === OrderTypes.DELIVERY.id ? deliveryOrderTimeline : pickupOrderTimeline;
    return {
        orderTimeline,
    };
}