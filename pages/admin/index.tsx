import { ReactElement } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../_app";
import { BarChart, Card, Flex, Title } from "@tremor/react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { DashboardService } from "../../services/DashboardService";
import { TimelineTypes } from "../../constants/Dashboard/TimelineTypes";
import { getFormattedTime } from "../../utils/helper";

const chartdata2 = [
    {
        topic: "Topic 1",
        "Group A": 890,
        "Group B": 338,
        "Group C": 538,
        "Group D": 396,
        "Group E": 138,
        "Group F": 436,
    },
];
const dataFormatter = (number: number) => {
    return Intl.NumberFormat("us").format(number).toString();
};
const cities = [
    {
        name: "New York",
        sales: 9800,
    },
    {
        name: "London",
        sales: 4567,
    },
    {
        name: "Hong Kong",
        sales: 3908,
    },
    {
        name: "San Francisco",
        sales: 2400,
    },
    {
        name: "Singapore",
        sales: 1908,
    },
    {
        name: "Zurich",
        sales: 1398,
    },
];

const valueFormatter = (number: number) =>
    `$ ${Intl.NumberFormat("us").format(number).toString()}`;
const Page: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const dashboardService = new DashboardService(loginUser?.accessToken);

    const monthsOf2022 = new Array(7).fill(0).map((_, index) => {
        const date = new Date(2022, (index + 6), 2);
        return {
            "type": TimelineTypes.Month.id,
            "startDate": date.toISOString(),
            "timeLength": 29,
            "year": 2022,
        };
    });
    const { data: newCustomers } = useQuery(
        ["new_customers"],
        () => dashboardService.getAdminDashboardComparisonNewCustomers({
            "timeLine": [
                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2023-04-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2023,
                },
                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2023-03-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2023,
                },
                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2023-02-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2023,
                },
                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2023-01-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2023,
                },

                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-12-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },

                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-11-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },

                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-10-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },


                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-09-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },


                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-08-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },


                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-07-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },


                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-06-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },
            ],
            "sizeSubject": 0,
            "sizeData": 10,
            "isDescending": false,
        }),
    );

    const { data: newOrders } = useQuery(
        ["new_orders"],
        () => dashboardService.getAdminDashboardComparisonNewOrders({
            "timeLine": [
                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2023-04-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2023,
                },
                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2023-03-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2023,
                },
                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2023-02-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2023,
                },
                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2023-01-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2023,
                },

                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-12-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },

                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-11-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },

                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-10-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },


                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-09-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },


                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-08-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },


                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-07-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },


                {
                    "type": TimelineTypes.Month.id,
                    "startDate": "2022-06-01T12:00:24.382Z",
                    "timeLength": 29,
                    "year": 2022,
                },
            ],
            "sizeSubject": 0,
            "sizeData": 10,
            "isDescending": false,
        }),
    );

    const testDataCustomers = newCustomers?.models?.map((i: any, index) => {
        return {
            "Số khách hàng mới": i?.total ?? 0,
            title: getFormattedTime(i?.timeLine?.startDate, "MM/yyyy"),
        };
    });

    const testDataOrders = newOrders?.models?.map((i: any, index) => {
        return {
            "Số đơn hàng": i?.total ?? 0,
            title: getFormattedTime(i?.timeLine?.startDate, "MM/yyyy"),
        };
    });

    // const newCustomersData = newCustomers?.data.map((item) => {
    //     return {
    //         name: item.name,
    //         sales: item.value,
    //     };
    // });

    return (
        <div>
            <Card>
                <Title>Khách hàng mới theo các tháng từ 6/2022</Title>
                <BarChart
                    className="mt-6"
                    data={testDataCustomers}
                    index="title"
                    categories={["Số khách hàng mới"]}
                    colors={["blue", "teal", "amber", "rose", "indigo", "emerald"]}
                    valueFormatter={dataFormatter}
                    yAxisWidth={48}
                />
            </Card>

            <Card className={""}>
                <Title>Đơn hàng theo các tháng từ 6/2022</Title>
                <BarChart
                    className="mt-6"
                    data={testDataOrders}
                    index="title"
                    categories={["Số đơn hàng"]}
                    colors={["teal", "amber", "rose", "indigo", "emerald"]}
                    valueFormatter={dataFormatter}
                    yAxisWidth={48}
                />
            </Card>

        </div>
    );
};

Page.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default Page;
