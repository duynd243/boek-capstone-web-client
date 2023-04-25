import AdminLayout from "../../../components/Layout/AdminLayout";
import React, { Fragment, ReactElement } from "react";

import { NextPageWithLayout } from "../../_app";
import { useAuth } from "../../../context/AuthContext";
import { DashboardService } from "../../../services/DashboardService";
import Datepicker from "../../../components/Datepicker";
import DashboardCard01 from "../../../components/Dashboard/DashboardCard01";
import DashboardCard02 from "../../../components/Dashboard/DashboardCard02";
import DashboardCard03 from '../../../components/Dashboard/DashboardCard03';
import PageHeading from "../../../components/Admin/PageHeading";
import { Card, Title, Text, Tab, TabList, Grid } from "@tremor/react";
import { Dropdown, DropdownItem } from "@tremor/react";
import Form from "../../../components/Form";
import Image from "next/image";
import DashboardCard04 from './../../../components/Dashboard/DashboardCard04';
import DashboardCard05 from "../../../components/Dashboard/DashboardCard05";
import DashboardCard06 from "../../../components/Dashboard/DashboardCard06";
import { IoChevronBack } from "react-icons/io5";
import Link from 'next/link';



const DashboarDetailPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const dashboardService = new DashboardService(loginUser?.accessToken);
    return (
        <Fragment>
            <PageHeading label="Chi tiết doanh thu của hội sách New campaign">
            </PageHeading>
            <div className="mb-6">
                    <Link
                        className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                        href="/issuer"
                    >
                        <IoChevronBack size={"17"} />
                        <span>Quay lại</span>
                    </Link>
                </div>
            <div className="mt-6">
                <Form.GroupLabel
                    label={"Thông tin chung"}
                    description={"Thông tin cơ bản về Hội sách"}
                />
                <div className='mt-3 space-y-4 md:space-y-0 md:flex gap-6'>
                    <Image
                        width={1200}
                        height={1200}
                        className={'rounded-md w-64 h-72 object-cover max-w-full shadow-md'}
                        alt=""
                        src={'https://statics.vincom.com.vn/tin-tuc-su-kien/Tan-Viet-16041.jpg'} />
                    <div>
                        <div
                            className='inline mb-2 bg-blue-500 text-sm font-medium text-white py-2 px-3 w-fit rounded'>01/03/2023 - 14/04/2023
                        </div>
                        <div
                            className='inline ml-2 mb-2 bg-amber-500 text-sm font-medium text-white py-2 px-3 w-fit rounded'>TRỰC TIẾP
                        </div>
                        <h1 className="mt-3 mb-2 text-2xl font-medium text-slate-800">Hội sách New campaign</h1>
                        <div className="text-gray-500">Địa điểm: 123 tran phu, Xã Nánh Nghê, Huyện Đà Bắc, Tỉnh Hoà Bình</div>


                        {/* Description */}
                        <div className="mt-3 text-sm text-gray-500">

                        </div>
                    </div>
                </div>

            </div>
            <div className="mt-6">
                <Card>
                    <div className="h-800" >
                        <PageHeading label="Doanh thu">
                            <Datepicker />

                        </PageHeading>
                        <DashboardCard04 />
                    </div>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <div className="h-1200" >
                        <PageHeading label="Sách bán chạy">
                        <Dropdown
                // className="mt-2"
                onValueChange={(value) => console.log("The selected value is", value)}
                placeholder="Số lượng"
              >
                <DropdownItem value="1" text="5" />
                <DropdownItem value="2" text="10"  />
                <DropdownItem value="1" text="15" />
                <DropdownItem value="1" text="20" />
                <DropdownItem value="1" text="25" />
              </Dropdown>

                        </PageHeading>
                        <DashboardCard05/>
                    </div>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <div className="h-1200" >
                        <PageHeading label="Đơn hàng">
                        <Dropdown
                // className="mt-2"
                onValueChange={(value) => console.log("The selected value is", value)}
                placeholder="Sắp xếp"
              >
                <DropdownItem value="1" text="Tăng dần" />
                <DropdownItem value="2" text="Giảm dần"  />
              </Dropdown>

                        </PageHeading>
                       <DashboardCard06/>
                    </div>
                </Card>
            </div>
        </Fragment>
    );
};

DashboarDetailPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default DashboarDetailPage;
