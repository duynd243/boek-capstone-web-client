import { IUser } from "./../User/IUser";
export interface IParticipant {
    id: number;
    campaignId?: number;
    issuerId?: string;
    status?: number;
    statusName?: string;
    note?: string;
    createdDate?: string;
    updatedDate?: string;
    issuer?: {
        id?: string;
        description?: string;
        user?: IUser;
    };
}
