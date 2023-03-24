import React from 'react'
import {IParticipantStatus, ParticipantStatuses} from "../constants/ParticipantStatuses";
import Kanban from "./Kanban";
import {useQuery} from "@tanstack/react-query";
import {useAuth} from "../context/AuthContext";
import {ParticipantService} from "../services/ParticipantService";
import ParticipantCard from "./ParticipantCard";
import {Roles} from "../constants/Roles";
import EmptyState, {EMPTY_STATE_TYPE} from "./EmptyState";

const ParticipantStatusLabel = ({
                                    status,
                                    count,
                                    countBgColor = 'bg-green-600'
                                }: { status: string, count: number, countBgColor?: string }) => {
    return (
        <div className="flex bg-white rounded shadow px-4 items-center justify-between font-semibold text-md py-4">
            {status}
            <span className={`text-white ${countBgColor} px-3 text-sm py-1 rounded`}>{count}</span>
        </div>
    );
};


type Props = {
    participantStatus: IParticipantStatus
}

const ParticipantColumn: React.FC<Props> = ({participantStatus}) => {

    const {loginUser} = useAuth();
    const participantService = new ParticipantService(loginUser?.accessToken);
    const queryKey = loginUser?.role === Roles.SYSTEM.id ? 'admin_participants' : 'issuer_participants';
    const {data: participantsData, isLoading: isParticipantsLoading} = useQuery(
        [queryKey, participantStatus?.id],
        loginUser?.role === Roles.SYSTEM.id ? () => participantService.getParticipantsByAdmin({
            size: 100,
            status: participantStatus?.id,
            sort: participantStatus.id === ParticipantStatuses.PendingRequest.id
            || participantStatus.id === ParticipantStatuses.PendingInvitation.id
                ?
                'createdDate desc' : 'updatedDate desc'
        }) : () => participantService.getParticipantsByIssuer({
            size: 100,
            status: participantStatus?.id,
            sort: participantStatus.id === ParticipantStatuses.PendingRequest.id
            || participantStatus.id === ParticipantStatuses.PendingInvitation.id
                ?
                'createdDate desc' : 'updatedDate desc'
        }),
    );
    return (
        <Kanban.Column header={
            <ParticipantStatusLabel
                countBgColor={participantStatus?.bgColor}
                count={participantsData?.metadata?.total || 0}
                status={`${participantStatus?.icon} ${participantStatus.displayName}`}/>
        } columnWidth={'w-[400px]'}>
            {participantsData?.data?.map((p) => (
                <div key={p?.id} className='pr-2'>
                    <ParticipantCard key={p?.id} participant={p}/>
                </div>
            ))}
            {participantsData?.data?.length === 0 && !isParticipantsLoading && (
                <div className={'bg-white py-8 rounded'}>
                    <EmptyState
                        status={EMPTY_STATE_TYPE.NO_DATA}
                        customMessage={'Không có dữ liệu'}
                    />
                </div>
            )}
        </Kanban.Column>
    )
}

export default ParticipantColumn