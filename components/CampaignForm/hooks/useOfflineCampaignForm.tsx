import {z} from "zod";
import {isImageFile} from "../../../utils/helper";
import {AddressRequestSchema, BaseCampaignSchema, CampaignOrganizationSchema, message, ScheduleSchema} from "./index";

type Props = {
    action?: 'CREATE' | 'UPDATE'
}

function useOfflineCampaignForm({action = 'CREATE'}: Props) {
    const BaseOfflineCampaignSchema = BaseCampaignSchema.extend({
        previewFile: action === 'UPDATE'
            ? z.any().optional()
            : z.any().refine(file => (file instanceof File) && isImageFile(file), {
                message: 'Ảnh bìa không được để trống và phải là ảnh',
            }),
        addressRequest: AddressRequestSchema,
        campaignOrganizations: z.array(CampaignOrganizationSchema)
    });

    const ContinuousOfflineCampaignSchema = BaseOfflineCampaignSchema.extend({
        isContinuous: z.literal(true),
    })

    const NonContinuousOfflineCampaignSchema = BaseOfflineCampaignSchema.extend({
        isContinuous: z.literal(false),

        // Make schedules optional
        campaignOrganizations: z.array(CampaignOrganizationSchema.extend({
            schedules: z.array(ScheduleSchema).optional()
        }))
    });


    return {
        ContinuousOfflineCampaignSchema,
        NonContinuousOfflineCampaignSchema,
    }
}

export default useOfflineCampaignForm;