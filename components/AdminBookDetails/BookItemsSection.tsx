import React, { Fragment, useContext } from "react";
import Form from "../Form";
import Link from "next/link";
import Image from "next/image";
import { BookContext } from "../../context/BookContext";

type Props = {}

const BookItemsSection: React.FC<Props> = ({}) => {
    const book = useContext(BookContext);
    return (
        <Fragment>
            <Form.GroupLabel
                label={"Sách trong series"}
                description={"Danh sách các sách trong series"}
            />
            <div className="mt-3 flex gap-x-6 items-stretch py-3 overflow-x-auto">
                {book?.bookItems?.map(({ book }) => (
                    <Link
                        href={`/admin/books/${book?.id}`}
                        key={book?.id}
                        className="w-56 rounded-md bg-white border flex flex-col">
                        {/* Image */}
                        <Image src={book?.imageUrl || ""}
                               alt={""} width={500} height={500}
                               className={"w-auto h-72 object-cover rounded-t-md"}
                        />
                        {/* Content */}
                        <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                            <div>
                                <div className="text-sm font-medium text-slate-800">{book?.name}</div>
                                <div className="text-sm text-gray-500">{book?.releasedYear}</div>
                            </div>
                            {/*Price on right*/}
                            <div className="flex justify-end items-center mt-2">
                                <div className="text-emerald-600 font-medium text-lg">
                                    {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        },
                                    ).format(book?.coverPrice || 0)}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </Fragment>
    );
};

export default BookItemsSection;