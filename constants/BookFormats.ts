export interface IBookFormat {
    id: number;
    displayName: string;
}

export const BookFormats = {
    PAPER: {
        id: 1,
        displayName: "Sách giấy",
    },
    PDF: {
        id: 2,
        displayName: "Sách PDF",
    },
    AUDIO: {
        id: 3,
        displayName: "Sách Audio",
    }
} satisfies Record<string, IBookFormat>

export function getBookFormatById(id: number | undefined): IBookFormat | undefined {
    return Object.values(BookFormats).find((format) => format.id === id);
}

const a = {
    hobbies: [{
        id: 1,
        name: "Reading",
    }, {
        id: 2,
        name: "Writing",
    }],
}

const b = {
    hobbies: [{
        id: 1,
        name: "Reading",
    },{
        id: 3,
        name: "Drawing",
    }],
}

