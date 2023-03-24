import {useQuery} from "@tanstack/react-query";
import React, {useContext, useState} from "react";
import {useAuth} from "../../context/AuthContext";
import {CampaignContext} from "../../context/CampaignContext";
import SidebarBlockWrapper from "./SidebarBlockWrapper";
import CampaignStaffService from "../../services/CampaignStaffService";
import Image from "next/image";
import {AiOutlineUsergroupAdd} from "react-icons/ai";
import AddStaffModal from "../Modal/AddStaffModal";

type Props = {
    maxRows?: number;
};

const SidebarStaffsTable: React.FC<Props> = ({maxRows = 10}) => {
    const [showInviteModal, setShowInviteModal] = useState(false);
    const {loginUser} = useAuth();

    const campaign = useContext(CampaignContext);
    const campaignStaffService = new CampaignStaffService(
        loginUser?.accessToken
    );

    const {data: campaignStaffs} = useQuery(
        ["campaign_staffs", campaign?.id],
        () => {
            return campaignStaffService.getCampaignStaffs({
                campaignId: campaign?.id,
            });
        }
    );

    //const currentStaffs = campaign?.
    return (
        <SidebarBlockWrapper>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-1">
                <div className="text-base font-semibold text-slate-800">
                    Nhân viên ({campaignStaffs?.data?.length})
                </div>
                {campaignStaffs?.data &&
                    campaignStaffs?.data?.length > 0 &&
                    campaignStaffs?.data?.length > maxRows && (
                        <button
                            className="text-base font-medium text-indigo-500 hover:text-indigo-600 disabled:text-gray-500">
                            Xem tất cả
                        </button>
                    )}
            </div>
            {campaignStaffs?.data?.length === 0 ? (
                <div className="text-sm text-slate-500">
                    Sự kiện này hiện chưa được thêm nhân viên nào.
                </div>
            ) : (
                <ul className="space-y-3.5">
                    {campaignStaffs?.data?.slice(0, maxRows).map((cs) => (
                        <li key={cs?.id}>
                            <div className="flex justify-between">
                                <div className="flex grow items-center">
                                    <div className="relative mr-3">
                                        <Image
                                            className="h-8 w-8 rounded-full"
                                            src={cs?.staff?.imageUrl || ""}
                                            width="32"
                                            height="32"
                                            alt=""
                                        />
                                    </div>
                                    <div className="truncate">
                                        <span className="text-sm font-medium text-slate-800">
                                            {cs?.staff?.name}
                                        </span>
                                    </div>
                                </div>
                                <button className="rounded-full text-slate-400 hover:text-slate-500">
                                    <span className="sr-only">Menu</span>
                                    <svg
                                        className="h-8 w-8 fill-current"
                                        viewBox="0 0 32 32"
                                    >
                                        <circle cx="16" cy="16" r="2"/>
                                        <circle cx="10" cy="16" r="2"/>
                                        <circle cx="22" cy="16" r="2"/>
                                    </svg>
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <div className="space-y-2.5 mt-5">
                <button
                    className="m-btn bg-indigo-500 text-white w-full"
                    onClick={() => setShowInviteModal(true)}
                >
                    <AiOutlineUsergroupAdd className="mr-2.5" size={17}/>
                    Thêm nhân viên
                </button>
                {/* <Link
                    href={`/admin/participants/campaigns/${campaign?.id}`}
                    className="m-btn bg-slate-50 text-slate-600 w-full border"
                >
                    Quản lý yêu cầu tham gia
                </Link> */}
            </div>

            <AddStaffModal
                currentStaffs={campaignStaffs?.data?.map((cs) => cs?.staff) || []}
                isOpen={showInviteModal}
                onClose={() => setShowInviteModal(false)}
            />
        </SidebarBlockWrapper>
    );
};

export default SidebarStaffsTable;
