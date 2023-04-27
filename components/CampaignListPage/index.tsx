import React, { Fragment, useCallback, useState } from "react";
import LoadingTopPage from "../LoadingTopPage";
import PageHeading from "../Admin/PageHeading";
import SearchForm from "../Admin/SearchForm";
import { Menu, Tab, Transition } from "@headlessui/react";
import CreateButton from "../Admin/CreateButton";
import CreateCampaignButton from "../CreateCampaignButton";
import { CampaignFormatTabs } from "../../constants/CampaignFormats";
import { CampaignStatusTabs } from "../../constants/CampaignStatuses";
import Chip from "../Admin/Chip";
import useSearchQuery from "../../hooks/useSearchQuery";
import { useAuth } from "../../context/AuthContext";
import { CampaignService } from "../../services/CampaignService";
import { useQuery } from "@tanstack/react-query";
import CampaignCard from "../CampaignCard";
import Pagination from "../Pagination";
import EmptyState, { EMPTY_STATE_TYPE } from "../EmptyState";
import CampaignCardSkeleton from "../CampaignCard/CampaignCardSkeleton";
import { HiBuildingStorefront } from "react-icons/hi2";
import { HiStatusOnline } from "react-icons/hi";
import { Roles } from "../../constants/Roles";
import SelectBox from "../SelectBox";
import Link from "next/link";

type Props = {};

