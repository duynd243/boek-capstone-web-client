import {IUser} from "../User/IUser";
import {ICampaign} from "../Campaign/ICampaign";

export interface IParticipant {
    id: number;
    campaignId?: number;
    issuerId?: string;
    status?: number;
    statusName?: string;
    note?: string;
    createdDate?: string;
    updatedDate?: string;
    issuer?: {
        id?: string;
        description?: string;
        user?: IUser;
    };
    campaign?: ICampaign;
}
