import React, {Fragment, ReactElement, useState} from 'react'
import {ParticipantFlowTabs} from "../../../constants/ParticipantStatuses";
import {NextPageWithLayout} from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import {Tab} from "@headlessui/react";
import Kanban from "../../../components/Kanban";
import ParticipantColumn from "../../../components/ParticipantColumn";

const IssuerParticipants: NextPageWithLayout = () => {
    const [selectedFlowTab, setSelectedFlowTab] = useState(
        ParticipantFlowTabs[0]
    );
    return (
        <Fragment>
            <PageHeading label="Yêu cầu và lời mời tham gia hội sách">
            </PageHeading>
            <div className="rounded shadow bg-gradient-to-r from-gray-700 via-gray-900 to-black
             overflow-hidden">
                <div className="bg-white px-4 md:px-6 border-b-2">
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
                </div>

                <Kanban.Wrapper gap={'gap-10'}>
                    {selectedFlowTab.statusTabs.map((statusTab) =>
                        <ParticipantColumn key={statusTab?.id} participantStatus={statusTab}/>
                    )}
                </Kanban.Wrapper>

            </div>
        </Fragment>
    )
}
IssuerParticipants.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerParticipants