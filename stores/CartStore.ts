import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { IBookProduct, ICustomerBookProduct } from "../types/Book/IBookProduct";
import { ICampaign } from "../types/Campaign/ICampaign";
import { toast } from "react-hot-toast";

export interface ICartItem {
    product: ICustomerBookProduct | IBookProduct;
    withPdf: boolean;
    withAudio: boolean;
    quantity: number;
}

export interface IGroupedCartItem {
    campaign: ICampaign | undefined;
    items: ICartItem[];
}

export interface ICartStore {
    cart: ICartItem[];
}

export interface ICartActions {
    addToCart: (item: ICustomerBookProduct | IBookProduct) => void;
    removeItem: (productId: string) => void;
    getGroupedByCampaignCart: (cart: ICartItem[]) => IGroupedCartItem[];
    clearCart: () => void;
    updateQuantity: (productId: string, quantity: number) => void;
    updateWithPdf: (productId: string, withPdf: boolean) => void;
    updateWithAudio: (productId: string, withAudio: boolean) => void;
}

const addToCart = (
    cart: ICartItem[],
    item: ICustomerBookProduct | IBookProduct,
) => {
    const index = cart.findIndex((cartItem) => cartItem?.product?.id === item?.id);
    if (index === -1) {
        cart.push({
            product: item,
            withPdf: false,
            withAudio: false,
            quantity: 1,
        });
    } else {
        if (item?.saleQuantity && item?.saleQuantity < cart[index].quantity + 1) {
            toast.error("Số lượng sách này đã hết");
            return;
        }
        cart[index].quantity += 1;
    }
    toast.success("Thêm vào giỏ hàng thành công");
};
const removeItem = (cart: ICartItem[], productId: string) => {
    const index = cart.findIndex((x) => x?.product?.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
    }
};

const updateQuantity = (
    cart: ICartItem[],
    productId: string,
    quantity: number,
) => {
    const index = cart.findIndex((x) => x?.product?.id === productId);
    if (index !== -1) {
        cart[index].quantity = quantity;
    } else {
        console.error("Cannot find product in cart");
    }
};

const getCartGroupByCampaign = (cart: ICartItem[]): IGroupedCartItem[] => {
    return cart.reduce((acc, cur) => {
        const index = acc.findIndex(
            (x) => x.campaign?.id === cur.product.campaign?.id,
        );
        if (index === -1) {
            acc.push({
                campaign: cur?.product?.campaign,
                items: [cur],
            });
        } else {
            acc[index].items.push(cur);
        }
        return acc;
    }, [] as IGroupedCartItem[]);
};
export const useCartStore = create<ICartStore & ICartActions>()(
    persist(
        devtools((set) => ({
            cart: [],
            addToCart: (item) =>
                set((state) => {
                    const cart = [...state.cart];
                    addToCart(cart, item);
                    return { cart };
                }),
            removeItem: (productId) =>
                set((state) => {
                    const cart = [...state.cart];
                    removeItem(cart, productId);
                    return { cart };
                }),
            getGroupedByCampaignCart: (cart) => getCartGroupByCampaign(cart),
            updateQuantity: (productId, quantity) =>
                set((state) => {
                    const cart = [...state.cart];
                    updateQuantity(cart, productId, quantity);
                    return { cart };
                }),
            updateWithPdf: (productId, withPdf) =>
                set((state) => {
                    const cart = [...state.cart];
                    const index = cart.findIndex(
                        (x) => x?.product?.id === productId,
                    );
                    if (index !== -1) {
                        cart[index].withPdf = withPdf;
                    } else {
                        console.error("Cannot find product in cart");
                    }
                    return { cart };
                }),
            updateWithAudio: (productId, withAudio) =>
                set((state) => {
                    const cart = [...state.cart];
                    const index = cart.findIndex(
                        (x) => x?.product?.id === productId,
                    );
                    if (index !== -1) {
                        cart[index].withAudio = withAudio;
                    } else {
                        console.error("Cannot find product in cart");
                    }
                    return { cart };
                }),
            clearCart: () => set({ cart: [] }),
        })),
        {
            name: "cart-store",
        },
    ),
);
