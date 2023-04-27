import React, { useState } from "react";
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
import { BookProductService } from "./../../services/BookProductService";
import { IBookProduct } from "../../types/Book/IBookProduct";

type Props = {
    campaignId: number;
    isOpen: boolean;
    onClose: () => void;
    onItemSelect: (book: IBookProduct) => void;
    genreIds?: (number | undefined)[];
    selectedBooks?: Array<Pick<IBookProduct, "id"> | Partial<IBookProduct>>;
}

const SelectOldComboProductModal = ({
                                        isOpen,
                                        onClose,
                                        onItemSelect,
                                        genreIds,
                                        selectedBooks,
                                        campaignId,
                                    }: Props) => {

    console.log(genreIds);
    const { loginUser } = useAuth();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const bookService = new BookService(loginUser?.accessToken);
    const bookProductService = new BookProductService(loginUser?.accessToken);

    const { data: books } = useQuery(["/issuer/books/products/existed-combos", debouncedSearch, campaignId], () =>
        bookProductService.getComboBooksProduct$Issuer({
            name: debouncedSearch,
            genreIds: genreIds,
            CurrentCampaignId: campaignId,
        }),
    );


    return (
        <TransitionModal
            maxWidth={"max-w-3xl"}
            isOpen={isOpen}
            closeOnOverlayClick={true}
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
                    {books && books?.length > 0 ? (
                        books?.map((book, index) => {
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
                                    className={`relative flex justify-between border-b border-gray-300 p-4 pr-12 ${isSelected
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
                                                {book?.genre?.name}
                                            </div>
                                            <div className="mb-1 text-sm font-medium text-gray-900">
                                                {book?.title}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                Số sách trong Combo: {book?.bookProductItems?.length}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                Số lượng bán: {book?.saleQuantity || 0}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-emerald-600">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(book?.salePrice || 0)}
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
                            href={`/issuer/campaigns/${campaignId}/books/add-combo`}
                            className="m-btn bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Tạo sách combo mới
                        </Link>
                    </div>
                </Modal.Footer>
            </div>
        </TransitionModal>
    );
};

export default SelectOldComboProductModal;