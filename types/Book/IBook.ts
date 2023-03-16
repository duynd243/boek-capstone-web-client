import { IGenre } from "../Genre/IGenre";
import { IPublisher } from "../Publisher/IPublisher";
import { IBookAuthor } from "../Book_Author/IBookAuthor";
import { ICampaign } from './../Campaign/ICampaign';

export interface IBookItem {
    id: number;
    parentBookId?: number;
    bookId: number;
    displayIndex: number;
    book?: IBook;
}

export interface IBook {
    id?: number;
    code?: string;
    genreId?: number;
    publisherId?: number;
    issuerId?: string;
    isbn10?: string;
    isbn13?: string;
    name?: string;
    translator?: string;
    imageUrl?: string;
    coverPrice?: number;
    description?: string;
    language?: string;
    size?: string;
    releasedYear?: number;
    page?: number;
    isSeries?: boolean;
    pdfExtraPrice?: number;
    pdfTrialUrl?: string;
    audioExtraPrice?: number;
    audioTrialUrl?: string;
    status?: number;
    statusName?: string;
    fullPdfAndAudio?: boolean;
    onlyPdf?: boolean;
    onlyAudio?: boolean;
    genre?: IGenre;
    saleQuantity?: number;
    discount?: number;
    // status: boolean;
    setFieldValue: (fieldName: string, value: any) => void;
    //issuer?: Issuer;
    publisher?: IPublisher;
    bookAuthors?: IBookAuthor[];
    bookItems?: IBookItem[];
    campaigns?: ICampaign[];
}