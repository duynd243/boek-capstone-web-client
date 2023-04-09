import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IBookProduct, ICustomerBookProduct } from "../types/Book/IBookProduct";

export class BookProductService extends BaseService {

    getBookProducts = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IBookProduct>>("/books/products",
            { params },
        );
        return response.data;
    };

    getBookProductById = async (id: string) => {
        const response = await this.axiosClient.get<IBookProduct>(`/books/products/${id}`);
        return response.data;
    };


    acceptBookProductByAdmin = async (payload: any) => {
        const response = await this.axiosClient.put("/admin/book-products/acceptance", payload);
        return response.data;
    };

    rejectBookProductByAdmin = async (payload: any) => {
        const response = await this.axiosClient.put("/admin/book-products/rejection", payload);
        return response.data;
    };

    getBookProductsByIssuer = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IBookProduct>>("/issuer/books/products",
            { params },
        );
        return response.data;
    };

    getBookProductsByCustomer = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<ICustomerBookProduct>>("/books/customer/products",
            { params },
        );
        return response.data;
    };

    getBookProductByIdByCustomer = async (id: string) => {
        const response = await this.axiosClient.get<ICustomerBookProduct>(`/books/customer/products/${id}`);
        return response.data;
    };
}
