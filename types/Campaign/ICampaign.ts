import {IGroup} from "../Group/IGroup";
import {IOrganization} from "../Organization/IOrganization";
import {ICampaignCommission} from "../ICampaignComission";

export interface ICampaign {
    id: number;
    code?: string;
    name?: string;
    description?: string;
    imageUrl?: string;
    format?: number;
    privacy?: number;
    address?: string;
    offlineStatus?: number;
    startOfflineDate?: string;
    endOfflineDate?: string;
    onlineStatus?: number;
    startOnlineDate?: string;
    endOnlineDate?: string;
    createdDate?: string;
    updatedDate?: string;
    statusOfflineName?: string;
    statusOnlineName?: string;
    formatName?: string;
    privacyName?: string;
    campaignCommissions?: ICampaignCommission[];
    campaignOrganizations?: {
        id?: number;
        campaignId?: number;
        organizationId?: number;
        organization?: IOrganization;
    }[];
    campaignGroups?: {
        id?: number;
        campaignId?: number;
        groupId?: number;
        group?: IGroup;
    }[];
}