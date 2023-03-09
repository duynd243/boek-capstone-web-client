import { OrderTypes } from "./OrderTypes";

export const OrderStatuses: Record<
    string,
    { id: number; displayName: string }
> = {
    PROCESSING: {
        id: 1,
        displayName: "Đang xử lý",
    },
    // Chờ nhận hàng tại campaign (đơn dạng pickup)
    WAITING_RECEIVE: {
        id: 2,
        displayName: "Đợi nhận hàng",
    },
    SHIPPING: {
        id: 3,
        displayName: "Đang vận chuyển",
    },
    SHIPPED: {
        id: 4,
        displayName: "Đã giao",
    },
    // Đã nhận hàng tại campaign (đơn dạng pickup)
    RECEIVED: {
        id: 5,
        displayName: "Đã nhận",
    },
    CANCELLED: {
        id: 6,
        displayName: "Đã bị hủy",
    },
};

export function getOrderStatusById(id: number) {
    return Object.values(OrderStatuses).find((status) => status.id === id);
}

export function getNextUpdateStatus(
    currentStatusId?: number,
    orderTypeId?: number
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
        orderTypeId === OrderTypes.SHIPPING.id
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
