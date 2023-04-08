import React, { Fragment } from "react";
import { NextPageWithLayout } from "../../_app";
import CustomerLayout from "../../../components/Layout/CustomerLayout";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { CampaignService } from "../../../services/CampaignService";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import Link from "next/link";
import { findRole } from "../../../constants/Roles";
import LoadingTopPage from "../../../components/LoadingTopPage";
import { CustomerCampaignContext } from "../../../context/CampaignContext";
import MainContent from "../../../components/CampaignDetails/MainContent";
import Sidebar from "../../../components/CampaignDetails/Sidebar";

const CustomerCampaignDetailsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const campaignService = new CampaignService(loginUser?.accessToken);

    const campaignId = router.query.id as string;

    const { data: campaign, isFetching, isInitialLoading, isError } = useQuery(
        ["campaign", campaignId],
        () => campaignService.getCampaignByIdByCustomer(Number(campaignId)),
        {
            enabled: !!campaignId,
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
                    href={`${findRole(loginUser?.role)?.defaultRoute}/campaigns`}
                    className="m-btn bg-blue-600 hover:bg-blue-700 text-white">
                    Xem danh sách hội sách
                </Link>
            </div>
        );
    }

    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <div className="mx-auto flex justify-center flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
                {campaign && (
                    <CustomerCampaignContext.Provider value={campaign}>
                        {/* Content */}
                        <MainContent />

                        {/* Sidebar */}
                        <Sidebar />
                    </CustomerCampaignContext.Provider>
                )}
            </div>
        </Fragment>
    );
};

CustomerCampaignDetailsPage.getLayout = (page) => {
    return <CustomerLayout>
        {page}
    </CustomerLayout>;
};

export default CustomerCampaignDetailsPage;