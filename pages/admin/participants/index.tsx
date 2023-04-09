import React, {ReactElement} from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../_app";
import ParticipantsPage from "../../../components/ParticipantsPage";

const AdminParticipantsPage: NextPageWithLayout = () => {
    return (
        <ParticipantsPage/>
    );
};

AdminParticipantsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminParticipantsPage;
