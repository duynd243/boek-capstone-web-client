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
import {GiShop} from "react-icons/gi";
import {ImBook} from "react-icons/im";
import {IoMedalSharp} from "react-icons/io5";
import {MdContactMail} from "react-icons/md";

export interface ISidebarMenu {
    name: string;
    path: string; // also used as key
    icon?: React.ReactNode;
}

export interface ISidebarMenuGroup {
    groupName: string;
    menus: ISidebarMenu[];
}

export const ADMIN_SETTINGS_MENUS: ISidebarMenu[] = [
    {
        name: "Hồ sơ",
        path: "/admin/settings/profile",
    },
    {
        name: "Cài đặt khác",
        path: "/admin/settings/other",
    },
];

export const ISSUER_SETTINGS_MENUS: ISidebarMenu[] = [
    {
        name: "Hồ sơ",
        path: "/issuer/settings/profile",
    },
    {
        name: "Cài đặt khác",
        path: "/issuer/settings/other",
    },
];
export const ADMIN_SIDEBAR_MENUS: ISidebarMenuGroup[] = [
    {
        groupName: "Thống kê",
        menus: [
            {
                name: "Tổng quan",
                path: "/admin",
                icon: <BsFillPieChartFill/>,
            },
        ],
    }, {
        groupName: "Kinh doanh",
        menus: [
            {
                name: "Hội sách",
                path: "/admin/campaigns",
                icon: <GiShop/>,
            },
            {
                name: "Tham gia hội sách",
                path: "/admin/participants",
                icon: <MdContactMail/>,
            },
            {
                name: "Khách hàng",
                path: "/admin/customers",
                icon: <BsFillPeopleFill/>,
            },
            {
                name: "Đơn hàng",
                path: "/admin/orders",
                icon: <BsFillFileEarmarkMedicalFill/>,
            },
            {
                name: "Cấp độ khách hàng",
                path: "/admin/levels",
                icon: <IoMedalSharp/>,
            },
        ],
    },
    {
        groupName: "Đối tác",
        menus: [
            {
                name: "Nhà phát hành",
                path: "/admin/issuers",
                icon: <BsStack/>,
            },


            {
                name: "Tổ chức",
                path: "/admin/organizations",
                icon: <BsFillDiagram3Fill/>,
            },
            {
                name: "Nhóm",
                path: "/admin/groups",
                icon: <BsCollectionFill/>,
            },

        ],
    },
    {
        groupName: "Hệ thống",
        menus: [

            {
                name: "Kho sách",
                path: "/admin/books",
                icon: <ImBook/>,
            },
            {
                name: "Nhà xuất bản",
                path: "/admin/publishers",
                icon: <BsPrinterFill/>,
            },
            {
                name: "Tác giả",
                path: "/admin/authors",
                icon: <BsFillPenFill/>,
            },
            {
                name: "Thể loại sách",
                path: "/admin/categories",
                icon: <BsFillTagsFill/>,
            },
            {
                name: "Nhân sự",
                path: "/admin/personnels",
                icon: <BsFillBriefcaseFill/>,
            },
        ],
    },

    {
        groupName: "Cài đặt",
        menus: [
            {
                name: "Cài đặt",
                path: "/admin/settings",
                icon: <BsFillGearFill/>,
            },
        ],
    },
];

export const ISSUER_SIDEBAR_MENUS: ISidebarMenuGroup[] = [
    {
        groupName: "Hệ Thống",
        menus: [
            {
                name: "Thống kê",
                path: "/issuer",
                icon: <BsFillPieChartFill/>,
            },

            {
                name: "Hội sách",
                path: "/issuer/campaigns",
                icon: <BsFillCalendarWeekFill/>,
            },
            {
                name: "Đơn hàng",
                path: "/issuer/orders",
                icon: <BsFillFileEarmarkMedicalFill/>,
            },
        ],
    },
    {
        groupName: "Đối tác",
        menus: [
            {
                name: "Kho sách",
                path: "/issuer/books",
                icon: <ImBook/>,
            },
            {
                name: "Nhà xuất bản",
                path: "/admin/publishers",
                icon: <BsPrinterFill/>,
            },
            {
                name: "Tác giả",
                path: "/admin/authors",
                icon: <BsFillPenFill/>,
            },
            {
                name: "Thể loại sách",
                path: "/admin/categories",
                icon: <BsFillTagsFill/>,
            },
            {
                name: "Cài đặt",
                path: "/issuer/settings/profile",
                icon: <BsFillGearFill/>,
            },
        ],
    },
];
