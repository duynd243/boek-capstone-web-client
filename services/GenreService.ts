import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IGenre } from "../types/Genre/IGenre";
import { IBaseRequestParams } from "../types/Request/IBaseRequestParams";

export class GenreService extends BaseService {
    getGenres = async (
        params?: IBaseRequestParams<IGenre> & { withBooks?: boolean }
    ) => {
        const response = await this.axiosClient.get<IBaseListResponse<IGenre>>(
            "/genres",
            {
                params,
            }
        );
        return response.data;
    };
}
