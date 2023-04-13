import React from "react";
import { RiCake2Line, RiMailLine, RiUserAddLine } from "react-icons/ri";
import { getFormattedTime } from "../../utils/helper";
import { ICustomer } from "../../types/User/IUser";

type Props = {
    profile: ICustomer | undefined;
    isLoading: boolean;
}

const labelClasses = "text-sm font-medium text-slate-500 ml-2 text-left line-clamp-1 break-words";
const iconClasses = "text-slate-500 flex-shrink-0";

const BioSection: React.FC<Props> = ({ profile, isLoading }) => {
    return (
        <div className="space-y-2.5">

            <div className="flex items-center">
                <RiMailLine className={iconClasses} />
                <span className={labelClasses}>{
                    profile?.user?.email || "Chưa cập nhật"
                }</span>
            </div>


            <div className="flex items-center">
                <RiUserAddLine className={iconClasses} />
                <span className={labelClasses}>
                                Tham gia Boek từ {getFormattedTime(profile?.user?.createdDate, "dd-MM-yyyy")}
                            </span>
            </div>

            <div className="flex items-center">
                <RiCake2Line className={iconClasses} />
                <span className={labelClasses}>
                                {getFormattedTime(profile?.dob, "dd-MM-yyyy")}
            </span>
            </div>

            {/*<div className="flex items-center">*/}
            {/*    <RiMapPin2Line className={iconClasses} />*/}
            {/*    <span className={labelClasses}>{*/}
            {/*        profile?.user?.address || "Chưa cập nhật"*/}
            {/*    }</span>*/}
            {/*</div>*/}


        </div>
    );
};

export default BioSection;