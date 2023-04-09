export const OrderTypes = {
    DELIVERY: {
        id: 1,
        displayName: "Đơn giao hàng",
    },
    PICKUP: {
        id: 2,
        displayName: "Đơn tại quầy",
    },
} satisfies Record<string, {
    id: number;
    displayName: string;
}>;

export function getOrderTypeById(id: number) {
    return Object.values(OrderTypes).find(
        (type) => type.id === id,
    );
}