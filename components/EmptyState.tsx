import React from 'react'
import {BsSearch} from "react-icons/bs";
import {HiOutlineInbox} from "react-icons/hi2";

export enum EMPTY_STATE_TYPE {
    NO_DATA,
    SEARCH_NOT_FOUND,
}

type Props = {
    status: EMPTY_STATE_TYPE,
    keyword?: string,
}

const EmptyState: React.FC<Props> = ({status, keyword}) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-slate-100">
                {status === EMPTY_STATE_TYPE.NO_DATA ? (
                    <HiOutlineInbox
                        className="w-12 h-12 text-slate-400"
                    />
                ) : (
                    <BsSearch
                        className="w-12 h-12 text-slate-400"
                    />
                )}
            </div>
            <div className="mt-4 text-lg font-medium text-slate-500">
                {status === EMPTY_STATE_TYPE.NO_DATA
                    ? 'Chưa có dữ liệu'
                    : keyword
                        ? `Không tìm thấy kết quả cho từ khóa "${keyword}"`
                        : 'Không tìm thấy kết quả'}
            </div>
            {status === EMPTY_STATE_TYPE.SEARCH_NOT_FOUND && (
                <div className="mt-2 text-base text-slate-500">
                    Hãy thử tìm kiếm với từ khóa khác
                </div>
            )}
        </div>

    )
}

export default EmptyState