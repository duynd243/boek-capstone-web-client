export interface IBookProduct {
    id: string;
    bookId?: number;
    campaignId?: number;
    issuerId?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    saleQuantity?: number;
    discount?: number;
    salePrice?: number;
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
    fullPdfAndAudio?: boolean;
    onlyPdf?: boolean;
    onlyAudio?: boolean;
}