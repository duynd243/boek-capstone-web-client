
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
    BsFillPersonVcardFill,
    BsFillPieChartFill,
    BsFillTagsFill,
    BsPrinterFill,
    BsStack,
} from "react-icons/bs";
import { GiShop } from "react-icons/gi";
import { ImBook } from "react-icons/im";
import { IoMedalSharp } from "react-icons/io5";
import { MdBook, MdContactMail } from "react-icons/md";

export interface ISidebarMenu {
    name: string;
    path: string; // also used as key
    icon?: React.ReactNode;
    subMenus?: ISidebarMenu[];
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

export const CUSTOMER_SETTINGS_MENUS: ISidebarMenu[] = [
    {
        icon: <BsFillPersonVcardFill />,
        name: "Hồ sơ",
        path: "/profile",
    },
    {
        icon: <BsFillFileEarmarkMedicalFill />,
        name: "Đơn hàng",
        path: "/orders",
    },
    {
        name: "Cài đặt khác",
        path: "/other",
    },
];


export const ADMIN_SIDEBAR_MENUS: ISidebarMenuGroup[] = [
    {
        groupName: "Hệ thống",
        menus: [
            {
                name: "Thống kê",
                path: "/admin",
                icon: <BsFillPieChartFill />,
            },
            {
                name: "Hội sách",
                path: "/admin/campaigns",
                icon: <GiShop />,
            },
            {
                name: "Tham gia hội sách",
                path: "/admin/participants",
                icon: <MdContactMail />,
            },
            {
                name: "Sách bán",
                path: "/admin/products",
                icon: <MdBook />,
            },
            {
                name: "Đơn hàng",
                path: "admin/orders",
                icon: <BsFillFileEarmarkMedicalFill />,
                subMenus: [
                    {
                        name: "Đơn giao",
                        path: "/admin/orders/delivery",
                    },
                    {
                        name: "Đơn tại quầy",
                        path: "/admin/orders/pickup",
                    },
                    // {
                    //     name: "Mocks",
                    //     path: "/admin/orders",
                    // },
                ],
            },
            // {
            //     name: "Đơn hàng trực tuyến",
            //     path: "/admin/orders",
            //     icon: <BsFillFileEarmarkMedicalFill />,
            // },
            // {
            //     name: "Đơn hàng hội sách",
            //     path: "/admin/orders2",
            //     icon: <BsFillFileEarmarkMedicalFill />,
            // },
            {
                name: "Nhân sự",
                path: "/admin/personnels",
                icon: <BsFillBriefcaseFill />,
            },
        ],
    },
    {
        groupName: "Đối tác",
        menus: [
            {
                name: "Nhà phát hành",
                path: "/admin/issuers",
                icon: <BsStack />,
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
                name: "Tác giả",
                path: "/admin/authors",
                icon: <BsFillPenFill />,
            },
            {
                name: "Thể loại sách",
                path: "/admin/genres",
                icon: <BsFillTagsFill />,
            },
        ],
    },
    {
        groupName: "Khách hàng",
        menus: [
            {
                name: "Khách hàng",
                path: "/admin/customers",
                icon: <BsFillPeopleFill />,
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

            {
                name: "Cấp độ khách hàng",
                path: "/admin/levels",
                icon: <IoMedalSharp />,
            },
        ],
    },

    {
        groupName: "Cài đặt",
        menus: [
            {
                name: "Cài đặt",
                path: "/admin/settings/profile",
                icon: <BsFillGearFill />,
            },
        ],
    },
];

// export const ISSUER_SIDEBAR_MENUS: ISidebarMenuGroup[] = [
//     {
//         groupName: "Chung",
//         menus: [
//             {
//                 name: "Tổng quan",
//                 path: "/issuer",
//                 icon: <BsFillPieChartFill/>,
//             },
//
//             {
//                 name: "Hội sách",
//                 path: "/issuer/campaigns",
//                 icon: <BsFillCalendarWeekFill/>,
//             },
//             {
//                 name: "Tham gia hội sách",
//                 path: "/issuer/participants",
//                 icon: <MdContactMail/>,
//             },
//             {
//                 name: "Kho sách",
//                 path: "/issuer/books",
//                 icon: <ImBook/>,
//             },
//             {
//                 name: "Đơn hàng",
//                 path: "/issuer/orders",
//                 icon: <BsFillFileEarmarkMedicalFill/>,
//             },
//         ],
//     },
//     {
//         groupName: "Cài đặt",
//         menus: [
//             {
//                 name: "Cài đặt",
//                 path: "/issuer/settings",
//                 icon: <BsFillGearFill/>,
//             },
//         ],
//     },
// ];

export const ISSUER_SIDEBAR_MENUS: ISidebarMenuGroup[] = [
    {
        groupName: "Hệ Thống",
        menus: [
            {
                name: "Thống kê",
                path: "/issuer",
                icon: <BsFillPieChartFill />,
            },

            {
                name: "Hội sách",
                path: "/issuer/campaigns",
                icon: <BsFillCalendarWeekFill />,
            },
            {
                name: "Tham gia hội sách",
                path: "/issuer/participants",
                icon: <MdContactMail />,
            },
            {
                name: "Sách bán",
                path: "/issuer/products",
                icon: <MdBook />,
            },
            {
                name: "Đơn hàng",
                path: "issuer/orders",
                icon: <BsFillFileEarmarkMedicalFill />,
                subMenus: [
                    {
                        name: "Đơn giao",
                        path: "/issuer/orders/delivery",
                    },
                    {
                        name: "Đơn tại quầy",
                        path: "/issuer/orders/pickup",
                    },
                ]
            },
        ],
    },
    {
        groupName: "Đối tác",
        menus: [
            {
                name: "Kho sách",
                path: "/issuer/books",
                icon: <ImBook />,
            },
            // {
            //     name: "Nhà xuất bản",
            //     path: "/admin/publishers",
            //     icon: <BsPrinterFill />,
            // },
            // {
            //     name: "Tác giả",
            //     path: "/admin/authors",
            //     icon: <BsFillPenFill />,
            // },
            // {
            //     name: "Thể loại sách",
            //     path: "/admin/categories",
            //     icon: <BsFillTagsFill />,
            // },
            {
                name: "Cài đặt",
                path: "/issuer/settings/profile",
                icon: <BsFillGearFill />,
            },
        ],
    },
];