import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";

const AdminCampaignsPage: NextPageWithLayout = () => {
  return <p></p>;
};

AdminCampaignsPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCampaignsPage;
