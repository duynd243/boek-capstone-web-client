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
        const response = await this.axiosClient.get<IBaseListResponse<IBookProduct>>("/issuer/books/products", {
            params,
        });
        return response.data;
    }

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

    createOddBookProductByIssuer = async (payload: any) => {
        const response = await this.axiosClient.post("/issuer/books/products/odd-books", payload);
        return response.data;
    }


    createSeriesBookProductByIssuer = async (payload: any) => {
        const response = await this.axiosClient.post("/issuer/books/products/series-books", payload);
        return response.data;
    }
    createComboBookProductByIssuer = async (payload: any) => {
        const response = await this.axiosClient.post("/issuer/books/products/combo-books", payload);
        return response.data;
    }

    updateBasicInfoBookProductByIssuer = async (payload: any) => {
        const response = await this.axiosClient.put("/issuer/books/products/started-campaign", payload);
        return response.data;
    }



    updateOddBookProductByIssuer = async (payload: any) => {
        const response = await this.axiosClient.put("/issuer/books/products/odd-books", payload);
        return response.data;
    }

    updateSeriesBookProductByIssuer = async (payload: any) => {
        const response = await this.axiosClient.put("/issuer/books/products/series-books", payload);
        return response.data;
    }

    updateComboBookProductByIssuer = async (payload: any) => {
        const response = await this.axiosClient.put("/issuer/books/products/combo-books", payload);
        return response.data;
    }

    getComboBooksProduct$Issuer = async (params?: any) => {
        const response = await this.axiosClient.get<
            IBookProduct[]
        >("/issuer/books/products/existed-combos", 
            { params}
        );
        return response.data;
    };

    getOddSeriesBookProductsByIssuer = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IBookProduct>>("/issuer/books/products/odd-series", {
            params,
        });
        return response.data;
    }

    getBookProductByIdByIssuer = async (id: string, params?: any) => {
        const response = await this.axiosClient.get<IBookProduct>(`/issuer/books/products/${id}`, { params });
        return response.data;
    };
}