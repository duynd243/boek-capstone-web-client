export interface IBookFormat {
    id: number;
    displayName: string;
    border?: string;
    bg?: string;
}

export class BookFormats {
    static readonly PAPER: IBookFormat = {
        id: 1,
        displayName: "Sách giấy",
        border: "border border-slate-300",
        bg: 'bg-slate-100',
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

export function getBookFormatById(id: number | undefined): IBookFormat | undefined {
    return Object.values(BookFormats).find((format) => format.id === id);
}
