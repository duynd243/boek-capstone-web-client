import { ILevel } from "./../Level/ILevel";

export interface ICampaignLevel {
    id: number;
    campaignId?: number;
    levelId?: number;
    level?: ILevel;
}