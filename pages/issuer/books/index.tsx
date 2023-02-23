import React, {Fragment, ReactElement, useState} from "react";
import {useAuth} from "../../../context/AuthContext";
import {IssuerBookService} from "../../../old-services/Issuer/Issuer_BookService";
import {useQuery} from "@tanstack/react-query";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../_app";
import SearchForm from "../../../components/Admin/SearchForm";
import PageHeading from "../../../components/Admin/PageHeading";
import {Menu, Transition} from "@headlessui/react";
import {IoAdd} from "react-icons/io5";
import {GiBookCover, GiBookmarklet, GiBookPile} from "react-icons/gi";
import CreateBookButton from "../../../components/CreateBookButton";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import {faker} from "@faker-js/faker/locale/vi";
import {IBookResponse} from "../../../old-types/response/IBookResponse";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import {randomBooks} from "../../admin/books";
import {getAvatarFromName} from "../../../utils/helper";

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
    const {loginUser} = useAuth();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const issuerBookService = new IssuerBookService(loginUser?.accessToken);

    const {data: issuerBooks} = useQuery(["issuer_books", page], () =>
        issuerBookService.getBooks$Issuer({
            page: page,
            size: pageSize,
            sort: "id desc",
        })
    );
    return (
        <Fragment>
            <PageHeading label="Kho sách">
                <SearchForm/>
                <Menu as={"div"} className={"relative"}>
                    <Menu.Button
                        as={"button"}
                        className="m-btn gap-1 bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                        <IoAdd size={16}/>
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
                        <Menu.Items
                            className="max-w-screen absolute right-0 z-10 mt-2 w-80 origin-top-right overflow-hidden rounded-lg bg-white p-2.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
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
            <TableWrapper>
                <TableHeading>
                    <TableHeader>Mã sách</TableHeader>
                    <TableHeader>Tên sách</TableHeader>
                    <TableHeader>Giá sách</TableHeader>
                    <TableHeader>Nhà xuất bản</TableHeader>
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
                    {randomBooks.map((book, index) => {
                        const randomBool = faker.datatype.boolean();
                        const randomBook = faker.datatype.number({
                            min: 0,
                            max: randomBooks.length - 1,
                        });
                        const fakeBook: IBookResponse = {
                            id: index,
                            code: `B${faker.datatype.number({
                                min: 10000,
                                max: 99999,
                            })}`,

                            publisher: {
                                name: faker.company.name(),
                            },
                            isbn10: faker.datatype
                                .number({
                                    min: 1000000000,
                                    max: 9999999999,
                                })
                                .toString(),
                            isbn13: faker.datatype
                                .number({
                                    min: 1000000000000,
                                    max: 9999999999999,
                                })
                                .toString(),
                            releasedYear: faker.datatype.number({
                                min: 2010,
                                max: 2022,
                            }),
                        };
                        return (
                            <tr key={index}>
                                <TableData className="text-sm font-medium uppercase text-gray-500">
                                    {fakeBook.code}
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
                                                src={getAvatarFromName(fakeBook.publisher?.name)}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm text-gray-900">
                                                {fakeBook.publisher?.name}
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData className="text-sm text-gray-500">
                                    {fakeBook.isbn10}
                                </TableData>

                                <TableData className="text-sm text-gray-500">
                                    {fakeBook.isbn13}
                                </TableData>
                                <TableData className="text-sm text-gray-500">
                                    {faker.name.fullName()}
                                </TableData>
                                <TableData
                                    textAlignment="text-center"
                                    className="text-sm text-gray-500"
                                >
                                    {fakeBook.releasedYear}
                                </TableData>
                                <TableData textAlignment="text-center">
                                    {randomBool ? (
                                        <span
                                            className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
                      Hoạt động
                    </span>
                                    ) : (
                                        <span
                                            className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold uppercase leading-5 text-red-800">
                      Bị vô hiệu hóa
                    </span>
                                    )}
                                </TableData>
                                <TableData className="text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900">
                                        Chi tiết
                                    </button>
                                </TableData>
                            </tr>
                        );
                    })}
                </TableBody>
            </TableWrapper>
        </Fragment>
    );
};
IssuerBooksPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerBooksPage;
