import React, { Fragment, ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { useRouter } from "next/router";
import { useAuth } from "../../../context/AuthContext";
import { BookService } from "../../../services/BookService";
import { useQuery } from "@tanstack/react-query";
import WelcomeBanner from "../../../components/WelcomBanner";
import FormPageLayout from "../../../components/Layout/FormPageLayout";
import SeriesBookDetails from "../../../components/AdminBookDetails/SeriesBookDetails";
import SingleBookDetails from "../../../components/AdminBookDetails/SingleBookDetails";

const AdminBookDetailsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const { id } = router.query;
    const bookService = new BookService();


    const { data: book, isLoading } = useQuery(["book", { id }],
        () => bookService.getBookById(Number(id)),
        {
            enabled: !!id && !isNaN(Number(id)),
        },
    );
    return (
        <Fragment>
            <FormPageLayout>
                <WelcomeBanner
                    label={"Chi tiết sách"}
                    className="p-6 sm:p-10"
                />
                {!isLoading && book && (book?.isSeries ?
                    <SeriesBookDetails book={book} /> :
                    <SingleBookDetails book={book} />)}
            </FormPageLayout>
        </Fragment>
    );
};

AdminBookDetailsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminBookDetailsPage;
