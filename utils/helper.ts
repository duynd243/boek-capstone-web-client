import { format } from "date-fns";
import { vi } from "date-fns/locale";
import slugify from "slugify";
import { z } from "zod";
import { BookFormats, IBookFormat } from "../constants/BookFormats";
import { hexColors } from "../constants/Colors";
import { IBook } from "../types/Book/IBook";
import { IBookProduct } from "../types/Book/IBookProduct";

export const isValidImageSrc = (src: string): boolean => {
    return z.string().url().safeParse(src).success;
};

export function getRequestDateTime(date: Date) {
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}
export function isImageFile(file: File) {
    return file.type.startsWith("image");
}

export function isValidFileSize(file: File, maxSizeInMb: number) {
    return file.size <= maxSizeInMb * 1024 * 1024;
}

function randomColor(name?: string | undefined): string {
    return hexColors[name ? name?.length % hexColors.length : 0];
}

export function getAvatarFromName(
    name?: string | undefined,
    length?: number
): string {
    const backgroundColor = randomColor(name);
    return `https://ui-avatars.com/api/?name=${
        name ? name : ""
    }&color=FFFFFF&background=${backgroundColor}&length=${
        length ? length : 2
    }&format=svg`;
}

export function isInViewPort(element: Element): boolean {
    const rect = element.getBoundingClientRect();
    const html = document.documentElement;
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || html.clientHeight) &&
        rect.right <= (window.innerWidth || html.clientWidth)
    );
}

const defaultLocaleFormat = { locale: vi };

export function getFormattedDate(
    dateStr: string | undefined,
    localeFormat: {
        locale: Locale;
    } = defaultLocaleFormat
) {
    const date = dateStr ? new Date(dateStr) : undefined;
    return {
        dayOfWeek: date ? format(date, "eeee", localeFormat) : "N/A",
        day: date ? format(date, "dd", localeFormat) : "N/A",
        month: date ? format(date, "MM", localeFormat) : "N/A",
        year: date ? format(date, "yyyy", localeFormat) : "N/A",
        withoutDayOfWeek: date
            ? format(date, "dd/MM/yyyy", localeFormat)
            : "N/A",
        fullDate: date ? format(date, "eeee, dd/MM/yyyy", localeFormat) : "N/A",
    };
}

export function getFormattedTime(
    dateStr: string | undefined,
    formatType: string
) {
    const dateObj = dateStr ? new Date(dateStr) : undefined;
    return dateObj ? format(dateObj, formatType, defaultLocaleFormat) : "N/A";
}

const slugifyOptions = {
    replacement: "-",
    remove: /[*+~.()'"!:@]/g,
    lower: true,
    strict: true,
    locale: "vi",
    trim: true,
};

export function getSlug(str?: string) {
    return slugify(str || "", slugifyOptions);
}

export function getSlugUrl(
    rootPath?: string,
    title?: string,
    id?: number | string
) {
    return `${rootPath}/${getSlug(title)}/${id}`;
}

export function getFormattedPrice(number: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(number);
}

export function isValidPhoneNumber(phoneNumber: string) {
    return /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/.test(
        phoneNumber
    );
}

export function getFormatsOfBook(
    book: IBook | IBookProduct | undefined
): IBookFormat[] {
    if (!book) return [];
    const formats: IBookFormat[] = [BookFormats.PAPER];
    if (book.fullPdfAndAudio) {
        formats.push(BookFormats.PDF);
        formats.push(BookFormats.AUDIO);
    }
    if (book.onlyPdf) {
        formats.push(BookFormats.PDF);
    }
    if (book.onlyAudio) {
        formats.push(BookFormats.AUDIO);
    }
    return formats;
}

export function getIntersectedArray<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((item) => arr2.includes(item));
}

export function getIntersectedFormatOfBooks(books: IBook[]): IBookFormat[] {
    if (!books || books.length === 0) return [];
    const formatsOfBooks = books.map((book) => getFormatsOfBook(book));
    return formatsOfBooks.reduce((prev, curr) =>
        getIntersectedArray(prev, curr)
    );
}

export const VIETNAMESE_PHONE_REGEX =
    /^(0|\+84)(\s|\.)?((3[2-9])|(5[689])|(7[06-9])|(8[1-689])|(9[0-46-9]))(\d)(\s|\.)?(\d{3})(\s|\.)?(\d{3})$/;
