import React from "react";
import {
    CampaignFormats,
    getCampaignFormatById,
} from "../../constants/CampaignFormats";

type Props = {
    formatId?: number;
};

const FormatCard = ({ formatId }: Props) => {
    let iconFill = "";
    let borderColor = "";
    let textColor = "text-slate-600";
    let bgColor = "bg-slate-50";
    if (formatId === CampaignFormats.OFFLINE.id) {
        iconFill = "fill-amber-500";
        borderColor = "border-amber-500";
        textColor = "text-amber-600";
        bgColor = "bg-amber-50";
    }
    if (formatId === CampaignFormats.ONLINE.id) {
        iconFill = "fill-green-500";
        borderColor = "border-green-500";
        textColor = "text-green-600";
        bgColor = "bg-green-50";
    }
    return (
        <div
            className={`flex items-center text-xs w-fit px-3 py-1 font-semibold uppercase rounded-sm ${bgColor} border ${borderColor} ${textColor}`}
        >
            {getCampaignFormatById(formatId)?.icon({
                className: `mr-2 ${iconFill}`,
            })}
            {getCampaignFormatById(formatId)?.name || "Không xác định"}
        </div>
    );
};

export default FormatCard;
