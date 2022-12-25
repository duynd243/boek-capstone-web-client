import React, { Fragment, ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import { faker } from "@faker-js/faker/locale/vi";
import { ImBoxAdd, ImTruck } from "react-icons/im";
import Image from "next/image";
import { vi } from "date-fns/locale";
import { format } from "date-fns";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableData from "../../../components/Admin/Table/TableData";

const IssuerOrdersPage: NextPageWithLayout = () => {
  return (
    <Fragment>
      <PageHeading label="Đơn hàng"></PageHeading>
      <TableWrapper>
        <TableHeading>
          <TableHeader>Mã đơn hàng</TableHeader>
          <TableHeader>Khách hàng</TableHeader>
          <TableHeader>Ngày đặt hàng</TableHeader>
          <TableHeader>Địa chỉ giao hàng</TableHeader>
          <TableHeader>Tổng tiền</TableHeader>
          <TableHeader>Loại đơn hàng</TableHeader>
          <TableHeader>Trạng thái</TableHeader>
          <TableHeader>
            <span className="sr-only">Edit</span>
          </TableHeader>
        </TableHeading>
        <TableBody>
          {new Array(8).fill(1).map((person, index) => {
            const randomBool = faker.datatype.boolean();
            return (
              <tr key={index}>
                <TableData className="text-sm font-medium uppercase text-blue-500">
                  {faker.datatype.uuid()}
                </TableData>
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
                <TableData className="text-sm text-gray-500">
                  {format(
                    faker.date.between("2022-01-01T00:00:00.000Z", new Date()),
                    "eeee, dd/MM/yyyy",
                    { locale: vi }
                  )}
                </TableData>

                <TableData className="text-sm text-gray-500">
                  {randomBool ? faker.address.cityName() : "Hội sách"}
                </TableData>
                <TableData className="text-sm font-semibold text-emerald-600">
                  {faker.finance.amount(10, 100, 2, "$")}
                </TableData>
                <TableData>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase leading-5 text-slate-600">
                    {randomBool ? (
                      <>
                        <ImTruck />
                        Giao hàng
                      </>
                    ) : (
                      <>
                        <ImBoxAdd />
                        Nhận tại hội sách
                      </>
                    )}
                  </span>
                </TableData>
                <TableData>
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase leading-5 text-green-800">
                    {randomBool ? "Đã giao" : "Đã nhận"}
                  </span>
                </TableData>
                <TableData className="text-right text-sm font-medium">
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Chi tiết
                  </a>
                </TableData>
              </tr>
            );
          })}
        </TableBody>
      </TableWrapper>
    </Fragment>
  );
};

IssuerOrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerOrdersPage;
