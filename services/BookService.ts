import {BaseService} from "./BaseService";
import {ICampaign} from "../types/Campaign/ICampaign";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";
import {IBook} from "../types/Book/IBook";

export class BookService extends BaseService {


    getBooks = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IBook>>("/books", {
            params,
        });
        return response.data;
    }
}
