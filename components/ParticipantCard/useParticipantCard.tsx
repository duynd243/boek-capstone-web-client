import {IParticipant} from "../../types/Participant/IParticipant";
import {useAuth} from "../../context/AuthContext";
import {Roles} from "../../constants/Roles";
import {ParticipantStatuses} from "../../constants/ParticipantStatuses";
import React, {useState} from "react";
import ConfirmModal from "../Modal/ConfirmModal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ParticipantService} from "../../services/ParticipantService";
import {toast} from "react-hot-toast";

type ParticipantButton = {
    title: string;
    onClick: () => void;
    type: 'primary' | 'secondary' | 'danger';
}

function useParticipantCard(participant: IParticipant) {
    const {loginUser} = useAuth();
    let Buttons: ParticipantButton[] = [];
    let Modals: React.ReactElement[] = [];

    const queryClient = useQueryClient();


    const participantService = new ParticipantService(loginUser?.accessToken);

    const [showCancelInvitationModal, setShowCancelInvitationModal] = useState(false);

    const cancelInvitationMutation = useMutation((participantId: number) => {
        return participantService.cancelInviteByAdmin(participantId);
    });

    const acceptInvitationMutation = useMutation((participantId: number) => {
        return participantService.acceptInviteByIssuer(participantId);
    });

    const rejectInvitationMutation = useMutation((participantId: number) => {
        return participantService.rejectInviteByIssuer(participantId);
    });

    const rejectRequestMutation = useMutation((participantId: number) => {
        return participantService.rejectRequestByAdmin(participantId);
    });

    const acceptRequestMutation = useMutation((participantId: number) => {
        return participantService.acceptRequestByAdmin(participantId);
    });
    const handleCancelInvitation = async () => {
        await toast.promise(cancelInvitationMutation.mutateAsync(participant.id), {
            loading: 'Đang hủy lời mời',
            success: () => {
                queryClient.invalidateQueries(['admin_participants']);
                return 'Hủy lời mời thành công';
            },
            error: 'Hủy lời mời thất bại',
        });
        setShowCancelInvitationModal(false);
    }

    const handleAcceptInvitation = async () => {
        await toast.promise(acceptInvitationMutation.mutateAsync(participant.id), {
            loading: 'Đang xử lý',
            success: () => {
                queryClient.invalidateQueries(['issuer_participants']);
                return 'Chấp nhận lời mời thành công';
            },
            error: 'Đã có lỗi xảy ra',
        });
        setShowAcceptInvitationModal(false);
    }


    const handleRejectInvitation = async () => {
        await toast.promise(rejectInvitationMutation.mutateAsync(participant.id), {
            loading: 'Đang xử lý',
            success: () => {
                queryClient.invalidateQueries(['issuer_participants']);
                return 'Từ chối lời mời thành công';
            },
            error: 'Đã có lỗi xảy ra',
        });
        setShowRejectInvitationModal(false);
    }

    const handleRejectRequest = async () => {
        await toast.promise(rejectRequestMutation.mutateAsync(participant.id), {
            loading: 'Đang xử lý',
            success: () => {
                queryClient.invalidateQueries(['admin_participants']);
                return 'Từ chối yêu cầu thành công';
            },
            error: 'Đã có lỗi xảy ra',
        });
        setShowRejectRequestModal(false);
    }

    const handleAcceptRequest = async () => {
        await toast.promise(acceptRequestMutation.mutateAsync(participant.id), {
            loading: 'Đang xử lý',
            success: () => {
                queryClient.invalidateQueries(['admin_participants']);
                return 'Chấp nhận yêu cầu thành công';
            },
            error: 'Đã có lỗi xảy ra',
        });
        setShowAcceptRequestModal(false);
    }

    //Issuer
    const [showRejectInvitationModal, setShowRejectInvitationModal] = useState(false);
    const [showAcceptInvitationModal, setShowAcceptInvitationModal] = useState(false);

    // Admin
    const [showRejectRequestModal, setShowRejectRequestModal] = useState(false);
    const [showAcceptRequestModal, setShowAcceptRequestModal] = useState(false);


    const CancelInvitationModal = <ConfirmModal
        isOpen={showCancelInvitationModal}
        onClose={() => setShowCancelInvitationModal(false)}
        onConfirm={handleCancelInvitation}
        confirmText="Xác nhận hủy"
        title="Hủy lời mời tham gia"
        content={`Bạn có chắc chắn muốn hủy lời mời tham gia đối với nhà phát hành ${participant?.issuer?.user?.name}?`}/>

    const RejectInvitationModal = <ConfirmModal
        isOpen={showRejectInvitationModal}
        onClose={() => setShowRejectInvitationModal(false)}
        onConfirm={handleRejectInvitation}
        confirmText="Xác nhận từ chối"
        title="Từ chối lời mời tham gia"
        content={`Bạn có chắc chắn muốn từ chối lời mời tham gia hội sách ${participant?.campaign?.name}?`}/>

    const AcceptInvitationModal = <ConfirmModal
        isOpen={showAcceptInvitationModal}
        color={'indigo'}
        onClose={() => setShowAcceptInvitationModal(false)}
        onConfirm={handleAcceptInvitation}
        confirmText="Chấp nhận"
        title="Chấp nhận lời mời tham gia"
        content={`Bạn có chắc chắn muốn chấp nhận lời mời tham gia hội sách ${participant?.campaign?.name}?`}/>

    const RejectRequestModal = <ConfirmModal
        isOpen={showRejectRequestModal}
        onClose={() => setShowRejectRequestModal(false)}
        onConfirm={handleRejectRequest}
        confirmText="Xác nhận từ chối"
        title="Từ chối yêu cầu tham gia"
        content={`Bạn có chắc chắn muốn từ chối yêu cầu tham gia hội sách ${participant?.campaign?.name} từ nhà phát hành ${participant?.issuer?.user?.name}?`}/>

    const AcceptRequestModal = <ConfirmModal
        isOpen={showAcceptRequestModal}
        color={'indigo'}
        onClose={() => setShowAcceptRequestModal(false)}
        onConfirm={handleAcceptRequest}
        confirmText="Chấp nhận"
        title="Chấp nhận yêu cầu tham gia"
        content={`Bạn có chắc chắn muốn chấp nhận yêu cầu tham gia hội sách ${participant?.campaign?.name} từ nhà phát hành ${participant?.issuer?.user?.name}?`}/>


    if (participant?.status === ParticipantStatuses.PendingInvitation.id) {
        if (loginUser?.role === Roles.ISSUER.id) {
            Buttons.push({
                title: 'Từ chối',
                onClick: () => {
                    setShowRejectInvitationModal(true);
                },
                type: 'danger',
            });
            Buttons.push({
                title: 'Chấp nhận',
                onClick: () => {
                    setShowAcceptInvitationModal(true);
                },
                type: 'primary'
            });
            Modals.push(RejectInvitationModal, AcceptInvitationModal);
        } else if (loginUser?.role === Roles.SYSTEM.id) {
            Buttons.push({
                title: 'Hủy lời mời',
                onClick: () => {
                    setShowCancelInvitationModal(true);
                },
                type: 'danger'
            });
            Modals.push(CancelInvitationModal);
        }
    }
    if (participant?.status === ParticipantStatuses.PendingRequest.id
        && loginUser?.role === Roles.SYSTEM.id
    ) {
        Buttons.push({
            title: 'Từ chối',
            onClick: () => {
                setShowRejectRequestModal(true);
            },
            type: 'danger',
        });
        Buttons.push({
            title: 'Chấp nhận',
            onClick: () => {
                setShowAcceptRequestModal(true);
            },
            type: 'primary'
        });
        Modals.push(RejectRequestModal, AcceptRequestModal);
    }
    return {
        Buttons,
        Modals,
    };
}

export default useParticipantCard;