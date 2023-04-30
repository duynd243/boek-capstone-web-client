import { IBaseRequestParams } from "../types/Request/IBaseRequestParams";
import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { ILevel } from "../types/Level/ILevel";

type LevelRequestParams = IBaseRequestParams<ILevel> & {
    withCustomers?: boolean;
};

export type CreateLevelParams = Required<
    Pick<ILevel, "name" | "conditionalPoint">
>;

export type UpdateLevelParams = Required<
    Pick<ILevel, "id" | "name" | "conditionalPoint">
>;

export class LevelService extends BaseService {
    getLevels = async (params?: LevelRequestParams) => {
        const response = await this.axiosClient.get<IBaseListResponse<ILevel>>(
            "/levels",
            {
                params,
            },
        );
        return response.data;
    };

    getAllLevels = async (params?: LevelRequestParams) => {
        const response = await this.getLevels(params);
        const { data, metadata: { total } } = response;
        if (data.length < total) {
            const newResponse = await this.getLevels({
                ...params,
                size: total,
            });
            return newResponse.data;
        }
        return response.data;
    };

    createLevel = async (data: CreateLevelParams) => {
        const response = await this.axiosClient.post<ILevel>(
            "/admin/levels",
            data,
        );
        return response.data;
    };

    updateLevel = async (data: UpdateLevelParams) => {
        const response = await this.axiosClient.put<ILevel>(
            `/admin/levels`,
            data,
        );
        return response.data;
    };
}
