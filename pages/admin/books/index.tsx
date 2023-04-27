import React, { Fragment, ReactElement, useState } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import TableBody from "../../../components/Admin/Table/TableBody";
import { isValidImageSrc } from "../../../utils/helper";
import { IBook } from "../../../types/Book/IBook";
import { useAuth } from "../../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { BookService } from "../../../services/BookService";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import StatusCard from "../../../components/StatusCard";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import TableFooter from "../../../components/Admin/Table/TableFooter";
import DefaultAvatar from "../../../assets/images/default-avatar.png";
import Link from "next/link";

const AdminBooksPage: NextPageWithLayout = () => {


    const { loginUser } = useAuth();

    const bookService = new BookService(loginUser?.accessToken);
    const [selectedBook, setSelectedBook] = useState<IBook>();

    const {
        search,
        setSearch,
        page,
        size,
        onSizeChange,
        pageSizeOptions,
        setPage,
    } = useTableManagementPage();

    const {
        data: bookData,
        isLoading,
        isFetching,
    } = useQuery(
        ["books", { search, page, size }],
        () =>
            bookService.getBooks({
                name: search,
                page,
                size,
                sort: "CreatedDate desc",
            }),
        {
            keepPreviousData: true,
        },
    );

    return (
        <Fragment>
            <PageHeading label="Kho sách">
                <SearchForm
                    placeholder="Tìm kiếm theo tên sách"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
            </PageHeading>


            {bookData?.data && bookData?.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Mã sách</TableHeader>
                        <TableHeader>Tên sách</TableHeader>
                        <TableHeader>Giá sách</TableHeader>
                        <TableHeader>Được tạo bởi</TableHeader>
                        <TableHeader>ISBN10</TableHeader>
                        <TableHeader>ISBN13</TableHeader>
                        <TableHeader>Tác giả</TableHeader>
                        <TableHeader>Năm phát hành</TableHeader>
                        <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
                        <TableHeader>
                            <span className="sr-only">Edit</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {bookData?.data?.map((book) => {
                            return (
                                <tr key={book?.id}>
                                    <TableData className="text-sm font-medium uppercase text-gray-500">
                                        <div className="w-16 truncate">
                                            {book?.code}
                                        </div>
                                    </TableData>
                                    <TableData className="max-w-72">
                                        <div title={book?.name} className="flex items-center gap-4 w-72 truncate">
                                            <Image
                                                width={500}
                                                height={500}
                                                className="h-20 w-16 object-cover rounded-sm shadow-sm"
                                                src={book?.imageUrl || ""}
                                                alt=""
                                            />
                                            <div
                                                className="overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                                                {book?.name}
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
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={book?.issuer?.user?.imageUrl && isValidImageSrc(book?.issuer?.user?.imageUrl)
                                                        ? book?.issuer?.user?.imageUrl
                                                        : DefaultAvatar.src}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm text-gray-900">
                                                    {book?.issuer?.user?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </TableData>
                                    <TableData className="text-sm text-gray-500">
                                        {book?.isbn10 || "-"}
                                    </TableData>

                                    <TableData className="text-sm text-gray-500">
                                        {book?.isbn13 || "-"}
                                    </TableData>
                                    <TableData className="text-sm text-gray-500">
                                        {book?.bookAuthors?.map((author) => (author?.author?.name)).join(", ") || "-"}
                                    </TableData>
                                    <TableData
                                        textAlignment="text-center"
                                        className="text-sm text-gray-500"
                                    >
                                        {book?.releasedYear}
                                    </TableData>
                                    <TableData textAlignment="text-center">
                                        {book?.status ?
                                            <StatusCard label="Đang phát hành" /> :
                                            <StatusCard variant="error" label="Ngưng phát hành" />}
                                    </TableData>
                                    <TableData className="text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/books/${book?.id}`}
                                            className="text-indigo-600 hover:text-indigo-700"
                                        >
                                            Chi tiết
                                        </Link>
                                    </TableData>
                                </tr>
                            );
                        })}
                    </TableBody>
                    <TableFooter
                        colSpan={10}
                        size={size}
                        onSizeChange={onSizeChange}
                        page={page}
                        onPageChange={setPage}
                        totalElements={bookData?.metadata?.total || 0}
                        pageSizeOptions={pageSizeOptions}
                    />
                </TableWrapper>
            ) : (<div className="pt-8">
                {search ? (
                    <EmptyState
                        keyword={search}
                        status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                    />
                ) : (
                    <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />
                )}
            </div>)}
        </Fragment>
    );
};
AdminBooksPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminBooksPage;
