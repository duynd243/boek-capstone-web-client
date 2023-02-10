import {IGenre} from "./Genre/IGenre";

export interface ICampaignCommission {
    id: number;
    campaignId: number;
    genreId: number;
    commission: number;
    genre: IGenre;
}