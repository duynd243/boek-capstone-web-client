import { IBaseRequestParams } from "./../types/Request/IBaseRequestParams";
import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { ICampaignStaff } from "../types/Campaign_Staff/ICampaignStaff";
import { IUser } from "../types/User/IUser";
import { ICampaign } from "../types/Campaign/ICampaign";

export type AddStaffsRequestParams = {
    campaignId: number;
    staffIds: string[];
}
export default class CampaignStaffService extends BaseService {
    getCampaignStaffs = async (params?: IBaseRequestParams<ICampaignStaff>) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<ICampaignStaff>
        >("/admin/campaigns/staff", {
            params,
        });
        return response.data;
    };

    getStaffsByCampaignId = async (id: number) => {
        const response = await this.axiosClient.get<IUser[]>(
            `/admin/campaigns/${id}/staff`,
        );
        return response.data;
    };


    getCampaignWithStaffsByCampaignId = async (id: number) => {
        const response = await this.axiosClient.get<{
            total: number;
            campaign: ICampaign;
            staffs: IUser[];
        }>(
            `/admin/campaigns/${id}/staff`,
        );
        return response.data;
    };


    getUnattendedStaffsByCampaignId = async (campaignId: number) => {
        const response = await this.axiosClient.get<IUser[] | null>(
            `/admin/campaigns/${campaignId}/unattended-staff`,
        );
        return response.data;
    };

    addStaffs = async (params: AddStaffsRequestParams) => {
        const response = await this.axiosClient.post<ICampaignStaff[]>(
            `/admin/campaigns/staff`,
            params,
        );
        return response.data;
    };


    attendCampaignStaff = async (campaignStaffId: number) => {
        const response = await this.axiosClient.patch<any>(
            `/admin/campaigns/staff/attended-staff/${campaignStaffId}`,
        );
        return response.data;
    };

    unattendCampaignStaff = async (campaignStaffId: number) => {
        const response = await this.axiosClient.patch<any>(
            `/admin/campaigns/staff/unattended-staff/${campaignStaffId}`,
        );
        return response.data;
    };
}
