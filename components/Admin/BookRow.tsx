import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { IBookResponse } from "../../types/response/IBookResponse";
import Image from "next/image";
import DefaultAvatar from "./../../assets/images/default-avatar.png";
import TableData, { noDataLabel } from "./TableData";
import { getFormattedPrice } from "../../utils/helper";
import BookModal, {
  BookModalMode,
} from "./../../components/Modal/BookModal";
import { BsPencilFill } from "react-icons/bs";
import { BsFillEyeFill } from "react-icons/bs";




type Props = {
  book: IBookResponse;
};
const BookRow: React.FC<Props> = ({ book }) => {
  const [selectedBook, setSelectedBook] = useState<{
    id?: number;
    name?: string;
    code?: string;
    imageUrl?: string;
    isbn10?: string;
    isbn13?: string;
    price?: number;
    publisher?: { name?: string };
    releasedYear?: number;
    // unitInStock?: number;
    size?: string;
    authorBooks?: { author?: { name?: string } }[];
    category?: { name?: string };
    language?: string;
  }>();
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  return (
    <tr>
      <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
        <div className="text-left">{book?.code}</div>
      </td>
      <TableData>
        <div className="font-medium w-[100px] text-ellipsis overflow-hidden">
          {book?.isbn10 || noDataLabel}
        </div></TableData>
      <TableData>
        <div className="font-medium w-[100px] text-ellipsis overflow-hidden">
          {book?.isbn13 || noDataLabel}
        </div></TableData>
      <td className="whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
        <div className="flex items-center">
          <div className="mr-2 h-[100px] w-[64px] shrink-0 sm:mr-3">
            <Image
              className="rounded cursor-pointer"
              src={book?.imageUrl || DefaultAvatar.src}
              width="80"
              height="100"
              alt={book?.name || ""}
            />
          </div>
          <div className="font-medium w-[100px] text-ellipsis overflow-hidden">{book.name}</div>
        </div>
      </td>

      <TableData>{book?.price && getFormattedPrice(book?.price)}</TableData>
      <TableData>
        <div className="font-medium w-[100px] text-ellipsis overflow-hidden">
          {book?.publisher?.name || noDataLabel}
        </div></TableData>
      <TableData alignClass={"text-center"}>
        {book?.releasedYear || noDataLabel}
      </TableData>
      {/* <TableData alignClass={"text-center"}>
        {book?.unitInStock || noDataLabel}
      </TableData> */}
      <TableData>
        <div className="font-medium w-[100px] text-ellipsis overflow-hidden">
          {book?.authorBooks?.map((a) => a.author?.name).join(", ") ||
            noDataLabel}
        </div></TableData>
      <TableData>
        <div className="font-medium w-[100px] text-ellipsis overflow-hidden">{book?.category?.name || noDataLabel}</div>
      </TableData>
      <TableData>{book?.language || noDataLabel}</TableData>
      <TableData>
        <button 
        onClick={() => {

          setSelectedBook({
            id: book?.id,
            name: book?.name,
            code: book?.code,
            imageUrl: book?.imageUrl,
            isbn10: book?.isbn10,
            isbn13: book?.isbn13,
            price: book?.price,
            publisher: book?.publisher,
            releasedYear: book?.releasedYear,
            unitInStock: book?.unitInStock,
            size: book?.size,
            authorBooks: book?.authorBooks,
            category: book?.category,
            language: book?.language
          });
          setShowUpdateModal(true);
        }
        }

          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <BsFillEyeFill />
          {/* Chi tiết & Chỉnh sửa */}
        </button>
        <button onClick={() => {

          setSelectedBook({
            id: book?.id,
            name: book?.name,
            code: book?.code,
            imageUrl: book?.imageUrl,
            isbn10: book?.isbn10,
            isbn13: book?.isbn13,
            price: book?.price,
            publisher: book?.publisher,
            releasedYear: book?.releasedYear,
            unitInStock: book?.unitInStock,
            size: book?.size,
            authorBooks: book?.authorBooks,
            category: book?.category,
            language: book?.language
          });
          setShowUpdateModal(true);
        }
        }
          className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <BsPencilFill />
          {/* Chi tiết & Chỉnh sửa */}
        </button>
      </TableData>

      <td className="w-px whitespace-nowrap px-2 py-3 first:pl-5 last:pr-5">
        {/* Menu button */}
        {/* <button onClick={() => {

          setSelectedBook({
            id: book?.id,
            name: book?.name,
            code: book?.code,
            imageUrl: book?.imageUrl,
            isbn10: book?.isbn10,
            isbn13: book?.isbn13,
            price: book?.price,
            publisher: book?.publisher,
            releasedYear: book?.releasedYear,
            unitInStock: book?.unitInStock,
            size: book?.size,
            authorBooks: book?.authorBooks,
            category: book?.category,
            language: book?.language
          });
          setShowUpdateModal(true);
        }
        } className="rounded-full text-slate-400 hover:text-slate-500">
          <span className="sr-only">Chỉnh Sửa</span>
          <svg className="h-8 w-8 fill-current" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="2" />
            <circle cx="10" cy="16" r="2" />
            <circle cx="22" cy="16" r="2" />
          </svg>
        </button> */}
      </td>

      <BookModal
        action={BookModalMode.UPDATE}
        book={selectedBook as {
          id?: number; name?: string; code?: string; imageUrl?: string;
          isbn10?: string; isbn13?: string; price?: number; publisher?: { id?: number; name?: string };
          releasedYear?: number; unitInStock?: number; size?: string; authors?: { id?: number; name?: string }[];
          categories?: { id?: number; name?: string }[]; languages?: { id?: number; name?: string }[];
        }}
        onClose={() => setShowUpdateModal(false)}
        isOpen={showUpdateModal}
      />
    </tr>
  );
};

export default BookRow;
