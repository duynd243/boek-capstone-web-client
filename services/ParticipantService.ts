import { IParticipant } from "./../types/Participant/IParticipant";
import { BaseService } from "./BaseService";
import { IUser } from "../types/User/IUser";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IBaseRequestParams } from "../types/Request/IBaseRequestParams";

export interface InviteIssuerParams {
    campaignId: number;
    issuers: string[];
}

export class ParticipantService extends BaseService {
    inviteIssuerByAdmin = async (data: InviteIssuerParams) => {
        const response = await this.axiosClient.post<IParticipant[]>(
            "/admin/participants",
            data,
        );
        return response.data;
    };


    cancelInviteByAdmin = async (
        participantId: number,
    ) => {
        const response = await this.axiosClient.put<any>(
            `/admin/participants/cancellation/${participantId}`,
        );
        return response.data;
    };

    acceptInviteByIssuer = async (
        participantId: number,
    ) => {
        const response = await this.axiosClient.put<any>(
            `/issuer/participants/acceptance/${participantId}`,
        );
        return response.data;
    };

    rejectInviteByIssuer = async (
        participantId: number,
    ) => {
        const response = await this.axiosClient.put<any>(
            `/issuer/participants/rejection/${participantId}`,
        );
        return response.data;
    };

    requestToJoinByIssuer = async (
        campaignId: number,
    ) => {
        const response = await this.axiosClient.post<any>(
            `/issuer/participants`, {
                campaignId,
            },
        );
        return response.data;
    };

    rejectRequestByAdmin = async (
        participantId: number,
    ) => {
        const response = await this.axiosClient.put<any>(
            `/admin/participants/rejection/${participantId}`,
        );
        return response.data;
    };

    acceptRequestByAdmin = async (
        participantId: number,
    ) => {
        const response = await this.axiosClient.put<any>(
            `/admin/participants/approval/${participantId}`,
        );
        return response.data;
    };

    getUnparticipatedIssuersOfCampaign = async (campaignId: number) => {
        const response = await this.axiosClient.get<IUser[]>(
            `/admin/campaigns/unparticipated-issuers/${campaignId}`,
        );
        return response.data;
    };

    getParticipantsByAdmin = async (params?: IBaseRequestParams<IParticipant>) => {
        const response = await this.axiosClient.get<IBaseListResponse<IParticipant>>(
            "/admin/participants",
            { params },
        );
        return response.data;
    };

    getParticipantsByIssuer = async (params?: IBaseRequestParams<IParticipant>) => {
        const response = await this.axiosClient.get<IBaseListResponse<IParticipant>>(
            "/issuer/participants",
            { params },
        );
        return response.data;
    };
}
