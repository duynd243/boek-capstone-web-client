import AdminLayout from "../../components/Layout/AdminLayout";
import React, { Fragment, ReactElement, useState } from "react";

import { NextPageWithLayout } from "../_app";
import { useAuth } from "../../context/AuthContext";
import { DashboardService } from "../../services/DashboardService";
import WelcomeBanner from "../../components/WelcomBanner";
import Datepicker from "../../components/Datepicker";
import DashboardCard01 from "../../components/Dashboard/DashboardCard01";
import CreateButton from "../../components/Admin/CreateButton";
import DashboardCard02 from "../../components/Dashboard/DashboardCard02";
// import Barchart from "../../components/Charts/Barchart";
import DashboardCard03 from './../../components/Dashboard/DashboardCard03';
import PageHeading from "../../components/Admin/PageHeading";
import { Card, Title, Text, Tab, TabList, Grid, DateRangePicker, DateRangePickerValue, Subtitle, BarChart, List, ListItem, Flex, Bold } from "@tremor/react";
import { Dropdown, DropdownItem } from "@tremor/react";
import { useQuery } from "@tanstack/react-query";
import MetricCard from "../../components/Dashboard/MetricCard";
import { getDeltaTypeById } from "../../constants/Dashboard/DeltaTypes";
import { TimelineTypes } from "../../constants/Dashboard/TimelineTypes";
import { sub, formatISO } from "date-fns";
import { vi } from "date-fns/locale";
import { getFormattedTime } from "../../utils/helper";
import Image from "next/image";
import DefaultAvatar from "../../assets/images/default-avatar.png"
import { useRouter } from "next/router";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from 'next/link';
import { Pagination } from "swiper";
import { CampaignService } from "../../services/CampaignService";






const dateRanges = [{
    text: '7 ngày qua',
    value: '7d',
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(),
  }, {
    text: '30 ngày qua',
    value: '30d',
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  }, {
    text: 'Tháng này',
    value: 'mtd',
    startDate: new Date(new Date().setDate(1)),
    endDate: new Date(),
  }, {
    text: 'Từ đầu năm',
    value: 'ytd',
    startDate: new Date(new Date().setMonth(0, 1)),
    endDate: new Date(),
  }
]

const dataSizes = [5, 10, 15, 20, 25];

