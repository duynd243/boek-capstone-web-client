import { OrderPickUpTypes } from "./OrderPickUpTypes";

export const OrderPickUpStatuses: Record<
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
        displayName: "Đợi chờ nhận",
    },
    // SHIPPING: {
    //     id: 3,
    //     displayName: "Đang vận chuyển",
    // },
    // SHIPPED: {
    //     id: 4,
    //     displayName: "Đã giao",
    // },
    // Đã nhận hàng tại campaign (đơn dạng pickup)
    RECEIVED: {
        id: 3,
        displayName: "Đã nhận",
    },
    CANCELLED: {
        id: 4,
        displayName: "Đã bị hủy",
    },
};

export function getOrderPickUpStatusById(id: number) {
    return Object.values(OrderPickUpStatuses).find((status) => status.id === id);
}

export function getNextPickUpUpdateStatus(
    currentStatusId?: number,
    orderTypeId?: number
) {
    if (!currentStatusId || !orderTypeId) return null;

    if (
        currentStatusId === OrderPickUpStatuses.PROCESSING.id &&
        orderTypeId === OrderPickUpTypes.PICKUP.id
    ) {
        return OrderPickUpStatuses.WAITING_RECEIVE;
    }

    return null;
}
