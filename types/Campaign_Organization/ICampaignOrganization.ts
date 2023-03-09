import { IAddress } from "../Address/IAddress";
import { IOrganization } from "../Organization/IOrganization";

export interface ISchedule {
    id: number;
    campaignOrganizationId?: number;
    address?: string;
    addressViewModel?: IAddress;
    startDate?: string;
    endDate?: string;
    status?: number;
    statusName?: string;
}
export interface ICampaignOrganization {
    id: number;
    organizationId?: number;
    campaignId?: number;
    organization?: IOrganization;
    schedules?: ISchedule[];
}
