import { Tab } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, ReactElement, useState } from "react";
import Chip from "../../../../components/Admin/Chip";
import CreateButton from "../../../../components/Admin/CreateButton";
import PageHeading from "../../../../components/Admin/PageHeading";
import FormatCard from "../../../../components/CampaignCard/FormatCard";
import StatusLabel from "../../../../components/CampaignDetails/StatusLabel";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import Index from "../../../../components/ParticipantCard";
import { CampaignStatuses } from "../../../../constants/CampaignStatuses";
import { ParticipantStatuses } from "../../../../constants/ParticipantStatuses";
import { useAuth } from "../../../../context/AuthContext";
import { CampaignService } from "../../../../services/CampaignService";
import { NextPageWithLayout } from "../../../_app";
import { ParticipantService } from "../../../../services/ParticipantService";

const ParticipantFlowTabs = [
    {
        id: 1,
        displayName: "Được mời tham gia",
        statusTabs: [
            ParticipantStatuses.PendingInvitation,
            ParticipantStatuses.InvitationAccepted,
            ParticipantStatuses.InvitationRejected,
            ParticipantStatuses.InvitationCancelled,
        ],
    },
    {
        id: 2,
        displayName: "Gửi yêu cầu tham gia",
        statusTabs: [
            ParticipantStatuses.PendingRequest,
            ParticipantStatuses.RequestApproved,
            ParticipantStatuses.RequestRejected,
        ],
    },
];

const CampaignParticipants: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const campaignService = new CampaignService(loginUser?.accessToken);
    const participantService = new ParticipantService(loginUser?.accessToken);
    const campaignId = router.query.id as string;

    const { data: campaign, isLoading } = useQuery(
        ["admin_campaign", campaignId],
        () => campaignService.getCampaignByIdByAdmin(Number(campaignId)),
        {
            enabled: !!campaignId,
        },
    );
    const [selectedFlowTab, setSelectedFlowTab] = useState(
        ParticipantFlowTabs[0],
    );

    const [selectedStatusTab, setSelectedStatusTab] = useState(
        ParticipantFlowTabs[0].statusTabs[0].id,
    );

    console.log(selectedFlowTab.displayName);

    const participants =
        campaign?.participants?.filter((p) => p.status === selectedStatusTab) ||
        [];

    const [size, setSize] = useState<number>(1000);
    const [page, setPage] = useState<number>(1);

    const { data: participantsData, isLoading: isParticipantsLoading } = useQuery(
        ["admin_participants", campaignId, page, size, selectedStatusTab],
        () => participantService.getParticipantsByAdmin({
            campaignId: Number(campaignId),
            page,
            size,
            status: selectedStatusTab,
        }),
    );

    return (
        <Fragment>
            <PageHeading label="Quản lý yêu cầu / lời mời tham gia hội sách" />

            <div className="bg-white my-6 p-4 flex border rounded items-center">
                <FormatCard formatId={campaign?.format} />
                <div className="flex-1 ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                        {campaign?.name}
                    </h3>
                </div>
                <StatusLabel statusId={campaign?.status} />
                {campaign?.status === CampaignStatuses.NOT_STARTED.id && (
                    <div className="ml-4">
                        <CreateButton
                            label="Mời NPH tham gia"
                            onClick={undefined}
                        />
                    </div>
                )}
            </div>

            <div className="bg-white px-4 md:px-6 rounded">
                <Tab.Group>
                    <div className="border-b pt-2 border-gray-200">
                        <ul className="flex flex-wrap gap-2">
                            {ParticipantFlowTabs.map((tab) => (
                                <Tab
                                    onClick={() => {
                                        setSelectedStatusTab(tab.statusTabs[0].id);
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
                <Tab.Group>
                    <div className="py-6">
                        <ul className="flex flex-wrap gap-2">
                            {selectedFlowTab.statusTabs.map((tab) => (
                                <Tab
                                    onClick={() => setSelectedStatusTab(tab.id)}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.displayName}
                                >
                                    {({ selected }) => {
                                        return (
                                            <Chip active={selected}>
                                                {/* {tab?.statusColor && (
                                                    <span
                                                        className={`mr-2 inline-block h-2 w-2 rounded-full bg-${tab.statusColor}-500`}
                                                    />
                                                )} */}
                                                {tab.displayName}
                                            </Chip>
                                        );
                                    }}
                                </Tab>
                            ))}
                        </ul>
                    </div>
                </Tab.Group>
                <div className="grid md:grid-cols-2 gap-4 pb-6">
                    {participantsData && participantsData?.data?.map((p) => (
                        <Index showCampaignInfo={false} key={p.id} participant={p} />
                    ))}
                </div>
            </div>
        </Fragment>
    );
};
CampaignParticipants.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default CampaignParticipants;
