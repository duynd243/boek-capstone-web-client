import React from "react";
// import { tailwindConfig, hexToRGB } from "../../utils/tailwind";
import { rgba } from 'polished';

import {
    Card,
    Metric,
    Text,
    Flex,
    BadgeDelta,
    DeltaType,
    Color,
    Grid,
  } from "@tremor/react";
  
  const colors: { [key: string]: Color } = {
    increase: "emerald",
    moderateIncrease: "emerald",
    unchanged: "orange",
    moderateDecrease: "rose",
    decrease: "rose",
  };
  
  const categories: {
    title: string;
    metric: string;
    metricPrev: string;
    delta: string;
    deltaType: DeltaType;
  }[] = [
    {
      title: "Số lượng Đơn hàng",
      metric: "160 Đơn",
      metricPrev: "90 Đơn",
      delta: "70 Đơn",
      deltaType: "moderateIncrease",
    },
    {
      title: "Số lượng Sách được mua",
      metric: "200 Sản phẩm",
      metricPrev: "150 Sản phẩm",
      delta: "50 Sản phẩm",
      deltaType: "moderateDecrease",
    },
    {
      title: "Customers",
      metric: "1,072",
      metricPrev: "856",
      delta: "25.3%",
      deltaType: "moderateIncrease",
    },
  ];
type Props = {}

const DashboardCard01: React.FC<Props> = ({}) => {
    
    return (
        <Grid numColsSm={2} numColsLg={3} className="gap-6">
        {categories.map((item) => (
          <Card key={item.title}>
            <Text>{item.title}</Text>
            <Flex
              justifyContent="start"
              alignItems="baseline"
              className="truncate space-x-3"
            >
              <Metric>{item.metric}</Metric>
              <Text className="truncate">từ {item.metricPrev}</Text>
            </Flex>
            <Flex justifyContent="start" className="space-x-2 mt-4">
              <BadgeDelta deltaType={item.deltaType} />
              <Flex justifyContent="start" className="space-x-1 truncate">
                <Text color={colors[item.deltaType]}>{item.delta}</Text>
                <Text className="truncate"> so với ngày hôm qua </Text>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Grid>
    );
};

export default DashboardCard01;