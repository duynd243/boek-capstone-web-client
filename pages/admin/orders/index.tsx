import React, { Fragment, ReactElement, useState } from "react";
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
import { Dialog, Transition } from "@headlessui/react";
import { HiXMark } from "react-icons/hi2";

const AdminOrdersPage: NextPageWithLayout = () => {
  const [showDetails, setShowDetails] = useState(false);
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
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(faker.datatype.number())}
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
                  <button
                    onClick={() => setShowDetails(true)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Chi tiết
                  </button>
                </TableData>
              </tr>
            );
          })}
        </TableBody>
      </TableWrapper>

      <Transition.Root show={showDetails} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setShowDetails(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-60 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto relative w-screen max-w-md">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 left-0 -ml-8 flex pt-4 pr-2 sm:-ml-10 sm:pr-4">
                        <button
                          type="button"
                          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setShowDetails(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <HiXMark className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                      <div className="py-8 px-4 lg:px-8 2xl:px-12">
                        <div className="mx-auto max-w-sm lg:max-w-none">
                          <h2 className="mb-6 text-2xl font-bold text-slate-800">
                            Chi tiết đơn hàng
                          </h2>
                          <div className="space-y-6">
                            {/* Order Details */}
                            <div>
                              <div className="mb-2 font-semibold text-slate-800">
                                Danh sách sản phẩm
                              </div>
                              {/* Cart items */}
                              <ul>
                                {/* Cart item */}
                                <li className="flex items-center border-b border-slate-200 py-3">
                                  <a
                                    className="mr-2 block shrink-0 xl:mr-4"
                                    href="#0"
                                  >
                                    <Image
                                      className="h-20 w-16 object-cover xl:h-24 xl:w-20"
                                      src={
                                        "https://salt.tikicdn.com/cache/w1200/ts/product/8a/c3/a9/733444596bdb38042ee6c28634624ee5.jpg"
                                      }
                                      width="1000"
                                      height="1000"
                                      alt="Product 01"
                                    />
                                  </a>
                                  <div className="grow">
                                    <a href="#0">
                                      <h4 className="text-sm font-medium leading-tight text-slate-800">
                                        Có Hai Con Mèo Ngồi Bên Cửa Sổ
                                      </h4>
                                    </a>
                                  </div>
                                  <div className="ml-2 text-sm font-medium text-slate-800">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(faker.datatype.number())}
                                  </div>
                                </li>
                                {/* Cart item */}
                                <li className="flex items-center border-b border-slate-200 py-3">
                                  <a
                                    className="mr-2 block shrink-0 xl:mr-4"
                                    href="#0"
                                  >
                                    <Image
                                      className="h-20 w-16 object-cover xl:h-24 xl:w-20"
                                      src={
                                        "https://salt.tikicdn.com/cache/w1200/ts/product/90/49/97/ec88ab408c1997378344486c94dbac40.jpg"
                                      }
                                      width="200"
                                      height="142"
                                      alt="Product 02"
                                    />
                                  </a>
                                  <div className="grow">
                                    <a href="#0">
                                      <h4 className="text-sm font-medium leading-tight text-slate-800">
                                        Thao Túng Tâm Lý
                                      </h4>
                                    </a>
                                  </div>
                                  <div className="ml-2 text-sm font-medium text-slate-800">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(faker.datatype.number())}
                                  </div>
                                </li>
                                {/* Cart item */}
                                <li className="flex items-center border-b border-slate-200 py-3">
                                  <a
                                    className="mr-2 block shrink-0 xl:mr-4"
                                    href="#0"
                                  >
                                    <Image
                                      className="h-20 w-16 object-cover xl:h-24 xl:w-20"
                                      src={
                                        "https://salt.tikicdn.com/cache/w1200/ts/product/5e/18/24/2a6154ba08df6ce6161c13f4303fa19e.jpg"
                                      }
                                      width="200"
                                      height="142"
                                      alt="Product 03"
                                    />
                                  </a>
                                  <div className="grow">
                                    <a href="#0">
                                      <h4 className="text-sm font-medium leading-tight text-slate-800">
                                        Cây Cam Ngọt Của Tôi
                                      </h4>
                                    </a>
                                  </div>
                                  <div className="ml-2 text-sm font-medium text-slate-800">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(faker.datatype.number())}
                                  </div>
                                </li>
                              </ul>
                              {/* Fees, discount and total */}
                              <ul>
                                <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                  <div className="text-sm">Tổng cộng</div>
                                  <div className="ml-2 text-sm font-medium text-slate-800">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(205000)}
                                  </div>
                                </li>
                                <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                  <div className="text-sm">Phí vận chuyển</div>
                                  <div className="ml-2 text-sm font-medium text-slate-800">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(14000)}
                                  </div>
                                </li>
                                <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                  <div className="flex items-center">
                                    <span className="mr-2 text-sm">
                                      Giảm giá
                                    </span>
                                    <span className="inline-flex whitespace-nowrap rounded-full bg-slate-200 px-2.5 py-1 text-center text-xs font-medium uppercase text-slate-500">
                                      Gói Tiết Kiệm
                                    </span>
                                  </div>
                                  <div className="ml-2 text-sm font-medium text-slate-800">
                                    -
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(30000)}
                                  </div>
                                </li>
                                <li className="flex items-center justify-between border-b border-slate-200 py-3">
                                  <div className="font-medium">Thành tiền</div>
                                  <div className="ml-2 font-medium text-emerald-600">
                                    {new Intl.NumberFormat("vi-VN", {
                                      style: "currency",
                                      currency: "VND",
                                    }).format(189000)}
                                  </div>
                                </li>
                              </ul>
                            </div>

                            {/* Payment Details */}
                            <div>
                              <div className="mb-4 font-semibold text-slate-800">
                                Phương thức thanh toán
                              </div>
                              <div className="rounded border border-slate-200 p-3 text-sm">
                                <div className="flex items-center justify-between space-x-2">
                                  {/* CC details */}
                                  <div className="flex items-center">
                                    {/* Mastercard icon */}
                                    {/*<svg className="shrink-0 mr-3" width="32"*/}
                                    {/*     height="24"*/}
                                    {/*     xmlns="http://www.w3.org/2000/svg">*/}
                                    {/*    <rect fill="#1E293B" width="32" height="24"*/}
                                    {/*          rx="3"/>*/}
                                    {/*    <ellipse fill="#E61C24" cx="12.522" cy="12"*/}
                                    {/*             rx="5.565" ry="5.647"/>*/}
                                    {/*    <ellipse fill="#F99F1B" cx="19.432" cy="12"*/}
                                    {/*             rx="5.565" ry="5.647"/>*/}
                                    {/*    <path*/}
                                    {/*        d="M15.977 7.578A5.667 5.667 0 0 0 13.867 12c0 1.724.777 3.353 2.11 4.422A5.667 5.667 0 0 0 18.087 12a5.667 5.667 0 0 0-2.11-4.422Z"*/}
                                    {/*        fill="#F26622"*/}
                                    {/*    />*/}
                                    {/*</svg>*/}
                                    <Image
                                      width={1000}
                                      height={1000}
                                      className="mr-2 h-8 w-8"
                                      src={
                                        "https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-MoMo-Square.png"
                                      }
                                      alt=""
                                    />
                                    <div className="font-medium text-slate-600">
                                      Ví MoMo
                                    </div>
                                  </div>
                                  {/* Expiry */}
                                  <div className="ml-2">******7344</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </Fragment>
  );
};

AdminOrdersPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminOrdersPage;
