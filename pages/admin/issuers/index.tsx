import React, { Fragment, ReactElement, useState } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import { faker } from "@faker-js/faker/locale/vi";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import TableBody from "../../../components/Admin/Table/TableBody";
import IssuerModal, {
  IssuerModalMode,
} from "../../../components/Modal/IssuerModal";

export interface IFakeIssuer {
  id?: number;
  code?: string;
  name?: string;
  email?: string;
  imageUrl?: string;
  phone?: string;
  address?: string;
  status?: boolean;
  taxCode?: string;
}

const AdminIssuersPage: NextPageWithLayout = () => {
  const [selectedIssuer, setSelectedIssuer] = useState<IFakeIssuer>();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  return (
    <Fragment>
      <PageHeading label="Nhà phát hành">
        <SearchForm />
        <CreateButton
          onClick={() => setShowCreateModal(true)}
          label="Thêm nhà phát hành"
        />
      </PageHeading>

      <TableWrapper>
        <TableHeading>
          <TableHeader>Mã số</TableHeader>
          <TableHeader>Tên nhà phát hành</TableHeader>
          <TableHeader>Địa chỉ & Điện thoại</TableHeader>
          <TableHeader>Mã số thuế</TableHeader>
          <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
          <TableHeader>
            <span className="sr-only">Edit</span>
          </TableHeader>
        </TableHeading>
        <TableBody>
          {new Array(8).fill(1).map((_, index) => {
            const randomBool = faker.datatype.boolean();
            const fakeIssuer: IFakeIssuer = {
              id: index,
              code: `I${faker.datatype.number({
                min: 10000,
                max: 99999,
              })}`,
              imageUrl: faker.image.avatar(),
              name: faker.name.fullName(),
              email: faker.internet.email(),
              address: faker.address.cityName(),
              phone: faker.phone.number(),
              taxCode: faker.datatype
                .number({
                  min: 1000000000,
                  max: 9999999999,
                })
                .toString(),
              status: randomBool,
            };
            return (
              <tr key={index}>
                <TableData className="text-sm font-medium uppercase text-gray-500">
                  {fakeIssuer.code}
                </TableData>
                <TableData>
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        width={100}
                        height={100}
                        className="h-10 w-10 rounded-full"
                        src={fakeIssuer?.imageUrl || ""}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {fakeIssuer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fakeIssuer.email}
                      </div>
                    </div>
                  </div>
                </TableData>
                <TableData>
                  <div className="text-sm text-gray-900">
                    {fakeIssuer.address}
                  </div>
                  <div className="text-sm text-gray-500">
                    {fakeIssuer.phone}
                  </div>
                </TableData>

                <TableData>
                  <span className="text-sm font-medium uppercase text-gray-500">
                    {fakeIssuer.taxCode}
                  </span>
                </TableData>
                <TableData textAlignment="text-center">
                  {fakeIssuer.status ? (
                    <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
                      Hoạt động
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold uppercase leading-5 text-red-800">
                      Bị vô hiệu hóa
                    </span>
                  )}
                </TableData>
                <TableData className="text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedIssuer(fakeIssuer);
                      setShowUpdateModal(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Chỉnh sửa
                  </button>
                </TableData>
              </tr>
            );
          })}
        </TableBody>
      </TableWrapper>

      <IssuerModal
        maxWidth="max-w-2xl"
        action={IssuerModalMode.CREATE}
        onClose={() => setShowCreateModal(false)}
        isOpen={showCreateModal}
      />

      <IssuerModal
        maxWidth="max-w-2xl"
        action={IssuerModalMode.UPDATE}
        issuer={selectedIssuer}
        onClose={() => setShowUpdateModal(false)}
        isOpen={showUpdateModal}
      />
    </Fragment>
  );
};
AdminIssuersPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminIssuersPage;
