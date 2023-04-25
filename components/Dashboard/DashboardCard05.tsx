import React from "react";
// import { tailwindConfig, hexToRGB } from "../../utils/tailwind";
import { rgba } from 'polished';

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper";

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
import Image from "next/image";


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
      title: "Số lượng Sách được mua",
      metric: "100 Sách bán",
      metricPrev: "",
      delta: "",
      deltaType: "moderateIncrease",
    },
    {
        title: "Số lượng Sách được mua",
        metric: "201 Sách bán",
        metricPrev: "",
        delta: "",
        deltaType: "moderateIncrease",
      },
    {
        title: "Số lượng Sách được mua",
        metric: "302 Sách bán",
        metricPrev: "",
        delta: "",
        deltaType: "moderateIncrease",
      },
      {
        title: "Số lượng Sách được mua",
        metric: "403 Sách bán",
        metricPrev: "",
        delta: "",
        deltaType: "moderateIncrease",
      },
      {
        title: "Số lượng Sách được mua",
        metric: "504 Sách bán",
        metricPrev: "",
        delta: "",
        deltaType: "moderateIncrease",
      },
      {
        title: "Số lượng Sách được mua",
        metric: "605 Sách bán",
        metricPrev: "",
        delta: "",
        deltaType: "moderateIncrease",
      },
  ];
type Props = {}

const DashboardCard05: React.FC<Props> = ({}) => {
    
    return (
       
        <Swiper
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
            >
                 
                   
                {categories.map((item) => (
                     <SwiperSlide key={item.title}>
                     <Grid numCols={1} numColsSm={2} numColsLg={3} className="gap-6">
                     <Card>
                         <Flex
                            justifyContent="start"
                            alignItems="baseline"
                            className="truncate space-x-2 mt-4"
                            >
                             <Text>{item.title}</Text>
                             <Metric>{item.metric}</Metric>
           <Text className="truncate"> {item.metricPrev}</Text>
         </Flex>
         <Flex justifyContent="start" className="space-x-2 mt-4">
           {/* <BadgeDelta deltaType={item.deltaType} /> */}
           <Flex justifyContent="start" className="space-x-1 truncate">
             <Text color={colors[item.deltaType]}>{item.delta}</Text>
             <Text className="truncate"> Con chó nhỏ mang giỏ hoa hồng </Text>
           </Flex>
         </Flex>
         <div>
         <Image
                     width={500}
                     height={500}
                     className={'rounded-md w-40 h-50 object-cover max-w-full shadow-md'}
                     alt=""
                     src={'https://salt.tikicdn.com/ts/product/1a/f2/81/da77c137005b688731f5e6c21f3534ec.jpg'} />
         </div>
         </Card>
         </Grid>
         </SwiperSlide>
          
            ))}          
        </Swiper>
     
    );
};

export default DashboardCard05;