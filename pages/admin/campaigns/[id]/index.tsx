import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, ReactElement } from "react";
import MainContent from "../../../../components/CampaignDetails/MainContent";
import Sidebar from "../../../../components/CampaignDetails/Sidebar";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import { useAuth } from "../../../../context/AuthContext";
import { CampaignContext } from "../../../../context/CampaignContext";
import { CampaignService } from "../../../../services/CampaignService";
import { NextPageWithLayout } from "../../../_app";
import LoadingSpinnerWithOverlay from "../../../../components/LoadingSpinnerWithOverlay";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../../components/EmptyState";
import Link from "next/link";
import { findRole } from "../../../../constants/Roles";
import LoadingTopPage from "../../../../components/LoadingTopPage";

const CampaignDetails: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const campaignService = new CampaignService(loginUser?.accessToken);

    const campaignId = router.query.id as string;

    const { data: campaign, isFetching, isInitialLoading, isError } = useQuery(
        ["admin_campaign", campaignId],
        () => campaignService.getCampaignByIdByAdmin(Number(campaignId), {
            withAddressDetail: true,
        }),
        {
            enabled: !!campaignId,
            refetchOnWindowFocus: false,
        },
    );

    if (isInitialLoading) {
        return <LoadingSpinnerWithOverlay
            label={"Đang tải thông tin hội sách..."}
        />;
    }

    // pathname without router query
    const pathname = router.asPath.split("?")[0];
    console.log(pathname);

    if (isError) {
        return (
            <div className="flex flex-col items-center gap-6">
                <EmptyState status={EMPTY_STATE_TYPE.NO_DATA}
                            customMessage={"Không tìm thấy thông tin hội sách"}
                />
                <Link
                    href={`${findRole(loginUser?.role)?.baseUrl}/campaigns`}
                    className="m-btn bg-blue-600 hover:bg-blue-700 text-white">
                    Xem danh sách hội sách
                </Link>
            </div>
        );
    }

    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <div className="max-w-5xl mx-auto flex flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
                {campaign && (
                    <CampaignContext.Provider value={campaign}>
                        {/* Content */}
                        <MainContent />

                        {/* Sidebar */}
                        <Sidebar />
                    </CampaignContext.Provider>
                )}
            </div>
        </Fragment>
    );
};

CampaignDetails.getLayout = function getLayout(page: ReactElement) {
    return (
        <AdminLayout containerClassName="px-4 sm:px-6 lg:px-8 py-8 w-full" bgClassName="bg-gray-50">
            {page}
        </AdminLayout>
    );
};
export default CampaignDetails;
