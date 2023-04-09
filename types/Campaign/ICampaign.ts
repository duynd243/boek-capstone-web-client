import {IParticipant} from "../Participant/IParticipant";
import {ICampaignLevel} from "../Campaign_Level/ICampaignLevel";
import {ICampaignGroup} from "../Campaign_Group/ICampaignGroup";
import {ICampaignOrganization} from "../Campaign_Organization/ICampaignOrganization";
import {ICampaignCommission} from "../Campaign_Commission/ICampaignCommission";
import {IAddress} from "../Address/IAddress";

export interface ICampaign {
    id: number;
    code?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    format?: number;
    formatName?: string;
    address?: string;
    addressViewModel?: IAddress;
    startDate?: string;
    endDate?: string;
    isRecurring?: boolean;
    status?: number;
    createdDate?: string;
    updatedDate?: string;
    statusName?: string;
    campaignCommissions?: ICampaignCommission[];
    campaignOrganizations?: ICampaignOrganization[];
    campaignGroups?: ICampaignGroup[];
    participants?: IParticipant[];
    campaignLevels?: ICampaignLevel[];
}
