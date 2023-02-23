import React, {ReactElement} from "react";
import {NextPageWithLayout} from "../../../_app";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import WelcomeBanner from "../../../../components/WelcomBanner";
import OfflineCampaignForm from "../../../../components/CampaignForm/OfflineCampaignForm";
import FormPageLayout from "../../../../components/Layout/FormPageLayout";
import OnlineCampaignForm from "../../../../components/CampaignForm/OnlineCampaignForm";

const CreateOnlineCampaignPage: NextPageWithLayout = () => {
    return <FormPageLayout>
        <WelcomeBanner label="Tạo hội sách trực tuyến 🏪" className="p-6 sm:p-10"/>
        <OnlineCampaignForm action={'CREATE'}/>
    </FormPageLayout>;
};

CreateOnlineCampaignPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default CreateOnlineCampaignPage;
