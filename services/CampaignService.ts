import {BaseService} from "./BaseService";
import {ICampaign} from "../types/Campaign/ICampaign";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";

export class CampaignService extends BaseService {
    createCampaign = async (payload: any) => {
        const response = await this.axiosClient.post("/admin/campaigns", payload);
        return response.data;
    }

    createOnlineCampaign = async (payload: any) => {
        const response = await this.axiosClient.post("/admin/campaigns/online", payload);
        return response.data;
    }

    createOfflineCampaign = async (payload: any) => {
        const response = await this.axiosClient.post("/admin/campaigns/offline", payload);
        return response.data;
    }

    getCampaignByIdByAdmin = async (id: number) => {
        const response = await this.axiosClient.get<ICampaign>(`/admin/campaigns/${id}`);
        return response.data;
    }


    getCampaignsByAdmin = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<ICampaign>>("/admin/campaigns", {
            params,
        });
        return response.data;
    }
}
