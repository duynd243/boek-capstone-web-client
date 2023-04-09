export const CampaignStaffStatuses = {
    Attended : {
        id: 1,
        displayName: "Đang tham gia",
    },
    Unattended : {
        id: 2,
        displayName: "Không tham gia",
    },
} satisfies Record<
    string,
    {
        id: number;
        displayName: string;
    }
>;