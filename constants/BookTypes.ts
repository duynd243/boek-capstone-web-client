export interface IBookType {
    id: number;
    displayName: string;
    icon?: string;
}

export const BookTypes = {
    Single: {
        id: 1,
        displayName: "Sách lẻ",
        icon: "📘",
    },
    Combo: {
        id: 2,
        displayName: "Sách combo",
        icon: "📚",
    },
    Series: {
        id: 3,
        displayName: "Sách series",
        icon: "📖",
    },

} satisfies Record<string, IBookType>;


export function getBookTypeById(id: number | undefined): IBookType | undefined {
    return Object.values(BookTypes).find((type) => type.id === id);
}