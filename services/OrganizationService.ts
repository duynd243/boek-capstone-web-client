import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IOrganization } from "../types/Organization/IOrganization";
import { ICustomerOrganization } from "../types/Customer_Organization/ICustomerOrganization";


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

    getAllOrganizations = async (params?: any) => {
        const response = await this.getOrganizations(params);
        const { data, metadata: { total } } = response;
        if (data.length < total) {
            const newResponse = await this.getOrganizations({
                ...params,
                size: total,
            });
            return newResponse.data;
        }
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
        const response = await this.axiosClient.get<ICustomerOrganization>("/organizations/customer", {
            params,
        });
        if (response.status === 204) {
            return null;
        }
        return response.data;
    };

    followOrganization = async (id: number) => {
        const response = await this.axiosClient.post<IOrganization>(
            `/organizations/customer`, {
                organizationId: id,
            },
        );
        return response.data;
    };

    unfollowOrganization = async (id: number) => {
        const response = await this.axiosClient.delete<IOrganization>(
            `/organizations/customer/${id}`,
        );
        return response.data;
    };
}
