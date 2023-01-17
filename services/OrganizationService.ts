import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IOrganization } from "../types/Organization/IOrganization";

export class OrganizationService extends BaseService {
  getOrganizations = async (params?: any) => {
    const response = await this.axiosClient.get<
      IBaseListResponse<IOrganization>
    >("/organizations", {
      params,
    });
    return response.data;
  };
}
