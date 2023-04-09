import React, { Fragment, ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import WelcomeBanner from "../../../components/WelcomBanner";
import FormPageLayout from "../../../components/Layout/FormPageLayout";
import { BookProductService } from "../../../services/BookProductService";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import { BookTypes } from "../../../constants/BookTypes";
import SingleBookProductDetails from "../../../components/AdminBookProductDetails/SingleBookProductDetails";
import SeriesBookProductDetails from "../../../components/AdminBookProductDetails/SeriesBookProductDetails";
import ComboBookProductDetails from "../../../components/AdminBookProductDetails/ComboBookProductDetails";

const AdminBookProductDetailsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const { id } = router.query as { id: string };
    const bookProductService = new BookProductService(loginUser?.accessToken);


    const { data: product, isLoading } = useQuery(["admin_product", { id }],
        () => bookProductService.getBookProductById(id),
        {
            enabled: !!id,
        },
    );

    if (isLoading) return <LoadingSpinnerWithOverlay />;

    return (
        <Fragment>
            <FormPageLayout>
                <WelcomeBanner
                    label={"Chi tiết sách bán"}
                    className="p-6 sm:p-10"
                />
                {/*{!isLoading && book && (book?.isSeries ?*/}
                {/*    <SeriesBookProductDetails book={book} /> :*/}
                {/*    <SingleBookDetails book={book} />)}*/}

                {product && product?.type === BookTypes.Single.id ?
                    <SingleBookProductDetails product={product} /> : product?.type === BookTypes.Series.id ?
                        <SeriesBookProductDetails product={product} /> :
                        product?.type === BookTypes.Combo.id ?
                            <ComboBookProductDetails product={product} /> : null}
            </FormPageLayout>
        </Fragment>
    );
};

AdminBookProductDetailsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminBookProductDetailsPage;
