import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";

type Props = {
    label: string;
    description?: string;
    href?: string;
    icon: IconType;
};
const CreateCampaignButton: React.FC<Props> = ({
                                                   icon,
                                                   label,
                                                   description,
                                                   href,
                                               }) => {
    return (
        <Link
            href={href || ""}
            className="flex gap-4 rounded-lg p-3 transition duration-150 ease-in-out hover:bg-gray-50
            focus:outline-none focus-visible:ring focus-visible:ring-orange-500 focus-visible:ring-opacity-50"
        >
            <div className="w-30 h-30">
                {icon({
                    size: 45,
                    className: "p-2 fill-indigo-600 bg-indigo-50 rounded",
                })}
            </div>
            <div>
                <p className="text-sm font-medium text-slate-800">{label}</p>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
        </Link>
    );
};

export default CreateCampaignButton;
