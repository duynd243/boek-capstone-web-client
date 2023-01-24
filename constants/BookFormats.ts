export interface IBookFormat {
    id: number;
    displayName: string;
}

export class BookFormats {
    static readonly PAPER: IBookFormat = {
        id: 1,
        displayName: "Sách giấy",
    };
    static readonly PDF: IBookFormat = {
        id: 2,
        displayName: "Sách PDF",
    };
    static readonly AUDIO: IBookFormat = {
        id: 3,
        displayName: "Sách Audio",
    }
}

