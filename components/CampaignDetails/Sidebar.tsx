import Link from "next/link";
import React, {useContext, useState} from "react";
import {MdEdit} from "react-icons/md";
import {TiUserAdd} from "react-icons/ti";
import {CampaignFormats} from "../../constants/CampaignFormats";
import {CampaignStatuses} from "../../constants/CampaignStatuses";
import {Roles} from "../../constants/Roles";
import {useAuth} from "../../context/AuthContext";
import {CampaignContext} from "../../context/CampaignContext";
import SidebarIssuersTable from "./SidebarIssuersTable";
import SidebarStaffsTable from "./SidebarStaffsTable";
import {ParticipantStatuses} from "../../constants/ParticipantStatuses";
import ConfirmModal from "../Modal/ConfirmModal";
import {ParticipantService} from "../../services/ParticipantService";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";

const Sidebar: React.FC = () => {
    const [showRequestJoinModal, setShowRequestJoinModal] = useState(false);
    const {loginUser} = useAuth();
    const participantService = new ParticipantService(loginUser?.accessToken);
    const queryClient = useQueryClient();
    const sendRequestJoinMutation = useMutation((campaignId: number) => participantService.requestToJoinByIssuer(campaignId), {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['issuer_campaigns']);
            setShowRequestJoinModal(false);
        }
    });
    const campaign = useContext(CampaignContext);
    const joinedAndPendingIssuers =
        campaign?.participants
            ?.filter(
                (p) =>
                    p?.status === ParticipantStatuses.RequestApproved.id ||
                    p?.status === ParticipantStatuses.InvitationAccepted.id ||
                    p?.status === ParticipantStatuses.PendingInvitation.id ||
                    p?.status === ParticipantStatuses.PendingRequest.id
            )
            ?.map((p) => p?.issuer?.user) || [];


    const isJoined = !!joinedAndPendingIssuers?.find((i) => i?.id === loginUser?.id);

    const handleSendRequestJoin = async () => {
        if (!campaign?.id) return;
        await toast.promise(sendRequestJoinMutation.mutateAsync(campaign.id), {
            loading: 'Đang gửi yêu cầu',
            success: () => {
                return 'Gửi yêu cầu thành công';
            },
            error: (err) => err?.message || 'Đã có lỗi xảy ra',
        });
    }

    return (
        <div>
            <div className="space-y-4 lg:sticky lg:top-20">
                {loginUser?.role === Roles.SYSTEM.id &&
                    campaign?.status === CampaignStatuses?.NOT_STARTED.id && (
                        <Link
                            href={`${campaign?.id}/edit`}
                            className="m-btn bg-blue-600 text-white w-full"
                        >
                            <MdEdit className="mr-2.5" size={17}/>
                            Cập nhật thông tin
                        </Link>
                    )}

                {(loginUser?.role === Roles.ISSUER.id &&
                    campaign?.status === CampaignStatuses?.NOT_STARTED.id && !isJoined) && (
                    <>
                        <button
                            onClick={() => setShowRequestJoinModal(true)}
                            className="m-btn bg-blue-600 text-white w-full"
                        >
                            <TiUserAdd className="mr-2.5" size={17}/>
                            Yêu cầu tham gia
                        </button>

                        <ConfirmModal
                            isOpen={showRequestJoinModal}
                            color={'blue'}
                            onClose={() => setShowRequestJoinModal(false)}
                            onConfirm={handleSendRequestJoin}
                            confirmText="Gửi yêu cầu"
                            title="Chấp nhận lời mời tham gia"
                            content={`Bạn có chắc chắn muốn gửi yêu cầu tham gia hội sách ${campaign?.name}?`}/>
                    </>
                )}

                <SidebarIssuersTable/>

                {loginUser?.role === Roles.SYSTEM.id &&
                    campaign?.format === CampaignFormats?.OFFLINE.id && (
                        <SidebarStaffsTable/>
                    )}
            </div>
        </div>
    );
};

export default Sidebar;
