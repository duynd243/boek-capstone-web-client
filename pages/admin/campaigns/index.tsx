import React, { Fragment, ReactElement, useEffect, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { SystemCampaignService } from "../../../old-services/System/System_CampaignService";
import { useQuery } from "@tanstack/react-query";
import { CampaignStatuses } from "../../../constants/Statuses";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import { Tab } from "@headlessui/react";
import Chip from "../../../components/Admin/Chip";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import AdminCampaignCard from "../../../components/Admin/AdminCampaignCard";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";

const CampaignStatusTabs = [
  {
    id: undefined,
    name: "All",
    displayName: "Tất cả",
  },
  ...Object.values(CampaignStatuses),
];

const AdminCampaignsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [size, setSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<undefined | number>(
    undefined
  );
  const { loginUser } = useAuth();
  const systemCampaignService = new SystemCampaignService(
    loginUser?.accessToken
  );
  const { data: campaigns, isLoading } = useQuery(
    ["admin_campaigns", page, size, search, selectedStatus],
    () =>
      systemCampaignService.getCampaigns({
        page,
        size,
        status: selectedStatus,
        name: search,
        sort: "id desc",
      })
  );

  useEffect(() => {
    const search = router.query.search as string;
    setSearch(search);
    setPage(1); // Reset page to 1 when search changes
  }, [router.query.search]);

  return (
    <Fragment>
      <PageHeading label="Hội sách">
        <SearchForm defaultValue={search} />
        <CreateButton label="Tạo hội sách" href="/admin/campaigns/create" />
      </PageHeading>
      <Tab.Group>
        <div className="mb-5">
          <ul className="flex flex-wrap gap-2">
            {CampaignStatusTabs.map((tab) => (
              <Tab
                onClick={() => setSelectedStatus(tab.id)}
                as={"div"}
                className={"focus:outline-none"}
                key={tab.name}
              >
                {({ selected }) => {
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
      {isLoading ? (
        <LoadingSpinnerWithOverlay label="Đang tải..." />
      ) : campaigns?.data && campaigns?.data?.length > 0 ? (
        <div className="grid grid-cols-12 gap-6">
          {campaigns?.data?.map((campaign) => (
            <div
              key={campaign.id}
              className={"col-span-full sm:col-span-6 xl:col-span-4"}
            >
              <AdminCampaignCard campaign={campaign} />
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8">
          {search ? (
            <EmptyState
              keyword={search}
              status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
            />
          ) : (
            <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />
          )}
        </div>
      )}
    </Fragment>
  );
};

AdminCampaignsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCampaignsPage;