const Page: NextPageWithLayout = () => {
  const { loginUser } = useAuth();
  const router = useRouter();
  const dashboardService = new DashboardService(loginUser?.accessToken);

  const [revenueDateRange, setRevenueDateRange] = useState<DateRangePickerValue>([
    new Date(new Date().setMonth(0, 1)),
    new Date(),
  ]);

  const [revenueDataDescending, setRevenueDataDescending] = useState(true);
  const [revenueDataSize, setRevenueDataSize] = useState<number>(dataSizes[0]);


  const [spendingDateRange, setSpendingDateRange] = useState<DateRangePickerValue>([
    new Date(new Date().setMonth(0, 1)),
    new Date(),
  ]);
  const [bestSellerBooksDateRange,setBestSellerBooksDateRange] = useState<DateRangePickerValue>([
    new Date(new Date().setMonth(0, 1)),
    new Date(),
  ]);

  const [spendingDataDescending, setSpendingDataDescending] = useState(true);
  const campaignService = new CampaignService(loginUser?.accessToken);
    const {
        query: {
            id: campaignId,
        },
    } = useRouter();

  const {
    data: dashboardSummary,
  } = useQuery(["issuer_dashboard_summary"], dashboardService.getIssuerDashboardSummary)
  const campaignRevenueParams = {
    "timeLine": [
      {
        "type": TimelineTypes.Day.id,
        "startDate": revenueDateRange[0]?.toISOString(),
        "endDate": revenueDateRange[1]?.toISOString(),
        "timeLength": null,
        "seasonType": null,
        "year": revenueDateRange[1]?.getFullYear()
      }
    ],
    "sizeSubject": 0,
    "sizeData": revenueDataSize,
    "isDescendingData": revenueDataDescending,
    "isDescendingTimeLine": false,
    "separateDay": false
  }
  const {
    data: campaignRevenue,
  } = useQuery(["issuer_campaign_revenue", campaignRevenueParams], () => dashboardService.getCampaignRevenueByIssuer(campaignRevenueParams))


  const campaignRevenueChartData = campaignRevenue?.models?.[0]?.data?.map((item) => {
    return {
      name: item?.data?.name || "",
      "Doanh thu của hội sách": item?.total || 0,
    }
  }) || [];




  const customerSpendingParams = {
    "timeLine": [
      {
        "type": TimelineTypes.Day.id,
        "startDate": spendingDateRange[0]?.toISOString(),
        "endDate": spendingDateRange[1]?.toISOString(),
        "timeLength": null,
        "seasonType": null,
        "year": spendingDateRange[1]?.getFullYear()
      }
    ],
    "sizeSubject": 0,
    "sizeData": 0,
    "isDescendingData": spendingDataDescending,
    "isDescendingTimeLine": false,
    "separateDay": false
  }
  const {
    data: customerSpending,
  } = useQuery(["issuer_customer_spending", customerSpendingParams], () => dashboardService.getCustomerSpendingByIssuer(customerSpendingParams))


  // const spendingChartData = campa  ignRevenue?.models?.[0]?.data?.map((item) => {
  //   return {
  //     name: item?.data?.name || "",
  //     "Doanh thu của hội sách": item?.total || 0,
  //   }
  // }) || [];


  return (
    <Fragment>
      <Title>Thống kê</Title>
      {/* <Text>Thống kê của nhà phát hành</Text> */}
      <div className="mt-6">
        <Card>
          <PageHeading label="Hôm nay">
          </PageHeading>
          {/* <DashboardCard01 /> */}

          <Grid numColsSm={2} numColsLg={3} className="gap-6 mt-2">
            {dashboardSummary?.map(summary => (
              <MetricCard
                showDeltaIcon={summary?.status !== null}
                key={summary?.id}
                title={summary?.title}
                quantityOfTitle={summary?.quantityOfTitle || 0}
                deltaType={getDeltaTypeById(summary?.status)?.deltaType || 'unchanged'}
                deltaSubTitle={(summary?.statusName && summary?.quantityOfSubTitle) ? `${summary?.statusName} ${summary?.quantityOfSubTitle}` : ""}
                subTitle={summary?.status !== null ? summary?.subTitle : `${summary?.quantityOfSubTitle} ${summary?.subTitle}`}
              />
            ))}
          </Grid>
        </Card>
      </div>


      <div className="mt-6">
        <Card>
          <div className="h-800" >
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
                onValueChange={(value) => setRevenueDataDescending(value === "true")}
                placeholder="Sắp xếp"
              >
                <DropdownItem value={"false"} text="Tăng dần" />
                <DropdownItem value={"true"} text="Giảm dần" />
              </Dropdown>
              <Dropdown
                onValueChange={(value) => setRevenueDataSize(parseInt(value))}
                placeholder="Số lượng hội sách"
              >
                {dataSizes.map(size => <DropdownItem
                  key={size}
                  value={size.toString()}
                  text={size.toString()} />)}

              </Dropdown>
              <Dropdown
              placeholder="Hội sách tham gia"
              onValueChange={(value) => router.push(`/issuer/dashboard/campaigns/${campaignId}`)}
              >
               <DropdownItem 
                value={campaignId | ""}
                text={campaignRevenueChartData[0]?.name}
               />
              </Dropdown>
            </PageHeading>

            <Card>
              <Title>Doanh thu của các hội sách trong {getFormattedTime(revenueDateRange[0]?.toISOString(), "dd/MM/yyyy")} – {getFormattedTime(revenueDateRange[1]?.toISOString(), "dd/MM/yyyy")}</Title>
              <Subtitle>
                Doanh thu của các hội sách trong khoảng thời gian nhất định.
              </Subtitle>
              <BarChart
              stack={true}
                className="mt-6"
                data={campaignRevenueChartData}
                index="name"
                categories={["Doanh thu của hội sách"]}
                colors={["blue"]}
                valueFormatter={(value) => new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value)}
                yAxisWidth={90}

              />
            </Card>
            {/* <DashboardCard02 /> */}


          </div>
        </Card>
      </div>
      <div className="mt-6">
        <Card>
          <div className="h-1200" >
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
                onValueChange={(value) => setSpendingDataDescending(value === "true")}
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
                {getFormattedTime(spendingDateRange[0]?.toISOString(), "dd/MM/yyyy")} – {getFormattedTime(spendingDateRange[1]?.toISOString(), "dd/MM/yyyy")}
                </Text>
                <List className="mt-4"> 
                    {customerSpending?.models?.[0]?.data?.map((item, index) => <ListItem key={index}>
                      <Flex justifyContent="start" className="truncate space-x-4">
                        <Image
                          width={500}
                          height={500}
                          className="w-10 h-10 rounded-full object-cover"
                          src={item?.user?.imageUrl || DefaultAvatar.src} 
                          alt={''}
                        />
                        <div className="truncate">
                          <Text className="truncate">
                            <Bold>
                              {item?.user?.name || 'Vô danh'}
                            </Bold>
                          </Text>
                          <Text className="truncate">
                            {item?.totalOrders || 0} đơn hàng
                          </Text>
                        </div>
                      </Flex>
                      <Text>
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item?.total || 0)}
                      </Text>
                    </ListItem>)}
                </List>

              </Card>
            </Grid>
            {/* <DashboardCard03 /> */}
          </div>
        </Card>
      </div>
      
    </Fragment>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
