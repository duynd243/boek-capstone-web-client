import {BaseService} from "./BaseService";
import {CampaignPrivacies} from "../constants/CampaignPrivacies";
import {CampaignFormats} from "../constants/CampaignFormats";

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
}
