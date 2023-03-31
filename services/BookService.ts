import {BaseService} from "./BaseService";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";
import {IBook} from "../types/Book/IBook";
import {IBookProduct} from "../types/Book/IBookProduct";

export class BookService extends BaseService {

    getBooks = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IBook>>("/books", {
            params,
        });
        return response.data;
    }

    getBookById = async (id: number) => {
        const response = await this.axiosClient.get<IBook>(`/books/${id}`);
        return response.data;
    }

    getBookByIdByIssuer = async (id: number) => {
        const response = await this.axiosClient.get<IBook>(`/issuer/books/${id}`);
        return response.data;
    }
}
