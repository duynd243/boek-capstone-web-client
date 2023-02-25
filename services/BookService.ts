import {BaseService} from "./BaseService";
import {ICampaign} from "../types/Campaign/ICampaign";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";
import {IBook} from "../types/Book/IBook";

export class BookService extends BaseService {
    createBookByIssuer = async (payload: any) => {
        const response = await this.axiosClient.post("/issuer/books", payload);
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
}
