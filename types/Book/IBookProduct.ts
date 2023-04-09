import { ICampaign } from "../Campaign/ICampaign";
import { IBook } from "./IBook";
import { IIssuer } from "../User/IUser";
import { IGenre } from "../Genre/IGenre";
import { IUnhierarchicalBookProduct } from "./IUnhierarchicalBookProduct";

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
    campaignId?: number;
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
    issuer?: IIssuer;
    bookProductItems?: IBookProductItem[];
}

export interface ICustomerBookProduct extends IBookProduct {
    otherMobileBookProducts?: {
        id: string;
        bookId: number;
        genreId?: number;
        campaignId?: number;
        campaignName?: string;
        discount?: number;
        salePrice?: number;
    }[];
    unhierarchicalBookProducts?: IUnhierarchicalBookProduct[];
}