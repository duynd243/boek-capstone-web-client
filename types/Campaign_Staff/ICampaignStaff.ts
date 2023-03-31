import { ICampaign } from "../Campaign/ICampaign";
import { IUser } from "../User/IUser";

export interface ICampaignStaff {
    id: number;
    campaignId: number;
    staffId: string;
    status: number;
    statusName: string;
    campaign: ICampaign;
    staff: IUser;
}
