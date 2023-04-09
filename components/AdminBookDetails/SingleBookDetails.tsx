import React from "react";
import { IBook } from "../../types/Book/IBook";
import Form from "../Form";
import AdminBookDetailsLayout from "./AdminBookDetailsLayout";
import { BookContext } from "../../context/BookContext";
import MainSection from "./MainSection";
import DetailsSection from "./DetailsSection";
import DescriptionSection from "./DescriptionSection";

type Props = {
    book: IBook | undefined
}

const SingleBookDetails: React.FC<Props> = ({ book }) => {


    return (
        <BookContext.Provider value={book}>
            <AdminBookDetailsLayout>
                <MainSection />
                <Form.Divider />
                <DetailsSection />
                <Form.Divider />
                <DescriptionSection />
            </AdminBookDetailsLayout>
        </BookContext.Provider>
    );
};

export default SingleBookDetails;