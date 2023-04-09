import React, { Fragment, ReactElement, useState, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import { IssuerBookService } from "../../../old-services/Issuer/Issuer_BookService";
import { useQuery } from "@tanstack/react-query";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import SearchForm from "../../../components/Admin/SearchForm";
import PageHeading from "../../../components/Admin/PageHeading";
import { Menu, Transition } from "@headlessui/react";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import { IoAdd } from "react-icons/io5";
import { GiBookCover, GiBookmarklet, GiBookPile } from "react-icons/gi";
import CreateBookButton from "../../../components/CreateBookButton";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import { faker } from "@faker-js/faker/locale/vi";
import { IBookResponse } from "../../../old-types/response/IBookResponse";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import { randomBooks } from "../../admin/books";
import { getAvatarFromName } from "../../../utils/helper";
import useSearchQuery from "../../../hooks/useSearchQuery";
import { BookService } from './../../../services/BookService';
import Link from "next/link";
import TableFooter from "../../../components/Admin/Table/TableFooter";






const CREATE_BOOK_BUTTONS = [
  {
    label: "Sách Lẻ",
    description: "Thêm sách lẻ vào kho sách",
    href: "/issuer/books/create",
    icon: GiBookCover,
  },
  // {
  //   label: "Sách Combo",
  //   description: "Thêm sách combo vào kho sách",
  //   href: "/issuer/books/reate-combo",
  //   icon: GiBookPile,
  // },
  {
    label: "Sách Series",
    description: "Thêm sách series vào kho sách",
    href: "/issuer/books/create-series",
    icon: GiBookmarklet,
  },
];
const IssuerBooksPage: NextPageWithLayout = () => {
  const { loginUser } = useAuth();
  const pageSizeOptions = [5, 10, 20, 50];
  const [size, setSize] = useState<number>(pageSizeOptions[0]);
  const { search, setSearch } = useSearchQuery("search", () => setPage(1));
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const issuerBookService = new IssuerBookService(loginUser?.accessToken);
  const bookService = new BookService(loginUser?.accessToken);

  const { data: issuerData } = useQuery(["issuer_books", { search, page, size }], () =>
    bookService.getBooks$Issuer({
      page: page,
      size: pageSize,
      sort: "id desc",
      name: search || undefined,
    }),
  );
  const onSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(1);
  }, []);
  return (
    <Fragment>
      <PageHeading label="Kho sách">
        <SearchForm
          placeholder="Tìm kiếm sách"
          value={search}
          onSearchSubmit={(value) => setSearch(value)} />
        <Menu as={"div"} className={"relative"}>
          <Menu.Button
            as={"button"}
            className="m-btn gap-1 bg-indigo-500 text-white hover:bg-indigo-600"
          >
            <IoAdd size={16} />
            <span className="hidden sm:block">Thêm sách</span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="max-w-screen absolute right-0 z-10 mt-2 w-80 origin-top-right overflow-hidden rounded-lg bg-white p-2.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="relative flex flex-col gap-2 bg-white">
                {CREATE_BOOK_BUTTONS.map((button, index) => (
                  <Menu.Item key={index}>
                    <CreateBookButton
                      icon={button.icon}
                      href={button.href}
                      label={button.label}
                      description={button.description}
                    />
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </PageHeading>

      {issuerData?.data && issuerData?.data?.length > 0 ? (
        <TableWrapper>
          <TableHeading>
            <TableHeader>Mã sách</TableHeader>
            <TableHeader>Tên sách</TableHeader>
            <TableHeader>Giá sách</TableHeader>
            <TableHeader>Nhà xuất bản</TableHeader>
            <TableHeader>ISBN10</TableHeader>
            <TableHeader>ISBN13</TableHeader>
            {/* <TableHeader>Hội sách</TableHeader> */}
            <TableHeader>Tác giả</TableHeader>
            <TableHeader>Năm phát hành</TableHeader>
            <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
            <TableHeader>
              <span className="sr-only">Edit</span>
            </TableHeader>
          </TableHeading>
          <TableBody>
            {issuerData?.data?.map((book) => (
              <tr key={book?.id}>
                <TableData className="text-sm font-medium uppercase text-gray-500">
                  {book.code}
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
                    <div className="max-w-[15rem] overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                      {book.name}
                    </div>
                  </div>
                </TableData>
                <TableData className="text-sm font-semibold text-emerald-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(book?.coverPrice || 0)}
                </TableData>
                <TableData>
                  {!book?.isSeries ? <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        width={100}
                        height={100}
                        className="h-10 w-10 rounded-full"
                        src={getAvatarFromName(book.publisher?.name)}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm text-gray-900">
                        {book.publisher?.name}
                      </div>
                    </div>
                  </div> : <span>-</span>}
                </TableData>
                <TableData className="text-sm text-gray-500">
                  {book.isbn10}
                </TableData>

                <TableData className="text-sm text-gray-500">
                  {book.isbn13}
                </TableData>
                <TableData className="text-sm text-gray-500">
                  {book.bookAuthors?.map((author) => (
                    <div key={author?.id}>{author?.author?.name}</div>
                  ))}
                </TableData>
                <TableData
                  textAlignment="text-center"
                  className="text-sm text-gray-500"
                >
                  {book.releasedYear}
                </TableData>
                <TableData textAlignment="text-center">
                  {book.status ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
                      Phát Hành
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold uppercase leading-5 text-red-800">
                      Ngừng Phát Hành
                    </span>
                  )}
                </TableData>
                <TableData className="text-right text-sm font-medium">
                  <Link
                    href={book?.isSeries ? `/issuer/books/series-detail/${book?.id}` : `/issuer/books/book-detail/${book?.id}`}
                    className="text-indigo-600 hover:text-indigo-900">
                    Chi tiết
                  </Link>
                </TableData>
              </tr>
            ))}
          </TableBody>
          <TableFooter
            colSpan={10}
            size={size}
            onSizeChange={onSizeChange}
            page={page}
            onPageChange={(page) => setPage(page)}
            totalPages={issuerData?.metadata?.total || 0}
            pageSizeOptions={pageSizeOptions}
          />
        </TableWrapper>
      ) : (
        <div className="pt-8">
          {search ? (
            <EmptyState
              keyword={search}
              status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
            />
          ) : (
            <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />
          )}
        </div>
      )}
    </Fragment>
  );
};
IssuerBooksPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerBooksPage;
