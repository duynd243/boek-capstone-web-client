import React, { ReactElement } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import CampaignListPage from "../../../components/CampaignListPage";

const IssuerCampaignsPage: NextPageWithLayout = () => {
    return <CampaignListPage/>
    // const {search, setSearch} = useSearchQuery("search", () => setPage(1));
    //
    // const [size, setSize] = useState<number>(6);
    // const [page, setPage] = useState<number>(1);
    // const [selectedFormat, setSelectedFormat] = useState<undefined | number>(1);
    // const [selectedStatus, setSelectedStatus] = useState<undefined | number>(
    //     undefined
    // );
    // const [selectedOption, setSelectedOption] = useState<typeof CampaignSelectOptions[number]>(
    //     CampaignSelectOptions[0]
    // );
    // const {loginUser} = useAuth();
    // const campaignService = new CampaignService(loginUser?.accessToken);
    // const commonParams = {
    //     name: search,
    //     page,
    //     size,
    //     status: selectedStatus,
    //     format: selectedFormat,
    //     sort: "createdDate desc",
    //     withAddressDetail: true,
    // }
    // const {
    //     data: campaignsData,
    //     isLoading,
    //     isFetching,
    // } = useQuery(
    //     [
    //         "issuer_campaigns",
    //         {
    //             search, page, size, selectedFormat, selectedStatus,
    //             selectedOption
    //         },
    //     ],
    //     selectedOption.id === 1 ?
    //         () => campaignService.getCampaignsByIssuer(commonParams)
    //         : () => campaignService.getOtherCampaignsByIssuer(commonParams),
    //     {
    //         keepPreviousData: true,
    //     }
    // );
    //
    // const handleFormatChange = useCallback(
    //     (formatId?: number) => {
    //         setSelectedFormat(formatId);
    //         setPage(1);
    //     },
    //     [setSelectedFormat, setPage]
    // );
    //
    // const handleStatusChange = useCallback(
    //     (statusId?: number) => {
    //         setSelectedStatus(statusId);
    //         setPage(1);
    //     },
    //     [setSelectedStatus, setPage]
    // );
    // if (isLoading)
    //     return <LoadingSpinnerWithOverlay label="Đang tải các hội sách"/>;
    //
    // return (
    //     <Fragment>
    //         {isFetching && <LoadingTopPage/>}
    //         <PageHeading label="Hội sách">
    //             <SearchForm
    //                 placeholder="Tìm kiếm hội sách"
    //                 value={search}
    //                 onSearchSubmit={(value) => setSearch(value)}
    //             />
    //         </PageHeading>
    //
    //         <div className="bg-white px-4 md:px-6 rounded">
    //             <div>
    //                 <Tab.Group>
    //                     <div className="flex justify-between items-center border-b pt-2 border-gray-200">
    //                         <ul className="flex flex-wrap gap-2">
    //                             {CampaignFormatTabs.map((tab) => (
    //                                 <Tab
    //                                     onClick={() => handleFormatChange(tab.id)}
    //                                     as={"div"}
    //                                     className={"focus:outline-none"}
    //                                     key={tab.name}
    //                                 >
    //                                     <div
    //                                         className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm">
    //                                         {tab.name}
    //                                     </div>
    //                                 </Tab>
    //                             ))}
    //                         </ul>
    //
    //                         <div className={'w-56'}>
    //                             <SelectBox<typeof CampaignSelectOptions[number]>
    //                                 searchable={false}
    //                                 placeholder={''}
    //                                 value={selectedOption}
    //                                 dataSource={CampaignSelectOptions}
    //                                 onValueChange={(o) => {
    //                                     setPage(1);
    //                                     setSelectedOption(o);
    //                                 }}
    //                                 displayKey={'name'}/>
    //                         </div>
    //                     </div>
    //                 </Tab.Group>
    //
    //             </div>
    //
    //             <Tab.Group>
    //                 <div className="py-6">
    //                     <ul className="flex flex-wrap gap-2">
    //                         {CampaignStatusTabs.map((tab) => (
    //                             <Tab
    //                                 onClick={() => handleStatusChange(tab.id)}
    //                                 as={"div"}
    //                                 className={"focus:outline-none"}
    //                                 key={tab.displayName}
    //                             >
    //                                 {({selected}) => {
    //                                     return (
    //                                         <Chip active={selected}>
    //                                             {tab?.statusColor && (
    //                                                 <span
    //                                                     className={`mr-2 inline-block h-2 w-2 rounded-full bg-${tab.statusColor}-500`}
    //                                                 />
    //                                             )}
    //                                             {tab.displayName}
    //                                         </Chip>
    //                                     );
    //                                 }}
    //                             </Tab>
    //                         ))}
    //                     </ul>
    //                 </div>
    //             </Tab.Group>
    //             {campaignsData?.data && campaignsData?.data?.length > 0 ? (
    //                 <div className="pb-6">
    //                     <div className="grid gap-6 md:grid-cols-2 mb-4">
    //                         {campaignsData?.data?.map((campaign) => (
    //                             <CampaignCard
    //                                 key={campaign?.id}
    //                                 campaign={campaign}
    //                             />
    //                         ))}
    //                     </div>
    //                     <div className="flex justify-end items-center">
    //                         {/* <span className="text-sm text-gray-500">
    //                             Hiển thị từ{" "}
    //                             <span className="font-medium">{fromItem}</span>{" "}
    //                             đến{" "}
    //                             <span className="font-medium">{toItem}</span>{" "}
    //                             trong tổng số{" "}
    //                             <span className="font-medium">
    //                                 {campaignsData?.metadata?.total}
    //                             </span>{" "}
    //                             kết quả
    //                         </span> */}
    //                         <Pagination
    //                             currentPage={page}
    //                             pageSize={size}
    //                             totalItems={campaignsData?.metadata?.total || 0}
    //                             onPageChange={(page) => setPage(page)}
    //                             visiblePageButtonLimit={3}
    //                         />
    //                     </div>
    //                 </div>
    //             ) : (
    //                 <div className="py-24">
    //                     {search ? (
    //                         <EmptyState
    //                             keyword={search}
    //                             searchNotFoundMessage="Hãy thử tìm kiếm với từ khóa hoặc bộ lọc khác"
    //                             status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
    //                         />
    //                     ) : (
    //                         <EmptyState status={EMPTY_STATE_TYPE.NO_DATA}/>
    //                     )}
    //                 </div>
    //             )}
    //         </div>
    //
    //     </Fragment>
    // )
};
IssuerCampaignsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerCampaignsPage;
