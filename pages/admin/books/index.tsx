import React, {Fragment, ReactElement, useState} from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../_app";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import {faker} from "@faker-js/faker/locale/vi";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import TableBody from "../../../components/Admin/Table/TableBody";
import IssuerModal, {
    IssuerModalMode,
} from "../../../components/Modal/IssuerModal";
import {IBookResponse} from "../../../types/response/IBookResponse";

export const randomBooks = [
    {
        id: 1,
        name: "Có Hai Con Mèo Ngồi Bên Cửa Sổ",
        imageUrl: "https://salt.tikicdn.com/cache/w1200/ts/product/8a/c3/a9/733444596bdb38042ee6c28634624ee5.jpg",
    }, {
        id: 2,
        name: "Thao Túng Tâm Lý",
        imageUrl: "https://salt.tikicdn.com/cache/w1200/ts/product/90/49/97/ec88ab408c1997378344486c94dbac40.jpg",
    }, {
        id: 3,
        name: "Cây Cam Ngọt Của Tôi",
        imageUrl: "https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg",
    }
]

const AdminBooksPage: NextPageWithLayout = () => {
        const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
        const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

        return (
            <Fragment>
                <PageHeading label="Kho sách">
                    <SearchForm/>
                </PageHeading>

                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Mã sách</TableHeader>
                        <TableHeader>Tên sách</TableHeader>
                        <TableHeader>Giá sách</TableHeader>
                        <TableHeader>Nhà phát hành</TableHeader>
                        <TableHeader>ISBN10</TableHeader>
                        <TableHeader>ISBN13</TableHeader>
                        <TableHeader>Năm phát hành</TableHeader>
                        <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
                    </TableHeading>
                    <TableBody>
                        {new Array(8).fill(1).map((_, index) => {
                            const randomBool = faker.datatype.boolean();
                            const randomBook = faker.datatype.number({min: 0, max: randomBooks.length - 1});
                            const fakeBook: IBookResponse = {

                                id: index,
                                code: `B${faker.datatype.number({
                                    min: 10000,
                                    max: 99999,
                                })}`,
                                imageUrl: faker.image.avatar(),
                                name: faker.name.fullName(),
                                isbn10: faker.datatype.number({
                                    min: 1000000000,
                                    max: 9999999999,
                                }).toString(),
                                isbn13: faker.datatype.number({
                                    min: 1000000000000,
                                    max: 9999999999999,
                                }).toString(),
                                releasedYear: faker.datatype.number({
                                        min: 2010,
                                        max: 2022,
                                    }
                                ),
                            };
                            return (
                                <tr key={index}>
                                    <TableData className="text-sm font-medium uppercase text-gray-500">
                                        {fakeBook.code}
                                    </TableData>
                                    <TableData>
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <Image
                                                    width={120}
                                                    height={160}
                                                    className=" rounded"
                                                    src={randomBooks[randomBook].imageUrl}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {randomBooks[randomBook].name}
                                                </div>
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
                                                    src={fakeBook?.imageUrl || ""}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {fakeBook.name}
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
                                    <TableData textAlignment="text-center" className="text-sm text-gray-500">
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
                                </tr>
                            );
                        })}
                    </TableBody>
                </TableWrapper>

            </Fragment>
        );
    }
;
AdminBooksPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminBooksPage;
