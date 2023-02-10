import {HiStatusOnline} from "react-icons/hi";
import {HiArrowsUpDown, HiBuildingStorefront} from "react-icons/hi2";
import React from "react";

export class CampaignFormats {

    static readonly OFFLINE = {
        id: 1,
        icon: <HiBuildingStorefront className="fill-white"/>,
        name: "Trực tiếp",
        iconBackground: "bg-rose-500",
        description: "Hội sách được tổ chức trực tiếp tại một địa điểm cụ thể",
    };
    static readonly ONLINE = {
        id: 2,
        icon: <HiStatusOnline className="fill-white"/>,
        name: "Trực tuyến",
        iconBackground: "bg-green-500",
        description:
            "Hội sách được tổ chức trực tuyến, không cần đến địa điểm cụ thể",
    };
    // static readonly BOTH = {
    //     id: 3,
    //     icon: <HiArrowsUpDown className="fill-white"/>,
    //     name: "Cả hai",
    //     iconBackground: "bg-blue-500",
    //     description: "Hội sách được tổ chức cả trực tuyến và trực tiếp",
    // };
}
