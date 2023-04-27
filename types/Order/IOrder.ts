import { ICampaign } from "../Campaign/ICampaign";
import { ICustomer } from "../User/IUser";
import { ICampaignStaff } from "../Campaign_Staff/ICampaignStaff";
import { IBookProduct } from "../Book/IBookProduct";

export interface IOrderDetail {
    id: number;
    orderId?: string;
    bookProductId?: string;
    quantity?: number;
    price?: number;
    discount?: number;
    withPdf?: boolean;
    withAudio?: boolean;
    subTotal?: number;
    total?: number;
    bookProduct?: IBookProduct;
}

export interface IOrder {
    id: string;
    code?: string;
    customerId?: string;
    campaignId?: number;
    campaignStaffId?: number;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    address?: string;
    freight?: number;
    freightName?: string;
    payment?: number;
    paymentName?: string;
    type?: number;
    typeName?: string;
    note?: string;
    orderDate?: string;
    availableDate?: string;
    shippingDate?: string;
    shippedDate?: string;
    receivedDate?: string;
    cancelledDate?: string;
    status?: number;
    statusName?: string;
    total?: number;
    subTotal?: number;
    discountTotal?: number;
    campaign?: ICampaign;
    campaignStaff?: ICampaignStaff;
    customer?: ICustomer;
    orderDetails?: IOrderDetail[];
}