import { IGenre } from "../Genre/IGenre";

export interface ICampaignCommission {
    id: number;
    campaignId?: number;
    genreId?: number;
    minimalCommission?: number;
    genre?: IGenre;
}
