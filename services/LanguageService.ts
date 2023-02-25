import {BaseService} from "./BaseService";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";
import {IGenre} from "../types/Genre/IGenre";

export class LanguageService extends BaseService {
    getLanguages = async (params?: any) => {
        const response = await this.axiosClient.get<string[]>(
            "/languages",
            {
                params,
            }
        );
        return response.data;
    };
}
