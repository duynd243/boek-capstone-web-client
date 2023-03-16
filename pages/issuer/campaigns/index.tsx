import React, {Fragment, ReactElement, useState} from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {useAuth} from "../../../context/AuthContext";
import {useQuery} from "@tanstack/react-query";
import {IssuerCampaignService} from "../../../old-services/Issuer/Issuer_CampaignService";
import SearchForm from "../../../components/Admin/SearchForm";
import AdminCampaignCard from "../../../components/Admin/AdminCampaignCard";
import {NextPageWithLayout} from "../../_app";
import {useRouter} from "next/router";
import {Menu, Tab, Transition} from "@headlessui/react";
import Chip from "../../../components/Admin/Chip";
import LoadingTopPage from "../../../components/LoadingTopPage";
import PageHeading from "../../../components/Admin/PageHeading";
import CreateButton from "../../../components/Admin/CreateButton";
import CreateCampaignButton from "../../../components/CreateCampaignButton";
import CampaignCard from "../../../components/CampaignCard";

const IssuerCampaignsPage: NextPageWithLayout = () => {
    const {loginUser} = useAuth();
    const issuerCampaignService = new IssuerCampaignService(
        loginUser?.accessToken
    );
    const router = useRouter();

    const [page, setPage] = React.useState(1);
    const [size, setSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [otherPage, setOtherPage] = React.useState(1);
    const [endedPage, setEndedPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(200);
    const [selectedStatus, setSelectedStatus] = useState<undefined | number>(
        undefined
    );

    const CampaignTabs = [
        {
            id: 0,
            name: "Hội sách của tôi",
        },
        {
            id: 1,
            name: "Các hội sách khác",
            statusColor: "bg-green-500",
        },
        {
            id: 2,
            name: "Hội sách đã kết thúc",
            statusColor: "bg-red-500",
        },
    ];

    const {data: campaigns, isLoading} = useQuery(
        ["issuer_campaigns", page, size, search, selectedStatus],
        () =>
            issuerCampaignService.getCampaigns$Issuer({
                page: page,
                size: pageSize,
                name: search,
                sort: "id desc",
            })
    );

    const {data: otherCampaigns, isLoading: isOtherLoading} = useQuery(
        ["issuer_other_campaigns", otherPage],
        () =>
            issuerCampaignService.getOtherCampaigns$Issuer({
                page: otherPage,
                size: pageSize,
                sort: "id desc",
            })
    );
    const {data: endedCampaigns, isLoading: isEndedLoading} = useQuery(
        ["issuer_ended_campaigns", endedPage],
        () =>
            issuerCampaignService.getEndedCampaigns$Issuer({
                page: endedPage,
                size: pageSize,
                sort: "id desc",
            })
    );
    return (
        <Fragment>
            {/*{isFetching && <LoadingTopPage/>}*/}
            <PageHeading label="Hội sách">
                <SearchForm
                    placeholder="Tìm kiếm hội sách"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />

            </PageHeading>

            <Tab.Group>
                <div className="mb-5">
                    <ul className="flex flex-wrap gap-2">
                        {CampaignTabs.map((tab) => (
                            <Tab as={"div"} className={"focus:outline-none"} key={tab.name}>
                                {({selected}) => {
                                    if (selected) setSelectedStatus(tab.id);
                                    return (
                                        <Chip active={selected}>
                                            {tab?.statusColor && (
                                                <span
                                                    className={`mr-2 inline-block h-2 w-2 rounded-full ${tab.statusColor}`}
                                                />
                                            )}
                                            {tab.name}
                                        </Chip>
                                    );
                                }}
                            </Tab>
                        ))}
                    </ul>
                </div>

                <Tab.Panel as={Fragment}>
                    <div className="grid gap-6 md:grid-cols-2 mb-4">
                        {isLoading ? (
                            <div>Đang tải...</div>
                        ) : (
                            campaigns?.data?.map((campaign) => (
                               <CampaignCard key={campaign?.id} campaign={campaign}/>
                            ))
                        )}
                    </div>
                </Tab.Panel>
                <Tab.Panel as={Fragment}>
                    <div className="grid grid-cols-12 gap-6">
                        {isOtherLoading ? (
                            <div>Đang tải...</div>
                        ) : (
                            otherCampaigns?.data?.map((campaign) => (
                                <div
                                    key={campaign.id}
                                    className={"col-span-full sm:col-span-6 xl:col-span-4"}
                                >
                                    <AdminCampaignCard campaign={campaign}/>
                                </div>
                            ))
                        )}
                    </div>
                </Tab.Panel>
                <Tab.Panel as={Fragment}>
                    <div className="grid grid-cols-12 gap-6">
                        {isEndedLoading ? (
                            <div>Đang tải...</div>
                        ) : (
                            endedCampaigns?.data?.map((campaign) => (
                                <div
                                    key={campaign.id}
                                    className={"col-span-full sm:col-span-6 xl:col-span-4"}
                                >
                                    <AdminCampaignCard campaign={campaign}/>
                                </div>
                            ))
                        )}
                    </div>
                </Tab.Panel>
            </Tab.Group>
        </Fragment>
    );
};
IssuerCampaignsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerCampaignsPage;
