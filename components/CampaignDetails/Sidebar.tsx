import React from "react";
import SidebarIssuersTable from "./SidebarIssuersTable";
import {IUser} from "../../old-types/user/IUser";
import SidebarActionButtons from "./SidebarActionButtons";
import {useAuth} from "../../context/AuthContext";
import {Roles} from "../../constants/Roles";
import {faker} from "@faker-js/faker/locale/vi";
import SidebarStaffsTable from "./SidebarStaffsTable";
import {ICampaign} from "../../types/Campaign/ICampaign";
import {CampaignFormats} from "../../constants/CampaignFormats";

type Props = {
    campaign: ICampaign | undefined;
    issuers: IUser[];
};

const Sidebar: React.FC<Props> = ({campaign, issuers}) => {
    const {loginUser} = useAuth();
    return (
        <div>
            <div className="space-y-4 lg:sticky lg:top-20">
                {/* 1st block */}
                {loginUser && loginUser?.role === Roles.ISSUER.id && (
                    <SidebarActionButtons campaign={campaign} issuers={issuers}/>
                )}
                {/* 2nd block */}
                <SidebarIssuersTable issuers={[
                    {
                        id: '1',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    },
                    {
                        id: '2',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    },
                    {
                        id: '3',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    }, {
                        id: '4',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    }, {
                        id: '5',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    }, {
                        id: '6',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    }, {
                        id: '7',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    }
                ]}/>

                {campaign?.format === CampaignFormats?.OFFLINE.id && <SidebarStaffsTable issuers={[
                    {
                        id: '1',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    },
                    {
                        id: '2',
                        name: faker.name.fullName(),
                        imageUrl: faker.image.avatar(),
                    },
                ]}/>}
            </div>
        </div>
    );
};

export default Sidebar;
