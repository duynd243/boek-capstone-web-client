import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IGroup } from "../types/Group/IGroup";

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
}
