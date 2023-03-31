import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IBookProduct } from "../types/Book/IBookProduct";

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
}
