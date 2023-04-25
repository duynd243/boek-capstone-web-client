import React from "react";
// import { tailwindConfig, hexToRGB } from "../../utils/tailwind";
import { rgba } from 'polished';
import {
    Card,
    List,
    ListItem,
    Icon,
    Text,
    Bold,
    Flex,
    Title,
    Button,
    Color,
    Grid,
  } from "@tremor/react";

  import {
    BriefcaseIcon,
    ShieldExclamationIcon,
    ShoppingBagIcon,
    HomeIcon,
    TruckIcon,
  } from "@heroicons/react/24/solid";

  import {ArrowDownLeftIcon} from "@heroicons/react/24/outline";

  type TransactionCategory = {
  name: string;
  icon: any;
  color: Color;
  numTransactions: number;
  amount: string;
};



  type Props = {}
const DashboardCard03: React.FC<Props> = ({}) => {
    const march: TransactionCategory[] = [
        {
          name: "Trần Thanh Hải",
          icon: ShoppingBagIcon,
          color: "sky",
          numTransactions: 24,
          amount: "20,000 VND",
        },
        {
          name: "Nguyễn Trung Hiếu",
          icon: ShoppingBagIcon,
          color: "orange",
          numTransactions: 4,
          amount: "100,000 VND",
        },
        {
          name: "Nguyễn Thị Hồng Nhung",
          icon: BriefcaseIcon,
          color: "pink",
          numTransactions: 11,
          amount: "1,000,000 VND",
        },
        {
          name: "Nguyễn Nhung",
          icon: ShieldExclamationIcon,
          color: "emerald",
          numTransactions: 2,
          amount: "200,000 VND",
        },
      ];
      const months = [
        {
          name: "Tháng 3 2023",
          data: march,
        },
      ];
    return (
        <Grid numColsSm={1} numColsLg={1} className="gap-6">
        {months.map((item) => (
          <Card key={item.name}>
            <Title>Chi tiêu khách hàng</Title>
            <Text>{item.name}</Text>
            <List className="mt-4">
              {item.data.map((transaction) => (
                <ListItem key={transaction.name}>
                  <Flex justifyContent="start" className="truncate space-x-4">
                    <Icon
                      variant="light"
                      icon={transaction.icon}
                      size="md"
                      color={transaction.color}
                    />
                    <div className="truncate">
                      <Text className="truncate">
                        <Bold>{transaction.name}</Bold>
                      </Text>
                      <Text className="truncate">
                        {`${transaction.numTransactions} đơn hàng`}
                      </Text>
                    </div>
                  </Flex>
                  <Text>{transaction.amount}</Text>
                </ListItem>
              ))}
            </List>
            <Button
              size="sm"
              variant="light"
              icon={ArrowDownLeftIcon}
              iconPosition="right"
              className="mt-4"
            >
              View details
            </Button>
          </Card>
        ))}
      </Grid>
    );
};

export default DashboardCard03;