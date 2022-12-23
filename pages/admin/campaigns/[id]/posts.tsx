import React, { ReactElement } from "react";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../../_app";
import { useRouter } from "next/router";

const Posts: NextPageWithLayout = () => {
  const router = useRouter();
  const { id: campaignId } = router.query;
  return <div>Campaign post of id: {campaignId}</div>;
};
Posts.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default Posts;
