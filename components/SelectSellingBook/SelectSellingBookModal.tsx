import React, {useState} from 'react'
import {fakeBookSeries} from "../../pages/admin/books";
import {BsSearch} from "react-icons/bs";
import EmptyState, {EMPTY_STATE_TYPE} from "../EmptyState";
import Modal from "../Modal/Modal";
import TransitionModal from "../Modal/TransitionModal";
import Image from "next/image";
import {faker} from "@faker-js/faker/locale/vi";
import Link from "next/link";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onItemSelect: (organization: typeof fakeBookSeries[number]) => void;
};
const SelectSellingBookModal: React.FC<Props> = ({
                                                           isOpen,
                                                           onClose,
                                                           onItemSelect
                                                       }) => {

    const [search, setSearch] = useState<string>("");

    const searchedBookSeries = fakeBookSeries.filter(bookSeries => bookSeries.name.toLowerCase().includes(search.toLowerCase()));

    return (
        <TransitionModal
            maxWidth={"max-w-xl"}
            isOpen={isOpen}
            closeOnOverlayClick={true}
            onClose={onClose}
        >
            <div className="overflow-hidden rounded-xl">
                <div>
                    <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Tìm kiếm sách series"
                        className="h-12 w-full border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-96 overflow-y-auto">
                    {searchedBookSeries.length > 0 ? (
                        searchedBookSeries?.map((book) => {

                            return (
                                <div
                                    onClick={() => {
                                        onItemSelect(book);
                                    }}
                                    key={book.id}
                                    className="flex justify-between border-b border-gray-300 p-4"
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
                                                {`S${faker.datatype.number({
                                                    min: 10000,
                                                    max: 99999,
                                                })}`}
                                            </div>
                                            <div className="mb-1 text-sm font-medium text-gray-900">
                                                {book.name}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                NXB: {book.publisher}
                                            </div>
                                            {/* <div className="text-sm font-medium text-gray-500">
                                                Số sách trong series: {book.books.length}
                                            </div> */}
                                        </div>
                                    </div>
                                    <div className="text-sm font-semibold text-emerald-600">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(faker.datatype.number())}
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
                            href="/issuer/books/create"
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

export default SelectSellingBookModal