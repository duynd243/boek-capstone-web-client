import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";
import {ReactElement} from "react";
import MainContent from "../../../../components/CampaignDetails/MainContent";
import Sidebar from "../../../../components/CampaignDetails/Sidebar";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import {useAuth} from "../../../../context/AuthContext";
import {CampaignContext} from "../../../../context/CampaignContext";
import {CampaignService} from "../../../../services/CampaignService";
import {NextPageWithLayout} from "../../../_app";

const CampaignDetails: NextPageWithLayout = () => {
    const {loginUser} = useAuth();
    const router = useRouter();
    const campaignService = new CampaignService(loginUser?.accessToken);

    const campaignId = router.query.id as string;

    const {data: campaign, isLoading} = useQuery(
        ["admin_campaign", campaignId],
        () => campaignService.getCampaignByIdByAdmin(Number(campaignId), {
            withAddressDetail: true,
        }),
        {
            enabled: !!campaignId,
        }
    );

    if (!isLoading && !campaign) {
        return (
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
                <div className="w-full lg:w-3/4">
                    <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Campaign not found
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
            {campaign && (
                <CampaignContext.Provider value={campaign}>
                    {/* Content */}
                    <MainContent/>

                    {/* Sidebar */}
                    <Sidebar/>
                </CampaignContext.Provider>
            )}
        </div>
    );
};

CampaignDetails.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout containerClassName="px-4 sm:px-6 lg:px-8 py-8 w-full">
            {page}
        </AdminLayout>
    );
};
export default CampaignDetails;
