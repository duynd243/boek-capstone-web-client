import React, { Fragment, useState } from "react";
import { NextPageWithLayout } from "../../../_app";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import CampaignCard from "../../../../components/CampaignCard";
import { useRouter } from "next/router";
import { useAuth } from "../../../../context/AuthContext";
import { CampaignService } from "../../../../services/CampaignService";
import { useQuery } from "@tanstack/react-query";
import {
    BarChart,
    BarList,
    Bold,
    Card,
    DateRangePicker,
    DateRangePickerValue,
    Dropdown,
    DropdownItem,
    Flex, SelectBox as TremorSelectBox, SelectBoxItem as TremorSelectBoxItem,
    Text,
    Title,
} from "@tremor/react";
import PageHeading from "../../../../components/Admin/PageHeading";
import { getFormattedTime } from "../../../../utils/helper";
import { vi } from "date-fns/locale";
import { DashboardService } from "../../../../services/DashboardService";
import { TimelineTypes } from "../../../../constants/Dashboard/TimelineTypes";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { getBookProductStatusById } from "../../../../constants/BookProductStatuses";
import Link from "next/link";
import Image from "next/image";
import { getOrderStatusById } from "../../../../constants/OrderStatuses";
import { IoChevronBack } from "react-icons/io5";

const dateRanges = [{
    text: "7 ngày qua",
    value: "7d",
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
}, {
    text: "30 ngày qua",
    value: "30d",
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
}, {
    text: "Tháng này",
    value: "mtd",
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(),
}, {
    text: "Từ đầu năm",
    value: "ytd",
    startDate: new Date(new Date().setMonth(0, 1)),
    endDate: new Date(),
},
];

