import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../../../_app";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import SeriesBookForm from "../../../../components/BookForm/SeriesBookForm";

const CreateSeriesPage: NextPageWithLayout = () => {
  return <SeriesBookForm formMode="create" />;
};

CreateSeriesPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default CreateSeriesPage;
