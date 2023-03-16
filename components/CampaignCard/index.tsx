import React from 'react'
import Image from "next/image";
import {ICampaign} from "../../types/Campaign/ICampaign";
import Link from "next/link";
import {useAuth} from "../../context/AuthContext";
import {findRole} from "../../constants/Roles";

type Props = {
    campaign: ICampaign
}

const CampaignCard: React.FC<Props> = ({campaign}) => {

    const {loginUser} = useAuth();
    const defaultRoute = findRole(loginUser?.role)?.defaultRoute;
    return (
        <Link href={`${defaultRoute}/campaigns/${campaign?.id}`}
              className='border cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow rounded overflow-hidden lg:grid lg:grid-cols-6'>
            <Image src={campaign?.imageUrl || ''}
                   width={1000}
                   height={1000}
                   className='object-cover w-full h-48 lg:col-span-2 lg:h-full'
                   alt=''/>
            <div className='p-4 lg:col-span-4'>
                <div
                    className='text-sm font-medium uppercase tracking-wide text-indigo-600'
                >12-06-2022 - 12-07-2022
                </div>
                <div className='text-slate-800 font-bold text-xl'>{campaign?.name}</div>
                <p className='mt-3 text-slate-600 text-sm overflow-hidden overflow-ellipsis line-clamp-3'>
                    {campaign?.description}
                </p>
            </div>
        </Link>
    )
}

export default CampaignCard