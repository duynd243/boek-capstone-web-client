import { ICampaign } from "./ICampaign";
import { IIssuer } from "../User/IUser";
import { ILevel } from "../Level/ILevel";
import { IHierarchicalBookProduct } from "../Book/IHierarchicalBookProduct";
import { IUnhierarchicalBookProduct } from "../Book/IUnhierarchicalBookProduct";
import { ICustomerCampaignOrganization } from "../Campaign_Organization/ICampaignOrganization";

export interface ICustomerCampaign extends Omit<ICampaign,
    "campaignCommissions"
    | "campaignLevels"
    | "campaignGroups"
    | "campaignOrganizations"
    | "addressViewModel"
    | "participants"
> {
    organizations?: ICustomerCampaignOrganization[];
    issuers?: IIssuer[];
    levels?: ILevel[];
    hierarchicalBookProducts?: IHierarchicalBookProduct[];
    unhierarchicalBookProducts?: IUnhierarchicalBookProduct[];
}
