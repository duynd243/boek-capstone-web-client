export class CampaignPrivacies {
    static readonly PUBLIC = {
        id: 1,
        displayName: "Công khai",
        description: "Hội sách sẽ khả dụng cho mọi người",
    };
    static readonly ORGANIZATION_ONLY = {
        id: 2,
        displayName: "Chỉ tổ chức",
        description:
            "Hội sách chỉ khả dụng cho thành viên thuộc các tổ chức được chọn",
    };
}
