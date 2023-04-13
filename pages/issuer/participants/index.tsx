import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import ParticipantsPage from "../../../components/ParticipantsPage";

const IssuerParticipants: NextPageWithLayout = () => {

    return (
        <ParticipantsPage />
    );
};
IssuerParticipants.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default IssuerParticipants;