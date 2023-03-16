import React from "react";
import {CheckmarkIcon} from "react-hot-toast";

type Props = {
    id: number;
    name: string;
    icon: React.ReactNode;
    description: string;
    checked: boolean;
    iconBackground: string;
};

const CampaignFormatCard: React.FC<Props> = ({
                                                 iconBackground,
                                                 icon,
                                                 id,
                                                 name,
                                                 checked,
                                                 description,
                                             }) => {
    return (
        <div
            className="relative h-full cursor-pointer select-none rounded border-2 border-slate-200 bg-white px-4 py-5 shadow-sm duration-150 ease-in-out ui-checked:border-indigo-400 hover:ui-not-checked:border-slate-300">
            <div className="mb-3 flex flex-wrap items-center gap-2 truncate">
                <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBackground}`}
                >
                    {icon}
                </div>
                <div className="truncate">
                    <span className="text-sm font-medium text-slate-800">{name}</span>
                </div>
            </div>
            {/* Card content */}
            <div className="text-sm text-gray-600">{description}</div>
            {/* Card footer */}
            {checked && (
                <div className="absolute top-2 right-2">
                    <CheckmarkIcon className="h-5 w-5 text-indigo-400"/>
                </div>
            )}
        </div>
    );
};

export default CampaignFormatCard;
