import {z} from "zod";
import {isImageFile} from "../../../utils/helper";
import {AddressRequestSchema, BaseCampaignSchema, CampaignOrganizationSchema, message, ScheduleSchema} from "./index";

type Props = {
    action?: 'CREATE' | 'UPDATE'
}

function useOfflineCampaignForm({action = 'CREATE'}: Props) {
    const BaseOnlineCampaignSchema = BaseCampaignSchema.extend({
        previewFile: action === 'UPDATE'
            ? z.any().optional()
            : z.any().refine(file => (file instanceof File) && isImageFile(file), {
                message: 'Ảnh bìa không được để trống và phải là ảnh',
            }),
        addressRequest: AddressRequestSchema,

        campaignGroups: z.array(z.object({
            groupId: z.number(),
            groupName: z.string().optional(),
            groupDescription: z.string().optional(),
        })),
        campaignLevels: z.array(z.object({
            levelId: z.number(),
            levelName: z.string(),
            levelRequiredPoint: z.number(),
        })),

    });


    return {
        BaseOnlineCampaignSchema,
    }
}

export default useOfflineCampaignForm;