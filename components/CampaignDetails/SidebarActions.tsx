import React, {Fragment, useContext, useState} from 'react'
import SidebarBlockWrapper from "./SidebarBlockWrapper";
import {CampaignContext} from "../../context/CampaignContext";
import {MdEdit} from "react-icons/md";
import useCampaign from "../../hooks/useCampaign";
import {useAuth} from "../../context/AuthContext";
import {TiUserAdd} from "react-icons/ti";
import useParticipantCard from "../ParticipantCard/useParticipantCard";
import {toast} from "react-hot-toast";
import {ParticipantService} from "../../services/ParticipantService";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import ConfirmModal from "../Modal/ConfirmModal";
import {CampaignStatuses} from "../../constants/CampaignStatuses";
import {IoCloseOutline, IoPauseOutline, IoPlayOutline} from "react-icons/io5";
import SidebarButton from "./SidebarButton";
import {Roles} from "../../constants/Roles";
import {CampaignService} from "../../services/CampaignService";
import {CampaignFormats} from "../../constants/CampaignFormats";
import {useRouter} from "next/router";

type Props = {}
const primaryBtn = "m-btn bg-indigo-500 text-white w-full"
const secondaryBtn = "m-btn bg-white !border-slate-200 !shadow text-slate-600 w-full border bg-slate-50"
const SidebarActions: React.FC<Props> = ({}) => {
    const {loginUser} = useAuth();
    const router = useRouter();
    const campaignService = new CampaignService(loginUser?.accessToken);
    const isAdmin = loginUser?.role === Roles.SYSTEM.id;
    const campaign = useContext(CampaignContext);
    const {
        isEditable,
        issuerHasPendingInvitation,
        issuerHasPendingRequest,
        issuerCanSendRequest,
        issuerJoined,
    } = useCampaign({campaign});

    const {
        Modals: pendingInvitationModals,
        Buttons: pendingInvitationButtons,
    } = useParticipantCard(issuerHasPendingInvitation);


    const adminMutationOptions = {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['admin_campaign']);
            await queryClient.invalidateQueries(['admin_campaigns']);
        }
    }

    const [rejectInvitationButton, acceptInvitationButton] = pendingInvitationButtons;
    const [showRequestJoinModal, setShowRequestJoinModal] = useState(false);

    const [showCancelModal, setShowCancelModal] = useState(false);


    const [showPostponeModal, setShowPostponeModal] = useState(false);
    const [showRestartModal, setShowRestartModal] = useState(false);


    const postPoneCampaignMutation = useMutation((campaignId: number) => {
        if (campaign?.format === CampaignFormats.OFFLINE.id) {
            return campaignService.postponeOfflineCampaign(campaignId);
        } else if (campaign?.format === CampaignFormats.ONLINE.id) {
            return campaignService.postponeOnlineCampaign(campaignId);
        }
        return Promise.reject();
    }, adminMutationOptions);

    const restartCampaignMutation = useMutation((campaignId: number) => {
        if (campaign?.format === CampaignFormats.OFFLINE.id) {
            return campaignService.restartOfflineCampaign(campaignId);
        } else if (campaign?.format === CampaignFormats.ONLINE.id) {
            return campaignService.restartOnlineCampaign(campaignId);
        }
        return Promise.reject();
    }, adminMutationOptions);

    const cancelCampaignMutation = useMutation((campaignId: number) => {
        if (campaign?.format === CampaignFormats.OFFLINE.id) {
            return campaignService.cancelOfflineCampaign(campaignId);
        } else if (campaign?.format === CampaignFormats.ONLINE.id) {
            return campaignService.cancelOnlineCampaign(campaignId);
        }
        return Promise.reject();
    }, {
        onSuccess: async () => {
            await adminMutationOptions.onSuccess();
            await router.push('/admin/campaigns');
        }
    });

    const handlePostPoneCampaign = async () => {
        if (!campaign?.id) return;
        await toast.promise(postPoneCampaignMutation.mutateAsync(campaign?.id), {
            loading: 'Đang tạm hoãn hội sách',
            success: () => {
                return 'Tạm hoãn hội sách thành công';
            },
            error: (err) => err?.message || 'Đã có lỗi xảy ra',
        });
    }

    const handleRestartCampaign = async () => {
        if (!campaign?.id) return;
        await toast.promise(restartCampaignMutation.mutateAsync(campaign?.id), {
            loading: 'Đang tiếp tục hội sách',
            success: () => {
                return 'Tiếp tục hội sách thành công';
            },
            error: (err) => err?.message || 'Đã có lỗi xảy ra',
        });
    }

    const handleCancelCampaign = async () => {
        if (!campaign?.id) return;
        await toast.promise(cancelCampaignMutation.mutateAsync(campaign?.id), {
            loading: 'Đang hủy hội sách',
            success: () => {
                return 'Hủy hội sách thành công';
            },
            error: (err) => err?.message || 'Đã có lỗi xảy ra',
        });
    }


    const participantService = new ParticipantService(loginUser?.accessToken);
    const queryClient = useQueryClient();
    const sendRequestJoinMutation = useMutation((campaignId: number) => participantService.requestToJoinByIssuer(campaignId), {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['issuer_campaign']);
            await queryClient.invalidateQueries(['issuer_campaigns']);
            setShowRequestJoinModal(false);
        }
    });

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
        <SidebarBlockWrapper>
            <div className="space-y-2.5 empty:hidden empty:space-y-0">
                {isEditable && (<SidebarButton
                    href={`${campaign?.id}/edit`}
                >
                    <MdEdit className="mr-2.5" size={17}/>
                    Cập nhật thông tin
                </SidebarButton>)}
                {isAdmin && campaign?.status === CampaignStatuses.STARTING.id &&
                    <Fragment>
                        <SidebarButton
                            onClick={() => setShowPostponeModal(true)}
                            variant='secondary'>
                            <IoPauseOutline className="mr-2.5 text-red-500" size={17}/>
                            Tạm hoãn hội sách
                        </SidebarButton>
                        <ConfirmModal
                            disableButtons={postPoneCampaignMutation.isLoading}
                            confirmText={postPoneCampaignMutation.isLoading ? 'Đang tạm hoãn...' : 'Tạm hoãn'}
                            isOpen={showPostponeModal}
                            onClose={() => setShowPostponeModal(false)}
                            onConfirm={async () => {
                                await handlePostPoneCampaign();
                                setShowPostponeModal(false);
                            }}
                            title="Tạm hoãn hội sách"
                            content="Bạn có chắc chắn muốn tạm hoãn hội sách này không?"
                        />
                    </Fragment>
                }
                {isAdmin && campaign?.status === CampaignStatuses.POSTPONED.id &&
                    <Fragment>
                        <SidebarButton
                            onClick={() => setShowRestartModal(true)}
                            variant='secondary'>
                            <IoPlayOutline className="mr-2.5 text-green-500" size={17}/>
                            Tiếp tục hội sách
                        </SidebarButton>
                        <ConfirmModal
                            color={'indigo'}
                            disableButtons={restartCampaignMutation.isLoading}
                            confirmText={restartCampaignMutation.isLoading ? 'Đang tiếp tục...' : 'Tiếp tục'}
                            isOpen={showRestartModal}
                            onClose={() => setShowRestartModal(false)}
                            onConfirm={async () => {
                                await handleRestartCampaign();
                                setShowRestartModal(false);
                            }}
                            title="Tiếp tục hội sách"
                            content="Bạn có chắc chắn muốn tiếp tục hội sách này không?"
                        />
                    </Fragment>
                }
                {isAdmin && campaign?.status === CampaignStatuses.NOT_STARTED.id && (
                    <Fragment>
                        <SidebarButton
                            onClick={() => setShowCancelModal(true)}
                            variant='secondary'>
                            <IoCloseOutline className="mr-2.5 text-red-500" size={17}/>
                            Huỷ hội sách
                        </SidebarButton>


                        <ConfirmModal
                            disableButtons={cancelCampaignMutation.isLoading}
                            confirmText={cancelCampaignMutation.isLoading ? 'Đang huỷ...' : 'Xác nhận huỷ'}
                            isOpen={showCancelModal}
                            onClose={() => setShowCancelModal(false)}
                            onConfirm={async () => {
                                await handleCancelCampaign();
                                setShowCancelModal(false);
                            }}
                            title="Huỷ hội sách"
                            content="Bạn có chắc chắn muốn huỷ hội sách này không?"
                        />
                    </Fragment>
                )}
            </div>

            {issuerHasPendingInvitation && <>
                <div className="text-base font-medium text-slate-800">
                    Bạn được mời tham gia sự kiện này
                </div>
                <div className='space-y-2.5 mt-3'>
                    <button
                        onClick={acceptInvitationButton.onClick}
                        className={primaryBtn}>Chấp nhận
                    </button>
                    <button
                        onClick={rejectInvitationButton.onClick}
                        className={secondaryBtn}>Từ chối
                    </button>

                    {pendingInvitationModals}
                </div>
            </>}
            {issuerHasPendingRequest && <>
                <button className={secondaryBtn}>Đã gửi yêu cầu</button>
            </>}
            {issuerCanSendRequest &&
                <>
                    <button
                        onClick={() => setShowRequestJoinModal(true)}
                        className={primaryBtn}
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
            }

            {issuerJoined && <div>Thêm sách</div>}

        </SidebarBlockWrapper>
    )
}

export default SidebarActions