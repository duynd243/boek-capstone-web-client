import { ReactElement } from "react";
import OnlineCampaignForm from "../../../../components/CampaignForm/OnlineCampaignForm";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import FormPageLayout from "../../../../components/Layout/FormPageLayout";
import WelcomeBanner from "../../../../components/WelcomBanner";
import { NextPageWithLayout } from "../../../_app";

const CreateOnlineCampaignPage: NextPageWithLayout = () => {

    return (
        <FormPageLayout>
            <WelcomeBanner
                label="Tạo hội sách trực tuyến 👨‍💻"
                className="p-6 sm:p-10"
            />
            <OnlineCampaignForm action={"CREATE"} />
        </FormPageLayout>
    );
};

CreateOnlineCampaignPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default CreateOnlineCampaignPage;
