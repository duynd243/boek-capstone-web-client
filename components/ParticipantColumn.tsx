import React from "react";
import { IParticipantStatus } from "../constants/ParticipantStatuses";
import Kanban from "./Kanban";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { ParticipantService } from "../services/ParticipantService";
import { Roles } from "../constants/Roles";
import ParticipantCardSkeleton from "./ParticipantCard/ParticipantCardSkeleton";
import ParticipantCard from "./ParticipantCard";
import EmptyState, { EMPTY_STATE_TYPE } from "./EmptyState";

const ParticipantStatusLabel = ({
                                    status,
                                    count,
                                    countBgColor = "bg-green-600",
                                }: { status: string, count: number, countBgColor?: string }) => {
    return (
        <div className="flex bg-white rounded shadow px-4 items-center justify-between font-semibold text-md py-4">
            {status}
            <span className={`text-white ${countBgColor} px-3 text-sm py-1 rounded`}>{count}</span>
        </div>
    );
};


type Props = {
    participantStatus: IParticipantStatus;
    campaignId: number | null;
}

const ParticipantColumn: React.FC<Props> = ({ participantStatus, campaignId }) => {

    const { loginUser } = useAuth();
    const participantService = new ParticipantService(loginUser?.accessToken);
    const queryKey = loginUser?.role === Roles.SYSTEM.id ? "admin_participants" : "issuer_participants";

    const params = {
        size: 100,
        status: participantStatus?.id,
        sort: "CreatedDate desc, UpdatedDate desc",
        campaignId: campaignId || undefined,
    };
    const { data: participantsData, isLoading: isParticipantsLoading } = useQuery(
        [queryKey, participantStatus?.id, campaignId],
        loginUser?.role === Roles.SYSTEM.id ?
            () => participantService.getParticipantsByAdmin(params) :
            () => participantService.getParticipantsByIssuer(params),
    );
    return (
        <Kanban.Column header={
            <ParticipantStatusLabel
                countBgColor={participantStatus?.bgColor}
                count={participantsData?.metadata?.total || 0}
                status={`${participantStatus?.icon} ${participantStatus.displayName}`} />
        } columnWidth={"w-[400px]"}>

            {isParticipantsLoading && (
                <div className="space-y-6">
                    <ParticipantCardSkeleton />
                    <ParticipantCardSkeleton />
                </div>

            )}
            {!isParticipantsLoading && participantsData?.data && participantsData?.data?.length > 0 &&
                <div className="space-y-6 pr-2">
                    {participantsData?.data?.map((p) => (
                        <div key={p?.id} className="">
                            <ParticipantCard key={p?.id} participant={p} />
                        </div>
                    ))}
                </div>
            }
            {participantsData?.data?.length === 0 && !isParticipantsLoading && (
                <div className={"bg-white py-8 rounded"}>
                    <EmptyState
                        status={EMPTY_STATE_TYPE.NO_DATA}
                        customMessage={"Không có dữ liệu"}
                    />
                </div>
            )}
        </Kanban.Column>
    );
};

export default ParticipantColumn;