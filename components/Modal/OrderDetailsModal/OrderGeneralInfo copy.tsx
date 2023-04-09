import React from 'react'
import SectionHeader from "./SectionHeader";
import {IMockOrder} from "./index";
import Image from "next/image";
import {getOrderStatusById} from "../../../constants/OrderStatuses";

type Props = {
    order?: IMockOrder;
}

const labelClasses = 'text-sm min-w-fit text-slate-700 font-medium'
const wrapperClasses = 'space-y-2 sm:space-y-0 sm:flex sm:justify-between sm:gap-3 py-3 border-b border-slate-200'

const OrderGeneralInfo: React.FC<Props> = ({order}) => {
    return (
        <div>
            <SectionHeader label={'Thông tin chung'}/>
            {/* Fees, discount and total */}
            <ul>
                <li className={wrapperClasses}>
                    <div className={labelClasses}>Khách hàng</div>
                    <div className={'flex items-center gap-2'}>
                        <Image
                            className='rounded-full object-cover w-8 h-8'
                            src={order?.customer?.imageUrl || ''} alt={''}
                            width={100} height={100}/>
                        <div className={'truncate'}>
                            <div className='text-sm font-medium text-slate-800'>{order?.customer?.name}</div>
                            <div className='text-xs text-slate-500'>
                                {order?.customer?.email}</div>
                        </div>
                    </div>
                </li>
                <li className={wrapperClasses}>
                    <div className={labelClasses}>Hội sách</div>
                    <div
                        className="text-sm font-medium text-slate-800 sm:text-right">
                        Tri ân thầy cô 20/11
                    </div>
                </li>
                <li className={wrapperClasses}>
                    <div className={labelClasses}>Trạng thái</div>
                    <div
                        className="w-fit bg-emerald-100 text-green-600 text-sm font-medium px-3 py-1 rounded">
                        {order?.status && getOrderStatusById(order.status)?.displayName}
                    </div>
                </li>

                <li className={wrapperClasses}>
                    <div className={labelClasses}>Ngày đặt hàng</div>
                    <div
                        className="text-sm font-medium text-slate-800 sm:text-right">
                        {order?.createdAt && new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                </li>
                <li className={wrapperClasses}>
                    <div className={labelClasses}>Địa chỉ giao hàng</div>
                    <div
                        className="text-sm font-medium text-slate-800 sm:text-right">
                        {order?.address}
                    </div>
                </li>

            </ul>
        </div>
    )
}

export default OrderGeneralInfo