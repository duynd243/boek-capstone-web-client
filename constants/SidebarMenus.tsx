import React from "react";

import {
  BsFillFileEarmarkMedicalFill,
  BsFillGearFill,
  BsFillPenFill,
  BsFillPeopleFill,
  BsFillPieChartFill,
  BsFillTagsFill,
  BsPersonBadgeFill,
} from "react-icons/bs";
import { GiShop } from "react-icons/gi";

export interface ISidebarMenu {
  name: string;
  path: string; // also used as key
  icon?: React.ReactNode;
}

export interface ISidebarMenuGroup {
  groupName: string;
  menus: ISidebarMenu[];
}

export const ADMIN_SIDEBAR_MENUS: ISidebarMenuGroup[] = [
  {
    groupName: "Chung",
    menus: [
      {
        name: "Tổng quan",
        path: "/admin",
        icon: <BsFillPieChartFill />,
      },
      {
        name: "Hội sách",
        path: "/admin/campaigns",
        icon: <GiShop />,
      },
      {
        name: "Nhà xuất bản",
        path: "/admin/publishers",
        icon: <BsPersonBadgeFill />,
      },
      {
        name: "Khách hàng",
        path: "/admin/customers",
        icon: <BsFillPeopleFill />,
      },
      {
        name: "Đơn hàng",
        path: "/admin/orders",
        icon: <BsFillFileEarmarkMedicalFill />,
      },
      {
        name: "Tác giả",
        path: "/admin/authors",
        icon: <BsFillPenFill />,
      },
      {
        name: "Thể loại + Chiết khấu",
        path: "/admin/genres",
        icon: <BsFillTagsFill />,
      },
    ],
  },
  {
    groupName: "Cài đặt",
    menus: [
      {
        name: "Cài đặt",
        path: "/admin/settings",
        icon: <BsFillGearFill />,
      },
    ],
  },
];

export const ISSUER_SIDEBAR_MENUS: ISidebarMenuGroup[] = [];