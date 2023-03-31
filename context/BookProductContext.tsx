import { createContext } from "react";
import { IBookProduct } from "../types/Book/IBookProduct";
export const BookProductContext = createContext<IBookProduct | undefined>(undefined);