import { IAuthor } from "../Author/IAuthor";

export interface IBookAuthor {
    id: number;
    bookId: number;
    authorId: number;
    author?: IAuthor;
}