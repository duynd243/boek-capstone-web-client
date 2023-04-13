import React from "react";
import Image from "next/image";
import { IUser } from "../types/User/IUser";
import { HiPhone } from "react-icons/hi2";
import { HiMail } from "react-icons/hi";
import DefaultCover from "../assets/images/default-cover.jpg";
import DefaultAvatar from "../assets/images/default-avatar.png";
import { isValidImageSrc } from "../utils/helper";

type Props = {
    issuer?: IUser;

}

const IssuerHoverCard: React.FC<Props> = ({ issuer }) => {
    return (
        <div className={"bg-slate-50 z-0 overflow-hidden relative min-w-md select-none shadow-lg rounded-lg p-4"}>
            <Image
                src={DefaultCover.src}
                width={300}
                height={300}
                alt={""}
                className={"absolute -z-10 top-0 right-0 left-0 w-full h-12 object-cover"} />
            <Image
                width={500}
                height={500}
                className="rounded-full z-10 w-12 h-12 object-cover border-2 border-white"
                src={issuer?.imageUrl && isValidImageSrc(issuer?.imageUrl)
                    ? issuer?.imageUrl
                    : DefaultAvatar.src} alt={""} />
            <div className={"text-sm font-semibold text-slate-700 mt-2"}>
                {issuer?.name}
            </div>
            <div className={"mt-2 space-y-1"}>
                <div className={"flex items-center gap-1 text-sm text-gray-500"}>
                    <HiMail />
                    {issuer?.email}
                </div>
                <div className={"flex items-center gap-1 text-sm text-gray-500"}>
                    <HiPhone />
                    {issuer?.phone}
                </div>
            </div>
        </div>
    );
};

export default IssuerHoverCard;