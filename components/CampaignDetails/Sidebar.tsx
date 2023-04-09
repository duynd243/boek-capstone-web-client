import React, { useContext } from "react";
import { CampaignFormats } from "../../constants/CampaignFormats";
import { Roles } from "../../constants/Roles";
import { useAuth } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";
import SidebarIssuersTable from "./SidebarIssuersTable";
import SidebarStaffsTable from "./SidebarStaffsTable";
import SidebarActions from "./SidebarActions";

const Sidebar: React.FC = () => {
    const { loginUser } = useAuth();
    const campaign = useContext(CampaignContext);

    return (
        <div>
            <div className="space-y-4 lg:sticky lg:top-20">

                {
                    (loginUser?.role === Roles.SYSTEM.id || loginUser?.role === Roles.ISSUER.id) &&
                    <SidebarActions />
                }

                <SidebarIssuersTable />

                {loginUser?.role === Roles.SYSTEM.id &&
                    campaign?.format === CampaignFormats?.OFFLINE.id && (
                        <SidebarStaffsTable />
                    )}
            </div>
        </div>
    );
};

export default Sidebar;
