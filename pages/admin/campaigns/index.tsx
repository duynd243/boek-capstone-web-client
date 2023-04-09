import { ReactElement } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import CampaignListPage from "../../../components/CampaignListPage";

const AdminCampaignsPage: NextPageWithLayout = () => {
    const { search, setSearch } = useSearchQuery("search", () => setPage(1));

    return <CampaignListPage/>
    // const { search, setSearch } = useSearchQuery("search", () => setPage(1));
    //
    // const [size, setSize] = useState<number>(6);
    // const [page, setPage] = useState<number>(1);
    // const [selectedFormatTab, setSelectedFormatTab] = useState<typeof CampaignFormatTabs[number]>(CampaignFormatTabs[0]);
    // const [selectedStatusTab, setSelectedStatusTab] = useState<typeof CampaignStatusTabs[number]>(CampaignStatusTabs[0]);
    // const { loginUser } = useAuth();
    // const campaignService = new CampaignService(loginUser?.accessToken);
    // const {
    //     data: campaignsData,
    //     isInitialLoading,
    // } = useQuery(
    //     [
    //         "admin_campaigns",
    //         search, page, size, selectedFormatTab.id, selectedStatusTab.id,
    //     ],
    //     () =>
    //         campaignService.getCampaignsByAdmin({
    //             name: search,
    //             page,
    //             size,
    //             status: selectedStatusTab.id,
    //             format: selectedFormatTab.id,
    //             sort: "createdDate desc",
    //             withAddressDetail: true,
    //         }),
    // );
    //
    // const onFormatTabChange = useCallback(
    //     (tab: typeof CampaignFormatTabs[number]) => {
    //         setSelectedFormatTab(tab);
    //         setPage(1);
    //     },
    //     [setSelectedFormatTab, setPage],
    // );
    //
    // function renderCampaigns() {
    //     if (!isInitialLoading) {
    //         if (campaignsData?.data && campaignsData.data.length > 0) {
    //             return (
    //                 <Fragment>
    //                     <div className="grid gap-6 md:grid-cols-2">
    //                         {campaignsData.data.map((campaign) => (
    //                             <CampaignCard
    //                                 key={campaign.id}
    //                                 campaign={campaign}
    //                             />
    //                         ))}
    //                     </div>
    //
    //                     <div className="flex mt-6 justify-end items-center">
    //                         <Pagination
    //                             currentPage={page}
    //                             pageSize={size}
    //                             totalItems={campaignsData?.metadata?.total || 0}
    //                             onPageChange={(page) => setPage(page)}
    //                             visiblePageButtonLimit={3}
    //                         />
    //                     </div>
    //                 </Fragment>
    //             );
    //         } else {
    //             return <div className="py-24">{search ?
    //                 <EmptyState
    //                     keyword={search}
    //                     searchNotFoundMessage="Hãy thử tìm kiếm với từ khóa hoặc bộ lọc khác"
    //                     status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
    //                 />
    //                 :
    //                 <EmptyState
    //                     keyword={search}
    //                     customMessage={"Không có hội sách nào"}
    //                     status={EMPTY_STATE_TYPE.NO_DATA}
    //                 />
    //             }</div>;
    //         }
    //     }
    //     return (
    //         <div className="grid gap-6 md:grid-cols-2">
    //             {new Array(6).fill(0).map((_, index) => (
    //                 <CampaignCardSkeleton key={index} />
    //             ))}
    //         </div>
    //     );
    // }
    //
    // const onStatusTabChange = useCallback(
    //     (tab: typeof CampaignStatusTabs[number]) => {
    //         setSelectedStatusTab(tab);
    //         setPage(1);
    //     },
    //     [setSelectedStatusTab, setPage],
    // );
    //
    // return (
    //     <Fragment>
    //         {isInitialLoading && <LoadingTopPage />}
    //         <PageHeading label="Hội sách">
    //             <SearchForm
    //                 placeholder="Tìm kiếm hội sách"
    //                 value={search}
    //                 onSearchSubmit={(value) => setSearch(value)}
    //             />
    //             <Menu as={"div"} className={"relative"}>
    //                 <Menu.Button as={"div"}>
    //                     <CreateButton label="Tạo hội sách" />
    //                 </Menu.Button>
    //                 <Transition
    //                     as={Fragment}
    //                     enter="transition ease-out duration-100"
    //                     enterFrom="transform opacity-0 scale-95"
    //                     enterTo="transform opacity-100 scale-100"
    //                     leave="transition ease-in duration-75"
    //                     leaveFrom="transform opacity-100 scale-100"
    //                     leaveTo="transform opacity-0 scale-95"
    //                 >
    //                     <Menu.Items
    //                         className="max-w-screen absolute right-0 z-10 mt-2 w-80 origin-top-right overflow-hidden rounded-lg bg-white p-2.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    //                         <div className="relative flex flex-col gap-2 bg-white">
    //                             {CampaignCreateButtons.map((button, index) => (
    //                                 <Menu.Item as={"div"} key={index}>
    //                                     <CreateCampaignButton
    //                                         icon={button.icon}
    //                                         href={button.href}
    //                                         label={button.label}
    //                                         description={button.description}
    //                                     />
    //                                 </Menu.Item>
    //                             ))}
    //                         </div>
    //                     </Menu.Items>
    //                 </Transition>
    //             </Menu>
    //         </PageHeading>
    //
    //         <div className="bg-white pb-6 px-4 md:px-6 rounded">
    //             <Tab.Group>
    //                 <div className="border-b pt-2 border-gray-200">
    //                     <ul className="flex flex-wrap gap-2">
    //                         {CampaignFormatTabs.map((tab) => (
    //                             <Tab
    //                                 onClick={() => onFormatTabChange(tab)}
    //                                 as={"div"}
    //                                 className={"focus:outline-none"}
    //                                 key={tab.name}
    //                             >
    //                                 <div
    //                                     className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm">
    //                                     {tab.name}
    //                                 </div>
    //                             </Tab>
    //                         ))}
    //                     </ul>
    //                 </div>
    //             </Tab.Group>
    //             <Tab.Group>
    //                 <div className="py-6">
    //                     <ul className="flex flex-wrap gap-2">
    //                         {CampaignStatusTabs.map((tab) => (
    //                             <Tab
    //                                 onClick={() => onStatusTabChange(tab)}
    //                                 as={"div"}
    //                                 className={"focus:outline-none"}
    //                                 key={tab.displayName}
    //                             >
    //                                 {({ selected }) => {
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
    //             {renderCampaigns()}
    //         </div>
    //
    //     </Fragment>
    // );
};

AdminCampaignsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCampaignsPage;
