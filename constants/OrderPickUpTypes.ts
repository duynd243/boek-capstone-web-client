import {OrderPickUpStatuses} from "./OrderPickUpStatuses";
import {OrderStatuses} from "./OrderStatuses";

export class OrderPickUpTypes {
    static readonly PICKUP = {
        id: 1,
        displayName: 'Nhận tại hội sách',
        availableStatuses: [
            OrderPickUpStatuses.PROCESSING,
            OrderPickUpStatuses.WAITING_RECEIVE,
            OrderPickUpStatuses.RECEIVED,
            OrderPickUpStatuses.CANCELLED,
        ],
    };
    static readonly SHIPPING = {
        id: 2,
        displayName: 'Giao hàng',
        availableStatuses: [
            OrderPickUpStatuses.PROCESSING,
            OrderPickUpStatuses.SHIPPING,
            OrderPickUpStatuses.SHIPPED,
            OrderPickUpStatuses.CANCELLED,
        ],
    }
}


function getOrderTypeById(id: number) {
    return Object.values(OrderPickUpTypes).find(
        (type) => type.id === id
    );
}