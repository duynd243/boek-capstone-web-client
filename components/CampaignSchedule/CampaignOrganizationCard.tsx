import React from 'react'
import Image from "next/image";
import {getAvatarFromName} from "../../utils/helper";
import {IoAdd} from "react-icons/io5";
import {z} from "zod";
import {CampaignOrganizationSchema} from "../CampaignForm/hooks";
import {useFieldArray, useFormContext} from "react-hook-form";
import ScheduleCard from "./ScheduleCard";
import useOfflineCampaignForm from "../CampaignForm/hooks/useOfflineCampaignForm";
import ErrorMessage from "../Form/ErrorMessage";
import {Transition} from "@headlessui/react";
import {BsFillCalendarPlusFill} from "react-icons/bs";
import {RiDeleteBin7Fill} from "react-icons/ri";


type CampaignOrganization = z.infer<typeof CampaignOrganizationSchema>

type Props = {
    onRemove: () => void;
    campaignOrganization: CampaignOrganization;
    index: number;
}

const CampaignOrganizationCard: React.FC<Props> = ({index, onRemove, campaignOrganization}) => {

    const {ContinuousOfflineCampaignSchema} = useOfflineCampaignForm({});
    type FormType = z.infer<typeof ContinuousOfflineCampaignSchema>;
    const {control, formState: {errors}} = useFormContext<FormType>();

    const {fields, append, remove} = useFieldArray({
        control,
        name: `campaignOrganizations.[${index}].schedules` as `campaignOrganizations.[0].schedules`,
    });


    return (
        <div>
            <div className='border rounded-md w-full p-10 bg-slate-50'>

                <div className='flex flex-wrap gap-3 justify-between items-start'>
                    <div className={'flex gap-3 items-center'}>
                        <Image
                            width={100}
                            height={100}
                            className={'rounded-full object-cover w-12 h-12'}
                            src={campaignOrganization?.organizationImageUrl || getAvatarFromName(campaignOrganization?.organizationName)}
                            alt={''}/>
                        <div>
                            <div className='text-lg font-medium'>{campaignOrganization?.organizationName}</div>
                            <div className='text-sm'>{campaignOrganization?.organizationAddress}</div>
                        </div>
                    </div>

                    <div className='flex gap-2'>
                        <button type={'button'}
                                onClick={onRemove}
                                className={'bg-gray-200 p-3 text-white rounded-full'}>
                            <RiDeleteBin7Fill size={18} className='fill-gray-500' />
                        </button>
                        <button type={'button'}
                                onClick={() => {
                                    append({})
                                }}
                                className={'bg-indigo-500 p-3 text-white rounded-full'}>
                            <BsFillCalendarPlusFill size={18}/>
                        </button>
                    </div>
                </div>

                <div className='space-y-6'>
                    {fields.map((item, itemIndex) => {
                        return (
                            <Transition
                                appear
                                show={true}
                                enter={'transform-gpu duration-700 ease-in-out'}
                                enterFrom={'opacity-0 scale-50'}
                                enterTo={'opacity-100 scale-100'}
                                leave={'transition-gpu duration-700 ease-in-out'}
                                leaveFrom={'opacity-100 scale-100'}
                                leaveTo={'opacity-0 scale-0'}
                                key={item.id}>
                                <ScheduleCard
                                    key={item.id}
                                    parentIndex={index}
                                    index={itemIndex}
                                    registerKey={`campaignOrganizations.[${index}].schedules.[${itemIndex}]`}
                                    onRemove={() => {
                                        remove(itemIndex)
                                    }}/>
                            </Transition>
                        )
                    })}
                </div>
            </div>
            {errors?.campaignOrganizations?.[index]?.schedules?.message && (
                <ErrorMessage>
                    {errors?.campaignOrganizations?.[index]?.schedules?.message}
                </ErrorMessage>
            )}
        </div>
    )
}

export default CampaignOrganizationCard