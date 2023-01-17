import React from "react";

import {
  BsCollectionFill,
  BsFillBriefcaseFill,
  BsFillCalendarWeekFill,
  BsFillDiagram3Fill,
  BsFillFileEarmarkMedicalFill,
  BsFillGearFill,
  BsFillPenFill,
  BsFillPeopleFill,
  BsFillPieChartFill,
  BsFillTagsFill,
  BsPrinterFill,
  BsStack,
} from "react-icons/bs";
import { GiShop } from "react-icons/gi";
import { ImBook } from "react-icons/im";
import { IoMedalSharp } from "react-icons/io5";

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
        name: "Kho sách",
        path: "/admin/books",
        icon: <ImBook />,
      },
      {
        name: "Nhà xuất bản",
        path: "/admin/publishers",
        icon: <BsPrinterFill />,
      },
      {
        name: "Khách hàng",
        path: "/admin/customers",
        icon: <BsFillPeopleFill />,
      },
      {
        name: "Nhà phát hành",
        path: "/admin/issuers",
        icon: <BsStack />,
      },
      {
        name: "Nhân sự",
        path: "/admin/personnels",
        icon: <BsFillBriefcaseFill />,
      },
      {
        name: "Đơn hàng",
        path: "/admin/orders",
        icon: <BsFillFileEarmarkMedicalFill />,
      },
      {
        name: "Cấp độ khách hàng",
        path: "/admin/levels",
        icon: <IoMedalSharp />,
      },
      {
        name: "Tác giả",
        path: "/admin/authors",
        icon: <BsFillPenFill />,
      },
      {
        name: "Thể loại sách",
        path: "/admin/categories",
        icon: <BsFillTagsFill />,
      },
      {
        name: "Tổ chức",
        path: "/admin/organizations",
        icon: <BsFillDiagram3Fill />,
      },
      {
        name: "Nhóm",
        path: "/admin/groups",
        icon: <BsCollectionFill />,
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
export const ISSUER_SIDEBAR_MENUS: ISidebarMenuGroup[] = [
  {
    groupName: "Chung",
    menus: [
      {
        name: "Tổng quan",
        path: "/issuer",
        icon: <BsFillPieChartFill />,
      },

      {
        name: "Hội sách",
        path: "/issuer/campaigns",
        icon: <BsFillCalendarWeekFill />,
      },
      {
        name: "Kho sách",
        path: "/issuer/books",
        icon: <ImBook />,
      },
      {
        name: "Đơn hàng",
        path: "/issuer/orders",
        icon: <BsFillFileEarmarkMedicalFill />,
      },
    ],
  },
  {
    groupName: "Cài đặt",
    menus: [
      {
        name: "Cài đặt",
        path: "/issuer/settings",
        icon: <BsFillGearFill />,
      },
    ],
  },
];
