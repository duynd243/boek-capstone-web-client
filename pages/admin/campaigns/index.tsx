import React, {Fragment, ReactElement, useEffect, useState} from "react";
import {NextPageWithLayout} from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {useRouter} from "next/router";
import {useAuth} from "../../../context/AuthContext";
import {useQuery} from "@tanstack/react-query";
import {CampaignStatuses} from "../../../constants/Statuses";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import {Menu, Tab, Transition} from "@headlessui/react";
import Chip from "../../../components/Admin/Chip";
import {CampaignFormats} from "../../../constants/CampaignFormats";
import CampaignCard from "../../../components/CampaignCard";
import {CampaignService} from "../../../services/CampaignService";
import useSearchQuery from "../../../hooks/useSearchQuery";
import {IoAdd} from "react-icons/io5";
import CreateBookButton from "../../../components/CreateBookButton";
import {GiBookmarklet} from "react-icons/gi";
import CreateCampaignButton from "../../../components/CreateCampaignButton";
import {HiBuildingStorefront} from "react-icons/hi2";
import {HiStatusOnline} from "react-icons/hi";

const CampaignStatusTabs = [
    {
        id: undefined,
        name: "All",
        displayName: "Tất cả trạng thái",
    },
    ...Object.values(CampaignStatuses),
];

const CampaignFormatTabs = [
    {
        id: undefined,
        name: "Tất cả hình thức",

    }, ...Object.values(CampaignFormats)];

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
    }
]


const AdminCampaignsPage: NextPageWithLayout = () => {

    const router = useRouter();

    const {search, setSearch} = useSearchQuery("search", () => setPage(1));

    const [size, setSize] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [selectedFormat, setSelectedFormat] = useState<undefined | number>(1);
    const [selectedStatus, setSelectedStatus] = useState<undefined | number>(
        undefined
    );
    const {loginUser} = useAuth();
    const campaignService = new CampaignService(loginUser?.accessToken);
    const {data: campaignsResponse, isLoading} = useQuery(
        ["admin_campaigns", {search}],
        () => campaignService.getCampaignsByAdmin({
            name: search,
        }),
    );
    return (
        <Fragment>
            <PageHeading label="Hội sách">
                <SearchForm
                    placeholder="Tìm kiếm hội sách"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />

                <Menu as={"div"} className={"relative"}>
                    <Menu.Button
                        as={'div'}
                    >
                        <CreateButton label="Tạo hội sách"/>

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
                        <Menu.Items
                            className="max-w-screen absolute right-0 z-10 mt-2 w-80 origin-top-right overflow-hidden rounded-lg bg-white p-2.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="relative flex flex-col gap-2 bg-white">
                                {CampaignCreateButtons.map((button, index) => (
                                    <Menu.Item as={'div'} key={index}>
                                        <CreateCampaignButton
                                            icon={button.icon}
                                            href={button.href}
                                            label={button.label}
                                            description={button.description}
                                        />
                                    </Menu.Item>
                                ))}
                            </div>
                        </Menu.Items>
                    </Transition>
                </Menu>
            </PageHeading>
            <div className='bg-white px-4 rounded'>
                <Tab.Group>
                    <div className="border-b pt-2 border-gray-200">
                        <ul className="flex flex-wrap gap-2">
                            {CampaignFormatTabs.map((tab) => (
                                <Tab
                                    onClick={() => {
                                    }}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.name}
                                >
                                    <div
                                        className='cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm'>
                                        {tab.name}
                                    </div>
                                </Tab>
                            ))}
                        </ul>
                    </div>
                </Tab.Group>
                <Tab.Group>
                    <div className="py-6">
                        <ul className="flex flex-wrap gap-2">
                            {CampaignStatusTabs.map((tab) => (
                                <Tab
                                    onClick={() => setSelectedStatus(tab.id)}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.name}
                                >
                                    {({selected}) => {
                                        return (
                                            <Chip active={selected}>
                                                {tab?.statusColor && (
                                                    <span
                                                        className={`mr-2 inline-block h-2 w-2 rounded-full ${tab.statusColor}`}
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
                <div className='grid gap-6 md:grid-cols-2 '>
                    {campaignsResponse?.data?.map((campaign) => (
                        <CampaignCard key={campaign?.id} campaign={campaign}/>))}
                </div>
            </div>

            {/*{isLoading ? (*/}
            {/*  <LoadingSpinnerWithOverlay label="Đang tải..." />*/}
            {/*) : campaigns?.data && campaigns?.data?.length > 0 ? (*/}
            {/*  <div className="grid grid-cols-12 gap-6">*/}
            {/*    {campaigns?.data?.map((campaign) => (*/}
            {/*      <div*/}
            {/*        key={campaign.id}*/}
            {/*        className={"col-span-full sm:col-span-6 xl:col-span-4"}*/}
            {/*      >*/}
            {/*        <AdminCampaignCard campaign={campaign} />*/}
            {/*      </div>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*) : (*/}
            {/*  <div className="mt-8">*/}
            {/*    {search ? (*/}
            {/*      <EmptyState*/}
            {/*        keyword={search}*/}
            {/*        status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}*/}
            {/*      />*/}
            {/*    ) : (*/}
            {/*      <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />*/}
            {/*    )}*/}
            {/*  </div>*/}
            {/*)}*/}
        </Fragment>
    );
};

AdminCampaignsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCampaignsPage;
