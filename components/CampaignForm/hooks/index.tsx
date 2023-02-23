import {z} from "zod";
import * as yup from "yup";

export const MAX_FILE_SIZE_IN_MB = 1;
export const message = {
    NOT_TODAY: 'Ngày bắt đầu phải sau hôm nay',
    NOT_AFTER: 'Thời gian kết thúc phải sau thời gian bắt đầu',
    PROVINCE_REQUIRED: 'Tỉnh / Thành phố không được để trống',
    DISTRICT_REQUIRED: 'Quận / Huyện không được để trống',
    WARD_REQUIRED: 'Phường / Xã không được để trống',
    START_DATE_REQUIRED: 'Thời gian bắt đầu không được để trống',
    END_DATE_REQUIRED: 'Thời gian kết thúc không được để trống',
    NOT_IMAGE_TYPE: 'Tệp tải lên phải có định dạng ảnh',
    INVALID_IMAGE_SIZE: `Kích thước tệp tải lên phải nhỏ hơn ${MAX_FILE_SIZE_IN_MB}MB`,
}

export const AddressRequestSchema = z.object({
    detail: z.string().min(1, 'Địa chỉ chi tiết không được để trống'),
    provinceCode: z.number({required_error: message.PROVINCE_REQUIRED}),
    districtCode: z.number({required_error: message.DISTRICT_REQUIRED}),
    wardCode: z.number({required_error: message.WARD_REQUIRED})
});
export const ScheduleSchema = z.object({
    addressRequest: AddressRequestSchema,
    startDate: z.date({required_error: message.START_DATE_REQUIRED}),
    endDate: z.date({required_error: message.END_DATE_REQUIRED}),
});
export const CampaignOrganizationSchema = z.object({
    organizationId: z.number(),
    organizationName: z.string().optional(),
    organizationImageUrl: z.string().optional(),
    organizationAddress: z.string().optional(),
    organizationPhone: z.string().optional(),
    schedules: z.array(ScheduleSchema).min(1, 'Cần có ít nhất 01 lịch trình cho mỗi tổ chức')
})

export const CampaignCommissionSchema = z.object(
    {
        genreId: z.number(),
        genreName: z.string().optional(),
        minimalCommission: z.coerce
            .number({required_error: 'Phần trăm chiết khấu không được để trống'})
            .int('Phần trăm chiết khấu phải là số nguyên')
            .min(0, 'Phần trăm chiết khấu phải lớn hơn hoặc bằng 0%')
            .max(100, 'Phần trăm chiết khấu phải nhỏ hơn hoặc bằng 100%'),

    }
);

export const CampaignDateSchema = z.object({
    startDate: z.date({required_error: message.START_DATE_REQUIRED})
        .refine(date => date && date > new Date(), {
            message: message.NOT_TODAY
        }),
    endDate: z.date({required_error: message.END_DATE_REQUIRED}),
})
    .refine((data) => data.startDate < data.endDate, {
        path: ["endDate"], // Set the path of this error on the startDate and endDate fields.
        message: message.NOT_AFTER,
    });

export const BaseCampaignSchema = z.object({
    name: z.string().trim().min(1, 'Tên không được để trống'),
    description: z.string().trim().min(1, 'Mô tả không được để trống'),
    //imageUrl: z.string().optional(),
    startDate: z.date({required_error: message.START_DATE_REQUIRED})
        .refine(date => date && date > new Date(), {
            message: message.NOT_TODAY
        }),
    endDate: z.date({required_error: message.END_DATE_REQUIRED}),
    campaignCommissions: z.array(CampaignCommissionSchema)
        .min(1, 'Cần có ít nhất 01 thể loại và phần trăm chiết khấu tương ứng'),

})

