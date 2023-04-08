import { IBaseRequestParams } from "../types/Request/IBaseRequestParams";
import { BaseService } from "./BaseService";
import { ICampaign } from "../types/Campaign/ICampaign";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { ICampaignHomepage } from "../types/Campaign/ICampainHomepage";
import { ICustomerCampaign } from "../types/Campaign/ICustomerCampaign";


export type GetCampaignsParams = IBaseRequestParams<ICampaign> & { withAddressDetail?: boolean };

export class CampaignService extends BaseService {
    createCampaign = async (payload: any) => {
        const response = await this.axiosClient.post(
            "/admin/campaigns",
            payload,
        );
        return response.data;
    };

    createOnlineCampaign = async (payload: any) => {
        const response = await this.axiosClient.post(
            "/admin/campaigns/online",
            payload,
        );
        return response.data;
    };

    updateOnlineCampaign = async (payload: any) => {
        const response = await this.axiosClient.put(
            `/admin/campaigns/online/`,
            payload,
        );
        return response.data;
    };

    createOfflineCampaign = async (payload: any) => {
        const response = await this.axiosClient.post(
            "/admin/campaigns/offline",
            payload,
        );
        return response.data;
    };


    updateOfflineCampaign = async (payload: any) => {
        const response = await this.axiosClient.put(
            "/admin/campaigns/offline",
            payload,
        );
        return response.data;
    };

    getCampaignByIdByAdmin = async (
        id: number,
        params?: GetCampaignsParams,
    ) => {
        const response = await this.axiosClient.get<ICampaign>(
            `/admin/campaigns/${id}`,
            {
                params,
            },
        );
        return response.data;
    };

    getCampaignByIdByIssuer = async (
        id: number,
        params?: GetCampaignsParams,
    ) => {
        const response = await this.axiosClient.get<ICampaign>(
            `/issuer/campaigns/${id}`,
            {
                params,
            },
        );
        return response.data;
    };

    getCampaignByIdByCustomer = async (
        id: number,
        params?: IBaseRequestParams<ICustomerCampaign>,
    ) => {
        const response = await this.axiosClient.get<ICustomerCampaign>(
            `/campaigns/customer/${id}`,
            {
                params,
            },
        );
        return response.data;
    };

    getCampaignsByAdmin = async (
        params?: GetCampaignsParams,
    ) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<ICampaign>
        >("/admin/campaigns", {
            params,
        });
        return response.data;
    };

    getCampaignsByCustomer = async (
        params?: any,
    ) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<ICampaign>
        >("/campaigns/customer", {
            params,
        });
        return response.data;
    };

    getAllCampaignsByCustomer = async (
        params?: GetCampaignsParams,
    ) => {
        const response = await this.getCampaignsByCustomer(params);
        const { data, metadata: { total } } = response;
        if (data.length < total) {
            const newResponse = await this.getCampaignsByCustomer({
                ...params,
                size: total,
            });
            return newResponse.data;
        }
        return data;
    };


    getCampaignsByIssuer = async (
        params?: GetCampaignsParams,
    ) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<ICampaign>
        >("/issuer/campaigns", {
            params,
        });
        return response.data;
    };

    getOtherCampaignsByIssuer = async (
        params?: GetCampaignsParams,
    ) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<ICampaign>
        >("/issuer/campaigns/other", {
            params,
        });
        return response.data;
    };

    postponeOnlineCampaign = async (id: number) => {
        const response = await this.axiosClient.patch(
            `/admin/campaigns/online/postponement/${id}`,
        );
        return response.data;
    };

    postponeOfflineCampaign = async (id: number) => {
        const response = await this.axiosClient.patch(
            `/admin/campaigns/offline/postponement/${id}`,
        );
        return response.data;
    };

    restartOnlineCampaign = async (id: number) => {
        const response = await this.axiosClient.patch(
            `/admin/campaigns/online/restart/${id}`,
        );
        return response.data;
    };

    restartOfflineCampaign = async (id: number) => {
        const response = await this.axiosClient.patch(
            `/admin/campaigns/offline/restart/${id}`,
        );
        return response.data;
    };

    cancelOnlineCampaign = async (id: number) => {
        const response = await this.axiosClient.patch(
            `/admin/campaigns/online/cancellation/${id}`,
        );
        return response.data;
    };

    cancelOfflineCampaign = async (id: number) => {
        const response = await this.axiosClient.patch(
            `/admin/campaigns/offline/cancellation/${id}`,
        );
        return response.data;
    };

    getHomepageCampaigns = async (params?: any) => {
        const response = await this.axiosClient.get<ICampaignHomepage>(
            `/campaigns/customer/home-page`, {
                params,
            },
        );
        return response.data;
    };
}
