import React, { Fragment, useMemo, useState } from "react";
import { NextPageWithLayout } from "../_app";
import CustomerLayout from "../../components/Layout/CustomerLayout";
import { useRouter } from "next/router";
import SearchSection from "../../components/CustomerSearchWithFilterPage/SearchSection";
import FilterSidebar from "../../components/CustomerSearchWithFilterPage/FilterSidebar";
import FilterSection from "../../components/CustomerSearchWithFilterPage/FilterSection";
import SortPanel from "../../components/CustomerSearchWithFilterPage/SortPanel";
import { CampaignService } from "../../services/CampaignService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
    getNumberArrayFromQueryKey,
    getSortedArray,
    getStringArrayFromQueryKey,
} from "../../components/CustomerSearchWithFilterPage/utils";
import { AddressService } from "../../services/AddressService";
import useCustomerSearchWithFilterPage from "../../components/CustomerSearchWithFilterPage/hook";
import { OrganizationService } from "../../services/OrganizationService";
import ExpandableList from "../../components/ExpandableList";
import EmptyState, { EMPTY_STATE_TYPE } from "../../components/EmptyState";
import CampaignCard from "../../components/CampaignCard";
import Pagination from "../../components/Pagination";
import CampaignCardSkeleton from "../../components/CampaignCard/CampaignCardSkeleton";
import { motion } from "framer-motion";
import Image from "next/image";
import { getAvatarFromName } from "../../utils/helper";
import { CampaignFormats } from "../../constants/CampaignFormats";
import { HiLocationMarker, HiOutlineStatusOnline } from "react-icons/hi";

