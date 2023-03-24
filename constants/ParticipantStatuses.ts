export interface IParticipantStatus {
    id: number;
    displayName: string;
    icon?: string;
    bgColor?: string;
    label?: {
        text: string,
        classNames: string,
    };
}

export const ParticipantStatuses = {
    // Issuer send request to join campaign
    PendingRequest: {
        id: 1,
        displayName: 'Đợi quản trị viên xét duyệt',
        icon: '⌛',
        bgColor: 'bg-amber-500',
        label: {
            text: 'Chờ xét duyệt',
            classNames: 'border border-amber-500 text-amber-600 bg-amber-50',
        }
    },
    RequestApproved: {
        id: 3,
        displayName: 'Đã được quản trị viên xét duyệt',
        icon: '🙌',
        bgColor: 'bg-green-600',
        label: {
            text: 'Đã xét duyệt',
            classNames: 'border border-green-500 text-green-600 bg-green-50'
        }
    },
    RequestRejected: {
        id: 4,
        displayName: 'Đã bị quản trị viên từ chối',
        icon: '🙅‍♀️',
        bgColor: 'bg-red-500',
        label: {
            text: 'Đã từ chối',
            classNames: 'border border-red-500 text-red-600 bg-red-50'
        }
    },

    // Admin send invitation to Issuer
    PendingInvitation: {
        id: 2,
        displayName: 'Đợi nhà phát hành đồng ý',
        icon: '⌛',
        bgColor: 'bg-amber-500',
        label: {
            text: 'Đang chờ',
            classNames: 'border border-amber-500 text-amber-600 bg-amber-50',
        }
    },
    InvitationCancelled: {
        // Admin cancel invitation
        id: 7,
        displayName: 'Đã hủy lời mời',
        icon: '🚫',
        bgColor: 'bg-slate-500',
        label: {
            text: 'Đã hủy',
            classNames: 'border border-slate-500 text-slate-600 bg-slate-50'
        }
    },
    InvitationAccepted: {
        id: 5,
        displayName: 'Nhà phát hành đã đồng ý',
        icon: '🙌',
        bgColor: 'bg-green-600',
        label: {
            text: 'Đã đồng ý',
            classNames: 'border border-green-500 text-green-600 bg-green-50'
        }
    },
    InvitationRejected: {
        id: 6,
        displayName: 'Nhà phát hành đã từ chối',
        icon: '🙅‍♀️',
        bgColor: 'bg-red-500',
        label: {
            text: 'Đã từ chối',
            classNames: 'border border-red-500 text-red-600 bg-red-50'
        }
    },

    // Automatic status update by worker service
} satisfies Record<string, IParticipantStatus>;


export const ParticipantFlowTabs = [
    {
        id: 1,
        displayName: "Được mời tham gia",
        statusTabs: [
            ParticipantStatuses.PendingInvitation,
            ParticipantStatuses.InvitationAccepted,
            ParticipantStatuses.InvitationRejected,
            ParticipantStatuses.InvitationCancelled,
        ],
    },
    {
        id: 2,
        displayName: "Gửi yêu cầu tham gia",
        statusTabs: [
            ParticipantStatuses.PendingRequest,
            ParticipantStatuses.RequestApproved,
            ParticipantStatuses.RequestRejected,
        ],
    },
];

export function getParticipantStatusById(id: number | undefined): IParticipantStatus | undefined {
    return Object.values(ParticipantStatuses).find((status) => status.id === id);
}
