import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IGroup } from "../types/Group/IGroup";

export type CreateGroupParams = Required<Pick<IGroup, "name" | "description">>;
export type UpdateGroupParams = Required<Omit<IGroup, "statusName">>;

export class GroupService extends BaseService {
    getGroups = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IGroup>>(
            "/groups",
            {
                params,
            }
        );
        return response.data;
    };

    getGroupsByAdmin = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IGroup>>(
            "/admin/groups",
            {
                params,
            }
        );
        return response.data;
    };

    createGroup = async (data: CreateGroupParams) => {
        const response = await this.axiosClient.post<IGroup>(
            "/admin/groups",
            data
        );
        return response.data;
    };

    updateGroup = async (data: UpdateGroupParams) => {
        const response = await this.axiosClient.put<IGroup>(
            "/admin/groups",
            data
        );
        return response.data;
    };
}
