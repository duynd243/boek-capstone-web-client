import React, { useState } from "react";
import { IBook } from "./../../types/Book/IBook";
import TransitionModal from "./../Modal/TransitionModal";
import { BsSearch } from "react-icons/bs";
import useDebounce from "./../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { BookService } from "./../../services/BookService";
import Modal from "./../Modal/Modal";
import Link from "next/link";
import Image from "next/image";
import EmptyState, { EMPTY_STATE_TYPE } from "../EmptyState";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onItemSelect: (book: IBook) => void;
    genreId?: number;
    selectedBooks?: Array<Pick<IBook, "id"> | Partial<IBook>>;
}

const SelectSellingBookComboModal = ({
                                         isOpen,
                                         onClose,
                                         onItemSelect,
                                         genreId,
                                         selectedBooks,
                                     }: Props) => {
    const { loginUser } = useAuth();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const bookService = new BookService(loginUser?.accessToken);

    const { data: books } = useQuery(["issuer_books", debouncedSearch, genreId], () =>
        bookService.getBooks$Issuer({
            name: debouncedSearch,
            genreIds: [genreId],
            isSeries: false,
        }),
    );


    return (
        <TransitionModal
            maxWidth={"max-w-3xl"}
            isOpen={isOpen}
            closeOnOverlayClick={false}
            onClose={onClose}
        >
            <div className="overflow-hidden rounded-xl">
                <div>
                    <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách"
                        className="h-12 w-full border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-96 overflow-y-auto">
                    {books?.data && books?.data.length > 0 ? (
                        books?.data.map((book, index) => {
                            const isSelected = selectedBooks?.find(
                                (item) => item.id === book.id,
                            );
                            return (
                                <div
                                    onClick={() => {
                                        if (!isSelected) {
                                            onItemSelect(book);
                                        }
                                    }}
                                    key={index}
                                    className={`relative flex justify-between border-b border-gray-300 p-4 pr-12 ${
                                        isSelected
                                            ? "cursor-not-allowed bg-slate-100"
                                            : "cursor-pointer"
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <Image
                                            width={500}
                                            height={500}
                                            className="h-20 w-16 object-cover"
                                            src={book.imageUrl || ""}
                                            alt=""
                                        />
                                        <div>
                                            <div
                                                className="mb-1 w-fit rounded bg-blue-500 py-1 px-2 text-xs text-white">
                                                {book?.code}
                                            </div>
                                            <div className="mb-1 text-sm font-medium text-gray-900">
                                                {book?.name}
                                            </div>
                                            {/* <div className="text-sm font-medium text-gray-500">
                                                Số sách trong Series: {book?.bookItems?.length}
                                            </div> */}
                                            <div className="text-sm font-medium text-gray-500">
                                                Thể loại: {book?.genre?.name}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-emerald-600">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(book?.coverPrice || 0)}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <EmptyState
                            status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                            keyword={search}
                        />
                    )}
                </div>

                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            onClick={onClose}
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Đóng
                        </button>
                        <Link
                            href="/issuer/books/create-series"
                            className="m-btn bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Tạo sách mới
                        </Link>
                    </div>
                </Modal.Footer>
            </div>
        </TransitionModal>
    );
};

export default SelectSellingBookComboModal;