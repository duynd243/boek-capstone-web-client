export interface IOrganization {
    id?: number;
    name?: string;
    address?: string;
    phoneNumber?: string;
}

export interface IUser {
    id?: string;
    code?: string;
    name?: string;
    email?: string;
    address?: string;
    phoneNumber?: string;
    role?: number;
    dob?: string;
    status?: boolean;
    imageUrl?: string;
    organizations?: IOrganization[];
}

export interface IParticipation {
    id?: number;
    campaignId?: number;
    issuerId?: string;
    invitedDate?: Date;
    updatedDate?: Date;
    status?: number;
    statusName?: string;
    note?: string;
    issuer?: IUser;
}

export interface IPost {
    id?: number;
    campaignId?: number;
    name?: string;
    createdDate?: string;
    updatedDate?: string;
    description?: string;
}

export interface IOrganizationCampaign {
    id?: number;
    organizationId?: number;
    campaignId?: number;
    address?: string;
    organization?: IOrganization;
}

export interface ICampaign {
    id?: number;
    code?: string;
    name?: string;
    address?: string;
    preDate?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    imageUrl?: string;
    status?: number;
    statusName?: string;
    participations?: IParticipation[];
    organizationCampaigns?: IOrganizationCampaign[];
    posts?: IPost[];
}
