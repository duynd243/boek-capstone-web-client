import React, { Fragment, useContext } from "react";
import Form from "../Form";
import Image from "next/image";
import { getAvatarFromName, getBookFormatOptions, getBookFormatPrice } from "../../utils/helper";

import { BookContext } from "../../context/BookContext";
import { BookFormats } from "../../constants/BookFormats";

type Props = {}
const BookFormatCard = ({ format, price }: { format: string, price?: number }) => {
    return <div
        className={`flex flex-col items-center w-fit py-2 px-3 gap-2 rounded border border-2`}>
                                    <span className="text-sm px-3 text-slate-500 font-medium">
                                    {format}
                                    </span>
        {price && <span className="text-sm px-3 text-green-600 font-medium">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(price)
                                    }
                                </span>}
    </div>;
};
const MainSection: React.FC<Props> = ({}) => {

    const book = useContext(BookContext);
    return (
        <Fragment>
            <Form.GroupLabel
                label={"Thông tin chung"}
                description={"Thông tin cơ bản về sách"}
            />
            <div className="mt-3 space-y-4 md:space-y-0 md:flex gap-6">
                <Image
                    width={1200}
                    height={1200}
                    className={"rounded-md w-80 h-96 object-cover max-w-full shadow-md"}
                    src={book?.imageUrl || ""} alt={book?.name || ""} />
                <div>
                    <div
                        className="inline mb-2 bg-blue-500 text-sm font-medium text-white py-2 px-3 w-fit rounded">{book?.code}
                    </div>
                    <div
                        className="inline ml-2 mb-2 bg-amber-500 text-sm font-medium text-white py-2 px-3 w-fit rounded">{book?.genre?.name}
                    </div>
                    <h1 className="mt-3 mb-2 text-2xl font-medium text-slate-800">{book?.name}</h1>
                    <div className="text-gray-500">Tạo bởi: {book?.issuer?.user?.name}</div>


                    {/* Price */}
                    <div className="text-emerald-600 font-medium text-xl mt-3">
                        {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        }).format(book?.coverPrice || 0)}
                    </div>

                    {/* Author */}
                    {!book?.isSeries && <>
                        <div className="text-gray-600 font-medium mt-3">Tác giả:</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {book?.bookAuthors?.map((author) => (
                                    <div key={author?.author?.id}
                                         className="flex items-center w-fit p-1 rounded-full bg-slate-50 shadow-sm">
                                        <Image src={author?.author?.imageUrl || getAvatarFromName(author?.author?.name)}
                                               alt={""} width={100} height={100}
                                               className={"w-10 h-10 object-cover rounded-full flex-shrink-0"}
                                        />
                                        <span className="text-sm px-3 text-slate-700 font-medium">
                                    {author?.author?.name}
                                    </span>
                                    </div>
                                ),
                            )}
                        </div>
                    </>}

                    <div className="text-gray-600 font-medium mt-3">Định dạng:</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {book?.isSeries === false && getBookFormatOptions(book)?.map((format) => (
                                <BookFormatCard key={format?.id}
                                                price={book?.isSeries ? undefined : (getBookFormatPrice(book, format) || 0)}
                                                format={format?.displayName} />
                            ),
                        )}

                        {book?.isSeries === true && <BookFormatCard
                            price={undefined}
                            format={BookFormats.PAPER.displayName} />
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default MainSection;