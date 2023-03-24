import {IconType} from "react-icons";
import {HiStatusOnline} from "react-icons/hi";
import {HiBuildingStorefront} from "react-icons/hi2";

type ICampaignFormat = {
    id: number;
    icon: IconType;
    name: string;
    iconBackground: string;
    description: string;
};

export const CampaignFormats = {
    OFFLINE: {
        id: 1,
        icon: HiBuildingStorefront,
        name: "Trực tiếp",
        iconBackground: "bg-rose-500",
        description: "Hội sách được tổ chức trực tiếp tại một địa điểm cụ thể",
    },
    ONLINE: {
        id: 2,
        icon: HiStatusOnline,
        name: "Trực tuyến",
        iconBackground: "bg-green-500",
        description:
            "Hội sách được tổ chức trực tuyến, không cần đến địa điểm cụ thể",
    },
} satisfies Record<string, ICampaignFormat>;

export function getCampaignFormatById(
    id?: number
): ICampaignFormat | undefined {
    return Object.values(CampaignFormats).find((format) => format.id === id);
}

export const CampaignFormatTabs = [
    {
        id: undefined,
        name: "Tất cả hình thức",
    },
    ...Object.values(CampaignFormats),
];
