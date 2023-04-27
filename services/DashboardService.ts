import { ICampaign } from "../types/Campaign/ICampaign";
import { ICustomerOrder } from "../types/Customer_Order/ICustomerOrder";
import { IBaseDateRangeDashboard, ITimeLine } from "../types/Dashboard/IBaseDateRangeDashboard";
import { BaseService } from "./BaseService";
import { IBookProduct } from "../types/Book/IBookProduct";
import { IOrder } from "../types/Order/IOrder";


export interface IDashboardSummary {
    id: number;
    quantityOfTitle: number;
    title: string;
    quantityOfSubTitle: number;
    status: number | null;
    statusName: string | null;
    subTitle: string;
}


export interface IBookProductOrder extends IBookProduct {
    total: number;
    orderDetails: {
        id: number
        orderId: string
        bookProductId: string
        quantity: number
        price: number
        discount: number
        withPdf: boolean
        withAudio: boolean
    };
}

export interface IDashboardDetail {
    timeLine: ITimeLine;
    subject: ICampaign;
    revenueTotal: number;
    revenues: {
        timeLine: ITimeLine;
        revenue: number;
    }[];
    bestSellerBookProducts: {
        timeLine: ITimeLine;
        total: number
        data: {
            data: IBookProduct;
            total: number;
        }[]
    };
    orders: {
        total: number;
        models: {
            timeLine: ITimeLine;
            total: number
            status: number
            data: IOrder[]
        }[]
    };
}

export class DashboardService extends BaseService {

    // region Admin
    getAdminDashboardComparisonNewCustomers = async (
        params: any,
    ) => {
        const response = await this.axiosClient.post("/admin/dashboard/new-customers", params);
        return response.data;
    };

    getAdminDashboardComparisonNewOrders = async (
        params: any,
    ) => {
        const response = await this.axiosClient.post("/admin/dashboard/orders", params);
        return response.data;
    };


    getIssuerDashboardSummary = async () => {
        const response = await this.axiosClient
            .post<IDashboardSummary[]>("/issuer/dashboard/summary");
        return response.data;
    };

    getAdminDashboardSummary = async () => {
        const response = await this.axiosClient
            .post<IDashboardSummary[]>("/admin/dashboard/summary");
        return response.data;
    };


    getCampaignRevenueByIssuer = async (params?: any) => {
        const response = await this.axiosClient
            .post<IBaseDateRangeDashboard<{
                data: ICampaign;
                total: number;
            }>>("/issuer/dashboard/campaigns/revenues",
                params,
            );
        return response.data;
    };


    getCampaignRevenueByAdmin = async (params?: any) => {
        const response = await this.axiosClient
            .post<IBaseDateRangeDashboard<{
                data: ICampaign;
                total: number;
            }>>("/admin/dashboard/campaigns/revenues",
                params,
            );
        return response.data;
    };


    getCustomerSpendingByIssuer = async (params?: any) => {
        const response = await this.axiosClient
            .post<IBaseDateRangeDashboard<ICustomerOrder>>("/issuer/dashboard/spending-customers",
                params,
            );
        return response.data;
    };

    getCustomerSpendingByAdmin = async (params?: any) => {
        const response = await this.axiosClient
            .post<IBaseDateRangeDashboard<ICustomerOrder>>("/admin/dashboard/spending-customers",
                params,
            );
        return response.data;
    };

    getTopIssuerRevenueGroupedByCampaignsByAdmin = async (params?: any) => {
        const response = await this.axiosClient
            .post<IBaseDateRangeDashboard<any>>("/admin/dashboard/campaigns/issuer/revenues/top",
                params,
            );
        return response.data;
    };

    getBestSellerBooksByAdmin = async (params?: any) => {
        const response = await this.axiosClient
            .post<IBaseDateRangeDashboard<IBookProductOrder>>("/admin/dashboard/best-seller",
                params,
            );
        return response.data;
    };

    getDashboardCampaignDetails = async (id: number, params?: any) => {
        const response = await this.axiosClient
            .post<IDashboardDetail>(`/admin/dashboard/campaigns/revenues/details/${id}`,
                params,
            );
        return response.data;
    };

    getDashboardCampaignDetailsByIssuer = async (id: number, params?: any) => {
        const response = await this.axiosClient
            .post<IDashboardDetail>(`/issuer/dashboard/campaigns/revenues/details/${id}`,
                params,
            );
        return response.data;
    };

}
