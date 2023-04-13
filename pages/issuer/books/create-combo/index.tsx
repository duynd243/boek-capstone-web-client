import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../../_app";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import ComboBookForm from "../../../../components/BookForm/ComboBookForm";

const CreateComboPage: NextPageWithLayout = () => {
    return <ComboBookForm formMode="create" />;
};

CreateComboPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default CreateComboPage;
