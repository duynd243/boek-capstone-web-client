import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { ReactElement } from "react";

const CreateCampaignPage: NextPageWithLayout = () => {
  return <p></p>;
};

CreateCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default CreateCampaignPage;
