import React from "react";
import { IBook } from "../../types/Book/IBook";
import Form from "../Form";
import AdminBookDetailsLayout from "./AdminBookDetailsLayout";
import MainSection from "./MainSection";
import DetailsSection from "./DetailsSection";
import DescriptionSection from "./DescriptionSection";
import { BookContext } from "../../context/BookContext";
import BookItemsSection from "./BookItemsSection";

type Props = {
    book: IBook | undefined
}


const SeriesBookDetails: React.FC<Props> = ({ book }) => {

    return (
        <BookContext.Provider value={book}>
            <AdminBookDetailsLayout>
                <MainSection />
                <Form.Divider />
                <BookItemsSection />
                <Form.Divider />
                <DetailsSection />
                <Form.Divider />
                <DescriptionSection />
            </AdminBookDetailsLayout>
        </BookContext.Provider>
    );
};

export default SeriesBookDetails;