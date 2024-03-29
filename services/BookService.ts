import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IBook } from "../types/Book/IBook";

export class BookService extends BaseService {

    getBooks = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IBook>>("/books", {
            params,
        });
        return response.data;
    };

    getBookById = async (id: number) => {
        const response = await this.axiosClient.get<IBook>(`/books/${id}`);
        return response.data;
    };

    getBookByIdByIssuer = async (id: number) => {
        const response = await this.axiosClient.get<IBook>(`/issuer/books/${id}`);
        return response.data;
    };

    createBookByIssuer = async (payload: any) => {
        const response = await this.axiosClient.post("/issuer/books", payload);
        return response.data;
    };
    createBookSeriesByIssuer = async (payload: any) => {
        const response = await this.axiosClient.post("/issuer/books/series-books", payload);
        return response.data;
    };
    createOddBookByIssuer = async (payload: any) => {
        const response = await this.axiosClient.post("/issuer/books/products/odd-books", payload);
        return response.data;
    };
    updateBookByIssuer = async (data: any) => {
        const response = await this.axiosClient.put<IBook>(`/issuer/books/`, data);
        return response.data;
    };
    updateSeriesBookByIssuer = async (data: any) => {
        const response = await this.axiosClient.put<IBook>(`/issuer/books/series-books`, data);
        return response.data;
    };
    getBooksByIssuer = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IBook>>(`/issuer/books`, {
            params,
            // paramsSerializer: {
            //   serialize: (params) => {
            //     return qs.stringify(params, { arrayFormat: 'repeat' })
            //   }
            // }
        });
        return response.data;
    };


    // getBooksByIssuer = async (params?: any) => {
    //   const response = await this.axiosClient.get<
    //     IBaseListResponse<IBook>
    //   >(`/issuer/books`, {
    //     params,
    //     // paramsSerializer: {
    //     //   encode: (params) => {
    //     //     return qs.stringify(params, { arrayFormat: 'repeat' })
    //     //   }
    //     // }
    //   });
    //   return response.data;
    // };

    getBookById$Issuer = async (id: number, params?: any) => {
        const response = await this.axiosClient.get<
            IBook
        >(`/issuer/books/${id}`, { params });
        return response.data;
    };


    getAddableBooksByIssuer = async (params?: any) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<IBook>
        >(`/issuer/books/products/odd-series`, {
            params,
            // paramsSerializer: {
            //   serialize: (params) => {
            //     return qs.stringify(params, { arrayFormat: 'repeat' })
            //   }
            // }
        });
        return response.data;
    };
}
