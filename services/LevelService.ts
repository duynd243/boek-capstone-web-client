import {BaseService} from "./BaseService";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";
import {ILevel} from "../types/Level/ILevel";

export class LevelService extends BaseService {
    getLevels = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<ILevel>>(
            "/levels",
            {
                params,
            }
        );
        return response.data;
    };
}
