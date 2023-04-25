import React from "react";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { useRouter } from "next/router";


type Props = {}

const DashboardCard04: React.FC<Props> = ({ }) => {
   

    const chartdata = [
        {
          name: "09/04/2023",
          "Doanh thu của hội sách": 248800,
        },
        {
          name: "10/04/2023",
          "Doanh thu của hội sách": 204500,
        },
        {
          name: "11/04/2023 ",
          "Doanh thu của hội sách": 174300,
        },
        {
            name: "12/04/2023",
            "Doanh thu của hội sách": 154300,
          },
          {
            name: "13/04/2023 ",
            "Doanh thu của hội sách": 124300,
          },
          {
            name: "14/04/2023",
            "Doanh thu của hội sách": 104300,
          },
          {
            name: "15/04/2023",
            "Doanh thu của hội sách": 84300,
          },
          {
            name: "16/04/2023",
            "Doanh thu của hội sách": 74300,
          },
      ];
    
    const dataFormatter = (number: number) => {
      return "VND " + Intl.NumberFormat("us").format(number).toString();
    };
    const router = useRouter();

    return (
        <Card>
        <Title>Doanh thu của Hội sách TP. HCM - Tháng 4/2023 trong 01/02/2022 – 16/04/2023</Title>
        <Subtitle>
        Doanh thu của hội sách trong các khoảng thời gian nhất định.
        </Subtitle>
        <BarChart
          className="mt-6"
          data={chartdata}
          index="name"
          categories={["Doanh thu của hội sách"]}
          colors={["blue"]}
          valueFormatter={dataFormatter}
          yAxisWidth={58}
        //   onClick={() => router.push("/issuer/dashboard")
        // }
        />
      </Card>
    );
};

export default DashboardCard04;