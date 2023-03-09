import { IBaseRequestParams } from "./../types/Request/IBaseRequestParams";
import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { ICampaignStaff } from "../types/Campaign_Staff/ICampaignStaff";

export default class CampaignStaffService extends BaseService {
    getCampaignStaffs = async (params?: IBaseRequestParams<ICampaignStaff>) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<ICampaignStaff>
        >("/admin/campaigns/staffs", {
            params,
        });
        return response.data;
    };
}
