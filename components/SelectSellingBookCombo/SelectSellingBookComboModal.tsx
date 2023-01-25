import React, {useState} from 'react'
import {fakeBookSeries, randomBooks} from "../../pages/admin/books";
import {BsCheckCircle, BsSearch} from "react-icons/bs";
import EmptyState, {EMPTY_STATE_TYPE} from "../EmptyState";
import Modal from "../Modal/Modal";
import TransitionModal from "../Modal/TransitionModal";
import Image from "next/image";
import {faker} from "@faker-js/faker/locale/vi";
import Link from "next/link";
import {IBook} from "../../types/Book/IBook";
import {IBookProduct} from "../../types/Book/IBookProduct";
import {getFormatsOfBook} from "../../utils/helper";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    selectedBooks: IBook[];
    onItemSelect: (book: IBook) => void;
};
const SelectSellingBookComboModal: React.FC<Props> = ({
                                                          isOpen,
                                                          onClose,
                                                          selectedBooks,
                                                          onItemSelect
                                                      }) => {

    const [search, setSearch] = useState<string>("");
    const searchedBooks = randomBooks.filter((book) => book?.name?.toLowerCase().includes(search.toLowerCase()));

    return (
        <TransitionModal
            maxWidth={"max-w-2xl"}
            isOpen={isOpen}
            closeOnOverlayClick={true}
            onClose={onClose}
        >
            <div className="overflow-hidden rounded-xl">
                <div>
                    <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách"
                        className="h-12 w-full border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-96 overflow-y-auto">
                    {searchedBooks.length > 0 ? (
                        searchedBooks.map((book, index) => {
                            const isSelected = selectedBooks?.find(b => b?.id === book?.id);
                            return (
                                <div
                                    onClick={() => {
                                        if (!isSelected) onItemSelect(book)
                                    }}
                                    key={book?.id}
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
                                                {`B${faker.datatype.number({
                                                    min: 10000,
                                                    max: 99999,
                                                })}`}
                                            </div>
                                            <div className="mb-1 text-sm font-medium text-gray-900">
                                                {book.name}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                NXB: {faker.company.name()}
                                            </div>
                                            <div className='flex gap-1.5 flex-wrap mt-3'>
                                                {getFormatsOfBook(book).map(format => (
                                                    <div
                                                        key={format?.id}
                                                        className="inline-block rounded py-1 px-2 text-xs text-blue-500 bg-white border border-blue-500">{format?.displayName}
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-emerald-600">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(faker.datatype.number())}
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
                                            <BsCheckCircle className="text-green-500"/>
                                        </div>
                                    )}
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
                            Tạo mới
                        </Link>
                    </div>
                </Modal.Footer>
            </div>
        </TransitionModal>
    )
}

export default SelectSellingBookComboModal