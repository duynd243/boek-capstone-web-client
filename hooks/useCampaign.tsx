import { ICampaign } from "../types/Campaign/ICampaign";
import { CampaignStatuses } from "../constants/CampaignStatuses";
import { useAuth } from "../context/AuthContext";
import { ParticipantStatuses } from "../constants/ParticipantStatuses";
import { Roles } from "../constants/Roles";
import { IParticipant } from "../types/Participant/IParticipant";

function useCampaign({ campaign }: { campaign: ICampaign | undefined }) {
    const { loginUser } = useAuth();

    const isEditable = loginUser?.role === Roles.SYSTEM.id &&
        (campaign?.status === CampaignStatuses?.NOT_STARTED.id
            || campaign?.status === CampaignStatuses?.STARTING.id
            || campaign?.status === CampaignStatuses?.POSTPONED.id
        )
    ;
    const isOnlyBasicInfoEditable = loginUser?.role === Roles.SYSTEM.id &&
        (campaign?.status === CampaignStatuses?.STARTING.id)
    ;

    const areStaffsEditable = loginUser?.role === Roles.SYSTEM.id &&
        (campaign?.status !== CampaignStatuses?.CANCELLED.id
            && campaign?.status !== CampaignStatuses?.FINISHED.id
            && campaign?.status !== CampaignStatuses?.POSTPONED.id
        );

    // chỉnh staff

//     Cancelled - Hủy
// Postponed - Hoãn
// End - Kết thúc

    const issuerHasPendingInvitation: IParticipant | undefined =
        campaign?.participants?.find((p) => p?.issuer?.user?.id === loginUser?.id && p?.status === ParticipantStatuses.PendingInvitation.id);

    const issuerHasPendingRequest: IParticipant | undefined =
        campaign?.participants?.find((p) => p?.issuer?.user?.id === loginUser?.id && p?.status === ParticipantStatuses.PendingRequest.id);

    const issuerJoined =
        campaign?.participants?.find((p) => p?.issuer?.user?.id === loginUser?.id
            && (p?.status === ParticipantStatuses.RequestApproved.id
                || p?.status === ParticipantStatuses.InvitationAccepted.id),
        );
    const issuerCanSendRequest =
        loginUser?.role === Roles.ISSUER.id &&
        campaign?.status === CampaignStatuses?.NOT_STARTED.id &&
        !issuerHasPendingInvitation && !issuerHasPendingRequest && !issuerJoined;

    return {
        isEditable,
        isOnlyBasicInfoEditable,
        issuerHasPendingInvitation,
        issuerHasPendingRequest,
        issuerJoined,
        issuerCanSendRequest,
        areStaffsEditable,
    };
}

export default useCampaign;