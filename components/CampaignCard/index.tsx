import Image from "next/image";
import Link from "next/link";
import React, { memo, useMemo } from "react";
import { BsCalendarWeek, BsThreeDots } from "react-icons/bs";
import { IoMdInformation } from "react-icons/io";
import { IoLocationSharp, IoPeopleSharp } from "react-icons/io5";
import NoImage from "../../assets/images/no-image.png";
import { ParticipantStatuses } from "../../constants/ParticipantStatuses";
import { useAuth } from "../../context/AuthContext";
import { ICampaign } from "../../types/Campaign/ICampaign";
import { getFormattedTime } from "../../utils/helper";
import AvatarGroup from "../AvatarGroup";
import FormatCard from "./FormatCard";
type Props = {
    campaign: ICampaign;
};

const CampaignCard: React.FC<Props> = ({ campaign }) => {

    const issuerAvatars = useMemo(() => {
        return (
            campaign?.participants
                ?.filter(
                    (p) =>
                        p?.status === ParticipantStatuses.RequestApproved.id ||
                        p?.status === ParticipantStatuses.InvitationAccepted.id
                )
                .map((p) => {
                    return {
                        src: p?.issuer?.user?.imageUrl,
                        title: p?.issuer?.user?.name,
                    };
                }) || []
        );
    }, [campaign]);

    console.log("issuerAvatars", issuerAvatars);                    

    const metadataItemClassName = {
        container: "flex items-center justify-between gap-3",
        label: {
            container: "flex items-center gap-2 min-w-fit",
            text: "text-slate-700 text-sm font-medium",
            icon: "fill-slate-500 bg-slate-100 w-5 h-5 rounded-full",
        },
        value: "text-sm font-medium text-slate-600 line-clamp-1",
    };
    return (
        <Link
            href={`campaigns/${campaign?.id}`}
            className="relative border cursor-pointer transition-all duration-300 shadow rounded overflow-hidden flex flex-col xl:flex-row"
        >
            <Image
                src={campaign?.imageUrl || NoImage.src}
                width={1000}
                height={1000}
                className="object-cover w-full h-48 xl:h-auto xl:w-1/3"
                alt=""
            />

            {/* Info */}
            <div className="p-4 flex-1 min-w-0 flex flex-col">
                <div className="flex-1 min-w-0">
                    {/* Time */}
                    <div className="flex text-blue-600 items-center gap-1.5 text-sm font-medium uppercase tracking-wide ">
                        <div className="bg-blue-50 p-2 rounded">
                            <BsCalendarWeek
                                className="fill-blue-600 w-3 h-3"
                                size={12}
                            />
                        </div>
                        <span>
                            {getFormattedTime(
                                campaign?.startDate,
                                "dd/MM/yyyy"
                            )}
                            {" - "}
                            {getFormattedTime(campaign?.endDate, "dd/MM/yyyy")}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="text-slate-800 font-semibold lg:font-bold text-xl line-clamp-2">
                        {campaign?.name}
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-slate-600 text-sm overflow-hidden overflow-ellipsis line-clamp-3">
                        {campaign?.description}
                    </p>
                </div>

                {/* Metadata */}
                <div className="mt-5 space-y-2.5 border p-3 rounded">
                    <div
                        className={`${metadataItemClassName.container} flex-wrap`}
                    >
                        <div className={metadataItemClassName.label.container}>
                            <IoMdInformation
                                size={12}
                                className={metadataItemClassName.label.icon}
                            />
                            <span className={metadataItemClassName.label.text}>
                                Hình thức
                            </span>
                        </div>
                        <FormatCard formatId={campaign?.format} />
                    </div>
                    <div
                        className={`${metadataItemClassName.container} min-w-0`}
                    >
                        <div className={metadataItemClassName.label.container}>
                            <IoLocationSharp
                                className={`${metadataItemClassName.label.icon} p-1`}
                            />
                            <span className={metadataItemClassName.label.text}>
                                Địa điểm
                            </span>
                        </div>
                        <span
                            title={campaign?.address}
                            className={metadataItemClassName.value}
                        >
                            {campaign?.address || "Chưa có thông tin"}
                        </span>
                    </div>
                    <div
                        className={`${metadataItemClassName.container} flex-wrap`}
                    >
                        <div className={metadataItemClassName.label.container}>
                            <IoPeopleSharp
                                className={`${metadataItemClassName.label.icon} p-1`}
                            />
                            <span className={metadataItemClassName.label.text}>
                                Nhà phát hành
                            </span>
                        </div>
                        {/* <span className="text-sm font-medium text-slate-600">
                            
                        </span> */}
                        {issuerAvatars.length > 0 ? (
                            <AvatarGroup
                                avatars={issuerAvatars}
                                max={3}
                                size={26}
                                restTitle="nhà phát hành khác"
                            />
                        ) : (
                            <span className={metadataItemClassName.value}>
                                Chưa có NPH tham gia
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Status Card */}
            <button className="border rounded-full absolute bg-white p-1.5 top-3 right-3">
                <BsThreeDots className="fill-slate-600" />
            </button>
        </Link>
    );
};

export default memo(CampaignCard);
