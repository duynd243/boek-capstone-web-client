import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IOrganization } from "../types/Organization/IOrganization";


export type UpdateOrganizationParams = Required<Pick<IOrganization, "id">> & Partial<IOrganization>;
export type CreateOrganizationParams = Omit<UpdateOrganizationParams, "id">;

export class OrganizationService extends BaseService {
    getOrganizations = async (params?: any) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<IOrganization>
        >("/organizations", {
            params,
        });
        return response.data;
    };

    createOrganization = async (data: CreateOrganizationParams) => {
        const response = await this.axiosClient.post<IOrganization>(
            "/admin/organizations",
            data,
        );
        return response.data;
    };

    updateOrganization = async (data: UpdateOrganizationParams) => {
        const response = await this.axiosClient.put<IOrganization>(
            `/admin/organizations`,
            data,
        );
        return response.data;
    };

    deleteOrganization = async (id: number) => {
        const response = await this.axiosClient.delete<IOrganization>(
            `/admin/organizations/${id}`,
        );
        return response.data;
    };

    getFollowingOrganizationsByCustomer = async (params?: any) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<IOrganization>
        >("/organizations/customer", {
            params,
        });
        return response.data;
    };
}
