import Link from "next/link";
import React, {useContext} from "react";
import {MdEdit} from "react-icons/md";
import {CampaignFormats} from "../../constants/CampaignFormats";
import {CampaignStatuses} from "../../constants/CampaignStatuses";
import {Roles} from "../../constants/Roles";
import {useAuth} from "../../context/AuthContext";
import {CampaignContext} from "../../context/CampaignContext";
import SidebarIssuersTable from "./SidebarIssuersTable";
import SidebarStaffsTable from "./SidebarStaffsTable";

const Sidebar: React.FC = () => {
    const {loginUser} = useAuth();
    const campaign = useContext(CampaignContext);
    console.log(campaign?.format === CampaignFormats?.OFFLINE.id);

    return (
        <div>
            <div className="space-y-4 lg:sticky lg:top-20">
                {loginUser?.role === Roles.SYSTEM.id &&
                    campaign?.status === CampaignStatuses?.NOT_STARTED.id && (
                        <Link
                            href={`${campaign?.id}/edit`}
                            className="m-btn bg-blue-600 text-white w-full"
                        >
                            <MdEdit className="mr-2.5" size={17}/>
                            Cập nhật thông tin
                        </Link>
                    )}
                {/* 1st block
                {loginUser && loginUser?.role === Roles.ISSUER.id && (
                    <SidebarActionButtons campaign={campaign} issuers={issuers}/>
                )} */}
                {/* 2nd block */}
                <SidebarIssuersTable/>

                {loginUser?.role === Roles.SYSTEM.id &&
                    campaign?.format === CampaignFormats?.OFFLINE.id && (
                        <SidebarStaffsTable/>
                    )}
            </div>
        </div>
    );
};

export default Sidebar;
