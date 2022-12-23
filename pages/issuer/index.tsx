import { NextPage } from "next";
import AdminLayout from "../../components/Layout/AdminLayout";
import React, { ReactElement } from "react";

import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  return <p>Issuer Dashboard</p>;
};
Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Page;
