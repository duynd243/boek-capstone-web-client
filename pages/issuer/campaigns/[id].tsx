import React, { Fragment, ReactElement } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import LoadingProgress from "../../../components/Commons/LoadingProgress";
import { IssuerCampaignService } from "../../../old-services/Issuer/Issuer_CampaignService";

import MainContent from "../../../components/CampaignDetails/MainContent";
import { NextPageWithLayout } from "../../_app";
import Sidebar from "../../../components/CampaignDetails/Sidebar";

import { IUser } from "../../../old-types/user/IUser";

const IssuerCampaignDetailsPage: NextPageWithLayout = () => {
  const { loginUser } = useAuth();
  const router = useRouter();
  const issuerCampaignService = new IssuerCampaignService(
    loginUser?.accessToken
  );
  const { id: campaignId } = router.query;

  const { data: campaign, isLoading } = useQuery(
    ["issuer_campaign", campaignId],
    () => issuerCampaignService.getCampaignById$Issuer(campaignId)
  );
  if (isLoading) {
    return <LoadingProgress />;
  }

  const issuers = campaign?.participations
    ?.filter((p) => p.issuer)
    .map((p) => p.issuer) as IUser[];
  return (
    <Fragment>
      <div className="mx-auto flex max-w-5xl flex-col lg:flex-row lg:space-x-8 xl:space-x-16">
        {campaign && (
          <>
            {/* Content */}

            <MainContent campaign={campaign} />

            {/* Sidebar */}
            <Sidebar campaign={campaign} issuers={issuers} />
          </>
        )}
      </div>
    </Fragment>
  );
};
IssuerCampaignDetailsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default IssuerCampaignDetailsPage;
