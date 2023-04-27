import AdminLayout from "../../../components/Layout/AdminLayout";
import React, { Fragment, ReactElement, useState } from "react";

import { NextPageWithLayout } from "../../_app";
import { useAuth } from "../../../context/AuthContext";
import { DashboardService } from "../../../services/DashboardService";
import PageHeading from "../../../components/Admin/PageHeading";
import {
    BarChart,
    Bold,
    Card,
    DateRangePicker,
    DateRangePickerValue,
    Dropdown,
    DropdownItem,
    Flex,
    Grid,
    List,
    ListItem,
    Subtitle,
    Text,
    Title,
} from "@tremor/react";
import { useQuery } from "@tanstack/react-query";
import MetricCard from "../../../components/Dashboard/MetricCard";
import { getDeltaTypeById } from "../../../constants/Dashboard/DeltaTypes";
import { TimelineTypes } from "../../../constants/Dashboard/TimelineTypes";
import { vi } from "date-fns/locale";
import { getFormattedTime } from "../../../utils/helper";
import Image from "next/image";
import DefaultAvatar from "../../../assets/images/default-avatar.png";
import { Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from "next/link";
import { getBookProductStatusById } from "../../../constants/BookProductStatuses";
import { useRouter } from "next/router";

const dateRanges = [
    {
        text: "7 ngày qua",
        value: "7d",
        startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
        endDate: new Date(),
    },
    {
        text: "30 ngày qua",
        value: "30d",
        startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
        endDate: new Date(),
    },
    {
        text: "Tháng này",
        value: "mtd",
        startDate: new Date(new Date().setDate(1)),
        endDate: new Date(),
    },
    {
        text: "Từ đầu năm",
        value: "ytd",
        startDate: new Date(new Date().setMonth(0, 1)),
        endDate: new Date(),
    },
];

const dataSizes = [5, 10, 15, 20, 25];

const Page: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const dashboardService = new DashboardService(loginUser?.accessToken);

    const [revenueDateRange, setRevenueDateRange] =
        useState<DateRangePickerValue>([
            new Date(new Date().setMonth(0, 1)),
            new Date(),
        ]);

    const [revenueDataDescending, setRevenueDataDescending] = useState(true);
    const [revenueDataSize, setRevenueDataSize] = useState<number>(
        dataSizes[0]
    );

    const [bestSellerBooksDateRange, setBestSellerBooksDateRange] =
        useState<DateRangePickerValue>([
            new Date(new Date().setMonth(0, 1)),
            new Date(),
        ]);
    const [bestSellerBooksDescending, setBestSellerBooksDescending] =
        useState(true);
    const [bestSellerBooksSize, setBestSellerBooksSize] = useState<number>(
        dataSizes[0]
    );

    const [spendingDateRange, setSpendingDateRange] =
        useState<DateRangePickerValue>([
            new Date(new Date().setMonth(0, 1)),
            new Date(),
        ]);

    const [spendingDataDescending, setSpendingDataDescending] = useState(true);

    //

    const { data: dashboardSummary } = useQuery(
        ["admin_dashboard_summary"],
        dashboardService.getAdminDashboardSummary
    );
    const campaignRevenueParams = {
        timeLine: [
            {
                type: TimelineTypes.Day.id,
                startDate: revenueDateRange[0]?.toISOString(),
                endDate: revenueDateRange[1]?.toISOString(),
                timeLength: null,
                seasonType: null,
                year: revenueDateRange[1]?.getFullYear(),
            },
        ],
        sizeSubject: 0,
        sizeData: revenueDataSize,
        isDescendingData: revenueDataDescending,
        isDescendingTimeLine: false,
        separateDay: false,
    };
    const { data: campaignRevenue } = useQuery(
        ["admin_campaign_revenue", campaignRevenueParams],
        () => dashboardService.getCampaignRevenueByAdmin(campaignRevenueParams)
    );

    const campaignRevenueChartData =
        campaignRevenue?.models?.[0]?.data?.map((item) => {
            return {
                name: item?.data?.name || "",
                "Doanh thu của hội sách": item?.total || 0,
            };
        }) || [];

    const customerSpendingParams = {
        timeLine: [
            {
                type: TimelineTypes.Day.id,
                startDate: spendingDateRange[0]?.toISOString(),
                endDate: spendingDateRange[1]?.toISOString(),
                timeLength: null,
                seasonType: null,
                year: spendingDateRange[1]?.getFullYear(),
            },
        ],
        sizeSubject: 0,
        sizeData: 0,
        isDescendingData: spendingDataDescending,
        isDescendingTimeLine: false,
        separateDay: false,
    };

    const { data: customerSpending } = useQuery(
        ["admin_customer_spending", customerSpendingParams],
        () =>
            dashboardService.getCustomerSpendingByAdmin(customerSpendingParams)
    );

    // const spendingChartData = campa  ignRevenue?.models?.[0]?.data?.map((item) => {
    //   return {
    //     name: item?.data?.name || "",
    //     "Doanh thu của hội sách": item?.total || 0,
    //   }
    // }) || [];

    const [issuerRevenueDateRange, setIssuerRevenueDateRange] =
        useState<DateRangePickerValue>([
            new Date(new Date().setMonth(0, 1)),
            new Date(),
        ]);

    const [issuerRevenueDataDescending, setIssuerRevenueDataDescending] =
        useState(true);
    const [issuerRevenueDataSize, setIssuerRevenueDataSize] = useState<number>(
        dataSizes[0]
    );
    const [issuerRevenueSubjectSize, setIssuerRevenueSubjectSize] =
        useState<number>(dataSizes[0]);

    const issuerRevenueByCampaignsParams = {
        timeLine: [
            {
                type: TimelineTypes.Day.id,
                startDate: issuerRevenueDateRange[0]?.toISOString(),
                endDate: issuerRevenueDateRange[1]?.toISOString(),
                timeLength: null,
                seasonType: null,
                year: issuerRevenueDateRange[1]?.getFullYear(),
            },
        ],
        sizeSubject: issuerRevenueSubjectSize,
        sizeData: issuerRevenueDataSize,
        isDescendingData: issuerRevenueDataDescending,
        isDescendingTimeLine: false,
        separateDay: false,
    };
    const { data: issuerRevenueGroupedByCampaigns } = useQuery(
        [
            "admin_dashboard_issuer_revenue_campaign",
            issuerRevenueByCampaignsParams,
        ],
        () =>
            dashboardService.getTopIssuerRevenueGroupedByCampaignsByAdmin(
                issuerRevenueByCampaignsParams
            )
    );

    const { data: bestSellerBooks } = useQuery(
        [
            "admin_dashboard_best_seller_books",
            bestSellerBooksSize,
            bestSellerBooksDescending,
            bestSellerBooksDateRange[0]?.toISOString(),
            bestSellerBooksDateRange[1]?.toISOString(),
        ],
        () =>
            dashboardService.getBestSellerBooksByAdmin({
                timeLine: [
                    {
                        type: TimelineTypes.Day.id,
                        startDate: bestSellerBooksDateRange[0]?.toISOString(),
                        endDate: bestSellerBooksDateRange[1]?.toISOString(),
                        timeLength: null,
                        seasonType: null,
                        year: bestSellerBooksDateRange[1]?.getFullYear(),
                    },
                ],
                sizeSubject: 0,
                sizeData: bestSellerBooksSize,
                isDescendingData: bestSellerBooksDescending,
                isDescendingTimeLine: false,
                separateDay: false,
            })
    );

    // const campaignRevenueChartData = campaignRevenue?.models?.[0]?.data?.map((item) => {
    //     return {
    //         name: item?.data?.name || "",
    //         "Doanh thu của hội sách": item?.total || 0,
    //     };
    // }) || [];

    const chartD =
        issuerRevenueGroupedByCampaigns?.models?.map((item) => {
            const x =
                item?.model?.data?.map((i) => {
                    const key = `${i?.data?.user?.name}`;
                    return {
                        [key]: i?.total,
                    };
                }) || [];

            const m = x?.reduce((acc, curr) => {
                const key = Object.keys(curr)[0];
                acc[key] = curr[key];
                return acc;
            }, {});
            return {
                topic: item?.subject?.name,
                ...m,
            };
        }) || [];
    console.log(JSON.stringify(chartD));


    const router = useRouter();

    return (
        <Fragment>
            <Title>Thống kê</Title>
            <Text>Thống kê tổng quan</Text>
            <div className="mt-6">
                <Card>
                    <PageHeading label="Hôm nay"></PageHeading>
                    {/* <DashboardCard01 /> */}

                    <Grid numColsSm={2} numColsLg={3} className="gap-6 mt-2">
                        {dashboardSummary?.map((summary) => (
                            <MetricCard
                                showDeltaIcon={summary?.status !== null}
                                key={summary?.id}
                                title={summary?.title}
                                quantityOfTitle={summary?.quantityOfTitle || 0}
                                deltaType={
                                    getDeltaTypeById(summary?.status)
                                        ?.deltaType || "unchanged"
                                }
                                deltaSubTitle={
                                    summary?.statusName &&
                                    summary?.quantityOfSubTitle
                                        ? `${summary?.statusName} ${summary?.quantityOfSubTitle}`
                                        : ""
                                }
                                subTitle={
                                    summary?.status !== null
                                        ? summary?.subTitle
                                        : `${summary?.quantityOfSubTitle} ${summary?.subTitle}`
                                }
                            />
                        ))}
                    </Grid>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <div className="h-800">
                        <PageHeading label="Doanh thu">
                            <DateRangePicker
                                className="max-w-md mx-auto"
                                value={revenueDateRange}
                                onValueChange={setRevenueDateRange}
                                locale={vi}
                                dropdownPlaceholder="Chọn"
                                options={dateRanges}
                            />
                            <Dropdown
                                // className="mt-2"
                                onValueChange={(value) =>
                                    setRevenueDataDescending(value === "true")
                                }
                                placeholder="Sắp xếp"
                            >
                                <DropdownItem value={"false"} text="Tăng dần" />
                                <DropdownItem value={"true"} text="Giảm dần" />
                            </Dropdown>
                            <Dropdown
                                onValueChange={(value) =>
                                    setRevenueDataSize(parseInt(value))
                                }
                                placeholder="Số lượng hội sách"
                            >
                                {dataSizes.map((size) => (
                                    <DropdownItem
                                        key={size}
                                        value={size.toString()}
                                        text={size.toString()}
                                    />
                                ))}
                            </Dropdown>

                            <Dropdown
                                onValueChange={(value) =>
                                    setRevenueDataSize(parseInt(value))
                                }
                                placeholder="Tất cả hội sách"
                            >
                                {(campaignRevenue?.models?.[0]?.data || [])?.map((item) => (
                                    <DropdownItem
                                        onClick={() => {
                                            if(item?.data?.id) {
                                                router.push(`/admin/dashboard/campaigns/${item?.data?.id}`)
                                            }
                                        }}
                                        key={item?.data?.id}
                                        value={item?.data?.id?.toString()}
                                        text={item?.data?.name}
                                    />
                                ))}
                            </Dropdown>
                        </PageHeading>

                        <Card>
                            <Title>
                                Doanh thu của các hội sách trong{" "}
                                {getFormattedTime(
                                    revenueDateRange[0]?.toISOString(),
                                    "dd/MM/yyyy"
                                )}{" "}
                                –{" "}
                                {getFormattedTime(
                                    revenueDateRange[1]?.toISOString(),
                                    "dd/MM/yyyy"
                                )}
                            </Title>
                            <Subtitle>
                                Doanh thu của các hội sách trong khoảng thời
                                gian nhất định.
                            </Subtitle>
                            <BarChart
                                stack={true}
                                className="mt-6"
                                data={campaignRevenueChartData}
                                index="name"
                                categories={["Doanh thu của hội sách"]}
                                colors={["blue"]}
                                valueFormatter={(value) =>
                                    new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(value)
                                }
                                yAxisWidth={90}
                            />
                        </Card>
                        {/* <DashboardCard02 /> */}
                    </div>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <div className="h-800">
                        <PageHeading label="Doanh thu nhà phát hành">
                            <DateRangePicker
                                className="max-w-md mx-auto"
                                value={issuerRevenueDateRange}
                                onValueChange={setIssuerRevenueDateRange}
                                locale={vi}
                                dropdownPlaceholder="Chọn"
                                options={dateRanges}
                            />
                            <Dropdown
                                // className="mt-2"
                                onValueChange={(value) =>
                                    setIssuerRevenueDataDescending(
                                        value === "true"
                                    )
                                }
                                placeholder="Sắp xếp"
                            >
                                <DropdownItem value={"false"} text="Tăng dần" />
                                <DropdownItem value={"true"} text="Giảm dần" />
                            </Dropdown>
                            <Dropdown
                                onValueChange={(value) =>
                                    setIssuerRevenueDataSize(parseInt(value))
                                }
                                placeholder="Số lượng hội sách"
                            >
                                {dataSizes.map((size) => (
                                    <DropdownItem
                                        key={size}
                                        value={size.toString()}
                                        text={size.toString()}
                                    />
                                ))}
                            </Dropdown>

                            <Dropdown
                                onValueChange={(value) =>
                                    setIssuerRevenueSubjectSize(parseInt(value))
                                }
                                placeholder="Số lượng NPH"
                            >
                                {dataSizes.map((size) => (
                                    <DropdownItem
                                        key={size}
                                        value={size.toString()}
                                        text={size.toString()}
                                    />
                                ))}
                            </Dropdown>
                        </PageHeading>

                        <Card>
                            <Title>
                                Doanh thu nhà phát hành của các hội sách trong{" "}
                                {getFormattedTime(
                                    issuerRevenueDateRange[0]?.toISOString(),
                                    "dd/MM/yyyy"
                                )}{" "}
                                –{" "}
                                {getFormattedTime(
                                    issuerRevenueDateRange[1]?.toISOString(),
                                    "dd/MM/yyyy"
                                )}
                            </Title>
                            <Subtitle>
                                Doanh thu của các hội sách trong khoảng thời
                                gian nhất định.
                            </Subtitle>
                            <BarChart
                                stack={true}
                                className="mt-6"
                                data={chartD}
                                index="topic"
                                categories={[
                                    ...new Set(
                                        chartD?.map(
                                            (obj) =>
                                                Object.keys(obj).filter(
                                                    (key) => key !== "topic"
                                                )[0]
                                        )
                                    ),
                                ]}
                                colors={[
                                    "indigo",
                                    "amber",
                                    "rose",
                                    "teal",
                                    "blue",
                                    "emerald",
                                ]}
                                valueFormatter={(value) =>
                                    new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(value)
                                }
                                yAxisWidth={90}
                                showXAxis={true}
                            />
                        </Card>
                    </div>
                </Card>
            </div>
            <div className="mt-6">
                <Card>
                    <div className="h-1200">
                        <PageHeading label="Chi tiêu khách hàng">
                            <DateRangePicker
                                className="max-w-md mx-auto"
                                value={spendingDateRange}
                                onValueChange={setSpendingDateRange}
                                locale={vi}
                                dropdownPlaceholder="Chọn"
                                options={dateRanges}
                            />
                            <Dropdown
                                // className="mt-2"
                                onValueChange={(value) =>
                                    setSpendingDataDescending(value === "true")
                                }
                                placeholder="Sắp xếp"
                            >
                                <DropdownItem value={"false"} text="Tăng dần" />
                                <DropdownItem value={"true"} text="Giảm dần" />
                            </Dropdown>
                        </PageHeading>

                        <Grid numColsSm={1} numColsLg={1} className="gap-6">
                            <Card>
                                <Title>Chi tiêu khách hàng</Title>
                                <Text>
                                    {getFormattedTime(
                                        spendingDateRange[0]?.toISOString(),
                                        "dd/MM/yyyy"
                                    )}{" "}
                                    –{" "}
                                    {getFormattedTime(
                                        spendingDateRange[1]?.toISOString(),
                                        "dd/MM/yyyy"
                                    )}
                                </Text>
                                <List className="mt-4">
                                    {customerSpending?.models?.[0]?.data?.map(
                                        (item, index) => (
                                            <ListItem key={index}>
                                                <Flex
                                                    justifyContent="start"
                                                    className="truncate space-x-4"
                                                >
                                                    <Image
                                                        width={500}
                                                        height={500}
                                                        className="w-10 h-10 rounded-full object-cover"
                                                        src={
                                                            item?.user
                                                                ?.imageUrl ||
                                                            DefaultAvatar.src
                                                        }
                                                        alt={""}
                                                    />
                                                    <div className="truncate">
                                                        <Text className="truncate">
                                                            <Bold>
                                                                {item?.user
                                                                    ?.name ||
                                                                    "Vô danh"}
                                                            </Bold>
                                                        </Text>
                                                        <Text className="truncate">
                                                            {item?.totalOrders ||
                                                                0}{" "}
                                                            đơn hàng
                                                        </Text>
                                                    </div>
                                                </Flex>
                                                <Text>
                                                    {new Intl.NumberFormat(
                                                        "vi-VN",
                                                        {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }
                                                    ).format(item?.total || 0)}
                                                </Text>
                                            </ListItem>
                                        )
                                    )}
                                </List>
                            </Card>
                        </Grid>
                        {/* <DashboardCard03 /> */}
                    </div>
                </Card>
            </div>

            <div className="mt-6">
                <Card>
                    <div className="h-1200">
                        <PageHeading label="Sách bán chạy">
                            <DateRangePicker
                                className="max-w-md mx-auto"
                                value={bestSellerBooksDateRange}
                                onValueChange={setBestSellerBooksDateRange}
                                locale={vi}
                                dropdownPlaceholder="Chọn"
                                options={dateRanges}
                            />
                            <Dropdown
                                // className="mt-2"
                                onValueChange={(value) =>
                                    setBestSellerBooksDescending(
                                        value === "true"
                                    )
                                }
                                placeholder="Sắp xếp"
                            >
                                <DropdownItem value={"false"} text="Tăng dần" />
                                <DropdownItem value={"true"} text="Giảm dần" />
                            </Dropdown>

                            <Dropdown
                                onValueChange={(value) =>
                                    setBestSellerBooksSize(parseInt(value))
                                }
                                placeholder="Số lượng sách"
                            >
                                {dataSizes.map((size) => (
                                    <DropdownItem
                                        key={size}
                                        value={size.toString()}
                                        text={size.toString()}
                                    />
                                ))}
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
                        {(bestSellerBooks?.models?.[0]?.data || [])?.map(
                            (product) => {
                                const productStatus = getBookProductStatusById(
                                    product?.status
                                );
                                return (
                                    <SwiperSlide
                                        className={"py-10"}
                                        key={product?.id}
                                    >
                                        <Link className={""} href={""}>
                                            {/*status tag*/}
                                            <div
                                                className={`absolute top-0 right-0 rounded-bl-md rounded-tr-md px-2 py-1 text-xs font-medium text-white ${
                                                    productStatus
                                                        ?.campaignCardTag
                                                        ?.bgClassNames ||
                                                    "bg-slate-500"
                                                }`}
                                            >
                                                {productStatus?.commonDisplayName ||
                                                    productStatus?.displayName}
                                            </div>

                                            {/* Image */}
                                            <Image
                                                src={product?.imageUrl || ""}
                                                alt={""}
                                                width={500}
                                                height={500}
                                                className={
                                                    "w-full h-64 object-cover border-b"
                                                }
                                            />
                                            {/* Content */}
                                            <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                                                <div>
                                                    <div className="text-sm font-medium text-slate-800 line-clamp-2 break-words">
                                                        {product?.title}
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
                                                        Đã bán:{" "}
                                                        {product?.total || 0}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                );
                            }
                        )}
                    </Swiper>
                </Card>
            </div>
        </Fragment>
    );
};

Page.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
