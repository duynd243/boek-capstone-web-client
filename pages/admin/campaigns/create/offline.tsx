import React, {ReactElement} from "react";
import {NextPageWithLayout} from "../../../_app";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import FormPageLayout from "../../../../components/Layout/FormPageLayout";
import WelcomeBanner from "../../../../components/WelcomBanner";
import OfflineCampaignForm from "../../../../components/CampaignForm/OfflineCampaignForm";

const CreateOfflineCampaignPage: NextPageWithLayout = () => {
    return (
        <FormPageLayout>
            <WelcomeBanner label="Tạo hội sách trực tiếp 🏪" className="p-6 sm:p-10"/>
            <OfflineCampaignForm action={'CREATE'}/>
        </FormPageLayout>
    );
};

CreateOfflineCampaignPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default CreateOfflineCampaignPage;
