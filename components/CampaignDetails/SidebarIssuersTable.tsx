import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import { CampaignStatuses } from "../../constants/CampaignStatuses";
import { ParticipantStatuses } from "../../constants/ParticipantStatuses";
import { Roles } from "../../constants/Roles";
import { useAuth } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";
import InviteIssuerModal from "../Modal/InviteIssuerModal";
import DefaultAvatar from "./../../assets/images/default-avatar.png";
import SidebarBlockWrapper from "./SidebarBlockWrapper";

type Props = {
    maxRows?: number;
};

const SidebarIssuersTable: React.FC<Props> = ({ maxRows = 10 }) => {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const { loginUser } = useAuth();

    const campaign = useContext(CampaignContext);
    const joinedIssuers =
        campaign?.participants
            ?.filter(
                (p) =>
                    p?.status === ParticipantStatuses.RequestApproved.id ||
                    (p?.status === ParticipantStatuses.InvitationAccepted.id &&
                        p?.issuer)
            )
            ?.map((p) => p?.issuer?.user) || [];

    const isAdmin = loginUser?.role === Roles.SYSTEM.id;
    const showInviteIssuer =
        isAdmin && campaign?.status === CampaignStatuses.NOT_STARTED.id;

    return (
        <SidebarBlockWrapper>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-1">
                <div className="text-base font-semibold text-slate-800">
                    Nhà phát hành tham gia ({joinedIssuers?.length})
                </div>
                {joinedIssuers?.length > 0 &&
                    joinedIssuers?.length > maxRows && (
                        <button className="text-base font-medium text-indigo-500 hover:text-indigo-600 disabled:text-gray-500">
                            Xem tất cả
                        </button>
                    )}
            </div>
            {joinedIssuers?.length === 0 ? (
                <div className="text-sm text-slate-500">
                    Sự kiện này hiện chưa có nhà phát hành nào tham gia.
                </div>
            ) : (
                <ul className="space-y-3.5">
                    {joinedIssuers?.slice(0, maxRows).map((issuer) => (
                        <li key={issuer?.id}>
                            <div className="flex justify-between">
                                <div className="flex grow items-center">
                                    <div className="relative mr-3">
                                        <Image
                                            className="h-8 w-8 rounded-full"
                                            src={
                                                issuer?.imageUrl ||
                                                DefaultAvatar.src
                                            }
                                            width="32"
                                            height="32"
                                            alt="User 08"
                                        />
                                    </div>
                                    <div className="truncate">
                                        <span className="text-sm font-medium text-slate-800">
                                            {issuer?.name}
                                        </span>
                                    </div>
                                </div>
                                <button className="rounded-full text-slate-400 hover:text-slate-500">
                                    <span className="sr-only">Menu</span>
                                    <svg
                                        className="h-8 w-8 fill-current"
                                        viewBox="0 0 32 32"
                                    >
                                        <circle cx="16" cy="16" r="2" />
                                        <circle cx="10" cy="16" r="2" />
                                        <circle cx="22" cy="16" r="2" />
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {isAdmin && (
                <div className="space-y-2.5 mt-5">
                    {showInviteIssuer && (
                        <>
                            <button
                                className="m-btn bg-indigo-500 text-white w-full"
                                onClick={() => setShowInviteModal(true)}
                            >
                                <AiOutlineUsergroupAdd
                                    className="mr-2.5"
                                    size={17}
                                />
                                Mời NPH tham gia
                            </button>
                        </>
                    )}
                    <Link
                        href={`/admin/participants/campaigns/${campaign?.id}`}
                        className="m-btn bg-slate-50 text-slate-600 w-full border"
                    >
                        Quản lý yêu cầu tham gia
                    </Link>
                </div>
            )}

            {showInviteIssuer && (
                <InviteIssuerModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                />
            )}
        </SidebarBlockWrapper>
    );
};

export default SidebarIssuersTable;
