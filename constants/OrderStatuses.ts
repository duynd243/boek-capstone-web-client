import { OrderTypes } from "./OrderTypes";

export interface IOrderStatus {
    id: number;
    displayName: string;
    labelColor?: string;
    dotColor?: string;
}

export const OrderStatuses = {
    PAYMENT_PENDING: {
        id: 1,
        displayName: "Chờ thanh toán",
        labelColor: "bg-amber-100 text-amber-800",
        dotColor: "bg-amber-400",
    },
    PROCESSING: {
        id: 2,
        displayName: "Đang xử lý",
        labelColor: "bg-amber-100 text-amber-800",
        dotColor: "bg-amber-400",
    },
    // Chờ nhận hàng tại campaign (đơn dạng pickup)
    WAITING_RECEIVE: {
        id: 3,
        displayName: "Đợi nhận hàng",
        labelColor: "bg-green-100 text-green-800",
        dotColor: "bg-green-400",
    },
    SHIPPING: {
        id: 4,
        displayName: "Đang vận chuyển",
        labelColor: "bg-green-100 text-green-800",
        dotColor: "bg-green-400",
    },
    SHIPPED: {
        id: 5,
        displayName: "Đã giao",
        labelColor: "bg-green-100 text-green-800",
        dotColor: "bg-green-400",
    },
    // Đã nhận hàng tại campaign (đơn dạng pickup)
    RECEIVED: {
        id: 6,
        displayName: "Đã nhận",
        labelColor: "bg-green-100 text-green-800",
        dotColor: "bg-green-400",
    },
    CANCELLED: {
        id: 7,
        displayName: "Đã bị hủy",
        labelColor: "bg-rose-100 text-rose-800",
        dotColor: "bg-rose-400",
    },
} satisfies Record<
    string,
    IOrderStatus
>;

export function getOrderStatusById(id: number | undefined) {
    return Object.values(OrderStatuses).find((status) => status.id === id);
}

export function getNextUpdateStatus(
    currentStatusId?: number,
    orderTypeId?: number,
) {
    if (!currentStatusId || !orderTypeId) return null;
    if (
        currentStatusId === OrderStatuses.PROCESSING.id &&
        orderTypeId === OrderTypes.PICKUP.id
    ) {
        return OrderStatuses.WAITING_RECEIVE;
    }
    if (
        currentStatusId === OrderStatuses.PROCESSING.id &&
        orderTypeId === OrderTypes.DELIVERY.id
    ) {
        return OrderStatuses.SHIPPING;
    }
    if (currentStatusId === OrderStatuses.WAITING_RECEIVE.id) {
        return OrderStatuses.RECEIVED;
    }
    if (currentStatusId === OrderStatuses.SHIPPING.id) {
        return OrderStatuses.SHIPPED;
    }
    return null;
}

export const PickupOrderTabs = [
    {
        id: undefined,
        displayName: "Tất cả trạng thái",
    },
    OrderStatuses.PAYMENT_PENDING,
    OrderStatuses.PROCESSING,
    OrderStatuses.WAITING_RECEIVE,
    OrderStatuses.RECEIVED,
    OrderStatuses.CANCELLED,
];

export const DeliveryOrderTabs = [
    {
        id: undefined,
        displayName: "Tất cả trạng thái",
    },
    OrderStatuses.PAYMENT_PENDING,
    OrderStatuses.PROCESSING,
    OrderStatuses.SHIPPING,
    OrderStatuses.SHIPPED,
    OrderStatuses.CANCELLED,
];
