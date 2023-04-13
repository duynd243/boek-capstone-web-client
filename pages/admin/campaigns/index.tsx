import { ReactElement } from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../../_app";
import CampaignListPage from "../../../components/CampaignListPage";

const AdminCampaignsPage: NextPageWithLayout = () => {
    return <CampaignListPage />;
};

AdminCampaignsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCampaignsPage;
