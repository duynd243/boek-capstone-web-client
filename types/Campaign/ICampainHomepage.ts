import { ICampaign } from "./ICampaign";

export interface ICampaignHomepage {
    hierarchicalCustomerCampaigns: IHierarchicalCustomerCampaign[];
    unhierarchicalCustomerCampaigns: any[];
}

export interface IHierarchicalCustomerCampaign {
    title: string;
    subHierarchicalCustomerCampaigns: ISubHierarchicalCustomerCampaign[];
}

export interface ISubHierarchicalCustomerCampaign {
    subTitle: string;
    organizationId: number;
    groupId: number;
    status: number;
    format: number;
    campaigns: ICampaign[];
}


export interface CampaignCommission {
    id: number;
    campaignId: number;
    genreId: number;
    minimalCommission: number;
    genre: Genre;
}

export interface Genre {
    id: number;
    parentId: any;
    name: string;
    displayIndex: number;
    status: boolean;
    statusName: string;
}

export interface CampaignOrganization {
    id: number;
    organizationId: number;
    campaignId: number;
    organization: Organization;
    schedules: Schedule[];
}

export interface Organization {
    id: number;
    name: string;
    address: string;
    phone: string;
    imageUrl: string;
}

export interface Schedule {
    id: number;
    campaignOrganizationId: number;
    address: string;
    addressViewModel: any;
    startDate: string;
    endDate: string;
    status: number;
    statusName: string;
}

export interface CampaignGroup {
    id: number;
    campaignId: number;
    groupId: number;
    group: Group;
}

export interface Group {
    id: number;
    name: string;
    description: string;
    status: boolean;
    statusName: string;
}

export interface Participant {
    id: number;
    campaignId: number;
    issuerId: string;
    status: number;
    statusName: string;
    note: string;
    createdDate: string;
    updatedDate?: string;
    issuer: Issuer;
}

export interface Issuer {
    id: string;
    description?: string;
    user: User;
}

export interface User {
    id: string;
    code: string;
    name: string;
    email: string;
    address: string;
    addressViewModel: any;
    phone: string;
    roleName: string;
    role: number;
    status: boolean;
    statusName: string;
    imageUrl: string;
    createdDate?: string;
    updatedDate: string;
}

export interface CampaignLevel {
    id: number;
    campaignId: number;
    levelId: number;
    level: Level;
}

export interface Level {
    id: number;
    name: string;
    conditionalPoint: number;
    status: boolean;
    statusName: string;
}
