import React, {Fragment, ReactElement, useState} from "react";
import {NextPageWithLayout} from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import Image from "next/image";
import {faker} from "@faker-js/faker/locale/vi";
import SearchForm from "../../../components/Admin/SearchForm";
import TableData from "../../../components/Admin/Table/TableData";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import Medal, {MedalTypes} from "../../../components/Medal";
import CustomerModal, {
    CustomerModalMode,
} from "../../../components/Modal/CustomerModal";

export const customerLevels = [
    {
        id: 1,
        name: "Đồng",
        requiredPoint: 0,
        medal: MedalTypes.BRONZE,
    },
    {
        id: 2,
        name: "Bạc",
        requiredPoint: 100,
        medal: MedalTypes.SILVER,
    },
    {
        id: 3,
        name: "Vàng",
        requiredPoint: 200,
        medal: MedalTypes.GOLD,
    },
    {
        id: 4,
        name: "Kim cương",
        requiredPoint: 300,
        medal: MedalTypes.DIAMOND,
    },
];

export interface IFakeCustomer {
    id?: number;
    code?: string;
    name?: string;
    email?: string;
    address?: string;
    phone?: string;
    status?: boolean;
    imageUrl?: string;
}

const AdminCustomersPage: NextPageWithLayout = () => {
    const [selectedCustomer, setSelectedCustomer] = useState<IFakeCustomer>();
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    return (
        <Fragment>
            <PageHeading label="Khách hàng">
                <SearchForm/>
            </PageHeading>
            <TableWrapper>
                <TableHeading>
                    <TableHeader>Mã số</TableHeader>
                    <TableHeader>Tên khách hàng</TableHeader>
                    <TableHeader>Địa chỉ & Điện thoại</TableHeader>
                    <TableHeader textAlignment="text-center">Cấp độ</TableHeader>
                    <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
                    <TableHeader>
                        <span className="sr-only">Edit</span>
                    </TableHeader>
                </TableHeading>
                <tbody className="divide-y divide-gray-200 bg-white">
                {new Array(8).fill(1).map((_, index) => {
                    const randomLevelIndex = faker.datatype.number({
                        min: 0,
                        max: customerLevels.length - 1,
                    });
                    const randomLevel = customerLevels[randomLevelIndex];
                    const fakeCustomer: IFakeCustomer = {
                        id: index,
                        code: `C${faker.datatype.number()}`,
                        imageUrl: faker.image.avatar(),
                        name: faker.name.fullName(),
                        email: faker.internet.email(),
                        address: faker.address.cityName(),
                        phone: faker.phone.number(),
                        status: faker.datatype.boolean(),
                    };
                    return (
                        <tr key={index}>
                            <TableData className="text-sm font-medium uppercase text-gray-500">
                                {fakeCustomer.code}
                            </TableData>
                            <TableData>
                                <div className="flex items-center">
                                    <div className="h-10 w-10 flex-shrink-0">
                                        <Image
                                            width={100}
                                            height={100}
                                            className="h-10 w-10 rounded-full"
                                            src={fakeCustomer.imageUrl || ""}
                                            alt=""
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {fakeCustomer.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {fakeCustomer.email}
                                        </div>
                                    </div>
                                </div>
                            </TableData>
                            <TableData>
                                <div className="text-sm text-gray-900">
                                    {fakeCustomer.address}
                                </div>
                                <div className="text-sm text-gray-500">
                                    {fakeCustomer.phone}
                                </div>
                            </TableData>
                            <TableData textAlignment="text-center">
                                <Medal medalType={randomLevel.medal}/>
                                <div className="text-sm font-medium capitalize text-gray-900">
                                    {randomLevel.name}
                                </div>
                            </TableData>
                            <TableData textAlignment="text-center">
                                {fakeCustomer.status ? (
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
                                <button
                                    onClick={() => {
                                        setSelectedCustomer(fakeCustomer);
                                        setShowUpdateModal(true);
                                    }}
                                    className="text-indigo-600 hover:text-indigo-900">
                                    Chỉnh sửa
                                </button>
                            </TableData>
                        </tr>
                    );
                })}
                </tbody>
            </TableWrapper>
            <CustomerModal
                maxWidth='max-w-2xl'
                action={CustomerModalMode.UPDATE}
                customer={selectedCustomer}
                onClose={() => {
                    setShowUpdateModal(false);
                    setSelectedCustomer(undefined);
                }}
                isOpen={showUpdateModal}/>
        </Fragment>
    );
};
AdminCustomersPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCustomersPage;
