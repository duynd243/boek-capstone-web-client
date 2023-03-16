import { BaseService } from "./BaseService";
import { ICampaign } from "../types/Campaign/ICampaign";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IBook } from "../types/Book/IBook";

export class BookService extends BaseService {
  createBookByIssuer = async (payload: any) => {
    const response = await this.axiosClient.post("/issuer/books", payload);
    return response.data;
  }
  createBookSeriesByIssuer = async (payload: any) => {
    const response = await this.axiosClient.post("/issuer/books/series-books", payload);
    return response.data;
  }
  createOddBookByIssuer = async (payload: any) => {
    const response = await this.axiosClient.post("/issuer/books/products/odd-books", payload);
    return response.data;
  }
  updateBookByIssuer = async (data: any) => {
    const response = await this.axiosClient.put<IBook>(`/issuer/books/`, data);
    return response.data;
  }
  updateSeriesBookByIssuer = async (data: any) => {
    const response = await this.axiosClient.put<IBook>(`/issuer/books/series-books`, data);
    return response.data;
  }
  getBooks$Issuer = async (params?: any) => {
    const response = await this.axiosClient.get<
      IBaseListResponse<IBook>
    >("/issuer/books", {
      params,
    });
    return response.data;
  };

  getBookById$Issuer = async (id: number, params? : any) => {
    const response = await this.axiosClient.get<
      IBook
    >(`/issuer/books/${id}`, { params });
    return response.data;
  };
}
