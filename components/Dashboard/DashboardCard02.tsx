import React from "react";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { useRouter } from "next/router";


type Props = {}

const DashboardCard02: React.FC<Props> = ({ }) => {
   

    const chartdata = [
        {
          name: "Hội sách TP. HCM ",
          "Doanh thu của hội sách": 248800,
        },
        {
          name: "Hội sách TP. HCM - Tháng 4/2023",
          "Doanh thu của hội sách": 204500,
        },
        {
          name: "Hội sách trực tiếp test ",
          "Doanh thu của hội sách": 174300,
        },
        {
            name: "Hội sách thiếu nhi",
            "Doanh thu của hội sách": 154300,
          },
          {
            name: "Hội sách mùa hè Boek 2 ",
            "Doanh thu của hội sách": 124300,
          },
          {
            name: "Hội sách mùa hè Boek",
            "Doanh thu của hội sách": 104300,
          },
          {
            name: "New campaign",
            "Doanh thu của hội sách": 84300,
          },
          {
            name: "New recurring campaign for order testing",
            "Doanh thu của hội sách": 74300,
          },
      ];
    
    const dataFormatter = (number: number) => {
      return "VND " + Intl.NumberFormat("us").format(number).toString();
    };
    const router = useRouter();

    return (
        <Card>
        <Title>Doanh thu của các hội sách trong 01/02/2022 – 16/04/2023</Title>
        <Subtitle>
        Doanh thu của các hội sách trong khoảng thời gian nhất định.
        </Subtitle>
        <BarChart
          className="mt-6"
          data={chartdata}
          index="name"
          categories={["Doanh thu của hội sách"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
          yAxisWidth={58}
          onClick={() => router.push("/issuer/dashboard")
        }
        />
      </Card>
    );
};

export default DashboardCard02;