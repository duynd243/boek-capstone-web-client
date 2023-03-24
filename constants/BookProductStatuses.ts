export interface IBookProductStatus {
    id: number;
    displayName: string;
    commonDisplayName?: string;
    label?: {
        classNames: string,
    };
}

export const BookProductStatuses = {
    Pending: {
        id: 1,
        displayName: 'Chờ xét duyệt',
        label: {
            classNames: 'border border-amber-500 text-amber-600 bg-amber-50',
        }
    },
    Rejected: {
        id: 2,
        displayName: 'Đã bị từ chối',
        label: {
            classNames: 'border border-green-500 text-green-600 bg-green-50',
        }
    },
    Selling: {
        id: 3,
        displayName: 'Đang bán',
        label: {
            classNames: 'border border-green-500 text-green-600 bg-green-50',
        }
    },
    NotSale: {
        id: 4,
        displayName: 'Ngừng bán',
        label: {
            classNames: 'border border-green-500 text-green-600 bg-green-50',
        }
    },
    NotSaleDueEndDate: {
        id: 5,
        displayName: 'Ngừng bán do hội sách kết thúc',
        commonDisplayName: 'Ngừng bán',
        label: {
            classNames: 'border border-green-500 text-green-600 bg-green-50',
        }
    },
    NotSaleDueCancelledCampaign: {
        id: 6,
        displayName: 'Ngừng bán do hội sách bị hủy',
        commonDisplayName: 'Ngừng bán',
        label: {
            classNames: 'border border-green-500 text-green-600 bg-green-50',
        }
    },
    NotSaleDuePostponedCampaign: {
        id: 7,
        displayName: 'Ngừng bán do hội sách tạm hoãn',
        commonDisplayName: 'Ngừng bán',
        label: {
            classNames: 'border border-green-500 text-green-600 bg-green-50',
        }
    },
    OutOfStock: {
        id: 8,
        displayName: 'Hết hàng',
        label: {
            classNames: 'border border-green-500 text-green-600 bg-green-50',
        }
    },
    Unreleased: {
        id: 9,
        displayName: 'Ngừng phát hành',
        label: {
            classNames: 'border border-green-500 text-green-600 bg-green-50',
        }
    },
} satisfies Record<string, IBookProductStatus>;


export function getBookProductStatusById(id: number | undefined): IBookProductStatus | undefined {
    return Object.values(BookProductStatuses).find((status) => status.id === id);
}