import {IBaseRequestParams} from "./../types/Request/IBaseRequestParams";
import {BaseService} from "./BaseService";
import {ICampaign} from "../types/Campaign/ICampaign";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";

export class CampaignService extends BaseService {
    createCampaign = async (payload: any) => {
        const response = await this.axiosClient.post(
            "/admin/campaigns",
            payload
        );
        return response.data;
    };

    createOnlineCampaign = async (payload: any) => {
        const response = await this.axiosClient.post(
            "/admin/campaigns/online",
            payload
        );
        return response.data;
    };

    updateOnlineCampaign = async (payload: any) => {
        const response = await this.axiosClient.put(
            `/admin/campaigns/online/`,
            payload
        );
        return response.data;
    };

    createOfflineCampaign = async (payload: any) => {
        const response = await this.axiosClient.post(
            "/admin/campaigns/offline",
            payload
        );
        return response.data;
    };


    updateOfflineCampaign = async (payload: any) => {
        const response = await this.axiosClient.put(
            "/admin/campaigns/offline",
            payload
        );
        return response.data;
    };

    getCampaignByIdByAdmin = async (
        id: number,
        params?: IBaseRequestParams<ICampaign> & { withAddressDetail?: boolean }
    ) => {
        const response = await this.axiosClient.get<ICampaign>(
            `/admin/campaigns/${id}`,
            {
                params,
            }
        );
        return response.data;
    };

    getCampaignByIdByIssuer = async (
        id: number,
        params?: IBaseRequestParams<ICampaign> & { withAddressDetail?: boolean }
    ) => {
        const response = await this.axiosClient.get<ICampaign>(
            `/issuer/campaigns/${id}`,
            {
                params,
            }
        );
        return response.data;
    };

    getCampaignsByAdmin = async (
        params?: IBaseRequestParams<ICampaign> & { withAddressDetail?: boolean }
    ) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<ICampaign>
        >("/admin/campaigns", {
            params,
        });
        return response.data;
    };
}
