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
        id: 3,
        displayName: "Đang tạm hoãn",
        statusColor: "slate",
    },
    FINISHED: {
        id: 4,
        displayName: "Đã kết thúc",
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