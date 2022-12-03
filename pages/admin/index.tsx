import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import AdminLayout from "../../components/Layout/AdminLayout";

const Page: NextPageWithLayout = () => {
  return <p>Admin Dashboard</p>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default Page;
