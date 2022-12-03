import React, { Fragment, ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import { faker } from "@faker-js/faker/locale/vi";
import { ImBoxAdd, ImTruck } from "react-icons/im";
import Image from "next/image";
import { vi } from "date-fns/locale";
import { format } from "date-fns";

const AdminOrdersPage: NextPageWithLayout = () => {
  return (
    <Fragment>
      <PageHeading label="Đơn hàng"></PageHeading>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Mã đơn hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Khách hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Ngày đặt hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Địa chỉ giao hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Tổng tiền
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Loại đơn hàng
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Trạng thái
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {new Array(8).fill(1).map((person, index) => {
                    const randomBool = faker.datatype.boolean();
                    return (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium uppercase text-blue-500">
                          {faker.datatype.uuid()}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
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
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {format(
                            faker.date.between(
                              "2022-01-01T00:00:00.000Z",
                              new Date()
                            ),
                            "eeee, dd/MM/yyyy",
                            { locale: vi }
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {randomBool ? faker.address.cityName() : "Hội sách"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-emerald-600">
                          {faker.finance.amount(10, 100, 2, "$")}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
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
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase leading-5 text-green-800">
                            {randomBool ? "Đã giao" : "Đã nhận"}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <a
                            href="#"
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Chi tiết
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

AdminOrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminOrdersPage;
