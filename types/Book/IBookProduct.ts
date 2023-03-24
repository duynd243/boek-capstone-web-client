import {ICampaign} from "../Campaign/ICampaign";
import {IBook} from "./IBook";
import {IUser} from "../User/IUser";
import { IGenre } from './../Genre/IGenre';

export interface IBookProductItem {
    id: number;
    parentBookProductId: string;
    bookId: number;
    format: number;
    displayIndex: number;
    withPdf: boolean;
    pdfExtraPrice?: number;
    displayPdfIndex: number;
    withAudio: boolean;
    audioExtraPrice?: number;
    displayAudioIndex: number;
    book: IBook;
}

export interface IBookProduct {
    id: string;
    bookId: number;
    genreId?: number;
    genre?: IGenre;
    campaignId: number;
    issuerId?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    saleQuantity?: number;
    discount?: number;
    salePrice?: number;
    commission?: number;
    type?: number;
    typeName?: string;
    format?: number;
    formatName?: string;
    withPdf?: boolean;
    pdfExtraPrice?: number;
    displayPdfIndex?: number;

    withAudio?: boolean;
    displayAudioIndex?: number;
    audioExtraPrice?: number;
    status?: number;
    statusName?: string;
    note?: string;
    createdDate?: string;
    updatedDate?: string;
    fullPdfAndAudio?: boolean;
    onlyPdf?: boolean;
    onlyAudio?: boolean;
    campaign?: ICampaign;
    book?: IBook;
    issuer?: {
        id?: string;
        description?: string;
        user?: IUser;
    };
    bookProductItems?: IBookProductItem[];
}