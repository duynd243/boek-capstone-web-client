import { IBookProduct } from "./IBookProduct";

export interface IUnhierarchicalBookProduct {
    campaignId: number;
    title: string;
    bookProducts: IBookProduct[];
}