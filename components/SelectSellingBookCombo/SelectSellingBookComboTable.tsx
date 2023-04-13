import React from "react";
import TableHeading from "../Admin/Table/TableHeading";
import TableHeader from "../Admin/Table/TableHeader";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import Image from "next/image";
import { getAvatarFromName, getFormatsOfBook } from "../../utils/helper";
import TableWrapper from "../Admin/Table/TableWrapper";
import { IBook } from "../../types/Book/IBook";
import { faker } from "@faker-js/faker/locale/vi";
import { BookFormats, IBookFormat } from "../../constants/BookFormats";
import { IBookComboItem } from "../../pages/issuer/campaigns/[id]/books/add-combo";

type Props = {
    onBonusChange: (check: boolean, bookId: number, formatId: number) => void;
    selectedFormat: IBookFormat | null;
    selectedBooks: (IBook & IBookComboItem)[];
    handleRemoveBook: (book: IBook & IBookComboItem) => void;
};

const SelectSellingBookComboTable: React.FC<Props> = ({
                                                          onBonusChange,
                                                          selectedFormat,
                                                          selectedBooks,
                                                          handleRemoveBook,
                                                      }) => {
    return (
        <TableWrapper>
            <TableHeading>
                <TableHeader>Mã sách</TableHeader>
                <TableHeader>Tên sách</TableHeader>
                <TableHeader>Giá bìa</TableHeader>
                <TableHeader>Nhà xuất bản</TableHeader>
                <TableHeader>Tặng kèm</TableHeader>
                <TableHeader>
                    <span className="sr-only">Edit</span>
                </TableHeader>
            </TableHeading>
            <TableBody>
                {selectedBooks.length > 0 ? (
                    selectedBooks.map((book, index) => {
                        const formats = getFormatsOfBook(book);
                        const availableBonuses = formats?.filter(
                            (format) =>
                                format?.id !== selectedFormat?.id && format?.id !== BookFormats.PAPER.id,
                        );

                        return (
                            <tr key={index}>
                                <TableData className="text-sm font-medium uppercase text-gray-500">
                                    {book?.code}
                                </TableData>
                                <TableData className="max-w-72">
                                    <div className="flex items-center gap-4">
                                        <Image
                                            width={500}
                                            height={500}
                                            className="h-20 w-16 object-cover"
                                            src={book.imageUrl || ""}
                                            alt=""
                                        />
                                        <div
                                            className="max-w-56 overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                                            {book.name}
                                        </div>
                                    </div>
                                </TableData>
                                <TableData className="text-sm font-semibold text-emerald-600">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(faker.datatype.number())}
                                </TableData>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full"
                                                src={getAvatarFromName("Nhã Nam")}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm text-gray-900">
                                                Nhã Nam
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData
                                    textAlignment="text-center"
                                    className="text-sm text-gray-500"
                                >
                                    <div className="space-y-4">
                                        {availableBonuses?.map((bonus) => {
                                            const checked = book?.withPdf && bonus?.id === BookFormats.PDF.id
                                                || book?.withAudio && bonus?.id === BookFormats.AUDIO.id;
                                            return <div
                                                className="relative flex items-center gap-2"
                                                key={bonus.id}>
                                                <input
                                                    onChange={(e) => {
                                                        if (book?.id) onBonusChange(e.target.checked, book.id, bonus.id);
                                                    }}
                                                    id={`bonus-${bonus.id}-b${book.id}`}
                                                    name={`bonus-${index}`}
                                                    type="checkbox"
                                                    value={bonus.id}
                                                    checked={selectedFormat ? checked : false}
                                                    disabled={!selectedFormat}
                                                    className="disabled:bg-gray-100 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                                <label
                                                    htmlFor={`bonus-${bonus.id}-b${book.id}`}
                                                    className="text-sm font-medium text-gray-600"
                                                >
                                                    {bonus?.displayName} - <span
                                                    className="text-emerald-600 font-medium">
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(faker.datatype.number())}</span>

                                                </label>
                                            </div>;
                                        })}
                                    </div>
                                </TableData>
                                <TableData className="text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleRemoveBook(book)}
                                        className="text-rose-600 hover:text-rose-800"
                                    >
                                        Xoá
                                    </button>
                                </TableData>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <TableData
                            colSpan={6}
                            textAlignment={"text-center"}
                            className="text-sm font-medium uppercase leading-10 text-gray-500 "
                        >
                            Chưa có sách nào được chọn
                        </TableData>
                    </tr>
                )}
            </TableBody>
        </TableWrapper>
    );
};

export default SelectSellingBookComboTable;
