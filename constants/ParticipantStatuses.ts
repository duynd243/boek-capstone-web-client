export interface IParticipantStatus {
    id: number;
    displayName?: string;
}

export const ParticipantStatuses = {
    // Issuer send request to join campaign
    PendingRequest: {
        id: 1,
        displayName: 'Đợi QTV xét duyệt',
    },
    RequestApproved: {
        id: 3,
        displayName: 'Đã được QTV xét duyệt',
    },
    RequestRejected: {
        id: 4,
        displayName: 'Đã bị QTV từ chối',
    },

    // Admin send invitation to Issuer
    PendingInvitation: {
        id: 2,
        displayName: 'Đợi NPH đồng ý',
    },
    InvitationCancelled: {
        // Admin cancel invitation
        id: 8,
        displayName: 'Đã hủy lời mời',
    },
    InvitationAccepted: {
        id: 5,
        displayName: 'NPH đã đồng ý',
    },
    InvitationRejected: {
        id: 6,
        displayName: 'NPH đã từ chối',
    },

    // Automatic status update by worker service
} satisfies Record<string, IParticipantStatus>;
