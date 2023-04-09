import ZaloPayLogo from "../assets/images/payments/zalo.png";
import CashLogo from "../assets/images/payments/cash.png";

export const OrderPaymentMethods = {
    Unpaid: {
        id: 1,
        name: "Chưa thanh toán",
        logo: ZaloPayLogo,
    },
    ZaloPay: {
        id: 2,
        name: "ZaloPay",
        displayName: "Thanh toán qua ZaloPay",
        logo: ZaloPayLogo,
    },
    Cash: {
        id: 3,
        name: "Tiền mặt",
        displayName: "Thanh toán tiền mặt",
        logo: CashLogo,

    },
} as const;


export function getOrderPaymentMethodById(id: number | undefined) {
    return Object.values(OrderPaymentMethods).find((item) => item.id === id);
}