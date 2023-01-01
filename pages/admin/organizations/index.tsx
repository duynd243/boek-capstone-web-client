import React, { Fragment, ReactElement, useState } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import { getAvatarFromName } from "../../../utils/helper";
import { faker } from "@faker-js/faker/locale/vi";
import OrganizationModal, {
  OrganizationModalMode,
} from "../../../components/Modal/OrganizationModal";

export interface IFakeOrganization {
  id?: number;
  code?: string;
  name?: string;
  address?: string;
  phone?: string;
  imageUrl?: string;
}

const AdminOrganizationsPage: NextPageWithLayout = () => {
  const [selectedOrg, setSelectedOrg] = useState<IFakeOrganization>();
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  return (
    <Fragment>
      <PageHeading label="Tổ chức">
        <SearchForm defaultValue={""} />
        <CreateButton
          onClick={() => setShowCreateModal(true)}
          label="Thêm tổ chức"
        />
      </PageHeading>
      <TableWrapper>
        <TableHeading>
          <TableHeader>Mã số</TableHeader>
          <TableHeader>Tên tổ chức</TableHeader>
          <TableHeader>Địa chỉ & Điện thoại</TableHeader>
          <TableHeader>
            <span className="sr-only">Actions</span>
          </TableHeader>
        </TableHeading>
        <TableBody>
          {new Array(8).fill(1).map((_, index) => {
            const fakeOrg: IFakeOrganization = {
              id: index,
              code: `O${faker.datatype.number()}`,
              name: faker.company.name(),
              address: faker.address.streetAddress(),
              imageUrl: faker.image.avatar(),
              phone: faker.phone.number(),
            };
            return (
              <tr key={faker.datatype.uuid()}>
                <TableData className="text-sm font-medium uppercase text-gray-500">
                  O{faker.datatype.number()}
                </TableData>
                <TableData>
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        width={100}
                        height={100}
                        className="h-10 w-10 rounded-full"
                        src={
                          fakeOrg.imageUrl || getAvatarFromName(fakeOrg.name)
                        }
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {fakeOrg.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {faker.company.companySuffix()}
                      </div>
                    </div>
                  </div>
                </TableData>
                <TableData>
                  <div className="text-sm text-gray-900">{fakeOrg.address}</div>
                  <div className="text-sm text-gray-500">{fakeOrg.phone}</div>
                </TableData>
                <TableData className="text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedOrg(fakeOrg);
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

      <OrganizationModal
        action={OrganizationModalMode.CREATE}
        onClose={() => setShowCreateModal(false)}
        isOpen={showCreateModal}
      />

      <OrganizationModal
        action={OrganizationModalMode.UPDATE}
        organization={selectedOrg}
        onClose={() => setShowUpdateModal(false)}
        isOpen={showUpdateModal}
      />
    </Fragment>
  );
};
AdminOrganizationsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminOrganizationsPage;
