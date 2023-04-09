import Image from "next/image";
import React, { memo, useMemo } from "react";
import { BsCalendarWeek, BsThreeDots } from "react-icons/bs";
import { IoMdInformation } from "react-icons/io";
import { IoLocationSharp, IoPeopleSharp } from "react-icons/io5";
import NoImage from "../../assets/images/no-image.png";
import { ParticipantStatuses } from "../../constants/ParticipantStatuses";
import { ICampaign } from "../../types/Campaign/ICampaign";
import { getFormattedTime } from "../../utils/helper";
import AvatarGroup from "../AvatarGroup";
import FormatCard from "./FormatCard";
import IssuerHoverCard from "../IssuerHoverCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { CampaignFormats } from "../../constants/CampaignFormats";
import { CampaignStatuses, getCampaignStatusById } from "../../constants/CampaignStatuses";


type Props = {
    horizontalOnly?: boolean;
    campaign: ICampaign;
};

const CampaignCard: React.FC<Props> = ({ campaign, horizontalOnly = false }) => {

    const campaignStatus = useMemo(() => getCampaignStatusById(campaign?.status), [campaign]);

    const issuerAvatars = useMemo(() => {
        return (
            campaign?.participants
                ?.filter(
                    (p) =>
                        p?.status === ParticipantStatuses.RequestApproved.id ||
                        p?.status === ParticipantStatuses.InvitationAccepted.id,
                )
                .map((p) => {
                    return {
                        src: p?.issuer?.user?.imageUrl,
                        title: p?.issuer?.user?.name,
                    };
                }) || []
        );
    }, [campaign]);

    const href = useMemo(() =>`campaigns/${campaign?.id}`, [campaign]);

    const issuerOfParticipants = useMemo(() => {
        return campaign?.participants?.map((p) => p?.issuer?.user) || [];
    }, [campaign]);
    const issuerHoverCardElements = issuerOfParticipants.map((issuer) => {
        return (
            <IssuerHoverCard issuer={issuer} key={issuer?.id} />
        );
    });


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
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            layout


            //href={`campaigns/${campaign?.id}`}
            className={`relative border shadow rounded overflow-hidden flex flex-col ${horizontalOnly ? "" : "xl:flex-row"}`}
        >
            {/*<div className={'absolute top-0 left-0 z-10 text-white bg-green-500'}>*/}
            {/*    Something*/}
            {/*</div>*/}

            <div
                className="absolute top-2 left-2 z-10 bg-white text-gray-800 m-btn-xs !rounded-full">
                <span
                    className={`mr-2 inline-block h-2 w-2 rounded-full bg-${campaignStatus?.statusColor || "slate"}-500 ${campaign?.status === CampaignStatuses.STARTING.id ? "animate-bounce" : ""}`}
                />
                {campaignStatus?.displayName}
            </div>


            <Link href={href}
                  className={`w-full h-48 ${horizontalOnly ? "" : "xl:h-auto xl:w-52"}`}>
                <Image
                    src={campaign?.imageUrl || NoImage.src}
                    width={1000}
                    height={1000}
                    className="object-cover w-full h-full"
                    alt=""
                />
            </Link>

            {/* Info */}
            <div className="p-4 flex-1 min-w-0 flex flex-col">
                <div className="flex-1 min-w-0">

                    {/* Time */}
                    <div
                        className="flex text-blue-600 items-center gap-1.5 text-sm font-medium uppercase tracking-wide ">
                        <div className="bg-blue-50 p-2 rounded">
                            <BsCalendarWeek
                                className="fill-blue-600 w-3 h-3"
                                size={12}
                            />
                        </div>
                        <span>
                            {getFormattedTime(
                                campaign?.startDate,
                                "dd/MM/yyyy",
                            )}
                            {" - "}
                            {getFormattedTime(campaign?.endDate, "dd/MM/yyyy")}
                        </span>
                    </div>

                    {/* Title */}
                    <Link href={href}
                          className="text-slate-800 font-semibold lg:font-bold text-xl line-clamp-2">
                        {campaign?.name}
                    </Link>

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
                            {campaign?.format === CampaignFormats.OFFLINE.id ? (campaign?.address || "Chưa có thông tin") : "Tổ chức trực tuyến"}
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
                                hoverElements={issuerHoverCardElements}
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
        </motion.div>
    );
};

export default memo(CampaignCard);