const dataSizes = [5, 10, 15, 20, 25];
const CampaignDashboardDetails: NextPageWithLayout = () => {

    const { loginUser } = useAuth();

    const dashboardService = new DashboardService(loginUser?.accessToken);

    const campaignService = new CampaignService(loginUser?.accessToken);
    const {
        query: {
            id: campaignId,
        },
    } = useRouter();

    const {
        data: campaign,
    } = useQuery(["admin_campaign", campaignId],
        () => campaignService.getCampaignByIdByAdmin(Number(campaignId)), {
            enabled: !!campaignId,
            onSuccess: (data) => {
                if ((!revenueDateRange?.[0] || !revenueDateRange?.[1])
                    && data?.startDate && data?.endDate
                ) {
                    setRevenueDateRange([new Date(data?.startDate), new Date(data?.endDate)]);
                }
            },
        },
    );

    const {
        data: allCampaigns,
    } = useQuery(["admin_campaigns"],
        () => campaignService.getAllCampaignsByAdmin({
            sort: "CreatedDate desc",
        }),
        {
            enabled: !!campaignId,
            select: (data) => {
                // put current campaign to the first
                const currentCampaign = data?.find((item) => item?.id === Number(campaignId));
                const otherCampaigns = data?.filter((item) => item?.id !== Number(campaignId));
                return [currentCampaign, ...otherCampaigns];
            },
        },
    );

    const [revenueDateRange, setRevenueDateRange] = useState<DateRangePickerValue>(() => {
        if (campaign?.startDate && campaign?.endDate) {
            return [new Date(campaign?.startDate), new Date(campaign?.endDate)];
        }
        return [null, null];
    });

    const [revenueDataDescending, setRevenueDataDescending] = useState(true);
    const [revenueDataSize, setRevenueDataSize] = useState<number>(dataSizes[0]);
    const params = {
        "campaignId": Number(campaignId),
        "dashboardRequestModel": {
            "timeLine": [
                {
                    "type": TimelineTypes.Day.id,
                    "startDate": revenueDateRange?.[0]?.toISOString()?.split("T")[0],
                    "endDate": revenueDateRange?.[1]?.toISOString()?.split("T")[0]?.concat("T23:59:59.999Z"),
                    "timeLength": 0,
                    "seasonType": 0,
                    "year": 0,
                },
            ],
            "sizeSubject": 0,
            "sizeData": revenueDataSize,
            "isDescendingData": revenueDataDescending,
            "isDescendingTimeLine": false,
            "separateDay": false,
        },
        "isAllTheTime": false,
    };
    const {
        data: dashboardData,
    } = useQuery(["dashboard", params],
        () => dashboardService.getDashboardCampaignDetails(Number(campaignId), params), {
            enabled: !!campaignId && !!revenueDateRange?.[0] && !!revenueDateRange?.[1],
        },
    );

    const campaignRevenueChartData = dashboardData?.revenues?.map((item) => {
        return {
            timeLine: item?.timeLine?.type === TimelineTypes.Month.id ? getFormattedTime(item?.timeLine?.startDate, "MM/yyyy") : getFormattedTime(item?.timeLine?.startDate, "dd/MM"),
            "Doanh thu": item?.revenue || 0,
        };
    }) || [];

    const router = useRouter();
    return (

        <Fragment>
            <div className="flex justify-between mb-6">
                <button
                    className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-200 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                    onClick={() => router.back()}
                >
                    <IoChevronBack size={"17"} />
                    <span>Quay lại</span>
                </button>

                <TremorSelectBox
                    className={"w-56"}
                    value={campaignId?.toString()}
                    placeholder={"Chọn hội sách"}
                    onValueChange={async (value) => {
                        if (value) {
                            // clear data
                            setRevenueDateRange([null, null]);
                            setRevenueDataSize(dataSizes[0]);
                            await router.push(`/admin/dashboard/campaigns/${value}`)
                        }
                    }}>

                    {(allCampaigns || [])?.map((campaign) => <TremorSelectBoxItem key={campaign?.id}
                                                                                  value={campaign?.id?.toString() || ""}
                                                                                  text={campaign?.name} />)
                    }
                </TremorSelectBox>
            </div>
            <Card>
                <div>
                    <PageHeading label="Hội sách">
                    </PageHeading>
                    {campaign && <CampaignCard
                        campaign={campaign}
                    />}
                </div>
            </Card>
            <Card className={"mt-6"}>
                <Flex justifyContent={"between"}>
                    <Title>
                        Thời gian thống kê
                    </Title>
                    <DateRangePicker
                        className={"w-fit"}
                        value={revenueDateRange}
                        onValueChange={(value) => {
                            setRevenueDateRange(value);
                        }}
                        locale={vi}
                        dropdownPlaceholder="Chọn"
                        enableDropdown={false}
                        minDate={campaign?.startDate ? new Date(campaign?.startDate) : undefined}
                        maxDate={campaign?.endDate ? new Date(campaign?.endDate) : undefined}
                    />
                </Flex>
            </Card>
            <div className="mt-6">
                <Card>
                    <div className="h-800">
                        <PageHeading label="Doanh thu">
                        </PageHeading>

                        <Card>
                            <Title>Doanh thu của hội sách
                                từ {getFormattedTime(revenueDateRange[0]?.toISOString(), "dd/MM/yyyy")} – {getFormattedTime(revenueDateRange[1]?.toISOString(), "dd/MM/yyyy")}</Title>
                            {/*<Subtitle>*/}
                            {/*    Doanh thu của các hội sách trong khoảng thời gian nhất định.*/}
                            {/*</Subtitle>*/}
                            <BarChart
                                className="mt-6"
                                data={campaignRevenueChartData}
                                index="timeLine"
                                categories={["Doanh thu"]}
                                colors={["blue"]}
                                valueFormatter={(value) => new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(value)}
                                yAxisWidth={90}
                            />
                        </Card>


                    </div>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <div className="h-1200">
                        <PageHeading label="Sách bán chạy">
                            <Dropdown
                                onValueChange={(value) => setRevenueDataSize(parseInt(value))}
                                placeholder="Số lượng sách"
                            >
                                {dataSizes.map(size => <DropdownItem
                                    key={size}
                                    value={size.toString()}
                                    text={size.toString()} />)}

                            </Dropdown>
                        </PageHeading>
                    </div>

                    <Swiper
                        breakpoints={{
                            640: {
                                slidesPerView: 1.4,
                            },
                            768: {
                                slidesPerView: 1.68,
                            },
                            1024: {
                                slidesPerView: 2.4,
                            },
                            1280: {
                                slidesPerView: 6,
                            },
                        }}
                        spaceBetween={30}
                        pagination={{
                            clickable: true,
                        }}
                        modules={[Pagination]}
                    >
                        {(dashboardData?.bestSellerBookProducts?.data || [])?.map((
                            { data: product, total },
                        ) => {
                            const productStatus = getBookProductStatusById(product?.status);
                            return <SwiperSlide

                                className={"py-10"}
                                key={product?.id}>
                                <Link
                                    className={""}
                                    href={""}>
                                    {/*status tag*/}
                                    <div
                                        className={`absolute top-0 right-0 rounded-bl-md rounded-tr-md px-2 py-1 text-xs font-medium text-white ${productStatus?.campaignCardTag?.bgClassNames || "bg-slate-500"}`}>
                                        {productStatus?.commonDisplayName || productStatus?.displayName}
                                    </div>

                                    {/* Image */}
                                    <Image src={product?.imageUrl || ""}
                                           alt={""} width={500} height={500}
                                           className={"w-full h-64 object-cover border-b"}
                                    />
                                    {/* Content */}
                                    <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                                        <div>
                                            <div
                                                className="text-sm font-medium text-slate-800 line-clamp-2 break-words">{product?.title}
                                            </div>
                                            {/*<div*/}
                                            {/*    className="mt-2 flex items-center text-sm font-medium text-slate-600">*/}
                                            {/*    <Image*/}
                                            {/*        src={product?.issuer?.user?.imageUrl || ""}*/}
                                            {/*        alt={""} width={500} height={500}*/}
                                            {/*        className={"w-6 h-6 object-cover rounded-full"}*/}
                                            {/*    />*/}
                                            {/*    <div className="ml-2">*/}
                                            {/*        {product?.issuer?.user?.name}*/}
                                            {/*    </div>*/}
                                            {/*</div>*/}
                                        </div>
                                        {/*Price on right*/}
                                        <div className="flex justify-end items-center mt-2">
                                            <div className="text-emerald-600 font-medium">
                                                Đã bán: {total || 0}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>;
                        })}
                    </Swiper>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <div className="h-1200">
                        <PageHeading label="Đơn hàng">
                            <Dropdown
                                // className="mt-2"
                                onValueChange={(value) => setRevenueDataDescending(value === "true")}
                                placeholder="Sắp xếp"
                            >
                                <DropdownItem value={"false"} text="Tăng dần" />
                                <DropdownItem value={"true"} text="Giảm dần" />
                            </Dropdown>
                        </PageHeading>
                    </div>
                    <Flex className="mt-4">
                        <Text>
                            <Bold>Trạng thái</Bold>
                        </Text>
                        <Text>
                            <Bold>Số đơn hàng</Bold>
                        </Text>
                    </Flex>
                    <BarList data={dashboardData?.orders?.models?.map(item => {
                        return {
                            icon: () => {
                                return <div
                                    className={`w-3 h-3 self-center ml-3 mr-2.5 rounded-full ${getOrderStatusById(item?.status)?.dotColor || "bg-slate-500"}`}></div>;
                            },
                            name: getOrderStatusById(item?.status)?.displayName || "Không xác định",
                            value: item?.total || 0,
                        };
                    }) || []} className="mt-2"
                             color={"slate"}
                    />
                </Card>
            </div>
        </Fragment>
    );
};

CampaignDashboardDetails.getLayout = (page) => {
    return (
        <AdminLayout>
            {page}
        </AdminLayout>
    );
};

export default CampaignDashboardDetails;