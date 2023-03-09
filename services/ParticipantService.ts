import { IParticipant } from "./../types/Participant/IParticipant";
import { BaseService } from "./BaseService";

export interface InviteIssuerParams {
    campaignId: number;
    issuers: string[];
}

export class ParticipantService extends BaseService {
    inviteIssuerByAdmin = async (data: InviteIssuerParams) => {
        const response = await this.axiosClient.post<IParticipant[]>(
            "/admin/participants",
            data
        );
        return response.data;
    };

    // createGroup = async (data: CreateGroupParams) => {
    //     const response = await this.axiosClient.post<IGroup>(
    //         "/admin/groups",
    //         data
    //     );
    //     return response.data;
    // };

    // updateGroup = async (data: UpdateGroupParams) => {
    //     const response = await this.axiosClient.put<IGroup>(
    //         "/admin/groups",
    //         data
    //     );
    //     return response.data;
    // };
}
