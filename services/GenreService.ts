import {BaseService} from "./BaseService";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";
import {IGenre} from "../types/Genre/IGenre";

export class GenreService extends BaseService {
    getGenres = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IGenre>>(
            "/genres",
            {
                params,
            }
        );
        return response.data;
    };
    getChildGenres = async (params?: any) => {
        const response = await this.axiosClient.get<IGenre[]>(
            "/genres/child-genres",
            {
                params,
            }
        );
        return response.data;
    };
}
