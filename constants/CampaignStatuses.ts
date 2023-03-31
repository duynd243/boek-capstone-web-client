export const CampaignStatuses = {
    NOT_STARTED: {
        id: 1,
        displayName: "Chưa bắt đầu",
        statusColor: "amber",
    },
    STARTING: {
        id: 2,
        displayName: "Đang diễn ra",
        statusColor: "green",
    },
    POSTPONED: {
        id: 5,
        displayName: "Đang tạm hoãn",
        statusColor: "slate",
    },
    FINISHED: {
        id: 3,
        displayName: "Đã kết thúc",
        statusColor: "blue",
    },
    CANCELLED: {
        id: 4,
        displayName: "Đã hủy",
        statusColor: "red",
    },
} satisfies Record<
    string,
    {
        id: number;
        displayName: string;
        statusColor?: string;
    }
>;

export function getCampaignStatusById(id: number | undefined) {
    return Object.values(CampaignStatuses).find((status) => status.id === id);
}

export const CampaignStatusTabs = [
    {
        id: undefined,
        displayName: "Tất cả trạng thái",
        statusColor: undefined,
    },
    ...Object.values(CampaignStatuses),
];