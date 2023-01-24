import React, {Fragment, ReactElement, useState} from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../_app";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import {faker} from "@faker-js/faker/locale/vi";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import TableBody from "../../../components/Admin/Table/TableBody";
import {IBookResponse} from "../../../old-types/response/IBookResponse";
import {getAvatarFromName} from "../../../utils/helper";
import {IBook} from "../../../types/Book/IBook";

export const randomBooks: IBook[] = [
    {
        code: 'B0001',
        id: 1,
        name: "Có Hai Con Mèo Ngồi Bên Cửa Sổ",
        imageUrl:
            "https://salt.tikicdn.com/cache/w1200/ts/product/8a/c3/a9/733444596bdb38042ee6c28634624ee5.jpg",
        fullPdfAndAudio: true,
        onlyPdf: false,
        onlyAudio: false,

    },
    {
        code: 'B0002',
        id: 2,
        name: "Thao Túng Tâm Lý",
        imageUrl:
            "https://salt.tikicdn.com/cache/w1200/ts/product/90/49/97/ec88ab408c1997378344486c94dbac40.jpg",
        fullPdfAndAudio: false,
        onlyPdf: true,
        onlyAudio: false,
    },
    {
        code: 'B0003',
        id: 3,
        name: "Cây Cam Ngọt Của Tôi",
        imageUrl:
            "https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg",
        fullPdfAndAudio: false,
        onlyPdf: false,
        onlyAudio: true,
    },
    {
        code: 'B0004',
        id: 4,
        name: "Rừng Nauy (Tái Bản)",
        imageUrl:
            "https://salt.tikicdn.com/ts/product/9a/84/8f/8c3eda2d15fa1ae7a0e13762a0cfa74e.jpg",
        fullPdfAndAudio: true,
        onlyPdf: false,
        onlyAudio: false,
    },
    {
        code: 'B0005',
        id: 5,
        name: "THÀNH NGỮ TỤC NGỮ VIỆT NAM",
        imageUrl:
            "http://static.nhanam.com.vn/thumb/0x320/crop/Books/Images/2022/11/15/LBC828K4.jpg",
        fullPdfAndAudio: false,
        onlyPdf: false,
        onlyAudio: true,
    },
    {
        code: 'B0006',
        id: 6,
        name: "Những Tù Nhân Của Địa Lý",
        imageUrl:
            "https://salt.tikicdn.com/cache/w1200/ts/product/8d/96/9e/c0c1f23db756d50b1944dff9c3988753.jpg",
        fullPdfAndAudio: false,
        onlyPdf: true,
        onlyAudio: false,
    },
];


export const fakeBookSeries = [
    {
        id: 1,
        name: "Trọn bộ Conan: Thám tử lừng danh",
        books: randomBooks,
        publisher: "Nhã Nam",
        imageUrl: 'https://image.voso.vn/users/vosoimage/images/305b028147ce40389ff2969191739421?t%5B0%5D=compress%3Alevel%3D100&accessToken=d6fc14d8bc82dd6ed3b09189e0e7e5d69e0d56fac3cb389b3cba9b40476dbdfe',
        description: 'Thám tử lừng danh Conan là một series manga trinh thám được sáng tác bởi Aoyama Gōshō. Tác phẩm được đăng tải trên tạp chí Weekly Shōnen Sunday của nhà xuất bản Shogakukan vào năm 1994 và được đóng gói thành 102 tập tankōbon tính đến tháng 9 năm 2022.',
        fullPdfAndAudio: true,
        onlyPdf: false,
        onlyAudio: false,
    }, {
        id: 2,
        name: "Trọn bộ Doraemon: Chú mèo máy đến từ tương lai",
        books: randomBooks,
        publisher: "Kim Đồng",
        imageUrl: 'https://cf.shopee.vn/file/b3a40a77ed93383a6a4fff29d83efe55',
        description: 'Daichōhen Doraemon là xê-ri manga khoa học viễn tưởng về Doraemon do họa sĩ Fujiko Fujio sáng tác. Xê-ri này được viết dựa trên các tác phẩm điện ảnh cùng tên phát hành hằng năm tại rạp từ 1980 và được đăng trên tạp chí CoroCoro Comic trước khi phim ra mắt.',
        fullPdfAndAudio: false,
        onlyPdf: true,
        onlyAudio: false,
    }, {
        id: 3,
        name: "Trọn bộ One Piece: Hành trình của Monkey D. Luffy",
        books: randomBooks,
        publisher: "Kim Đồng",
        imageUrl: 'https://vn-test-11.slatic.net/p/97755a6cb2ccab2842893cd4bf7c1af5.jpg',
        description: 'One Piece là một bộ truyện tranh hành động, phiêu lưu, hài hước, khoa học viễn tưởng do Eiichiro Oda sáng tác. Bộ truyện được đăng trên tạp chí Weekly Shōnen Jump từ năm 1997 và đã được chuyển thể thành anime, phim hoạt hình, phim truyền hình, phim điện ảnh, game điện tử, game điện thoại, game trên máy tính và nhiều sản phẩm khác.',
        fullPdfAndAudio: false,
        onlyPdf: false,
        onlyAudio: false,
    }
];


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
                    <TableHeader>Nhà xuất bản</TableHeader>
                    <TableHeader>ISBN10</TableHeader>
                    <TableHeader>ISBN13</TableHeader>
                    <TableHeader>Tác giả</TableHeader>
                    <TableHeader>Năm phát hành</TableHeader>
                    <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
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
                            </tr>
                        );
                    })}
                </TableBody>
            </TableWrapper>
        </Fragment>
    );
};
AdminBooksPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminBooksPage;
