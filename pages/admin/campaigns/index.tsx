import React, { ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { SystemCampaignService } from "../../../services/System/System_CampaignService";
import { useQuery } from "@tanstack/react-query";

const AdminCampaignsPage: NextPageWithLayout = () => {
  const router = useRouter();

  const [page, setPage] = React.useState(1);
  const [search, setSearch] = useState<string>("");
  const [pageSize, setPageSize] = React.useState(10);
  const [selectedStatus, setSelectedStatus] = useState<undefined | number>(
    undefined
  );
  const { loginUser } = useAuth();
  const systemCampaignService = new SystemCampaignService(
    loginUser?.accessToken
  );
  const { data: campaigns, isLoading } = useQuery(
    ["admin_campaigns", selectedStatus, search, page],
    () =>
      systemCampaignService.getCampaigns({
        page: page,
        size: pageSize,
        status: selectedStatus,
        name: search,
        sort: "id desc",
      })
  );
  // const { loginUser } = useAuth();
  // const systemCampaignService = new SystemCampaignService(
  //     loginUser?.accessToken
  // );

  // return <Fragment>
  //     <PageHeading label='Hội sách'>
  //         <SearchForm/>
  //         <CreateButton
  //             href='/admin/campaigns/create'
  //             label='Tạo hội sách'/>
  //     </PageHeading>
  //     <Tab.Group>
  //         <div className="mb-5">
  //             <ul className="flex flex-wrap gap-2">
  //                 {CampaignStatusTabs.map((tab) => (
  //                     <Tab
  //                         as={'div'}
  //                         className={'focus:outline-none'}
  //                         key={tab.name}
  //                     >
  //                         {({ selected }) => {
  //                             if (selected) setSelectedStatus(tab.id);
  //                             return (
  //                                 <Chip active={selected}>
  //                                     {tab.name}
  //                                 </Chip>
  //                             );
  //                         }}
  //                     </Tab>
  //                 ))}
  //             </ul>
  //         </div>
  //     </Tab.Group>
  //     <div className="grid grid-cols-12 gap-6">
  //         {isLoading ? (
  //             <div>Đang tải...</div>
  //         ) : (
  //             campaigns?.data?.map((campaign) => (
  //                 <div
  //                     key={campaign.id}
  //                     className={
  //                         'col-span-full sm:col-span-6 xl:col-span-4'
  //                     }
  //                 >
  //                     <AdminCampaignCard campaign={campaign} />
  //                 </div>
  //             ))
  //         )}
  //     </div>
  //
  // </Fragment>

  return <p></p>;
};

AdminCampaignsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCampaignsPage;