const CampaignCreateButtons = [
    {
        label: "Trực tiếp",
        description: "Tạo hội sách trực tiếp",
        href: "/admin/campaigns/create/offline",
        icon: HiBuildingStorefront,
    },
    {
        label: "Trực tuyến",
        description: "Tạo hội sách trực tuyến",
        href: "/admin/campaigns/create/online",
        icon: HiStatusOnline,
    },
];
const IssuerCampaignOptions = [
    {
        id: 1,
        name: "Hội sách của bạn",
    },
    {
        id: 2,
        name: "Hội sách khác",
    },
];
const CampaignListPage: React.FC<Props> = ({}) => {
    const { loginUser } = useAuth();

    const [size, setSize] = useState<number>(6);

    const [page, setPage] = useState<number>(1);

    const { searchFromQuery, onSearchChange } = useSearchQuery("search", () => {
        setPage(1);
    });
    const [selectedFormatTab, setSelectedFormatTab] = useState<
        (typeof CampaignFormatTabs)[number]
    >(CampaignFormatTabs[0]);
    const [selectedStatusTab, setSelectedStatusTab] = useState<
        (typeof CampaignStatusTabs)[number]
    >(CampaignStatusTabs[0]);
    const [selectedIssuerCampaignOption, setSelectedIssuerCampaignOption] =
        useState<(typeof IssuerCampaignOptions)[number]>(
            IssuerCampaignOptions[0]
        );
    const campaignService = new CampaignService(loginUser?.accessToken);

    const queryParams = {
        name: searchFromQuery,
        page,
        size,
        status: selectedStatusTab.id || undefined,
        format: selectedFormatTab.id || undefined,
        sort: "CreatedDate desc, UpdatedDate desc",
        issuerCampaignOption: selectedIssuerCampaignOption.id,
        withAddressDetail: true,
    };
    const { data: campaignsData, isInitialLoading } = useQuery(
        [
            loginUser?.role === Roles.SYSTEM.id
                ? "admin_campaigns"
                : "issuer_campaigns",
            queryParams,
        ],
        () => {
            if (loginUser?.role === Roles.SYSTEM.id) {
                return campaignService.getCampaignsByAdmin(queryParams);
            } else if (loginUser?.role === Roles.ISSUER.id) {
                if (selectedIssuerCampaignOption.id === 1) {
                    return campaignService.getCampaignsByIssuer(queryParams);
                }
                return campaignService.getOtherCampaignsByIssuer(queryParams);
            }
            return Promise.reject();
        }
    );

    const onFormatTabChange = useCallback(
        (tab: (typeof CampaignFormatTabs)[number]) => {
            setSelectedFormatTab(tab);
            setPage(1);
        },
        [setSelectedFormatTab, setPage]
    );

    function renderCampaigns() {
        if (!isInitialLoading) {
            if (campaignsData?.data && campaignsData.data.length > 0) {
                return (
                    <Fragment>
                        <div className="grid gap-6 md:grid-cols-2">
                            {campaignsData.data.map((campaign) => (
                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                />
                            ))}
                        </div>

                        <div className="flex mt-6 justify-end items-center">
                            <Pagination
                                currentPage={page}
                                pageSize={size}
                                totalItems={campaignsData?.metadata?.total || 0}
                                onPageChange={(page) => setPage(page)}
                                visiblePageButtonLimit={3}
                            />
                        </div>
                    </Fragment>
                );
            } else {
                return (
                    <div className="py-24">
                        {searchFromQuery ? (
                            <EmptyState
                                keyword={searchFromQuery}
                                searchNotFoundMessage="Hãy thử tìm kiếm với từ khóa hoặc bộ lọc khác"
                                status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                            />
                        ) : (
                            <EmptyState
                                keyword={searchFromQuery}
                                customMessage={"Không có hội sách nào"}
                                status={EMPTY_STATE_TYPE.NO_DATA}
                            />
                        )}
                    </div>
                );
            }
        }
        return (
            <div className="grid gap-6 md:grid-cols-2">
                {new Array(6).fill(0).map((_, index) => (
                    <CampaignCardSkeleton key={index} />
                ))}
            </div>
        );
    }

    const onStatusTabChange = useCallback(
        (tab: (typeof CampaignStatusTabs)[number]) => {
            setSelectedStatusTab(tab);
            setPage(1);
        },
        [setSelectedStatusTab, setPage]
    );
    return (
        <Fragment>
            {isInitialLoading && <LoadingTopPage />}
            <PageHeading label="Hội sách">
                <SearchForm
                    placeholder="Tìm kiếm hội sách"
                    value={searchFromQuery}
                    onSearchSubmit={onSearchChange}
                />
                {loginUser?.role === Roles.SYSTEM.id && (
                    <Menu as={"div"} className={"relative"}>
                        <Menu.Button as={"div"}>
                            <CreateButton label="Tạo hội sách" />
                        </Menu.Button>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="max-w-screen absolute right-0 z-10 mt-2 w-80 origin-top-right overflow-hidden rounded-lg bg-white p-2.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="relative flex flex-col gap-2 bg-white">
                                    {CampaignCreateButtons.map(
                                        (button, index) => (
                                            <Menu.Item as={"div"} key={index}>
                                                <CreateCampaignButton
                                                    icon={button.icon}
                                                    href={button.href}
                                                    label={button.label}
                                                    description={
                                                        button.description
                                                    }
                                                />
                                            </Menu.Item>
                                        )
                                    )}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                )}
            </PageHeading>

            <div className="bg-white pb-6 px-4 md:px-6 rounded">
                <div
                    className={
                        "border-b border-gray-200 flex items-center justify-between"
                    }
                >
                    <Tab.Group>
                        <ul className="flex flex-wrap gap-2">
                            {CampaignFormatTabs.map((tab) => (
                                <Tab
                                    onClick={() => onFormatTabChange(tab)}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.name}
                                >
                                    <div className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-6 px-4 border-b-2 font-medium text-sm">
                                        {tab.name}
                                    </div>
                                </Tab>
                            ))}
                        </ul>
                    </Tab.Group>
                    {loginUser?.role === Roles.ISSUER.id && (
                        <div className={"w-56"}>
                            <SelectBox<(typeof IssuerCampaignOptions)[number]>
                                searchable={false}
                                placeholder={""}
                                value={selectedIssuerCampaignOption}
                                dataSource={IssuerCampaignOptions}
                                onValueChange={(o) => {
                                    setPage(1);
                                    setSelectedIssuerCampaignOption(o);
                                }}
                                displayKey={"name"}
                            />
                        </div>
                    )}
                </div>
                <Tab.Group>
                    <div className="py-6">
                        <ul className="flex flex-wrap gap-2">
                            {CampaignStatusTabs.map((tab) => (
                                <Tab
                                    onClick={() => onStatusTabChange(tab)}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.displayName}
                                >
                                    {({ selected }) => {
                                        return (
                                            <Chip active={selected}>
                                                {tab?.statusColor && (
                                                    <span
                                                        className={`mr-2 inline-block h-2 w-2 rounded-full bg-${tab.statusColor}-500`}
                                                    />
                                                )}
                                                {tab.displayName}
                                            </Chip>
                                        );
                                    }}
                                </Tab>
                            ))}
                        </ul>
                    </div>
                </Tab.Group>
                {renderCampaigns()}
            </div>
        </Fragment>
    );
};

export default CampaignListPage;
