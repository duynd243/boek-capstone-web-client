import React, {memo} from "react";
import {BsSearch} from "react-icons/bs";
import {HiOutlineInbox} from "react-icons/hi2";

export enum EMPTY_STATE_TYPE {
    NO_DATA,
    SEARCH_NOT_FOUND,
}

type Props = {
    status: EMPTY_STATE_TYPE;
    keyword?: string;
    customMessage?: string;
};

const EmptyState: React.FC<Props> = ({status, keyword, customMessage}) => {
    return (
        <div className="flex h-full flex-col items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-100">
                {status === EMPTY_STATE_TYPE.NO_DATA ? (
                    <HiOutlineInbox className="h-12 w-12 text-slate-400"/>
                ) : (
                    <BsSearch className="h-12 w-12 text-slate-400"/>
                )}
            </div>
            <div className="mt-4 text-lg font-medium text-slate-600">
                {customMessage
                    ? customMessage
                    : status === EMPTY_STATE_TYPE.NO_DATA
                        ? "Chưa có dữ liệu"
                        : keyword
                            ? `Không tìm thấy kết quả cho từ khóa "${keyword}"`
                            : "Không tìm thấy kết quả"}
            </div>
            {status === EMPTY_STATE_TYPE.SEARCH_NOT_FOUND && (
                <div className="mt-2 text-base text-slate-500">
                    Hãy thử tìm kiếm với từ khóa khác
                </div>
            )}
        </div>
    );
};

export default memo(EmptyState);
