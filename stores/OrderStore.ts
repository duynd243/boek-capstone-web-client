import { devtools } from "zustand/middleware";
import { ICartItem } from "./CartStore";
import { create } from "zustand";

export interface IOrderStore {
    orderItems: ICartItem[];
    orderType: "delivery" | "pickup";
}

export interface IOrderStoreActions {
    setOrderType: (type: "delivery" | "pickup") => void;
    setOrderItems: (items: ICartItem[]) => void;
    removeOrderItem: (productId: string) => void;
}

export const useOrderStore = create<IOrderStore & IOrderStoreActions>()(
    devtools((set) => ({
        orderItems: [] as ICartItem[],
        orderType: "delivery",
        setOrderType: (type) => set({ orderType: type }),
        setOrderItems: (items) => set({ orderItems: items }),
        removeOrderItem: (productId) => {
            set((state) => ({
                orderItems: state.orderItems.filter(
                    (item) => item.product.id !== productId,
                ),
            }));
        },
    })),
);

export function getOrderParams(orderItems: ICartItem[]) {
    return {
        campaignId: orderItems[0]?.product?.campaignId,
        orderDetails:
            orderItems.map((item) => {
                return {
                    bookProductId: item?.product?.id,
                    quantity: item?.quantity,
                    withPdf: item?.withPdf || false,
                    withAudio: item?.withAudio || false,
                };
            }) || [],
    };
}
