import React, { Fragment, useEffect, useState } from "react";
import { ParticipantFlowTabs } from "../../constants/ParticipantStatuses";
import { useAuth } from "../../context/AuthContext";
import { CampaignService } from "../../services/CampaignService";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { ICampaign } from "../../types/Campaign/ICampaign";
import PageHeading from "../Admin/PageHeading";
import { Tab } from "@headlessui/react";
import Kanban from "../Kanban";
import ParticipantColumn from "../ParticipantColumn";
import SelectBox from "../SelectBox";
import { Roles } from "../../constants/Roles";
import { toast } from "react-hot-toast";

type Props = {}

const ParticipantsPage: React.FC<Props> = ({}) => {
    const router = useRouter();
    const urlTab = router.query["tab"] as string;
    const [selectedFlowTab, setSelectedFlowTab] = useState(
        ParticipantFlowTabs[0],
    );

    useEffect(() => {
        if(urlTab === 'request') {
           setSelectedFlowTab(ParticipantFlowTabs[1])
        }
    }, [urlTab]);


    const { loginUser } = useAuth();
    const campaignService = new CampaignService(loginUser?.accessToken);

    const { data: campaigns, isInitialLoading: isCampaignsLoading } = useQuery(
        [loginUser?.role === Roles.SYSTEM.id ? "admin_campaigns" : "issuer_campaigns"],
        loginUser?.role === Roles.SYSTEM.id ?
            () => campaignService.getCampaignsByAdmin({
                size: 100,
                sort: "CreatedDate desc, UpdatedDate desc",
            })
            :
            () => campaignService.getCampaignsByCustomer({
                size: 100,
                sort: "CreatedDate desc, UpdatedDate desc",
            }),
    );
    const campaignIdFromUrl = router.query["campaign"] as string;
    const [campaignId, setCampaignId] = useState<number | null>(Number(campaignIdFromUrl) || null);

    return (
        <Fragment>
            <PageHeading label="Yêu cầu và lời mời tham gia hội sách">
            </PageHeading>
            <div className="rounded shadow bg-gradient-to-r from-gray-700 via-gray-900 to-black
             overflow-hidden">
                <div className="flex justify-between items-center bg-white px-4 md:px-6 border-b-2">
                    <Tab.Group>
                        <div className="pt-2 border-gray-200">
                            <ul className="flex flex-wrap gap-2">
                                {ParticipantFlowTabs.map((tab) => (
                                    <Tab

                                        onClick={() => {
                                            setSelectedFlowTab(tab);
                                        }}
                                        as={"div"}
                                        className={"focus:outline-none"}
                                        key={tab.id}
                                    >
                                        <div
                                            className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm">
                                            {tab.displayName}
                                        </div>
                                    </Tab>
                                ))}
                            </ul>
                        </div>
                    </Tab.Group>

                    <div className={"w-72"}>
                        <SelectBox<Partial<ICampaign>>
                            value={
                                campaigns?.data?.find((c) => c?.id === campaignId) || null
                            }
                            placeholder={isCampaignsLoading ? "Đang tải..." : "Tất cả hội sách"}
                            dataSource={[{
                                id: undefined,
                                name: "Tất cả hội sách",
                            }, ...campaigns?.data || []]}
                            onValueChange={async (c) => {
                                if (c) {
                                    if (c?.id === campaignId) return;
                                    setCampaignId(c?.id || null);
                                    await router.push({
                                        pathname: router.pathname,
                                        query: {
                                            ...router.query,
                                            "campaign": c?.id,
                                        },
                                    });
                                }
                            }}
                            disabled={isCampaignsLoading}
                            displayKey={"name"} />
                    </div>
                </div>

                <Kanban.Wrapper gap={"gap-10"}>
                    {selectedFlowTab.statusTabs.map((statusTab) =>
                        <ParticipantColumn campaignId={campaignId}
                                           key={statusTab?.id}
                                           participantStatus={statusTab} />,
                    )}
                </Kanban.Wrapper>
            </div>
        </Fragment>
    );
};

export default ParticipantsPage;