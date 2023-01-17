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
import { faker } from "@faker-js/faker/locale/vi";
import { Tab } from "@headlessui/react";
import Chip from "../../../components/Admin/Chip";
import {
  BsFillBriefcaseFill,
  BsListUl,
  BsShieldFillCheck,
} from "react-icons/bs";
import CreateButton from "../../../components/Admin/CreateButton";
import TableBody from "../../../components/Admin/Table/TableBody";
import PersonnelModal, {
  PersonnelModalMode,
} from "../../../components/Modal/PersonnelModal";

const PersonnelTabs = [
  {
    id: 1,
    name: "Tất cả",
    icon: <BsListUl />,
  },
  {
    id: 2,
    name: "Quản trị viên",
    icon: <BsShieldFillCheck />,
  },
  {
    id: 3,
    name: "Nhân viên",
    icon: <BsFillBriefcaseFill />,
  },
];

export interface IFakePersonnel {
  id?: number;
  code?: string;
  name?: string;
  email?: string;
  imageUrl?: string;
  phone?: string;
  address?: string;
  status?: boolean;
  role?: number;
}

const AdminPersonnelsPage: NextPageWithLayout = () => {
  const [selectedPersonnel, setSelectedPersonnel] = useState<IFakePersonnel>();
  const [selectedTab, setSelectedTab] = useState(PersonnelTabs[0].id);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

  return (
    <Fragment>
      <PageHeading label="Nhân sự">
        <SearchForm />
        <CreateButton
          onClick={() => setShowCreateModal(true)}
          label="Thêm nhân sự"
        />
      </PageHeading>
      <Tab.Group>
        <div className="mb-5">
          <ul className="flex flex-wrap gap-2">
            {PersonnelTabs.map((tab) => (
              <Tab
                onClick={() => setSelectedTab(tab.id)}
                as={"div"}
                className={"focus:outline-none"}
                key={tab.name}
              >
                {({ selected }) => {
                  return (
                    <Chip active={selected}>
                      <div
                        className="flex
                                                items-center gap-2
                                                 px-1.5 py-1"
                      >
                        {tab?.icon}
                        {tab.name}
                      </div>
                    </Chip>
                  );
                }}
              </Tab>
            ))}
          </ul>
        </div>
      </Tab.Group>

      <TableWrapper>
        <TableHeading>
          <TableHeader>Mã số</TableHeader>
          <TableHeader>Tên nhân sự</TableHeader>
          <TableHeader>Địa chỉ & Điện thoại</TableHeader>
          <TableHeader textAlignment="text-center">Vai trò</TableHeader>
          <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
          <TableHeader>
            <span className="sr-only">Edit</span>
          </TableHeader>
        </TableHeading>
        <TableBody>
          {new Array(8).fill(1).map((person, index) => {
            const randomBool = faker.datatype.boolean();
            const randomRole = faker.datatype.boolean();
            const fakePersonnel: IFakePersonnel = {
              id: index,
              code: `${
                selectedTab === 1
                  ? randomBool
                    ? "A"
                    : "S"
                  : selectedTab === 2
                  ? "A"
                  : "S"
              }${faker.datatype.number({
                min: 10000,
                max: 99999,
              })}`,
              imageUrl: faker.image.avatar(),
              name: faker.name.fullName(),
              email: faker.internet.email(),
              address: faker.address.cityName(),
              phone: faker.phone.number(),
              role: randomRole ? 1 : 2,
              status: randomBool,
            };
            return (
              <tr key={index}>
                <TableData className="text-sm font-medium uppercase text-gray-500">
                  {fakePersonnel.code}
                </TableData>
                <TableData>
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        width={100}
                        height={100}
                        className="h-10 w-10 rounded-full"
                        src={fakePersonnel.imageUrl || ""}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {fakePersonnel.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {fakePersonnel.email}
                      </div>
                    </div>
                  </div>
                </TableData>
                <TableData>
                  <div className="text-sm text-gray-900">
                    {fakePersonnel.address}
                  </div>
                  <div className="text-sm text-gray-500">
                    {fakePersonnel.phone}
                  </div>
                </TableData>

                <TableData textAlignment="text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase leading-5 text-slate-600">
                    {selectedTab === 1 ? (
                      randomRole ? (
                        <BsShieldFillCheck />
                      ) : (
                        <BsFillBriefcaseFill />
                      )
                    ) : selectedTab === 2 ? (
                      <BsShieldFillCheck />
                    ) : (
                      <BsFillBriefcaseFill />
                    )}
                    {selectedTab === 1
                      ? randomRole
                        ? "Quản trị viên"
                        : "Nhân viên"
                      : selectedTab === 2
                      ? "Quản trị viên"
                      : "Nhân viên"}
                  </span>
                </TableData>
                <TableData textAlignment="text-center">
                  {fakePersonnel.status ? (
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
                      setSelectedPersonnel(fakePersonnel);
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
      <PersonnelModal
        maxWidth="max-w-2xl"
        action={PersonnelModalMode.CREATE}
        onClose={() => setShowCreateModal(false)}
        isOpen={showCreateModal}
      />

      <PersonnelModal
        maxWidth="max-w-2xl"
        action={PersonnelModalMode.UPDATE}
        personnel={selectedPersonnel}
        onClose={() => {
          setShowUpdateModal(false);
          setSelectedPersonnel(undefined);
        }}
        isOpen={showUpdateModal}
      />
    </Fragment>
  );
};
AdminPersonnelsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminPersonnelsPage;
