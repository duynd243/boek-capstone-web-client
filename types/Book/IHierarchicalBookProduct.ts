import { IGenre } from "../Genre/IGenre";
import { IBookProduct } from "./IBookProduct";
import { IUser } from "../User/IUser";

export interface ISubHierarchicalBookProduct {
    subTitle: string;
    genreId: number;
    issuerId: string;
    genre: IGenre;
    issuer: IUser;
    bookProducts: IBookProduct[];
}

export interface IHierarchicalBookProduct {
    campaignId: number;
    title: string;
    subHierarchicalBookProducts: ISubHierarchicalBookProduct[];
}