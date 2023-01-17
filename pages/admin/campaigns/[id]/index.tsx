import React, { ReactElement, useEffect, useState } from "react";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../../_app";
import { useAuth } from "../../../../context/AuthContext";
import { SystemCampaignService } from "../../../../old-services/System/System_CampaignService";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import Image from "next/image";

const CampaignDetails: NextPageWithLayout = () => {
  const { loginUser } = useAuth();

  const router = useRouter();
  const systemCampaignService = new SystemCampaignService(
    loginUser?.accessToken
  );
  const [campaignId, setCampaignId] = useState<number | undefined>(undefined);

  useEffect(() => {
    const campaignId = router.query.id as string;
    setCampaignId(Number(campaignId));
  }, [router.query.id]);

  const { data: campaign, isLoading } = useQuery(
    ["admin_campaign", campaignId],
    () => systemCampaignService.getCampaignById(campaignId)
  );
  return (
    <div>
      <h1>{campaign?.name}</h1>
      <Image
        src={campaign?.imageUrl || ""}
        alt={campaign?.name || ""}
        width={1920}
        height={1080}
      />
    </div>
  );
};

CampaignDetails.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default CampaignDetails;
