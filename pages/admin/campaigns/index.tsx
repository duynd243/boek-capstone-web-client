import { Menu, Tab, Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { Fragment, ReactElement, useCallback, useState } from "react";
import { HiStatusOnline } from "react-icons/hi";
import { HiBuildingStorefront } from "react-icons/hi2";
import Chip from "../../../components/Admin/Chip";
import CreateButton from "../../../components/Admin/CreateButton";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CampaignCard from "../../../components/CampaignCard";
import CreateCampaignButton from "../../../components/CreateCampaignButton";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import AdminLayout from "../../../components/Layout/AdminLayout";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import LoadingTopPage from "../../../components/LoadingTopPage";
import Pagination from "../../../components/Pagination";
import { CampaignFormats } from "../../../constants/CampaignFormats";
import { CampaignStatuses } from "../../../constants/CampaignStatuses";
import { useAuth } from "../../../context/AuthContext";
import useSearchQuery from "../../../hooks/useSearchQuery";
import { CampaignService } from "../../../services/CampaignService";
import { NextPageWithLayout } from "../../_app";

const CampaignStatusTabs = [
    {
        id: undefined,
        displayName: "Tất cả trạng thái",
        statusColor: undefined,
    },
    ...Object.values(CampaignStatuses),
];

const CampaignFormatTabs = [
    {
        id: undefined,
        name: "Tất cả hình thức",
    },
    ...Object.values(CampaignFormats),
];

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

const AdminCampaignsPage: NextPageWithLayout = () => {
    const { search, setSearch } = useSearchQuery("search", () => setPage(1));

    const [size, setSize] = useState<number>(6);
    const [page, setPage] = useState<number>(1);
    const [selectedFormat, setSelectedFormat] = useState<undefined | number>(1);
    const [selectedStatus, setSelectedStatus] = useState<undefined | number>(
        undefined
    );
    const { loginUser } = useAuth();
    const campaignService = new CampaignService(loginUser?.accessToken);
    const {
        data: campaignsData,
        isLoading,
        isFetching,
    } = useQuery(
        [
            "admin_campaigns",
            { search, page, size, selectedFormat, selectedStatus },
        ],
        () =>
            campaignService.getCampaignsByAdmin({
                name: search,
                page,
                size,
                status: selectedStatus,
                format: selectedFormat,
                sort: "createdDate desc",
                withAddressDetail: true,
            }),
        {
            keepPreviousData: true,
        }
    );

    const handleFormatChange = useCallback(
        (formatId?: number) => {
            setSelectedFormat(formatId);
            setPage(1);
        },
        [setSelectedFormat, setPage]
    );

    const handleStatusChange = useCallback(
        (statusId?: number) => {
            setSelectedStatus(statusId);
            setPage(1);
        },
        [setSelectedStatus, setPage]
    );
    if (isLoading)
        return <LoadingSpinnerWithOverlay label="Đang tải các hội sách" />;

    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <PageHeading label="Hội sách">
                <SearchForm
                    placeholder="Tìm kiếm hội sách"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
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
                                {CampaignCreateButtons.map((button, index) => (
                                    <Menu.Item as={"div"} key={index}>
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

            <div className="bg-white px-4 md:px-6 rounded">
                <Tab.Group>
                    <div className="border-b pt-2 border-gray-200">
                        <ul className="flex flex-wrap gap-2">
                            {CampaignFormatTabs.map((tab) => (
                                <Tab
                                    onClick={() => handleFormatChange(tab.id)}
                                    as={"div"}
                                    className={"focus:outline-none"}
                                    key={tab.name}
                                >
                                    <div className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm">
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
                                    onClick={() => handleStatusChange(tab.id)}
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
                {campaignsData?.data && campaignsData?.data?.length > 0 ? (
                    <div className="pb-6">
                        <div className="grid gap-6 md:grid-cols-2 mb-4">
                            {campaignsData?.data?.map((campaign) => (
                                <CampaignCard
                                    key={campaign?.id}
                                    campaign={campaign}
                                />
                            ))}
                        </div>
                        <div className="flex justify-end items-center">
                            {/* <span className="text-sm text-gray-500">
                                Hiển thị từ{" "}
                                <span className="font-medium">{fromItem}</span>{" "}
                                đến{" "}
                                <span className="font-medium">{toItem}</span>{" "}
                                trong tổng số{" "}
                                <span className="font-medium">
                                    {campaignsData?.metadata?.total}
                                </span>{" "}
                                kết quả
                            </span> */}
                            <Pagination
                                currentPage={page}
                                pageSize={size}
                                totalItems={campaignsData?.metadata?.total || 0}
                                onPageChange={(page) => setPage(page)}
                                visiblePageButtonLimit={3}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="py-24">
                        {search ? (
                            <EmptyState
                                keyword={search}
                                searchNotFoundMessage="Hãy thử tìm kiếm với từ khóa hoặc bộ lọc khác"
                                status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                            />
                        ) : (
                            <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />
                        )}
                    </div>
                )}
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
