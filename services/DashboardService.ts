import { IBookProduct } from "../types/Book/IBookProduct";
import { ICampaign } from "../types/Campaign/ICampaign";
import { ICustomerOrder } from "../types/Customer_Order/ICustomerOrder";
import { IBaseDateRangeDashboard, ITimeLine } from "../types/Dashboard/IBaseDateRangeDashboard";
import { IOrder } from "../types/Order/IOrder";
import { BaseService } from "./BaseService";


export interface IDashboardSummary {
    id: number
    quantityOfTitle: number
    title: string
    quantityOfSubTitle: number
    status: number | null
    statusName: string | null
    subTitle: string
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


    getCampaignRevenueByIssuer = async (params?: any) => {
        const response = await this.axiosClient
            .post<IBaseDateRangeDashboard<{
                data: ICampaign;
                total: number;
            }>>("/issuer/dashboard/campaigns/revenues", 
                params
            );
        return response.data;
    };


    getCustomerSpendingByIssuer = async (params?: any) => {
        const response = await this.axiosClient
            .post<IBaseDateRangeDashboard<ICustomerOrder>>("/issuer/dashboard/spending-customers", 
                params
            );
        return response.data;
    };

    
    getDashboardCampaignDetails = async (id: number, params?: any) => {
        const response = await this.axiosClient
            .post<IDashboardDetail>(`/issuer/dashboard/campaigns/revenues/details/${id}`,
                params,
            );
        return response.data;
    };

}
