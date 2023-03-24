import { IBookProduct } from "../types/Book/IBookProduct";
import { BaseService } from "./BaseService";
import { IBaseListResponse } from './../old-types/response/IBaseListResponse';

export class BookProductService extends BaseService {
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


    getBookProductsByIssuer = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IBookProduct>>("/issuer/books/products", {
            params,
        });
        return response.data;
    }
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
