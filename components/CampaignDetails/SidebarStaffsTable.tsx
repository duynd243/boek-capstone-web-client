import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";
import SidebarBlockWrapper from "./SidebarBlockWrapper";
import CampaignStaffService from "../../services/CampaignStaffService";
import Image from "next/image";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import AddStaffModal from "../Modal/AddStaffModal";
import { getAvatarFromName } from "../../utils/helper";
import SidebarButton from "./SidebarButton";
import { SidebarTable } from "./SidebarTable";
import useCampaign from "../../hooks/useCampaign";
import { Menu } from "@headlessui/react";
import { SidebarMenuButton } from "./SidebarMenuButton";
import ConfirmModal from "../Modal/ConfirmModal";
import { CampaignStaffStatuses } from "../../constants/CampaignStaffStatuses";
import { toast } from "react-hot-toast";

type Props = {
    maxRows?: number;
};

const SidebarStaffsTable: React.FC<Props> = ({ maxRows = 10 }) => {
    const [showAllModal, setShowAllModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();

    const [updateStaffData, setUpdateStaffData] = useState<{
        campaignStaffId: number;
        staffName: string;
        newStatus: boolean;
    } | null>(null);

    const campaign = useContext(CampaignContext);
    const campaignStaffService = new CampaignStaffService(
        loginUser?.accessToken,
    );

    const { data: campaignStaffs, isLoading: staffsLoading } = useQuery(
        ["campaign_staffs", campaign?.id, maxRows],
        () => {
            return campaignStaffService.getCampaignStaffs({
                campaignId: campaign?.id,
                size: maxRows,
            });
        }, {
            enabled: !!campaign?.id,
        },
    );

    const { areStaffsEditable } = useCampaign({ campaign });


    const updateCampaignStaffMutation = useMutation((
        campaignStaffId: number,
    ) => {
        if (!updateStaffData) return Promise.reject();
        if (updateStaffData?.newStatus) {
            return campaignStaffService.attendCampaignStaff(campaignStaffId);
        } else {
            return campaignStaffService.unattendCampaignStaff(campaignStaffId);
        }
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["campaign_staffs"]);
        },
    });

    const handleUpdateStaffStatus = async () => {
        if (!updateStaffData) return;
        await toast.promise(
            updateCampaignStaffMutation.mutateAsync(updateStaffData.campaignStaffId),
            {
                loading: "Đang cập nhật trạng thái nhân viên",
                success: () => {
                    return `Đã cập nhật trạng thái nhân viên thành công`;
                },
                error: (err) => err?.message || "Có lỗi xảy ra",
            },
        );
        setUpdateStaffData(null);
    };

    return (
        <SidebarBlockWrapper>
            <SidebarTable.Heading
                text={`Nhân viên  ${!staffsLoading ? `(${campaignStaffs?.metadata?.total || 0})` : ""}`}
                showAllButtonVisible={campaignStaffs?.metadata && campaignStaffs?.metadata?.total > maxRows}
                onShowAllClick={() => setShowAllModal(true)}>
                {/*<JoinedIssuerModal*/}
                {/*    isOpen={showAllModal}*/}
                {/*    onClose={() => setShowAllModal(false)}*/}
                {/*    joinedIssuers={joinedIssuers}*/}
                {/*/>*/}
            </SidebarTable.Heading>

            {staffsLoading && (
                <div className="space-y-6">
                    <SidebarTable.SkeletonItem />
                    <SidebarTable.SkeletonItem />
                </div>
            )}
            {!staffsLoading && !campaignStaffs?.data?.length && (
                <SidebarTable.Content text="Hội sách này hiện chưa được thêm nhân viên nào." />
            )}
            {!staffsLoading && campaignStaffs?.data && campaignStaffs?.data?.length > 0 ? (
                <ul className="space-y-3.5">
                    {campaignStaffs?.data?.slice(0, maxRows).map((cs) => (
                        <li key={cs?.id}>
                            <div className="flex justify-between">
                                <div className="flex grow">
                                    <div className="relative h-8 w-8 mr-3">
                                        <Image
                                            className="h-full w-full rounded-full"
                                            src={cs?.staff?.imageUrl || getAvatarFromName(cs?.staff?.name)}
                                            width="32"
                                            height="32"
                                            alt=""
                                        />
                                        <span
                                            className={`absolute -bottom-0.5 right-1 w-2 h-2 rounded-full border border-white ${cs?.status === CampaignStaffStatuses.Attended.id ? "bg-green-500" : "bg-rose-500"}`}></span>
                                    </div>
                                    <div className="truncate flex flex-col gap-1">
                                        <span className="text-sm font-medium text-slate-800">
                                            {cs?.staff?.name}
                                        </span>
                                        <span
                                            className={`text-xs font-medium flex items-center w-fit py-1 px-2 rounded ${cs?.status === CampaignStaffStatuses.Attended.id ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
                                             {cs?.status === CampaignStaffStatuses.Attended.id ? CampaignStaffStatuses.Attended.displayName : CampaignStaffStatuses.Unattended.displayName}
                                        </span>
                                    </div>
                                </div>
                                {areStaffsEditable &&
                                    <Menu as={"div"} className={"relative"}>
                                        <Menu.Button>
                                            <SidebarMenuButton />
                                        </Menu.Button>
                                        <Menu.Items
                                            className={"absolute top-8 rounded bg-white shadow border right-0 min-w-max z-10"}>
                                            <Menu.Item>
                                                <button
                                                    onClick={() => {
                                                        setUpdateStaffData({
                                                            campaignStaffId: cs?.id,
                                                            staffName: cs?.staff?.name || "",
                                                            newStatus: cs?.status !== CampaignStaffStatuses.Attended.id,
                                                        });
                                                        setShowConfirmModal(true);
                                                    }}
                                                    className={`py-2 px-3 text-sm ${cs?.status === CampaignStaffStatuses.Attended.id ? "text-rose-500" : ""}`}
                                                >
                                                    <span>
                                                        {cs?.status === CampaignStaffStatuses.Attended.id ? "Vô hiệu hóa" : "Kích hoạt"}
                                                    </span>
                                                </button>
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Menu>

                                }
                            </div>
                        </li>
                    ))}
                </ul>
            ) : null}

            {areStaffsEditable && (<>
                <div className="space-y-2.5 mt-5">
                    <SidebarButton
                        onClick={() => setShowInviteModal(true)}
                    >
                        <AiOutlineUsergroupAdd className="mr-2.5" size={17} />
                        Thêm nhân viên
                    </SidebarButton>
                </div>

                <AddStaffModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                />

                <ConfirmModal
                    disableButtons={updateCampaignStaffMutation.isLoading}
                    color={updateStaffData?.newStatus ? "indigo" : ""}
                    isOpen={showConfirmModal}
                    onClose={() => {
                        setShowConfirmModal(false);
                        setUpdateStaffData(null);
                    }}
                    onConfirm={async () => {
                        await handleUpdateStaffStatus();
                        setShowConfirmModal(false);
                    }}
                    title={updateStaffData?.newStatus ? "Kích hoạt nhân viên" : "Vô hiệu hóa nhân viên"}
                    content={updateStaffData?.newStatus ?
                        `Bạn có chắc chắn muốn kích hoạt nhân viên ${updateStaffData?.staffName}?` :
                        `Bạn có chắc chắn muốn vô hiệu hóa nhân viên ${updateStaffData?.staffName}?`}
                    confirmText={updateStaffData?.newStatus ? "Kích hoạt" : "Vô hiệu hóa"}
                />
            </>)}
        </SidebarBlockWrapper>
    );
};

export default SidebarStaffsTable;
