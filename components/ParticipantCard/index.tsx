import Image from "next/image";
import React, {Fragment} from "react";
import {useAuth} from "../../context/AuthContext";
import {IParticipant} from "../../types/Participant/IParticipant";
import {AiFillShop} from "react-icons/ai";
import {getFormattedTime, isValidImageSrc} from "../../utils/helper";
import DefaultAvatar from "../../assets/images/default-avatar.png";
import {formatDistance} from "date-fns";
import {vi} from "date-fns/locale";
import useParticipantCard from "./useParticipantCard";
import {Roles} from "../../constants/Roles";
import {getParticipantStatusById} from "../../constants/ParticipantStatuses";

type Props = {
    participant: IParticipant;
    showCampaignInfo?: boolean;
};

const ParticipantCard: React.FC<Props> = ({
                                              participant,
                                              showCampaignInfo = true,
                                          }) => {
    const {loginUser} = useAuth();
    const {Buttons, Modals} = useParticipantCard(participant);
    const participantStatus = getParticipantStatusById(participant?.status);
    return (
        <Fragment>
            <div className='relative'>
                <div className='p-4 bg-white'>
                    <div className={'flex items-center justify-between'}>
                        <div className='flex gap-2.5 items-center'>
                            {loginUser?.role === Roles.SYSTEM.id ? <Image
                                src={participant?.issuer?.user?.imageUrl && isValidImageSrc(participant?.issuer?.user?.imageUrl)
                                    ? participant?.issuer?.user?.imageUrl
                                    : DefaultAvatar.src} alt={''}
                                width={300}
                                height={300}
                                className={'rounded-full object-cover w-10 h-10'}
                            /> : <Image
                                src={participant?.campaign?.imageUrl && isValidImageSrc(participant?.campaign?.imageUrl)
                                    ? participant?.campaign?.imageUrl
                                    : DefaultAvatar.src} alt={''}
                                width={300}
                                height={300}
                                className={'rounded-sm object-cover w-10 h-10'}
                            />}
                            <div className='flex flex-col'>
                                <div className='font-semibold line-clamp-1 break-words'>
                                    {loginUser?.role === Roles.SYSTEM.id ? participant?.issuer?.user?.name : participant?.campaign?.name}
                                </div>
                                <div className='text-xs font-medium text-slate-500 line-clamp-1 break-words'>
                                    {loginUser?.role === Roles.SYSTEM.id ? participant?.issuer?.user?.email : participant?.campaign?.address}
                                </div>
                            </div>
                        </div>
                        {participant?.updatedDate && <span className='text-sm text-right text-slate-500'>
                        Cập nhật<br/>
                        <span className='font-medium text-blue-600'>
                            {formatDistance(new Date(participant?.updatedDate), new Date(), {
                                addSuffix: true,
                                locale: vi
                            })}
                        </span>
                        </span>}
                    </div>

                    <div className='grid grid-cols-2 py-5 border-b'>
                        <div className='flex flex-col mx-auto gap-2'>
                            <div className='text-sm font-medium text-gray-500'>
                                Thời gian khởi tạo
                            </div>
                            <div className='text-sm font-medium text-gray-700'>
                                {getFormattedTime(participant?.createdDate, 'HH:mm - dd/MM/yyyy')}
                            </div>
                        </div>

                        <div className='flex flex-col mx-auto justify-center gap-2'>
                            <div className='text-sm font-medium text-gray-500'>
                                Trạng thái
                            </div>
                            <span
                                className={`w-fit flex items-center h-6 px-3 text-xs font-semibold ${participantStatus?.label?.classNames}`}>
                                {participantStatus?.label?.text || 'Không xác định'}
                            </span>
                        </div>


                    </div>

                    {loginUser?.role === Roles.SYSTEM.id &&
                        <div className='flex items-center justify-between mt-4 gap-3.5'>
                            <div className='flex text-sm items-center gap-1.5 min-w-max'>
                                <div className='text-white bg-blue-500 p-1.5 rounded-full'>
                                    <AiFillShop/>
                                </div>
                                <span className='font-medium'>
                            Hội sách
                        </span>
                            </div>

                            <span className='text-sm text-slate-700 line-clamp-1 break-words'>
                        {participant?.campaign?.name}
                    </span>
                        </div>}

                    <div className='bg-slate-50 rounded text-sm text-slate-600 mt-4 px-3 py-2 border border-slate-200'>
                        📝 {participant?.note || 'Không có ghi chú'}
                    </div>
                </div>
                {Buttons.length > 0 &&
                    <div className='grid grid-cols-2 bg-gray-50 gap-2.5 p-4 text-sm'>
                        {Buttons.map((Button, index) => {
                            let color = 'bg-white border';
                            if (Button.type === 'primary') {
                                color = 'bg-indigo-500 text-white';
                            }
                            if (Button.type === 'danger') {
                                color = 'bg-white text-red-500 border';
                            }
                            return <button key={index} onClick={Button.onClick}
                                           className={`py-2 rounded font-medium ${Buttons.length === 1 ? 'col-span-2' : ''} ${color}`}>
                                {Button.title}
                            </button>;
                        })}
                    </div>
                }
            </div>


            {Modals}
        </Fragment>
    );
};

export default ParticipantCard;
