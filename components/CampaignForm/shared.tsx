import { z } from "zod";
export const MAX_FILE_SIZE_IN_MB = 1;

export const message = {
    NOT_TODAY: "Ngày bắt đầu phải sau hôm nay",
    NOT_AFTER: "Thời gian kết thúc phải sau thời gian bắt đầu",
    PROVINCE_REQUIRED: "Tỉnh / Thành phố không được để trống",
    DISTRICT_REQUIRED: "Quận / Huyện không được để trống",
    WARD_REQUIRED: "Phường / Xã không được để trống",
    START_DATE_REQUIRED: "Thời gian bắt đầu không được để trống",
    END_DATE_REQUIRED: "Thời gian kết thúc không được để trống",
    NOT_IMAGE_TYPE: "Tệp tải lên phải có định dạng ảnh",
    INVALID_IMAGE_SIZE: `Kích thước tệp tải lên phải nhỏ hơn ${MAX_FILE_SIZE_IN_MB}MB`,
};

export const CampaignCommissionSchema = z.object({
    genreId: z.number(),
    genreName: z.string().optional(),
    minimalCommission: z.coerce
        .number()
        .int("Phần trăm chiết khấu phải là số nguyên")
        .min(1, "Phần trăm chiết khấu phải lớn hơn 0%")
        .max(100, "Phần trăm chiết khấu phải nhỏ hơn hoặc bằng 100%"),
});

export const AddressRequestSchema = z.object({
    detail: z.string().min(1, "Địa chỉ chi tiết không được để trống"),
    provinceCode: z.coerce
        .number({
            required_error: message.PROVINCE_REQUIRED,
        })
        .positive("Tỉnh / Thành phố không được để trống")
        .default(0),
    districtCode: z.coerce
        .number({
            required_error: message.DISTRICT_REQUIRED,
        })
        .positive("Quận / Huyện không được để trống")
        .default(0),
    wardCode: z.coerce
        .number({ required_error: message.WARD_REQUIRED })
        .positive("Phường / Xã không được để trống")
        .default(0),
});
export const ScheduleSchema = z.object({
    addressRequest: AddressRequestSchema,
    startDate: z.date({ required_error: message.START_DATE_REQUIRED }),
    endDate: z.date({ required_error: message.END_DATE_REQUIRED }),
});
export const CampaignOrganizationSchema = z.object({
    organizationId: z.number(),
    organizationName: z.string().optional(),
    organizationImageUrl: z.string().optional(),
    organizationAddress: z.string().optional(),
    schedules: z
        .array(ScheduleSchema)
        .min(1, "Cần có ít nhất 1 lịch trình cho mỗi tổ chức được thêm"),
});

export const BaseCampaignSchema = z.object({
    name: z.string().trim().min(1, "Tên hội sách không được để trống"),
    description: z.string().trim().min(1, "Mô tả hội sách không được để trống"),
    imageUrl: z.string().optional(),
    previewFile: z.any().optional(),
    startDate: z
        .date({
            required_error: message.START_DATE_REQUIRED,
        })
        .refine((date) => date && date > new Date(), {
            message: message.NOT_TODAY,
        }),
    endDate: z.date({
        required_error: message.END_DATE_REQUIRED,
    }),
    campaignCommissions: z
        .array(CampaignCommissionSchema)
        .min(1, "Cần có ít nhất 1 thể loại và phần trăm chiết khấu tương ứng"),
});

export const OfflineCampaignSchema = BaseCampaignSchema.extend({
    addressRequest: AddressRequestSchema,
    campaignOrganizations: z
        .array(CampaignOrganizationSchema)
        .min(1, "Cần có ít nhất 1 tổ chức được chọn"),
});

export const RecurringOfflineCampaignSchema = OfflineCampaignSchema.extend({
    isRecurring: z.literal(true),
});

export const NonRecurringOfflineCampaignSchema = OfflineCampaignSchema.extend({
    isRecurring: z.literal(false),
    campaignOrganizations: z.array(
        CampaignOrganizationSchema.extend({
            schedules: z.array(ScheduleSchema).optional(),
        })
    ),
});

export const OnlineCampaignSchema = BaseCampaignSchema.extend({
    campaignGroups: z
        .array(
            z.object({
                groupId: z.number(),
                groupName: z.string().optional(),
                groupDescription: z.string().optional(),
            })
        )
        .min(1, "Cần có ít nhất 1 nhóm đề tài được chọn"),
    campaignLevels: z.array(
        z.object({
            levelId: z.number(),
            levelName: z.string().optional(),
            levelRequiredPoint: z.number().optional(),
        })
    ),
});
