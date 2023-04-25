import React from "react";
// import { tailwindConfig, hexToRGB } from "../../utils/tailwind";
import { rgba } from 'polished';

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper";

import { BarList, Card, Title, Bold, Flex, Text } from "@tremor/react";

type Props = {}
const data = [
    {
        name: '🟡Đang xử lí',
        value: 456,
        href: 'https://twitter.com/tremorlabs',
       
    },
    {
        name: '🔵Đang vận chuyển',
        value: 351,
        href: 'https://google.com',
    },
    {
        name: '🔵Đợi nhận hàng',
        value: 271,
        href: 'https://github.com/tremorlabs/tremor',
    },
    {
        name: '🟢Đã giao',
        value: 191,
        href: 'https://reddit.com',
    },
    {
        name: '🟢Đã nhận',
        value: 91,
        href: 'https://www.youtube.com/@tremorlabs3079',
    },
    {
        name: '🔴Đã hủy',
        value: 5,
        href: 'https://www.youtube.com/@tremorlabs3079',
    },
];
const DashboardCard06: React.FC<Props> = ({}) => {
    
    return (
        <Card className="max-w-lg">
        <Title>01/02/2023 – 18/04/2023</Title>
        <Flex className="mt-4">
          <Text>
            <Bold>Trạng thái</Bold>
          </Text>
          <Text>
            <Bold>Số lượng</Bold>
          </Text>
        </Flex>
        <BarList data={data} className="mt-2" />
      </Card>
    );
};

export default DashboardCard06;