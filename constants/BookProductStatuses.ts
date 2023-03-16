export interface IBookProductStatus {
    id: number;
    displayName: string;
}

export const BookProductStatuses = {
    Pending: {
        id: 1,
        displayName: 'Chờ xét duyệt',
    },
    Rejected: {
        id: 2,
        displayName: 'Đã bị từ chối',
    },
    Selling: {
        id: 3,
        displayName: 'Đang bán',
    },
    NotSale: {
        id: 4,
        displayName: 'Ngừng bán',
    },
    NotSaleDueEndDate: {
        id: 5,
        displayName: 'Ngừng bán do hội sách kết thúc',
    },
    NotSaleDueCancelledCampaign: {
        id: 6,
        displayName: 'Ngừng bán do hội sách bị hủy',
    },
    NotSaleDuePostponedCampaign: {
        id: 7,
        displayName: 'Ngừng bán do hội sách tạm hoãn',
    },
    OutOfStock: {
        id: 8,
        displayName: 'Hết hàng',
    },
    Unreleased: {
        id: 9,
        displayName: 'Ngừng phát hành',
    },
} satisfies Record<string, IBookProductStatus>;