const sortOptions = [
    { name: "Mới nhất", value: "CreatedDate desc" },
    { name: "Tên A-Z", value: "Name asc" },
    { name: "Tên Z-A", value: "Name desc" },
];
const CustomerCampaignsPage: NextPageWithLayout = () => {
    const router = useRouter();
    const [page, setPage] = useState(1);
    const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);
    const searchFromQuery = getStringArrayFromQueryKey(router.query.name)[0] || "";
    const [startDate, setStartDate] = useState(getStringArrayFromQueryKey(router.query.startdate)[0] || "");
    const [endDate, setEndDate] = useState(getStringArrayFromQueryKey(router.query.enddate)[0] || "");

    const {
        onParamsChange,
        issuers,
    } = useCustomerSearchWithFilterPage(setPage);

    const [formatIds, setFormatIds] = useState<number[]>(
        getNumberArrayFromQueryKey(router.query.format),
    );

    const [addresses, setAddresses] = useState<string[]>(
        getStringArrayFromQueryKey(router.query.address).filter((x) => x !== ""),
    );

    const [statusIds, setStatusIds] = useState<number[]>(
        getNumberArrayFromQueryKey(router.query.genre),
    );

    const [issuerIds, setIssuerIds] = useState<string[]>(
        getStringArrayFromQueryKey(router.query.issuer).filter((x) => x !== ""),
    );

    const [orgIds, setOrgIds] = useState<number[]>(
        getNumberArrayFromQueryKey(router.query.organization),
    );

    const campaignService = new CampaignService();
    const addressService = new AddressService();
    const organizationService = new OrganizationService();
    const queryParams = {
        name: searchFromQuery,
        startDate: startDate,
        endDate: endDate,
        formats: formatIds,
        address: addresses,
        "CampaignOrganizations.OrganizationIds": orgIds,
        "Participants.IssuerIds": issuerIds,
        size: 6,
        page,
        sort: selectedSortOption.value,
    };

    const {
        data,
        isInitialLoading: campaignsLoading,
    } = useQuery(["customer_campaigns", queryParams],
        () => campaignService.getCampaignsByCustomer(queryParams),
        {
            onError: (error: any) => {
                toast.error(error?.message || "Xảy ra lỗi!\nVui lòng thử lại sau hoặc chọn các bộ lọc khác.", {
                    duration: 5000,
                });
            },
        },
    );

    const {
        data: provinces,
    } = useQuery(
        ["provinces"],
        () => addressService.getProvinces(),
    );

    const {
        data: organizations,
    } = useQuery(
        ["organizations"],
        () => organizationService.getAllOrganizations(),
    );

    const sortedIssuers = getSortedArray((issuers || []), "id", issuerIds);
    const sortedOrganizations = getSortedArray((organizations || []), "id", orgIds);

    const haveFilters = useMemo(() => {
        return startDate !== "" || endDate !== "" || formatIds.length > 0 || addresses.length > 0 || statusIds.length > 0 || issuerIds.length > 0 || orgIds.length > 0;
    }, [startDate, endDate, formatIds, addresses, statusIds, issuerIds, orgIds]);

    const clearFilters = async () => {
        setStartDate("");
        setEndDate("");
        setFormatIds([]);
        setAddresses([]);
        setStatusIds([]);
        setIssuerIds([]);
        setOrgIds([]);
        setPage(1);
        await router.push({
            pathname: router.pathname,
            query: {
                name: searchFromQuery,
            },
        });
    };

    return (
        <Fragment>
            <SearchSection title={"Hội sách"}
                           initValue={searchFromQuery}
                           onSearch={async (value) => await onParamsChange("name", value)} />

            <div className={"max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
                <div className={"flex flex-col md:flex-row gap-6 relative"}>
                    <FilterSidebar onClearFilters={clearFilters}
                                   clearFiltersDisabled={!haveFilters}
                    >
                        <FilterSection label={"Thời gian"}>
                            <></>
                        </FilterSection>

                        <FilterSection
                            defaultOpen={addresses.length > 0}
                            count={addresses.length}
                            label={"Địa điểm"}>
                            <div className={"space-y-3"}>
                                <ExpandableList items={provinces || []} renderItem={
                                    (province) => <div
                                        className={"flex items-center justify-between gap-2 text-sm outline-none"}>

                                        <label htmlFor={`province-${province?.code}`}>
                                                    <span>
                                                        {province?.nameWithType}
                                                    </span>
                                        </label>

                                        <input
                                            type="checkbox"
                                            id={`province-${province?.code}`}
                                            className={"rounded-sm bg-gray-100 border-gray-200 shrink-0"}
                                            checked={addresses.includes(province?.nameWithType)}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newAddresses = [...addresses, province?.nameWithType];
                                                    setAddresses(newAddresses);
                                                    await onParamsChange("address", newAddresses);
                                                } else {
                                                    const newAddresses = addresses.filter(x => x !== province?.nameWithType);
                                                    setAddresses(newAddresses);
                                                    await onParamsChange("address", newAddresses);
                                                }
                                            }
                                            }
                                        />
                                    </div>
                                } />

                            </div>
                        </FilterSection>

                        <FilterSection label={"Hình thức tổ chức"}>
                            <div className={"flex flex-wrap gap-2 text-sm text-gray-500"}>
                                {Object.values(CampaignFormats).map((format) => {
                                    const checked = formatIds.includes(format.id);
                                    return <Fragment key={format.id}>
                                        <input
                                            type="checkbox"
                                            id={`format-${format.id}`}
                                            className={"hidden"}
                                            checked={checked}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newFormatIds = [...formatIds, format.id];
                                                    setFormatIds(newFormatIds);
                                                    await onParamsChange("format", newFormatIds);
                                                } else {
                                                    const newFormatIds = formatIds.filter((x) => x !== format.id);
                                                    setFormatIds(newFormatIds);
                                                    await onParamsChange("format", newFormatIds);
                                                }
                                            }
                                            }
                                        />
                                        <label htmlFor={`format-${format.id}`}>
                                            <div
                                                className={`flex gap-1 border py-2 px-3 rounded-md cursor-pointer ${checked ? "bg-blue-50 text-blue-500 border-blue-400" : ""}`}>
                                                {format.id === CampaignFormats.OFFLINE.id && <HiLocationMarker
                                                    className="flex-shrink-0 h-5 w-5 text-rose-600" />}
                                                {format.id === CampaignFormats.ONLINE.id && <HiOutlineStatusOnline
                                                    className="flex-shrink-0 h-5 w-5 text-green-600" />}
                                                <span className="font-medium">
                                                                {format.name}
                                                            </span>
                                            </div>
                                        </label>
                                    </Fragment>;
                                })}
                            </div>
                        </FilterSection>
                        <FilterSection label={"Trạng thái"}>
                            <></>
                        </FilterSection>

                        <FilterSection label={"Nhà phát hành"}
                                       count={issuerIds?.length}
                                       defaultOpen={issuerIds.length > 0}
                        >
                            <div className={"space-y-3"}>
                                <ExpandableList items={sortedIssuers} renderItem={
                                    (issuer) => <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={"h-full flex flex-col"}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        layout key={issuer.id}>
                                        <input
                                            type="checkbox"
                                            id={`issuer-${issuer.id}`}
                                            className={"hidden"}
                                            checked={issuerIds.includes(issuer.id)}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newIssuerIds = [...issuerIds, issuer.id];
                                                    setIssuerIds(newIssuerIds);
                                                    await onParamsChange("issuer", newIssuerIds);
                                                } else {
                                                    const newIssuerIds = issuerIds.filter((x) => x !== issuer.id);
                                                    setIssuerIds(newIssuerIds);
                                                    await onParamsChange("issuer", newIssuerIds);
                                                }
                                            }
                                            }
                                        />
                                        <label htmlFor={`issuer-${issuer.id}`}>
                                            <div
                                                className={`flex items-center gap-2 border py-2 px-3 text-sm rounded-md cursor-pointer ${issuerIds.includes(issuer.id) ? "bg-blue-50 text-blue-500 border-blue-400" : ""}`}>
                                                <Image src={issuer?.imageUrl ||
                                                    getAvatarFromName(issuer.name)
                                                } alt={""}
                                                       width={40}
                                                       height={40}
                                                       className={"rounded-full object-cover h-6 w-6"} />
                                                <span className="font-medium">
                                                                    {issuer.name}
                                                                </span>
                                            </div>
                                        </label>
                                    </motion.div>
                                } />

                            </div>
                        </FilterSection>

                        <FilterSection label={"Tổ chức"}>
                            <div className={"space-y-3"}>
                                <ExpandableList items={sortedOrganizations} renderItem={
                                    (org) => <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={"h-full flex flex-col"}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        layout key={org.id}>
                                        <input
                                            type="checkbox"
                                            id={`org-${org.id}`}
                                            className={"hidden"}
                                            checked={orgIds.includes(org.id)}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newOrgIds = [...orgIds, org.id];
                                                    setOrgIds(newOrgIds);
                                                    await onParamsChange("organization", newOrgIds);
                                                } else {
                                                    const newOrgIds = orgIds.filter((x) => x !== org.id);
                                                    setOrgIds(newOrgIds);
                                                    await onParamsChange("organization", newOrgIds);
                                                }
                                            }
                                            }
                                        />
                                        <label htmlFor={`org-${org.id}`}>
                                            <div
                                                className={`flex items-center gap-2 border py-2 px-3 text-sm rounded-md cursor-pointer ${orgIds.includes(org.id) ? "bg-blue-50 text-blue-500 border-blue-400" : ""}`}>
                                                <Image src={org?.imageUrl ||
                                                    getAvatarFromName(org.name)
                                                } alt={""}
                                                       width={40}
                                                       height={40}
                                                       className={"rounded-full object-cover h-6 w-6"} />
                                                <span className="font-medium">
                                                                    {org.name}
                                                                </span>
                                            </div>
                                        </label>
                                    </motion.div>
                                } />

                            </div>
                        </FilterSection>
                    </FilterSidebar>
                    <div className="md:self-start md:grow">
                        <SortPanel
                            hideResult={campaignsLoading}
                            showingListLength={(data?.data.length || 0)}
                            totalListLength={(data?.metadata?.total || 0)}
                            value={selectedSortOption}
                            sortOptions={sortOptions}
                            onSortChange={value => {
                                setSelectedSortOption(value);
                                setPage(1);
                            }}
                            itemName={'hội sách'}
                        />

                        {!campaignsLoading && data?.data.length === 0 && (
                            <div className={"my-24"}>
                                <EmptyState status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                                            searchNotFoundMessage={"Hãy thử tìm kiếm với từ khoá hoặc bộ lọc khác."}
                                />
                            </div>
                        )}
                        {!campaignsLoading && data?.data && data?.data.length > 0 && (
                            <div className="mt-6 md:self-start grid md:grid-cols-2 gap-6">
                                {data?.data.map((campaign) => (
                                    <CampaignCard
                                        key={campaign.id}
                                        campaign={campaign}
                                        horizontalOnly={true}
                                    />
                                ))}
                            </div>
                        )}
                        {campaignsLoading && (
                            <div className="mt-6 md:self-start grid md:grid-cols-2 gap-6">
                                {[...Array(6)].map((_, index) =>
                                    <CampaignCardSkeleton horizontalOnly={true} key={index} />,
                                )}
                            </div>
                        )}
                        {!campaignsLoading && data?.data && data?.data.length > 0 &&
                            <div className="mt-6 flex justify-end">
                                <Pagination
                                    currentPage={page}
                                    pageSize={6}
                                    totalItems={data?.metadata?.total || 0}
                                    onPageChange={p => setPage(p)}
                                    visiblePageButtonLimit={4}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

CustomerCampaignsPage.getLayout = (page) => {
    return (
        <CustomerLayout
            childrenWrapperClassName={"relative"}
        >{page}</CustomerLayout>
    );
};

export default CustomerCampaignsPage;