import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IOrder } from "../types/Order/IOrder";

export class OrderService extends BaseService {

    // For customer (access token required)
    getOrders = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IOrder>>(
            "/orders",
            {
                params,
            },
        );
        return response.data;
    };
    // For customer (access token required)
    getOrderById = async (id: string) => {
        const response = await this.axiosClient.get<IOrder>(`/orders/${id}`);
        return response.data;
    };

    getOrdersByAdmin = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IOrder>>(
            "/admin/orders",
            {
                params,
            },
        );
        return response.data;
    };

    getOrderByIdByAdmin = async (id: string) => {
        const response = await this.axiosClient.get<IOrder>(`/admin/orders/${id}`);
        return response.data;
    };

    getOrdersByIssuer = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IOrder>>(
            "/issuer/orders",
            {
                params,
            },
        );
        return response.data;
    };

    getOrderByIdByIssuer = async (id: string) => {
        const response = await this.axiosClient.get<IOrder>(`/issuer/orders/${id}`);
        return response.data;
    };
}
