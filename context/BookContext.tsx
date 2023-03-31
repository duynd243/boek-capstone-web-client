import { createContext } from "react";
import { IBook } from "../types/Book/IBook";


export const BookContext = createContext<IBook | undefined>(undefined);