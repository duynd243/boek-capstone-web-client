import React, {ReactElement, useEffect, useState} from "react";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../../_app";
import {useAuth} from "../../../../context/AuthContext";
import {SystemCampaignService} from "../../../../old-services/System/System_CampaignService";
import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/router";
import Image from "next/image";
import {CampaignService} from "../../../../services/CampaignService";
import MainContent from "../../../../components/CampaignDetails/MainContent";
import Sidebar from "../../../../components/CampaignDetails/Sidebar";

const CampaignDetails: NextPageWithLayout = () => {
    const {loginUser} = useAuth();
    const router = useRouter();
    const campaignService = new CampaignService(loginUser?.accessToken);

    const campaignId = router.query.id as string;

    const {data: campaign, isLoading} = useQuery(
        ["admin_campaign", campaignId],
        () => campaignService.getCampaignByIdByAdmin(Number(campaignId)),
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            retry: false,
            enabled: !!campaignId
        }
    );
    return (
        <div className="mx-auto flex max-w-5xl flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
                {campaign && (
                    <>
                        {/* Content */}
                        <MainContent campaign={campaign} />

                        {/* Sidebar */}
                        <Sidebar campaign={campaign} issuers={undefined} />

                    </>
                )}
            </div>
    );
};

CampaignDetails.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default CampaignDetails;
