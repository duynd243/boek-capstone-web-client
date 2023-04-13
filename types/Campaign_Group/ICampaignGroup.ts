import { IGroup } from "./../Group/IGroup";

export interface ICampaignGroup {
    id: number;
    campaignId?: number;
    groupId?: number;
    group?: IGroup;
}