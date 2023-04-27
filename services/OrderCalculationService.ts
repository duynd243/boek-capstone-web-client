import { BaseService } from "./BaseService";

export interface IOrderCalculationResponse {
    subTotal: number;
    freight: number;
    discountTotal: number;
    total: number;
    freightName: string;
    plusPoint: number;
    orderDetails: {
        bookProductId: string
        quantity: number
        price: number
        discount: number
        withPdf: boolean
        withAudio: boolean
        total: number
        subTotal: number
    }[];
}

export class OrderCalculationService extends BaseService {
    getCartCalculation = async (params?: any) => {
        const response = await this.axiosClient.post<IOrderCalculationResponse>(
            "/orders/calculation/cart", params,
        );
        return response.data;
    };

    getPickupCalculation = async (params?: any) => {
        const response = await this.axiosClient.post<IOrderCalculationResponse>(
            "/orders/calculation/pick-up", params,
        );
        return response.data;
    };

    getDeliveryCalculation = async (params?: any) => {
        const response = await this.axiosClient.post<IOrderCalculationResponse>(
            "/orders/calculation/shipping", params,
        );
        return response.data;
    };
}
