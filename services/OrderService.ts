import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IOrder } from "../types/Order/IOrder";

export class OrderService extends BaseService {

    // For customer (access token required)
    getOrdersByCustomer = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IOrder>>(
            "/orders",
            {
                params,
            },
        );
        return response.data;
    };
    // For customer (access token required)
    getOrderByIdByCustomer = async (id: string) => {
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

    updateOrderToShippingStatus = async (param?: any) => {
        const response = await this.axiosClient.put<IOrder>(
            "/issuer/orders/shipping", param,
        );
        return response.data;
    };

    updateShippingToShippedStatus = async (param?: any) => {
        const response = await this.axiosClient.put<IOrder>(
            "/issuer/orders/shipped", param,
        );
        return response.data;
    };

    updateCancelOrderStatus = async (param?: any) => {
        const response = await this.axiosClient.put<IOrder>(
            "/issuer/orders/cancel", param,
        );
        return response.data;
    };
    updatePickUpOrderToShippingStatus = async (param?: any) => {
        const response = await this.axiosClient.put<IOrder>(
            "/issuer/orders/available", param,
        );
        return response.data;
    };
    updatePickUpOrderAdress = async (param?: any) => {
        const response = await this.axiosClient.put<IOrder>(
            "/issuer/orders/available/address", param,
        );
        return response.data;
    };

    getOrderAddressesIdByIssuer = async (id: string) => {
        const response = await this.axiosClient.get<string[]>(`/issuer/orders/campaigns/addresses/${id}`);
        return response.data;
    };


    createDeliveryOrderByCustomer = async (param?: any) => {
        const response = await this.axiosClient.post<any>(
            "/orders/customer/shipping", param,
        );
        return response.data;
    }

    createPickupOrderByCustomer = async (param?: any) => {
        const response = await this.axiosClient.post<any>(
            "/orders/customer/pick-up", param,
        );
        return response.data;
    }

    createZaloPayOrder = async (param?: any) => {
        const response = await this.axiosClient.post<any>(
            "/orders/zalopay", param,
        );
        return response.data;
    }


    createDeliveryOrderByGuest = async (param?: any) => {
        const response = await this.axiosClient.post<any>(
            "/orders/guest/shipping", param,
        );
        return response.data;
    }

    createPickupOrderByGuest = async (param?: any) => {
        const response = await this.axiosClient.post<any>(
            "/orders/guest/pick-up", param,
        );
        return response.data;
    }


}
