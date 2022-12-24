import React, { Fragment, ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import Image from "next/image";
import { faker } from "@faker-js/faker/locale/vi";
import SearchForm from "../../../components/Admin/SearchForm";
import TableData from "../../../components/Admin/Table/TableData";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";

const IssuerCustomersPage: NextPageWithLayout = () => {
  return (
    <Fragment>
      <PageHeading label="Khách hàng">
        <SearchForm />
      </PageHeading>
      <TableWrapper>
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Tên khách hàng
            </th>
            <th
              scope="col"
              className="px-6 py-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Địa chỉ & Điện thoại
            </th>
            <th
              scope="col"
              className="px-6 py-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Tổ chức
            </th>
            <th
              scope="col"
              className="px-6 py-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Số đơn hàng
            </th>
            <th
              scope="col"
              className="px-6 py-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Tổng chi
            </th>
            <th
              scope="col"
              className="px-6 py-6 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Trạng thái
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {new Array(8).fill(1).map((person, index) => (
            <tr key={index}>
              <TableData>
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <Image
                      width={100}
                      height={100}
                      className="h-10 w-10 rounded-full"
                      src={faker.image.avatar()}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {faker.name.fullName()}
                    </div>
                    <div className="text-sm text-gray-500">
                      {faker.internet.email()}
                    </div>
                  </div>
                </div>
              </TableData>
              <TableData>
                <div className="text-sm text-gray-900">
                  {faker.address.cityName()}
                </div>
                <div className="text-sm text-gray-500">
                  {faker.phone.number()}
                </div>
              </TableData>
              <TableData className="text-sm text-gray-500">
                {faker.company.name()}
              </TableData>
              <TableData className="text-sm text-gray-500">
                {faker.random.numeric()}
              </TableData>
              <TableData className="text-sm font-semibold text-emerald-600">
                {faker.finance.amount(5, 100, 2, "$")}
              </TableData>
              <TableData>
                {faker.datatype.boolean() ? (
                  <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
                    Hoạt động
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold uppercase leading-5 text-red-800">
                    Bị vô hiệu hóa
                  </span>
                )}
              </TableData>
              {/* <TableData className="text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900">
                  Chỉnh sửa
                </a>
              </TableData> */}
            </tr>
          ))}
        </tbody>
      </TableWrapper>
    </Fragment>
  );
};

IssuerCustomersPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerCustomersPage;
