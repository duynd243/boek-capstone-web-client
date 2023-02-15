import {OrderStatuses} from "./OrderStatuses";

export class OrderTypes {
    static readonly PICKUP = {
        id: 1,
        displayName: 'Nhận tại hội sách',
        availableStatuses: [
            OrderStatuses.PROCESSING,
            OrderStatuses.WAITING_RECEIVE,
            OrderStatuses.RECEIVED,
            OrderStatuses.CANCELLED,
        ],
    };
    static readonly SHIPPING = {
        id: 2,
        displayName: 'Giao hàng',
        availableStatuses: [
            OrderStatuses.PROCESSING,
            OrderStatuses.SHIPPING,
            OrderStatuses.SHIPPED,
            OrderStatuses.CANCELLED,
        ],
    }
}


function getOrderTypeById(id: number) {
    return Object.values(OrderTypes).find(
        (type) => type.id === id
    );
}