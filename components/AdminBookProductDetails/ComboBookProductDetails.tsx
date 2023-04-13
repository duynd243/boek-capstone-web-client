import React from "react";
import AdminBookProductDetailsLayout from "./AdminBookProductDetailsLayout";
import MainSection from "./MainSection";
import Form from "../Form";
import { BookProductContext } from "../../context/BookProductContext";
import { IBookProduct } from "../../types/Book/IBookProduct";
import DetailsSection from "./DetailsSection";
import DescriptionSection from "./DescriptionSection";
import StatusCard from "./StatusCard";
import BookItemsSection from "./BookItemsSection";

type Props = {
    product: IBookProduct | undefined
}


const ComboBookProductDetails: React.FC<Props> = ({ product }) => {

    return (
        <BookProductContext.Provider value={product}>
            <AdminBookProductDetailsLayout>
                <StatusCard />
                <Form.Divider />
                <MainSection />
                <Form.Divider />
                <BookItemsSection />
                <Form.Divider />
                <DetailsSection />
                <Form.Divider />
                <DescriptionSection />
            </AdminBookProductDetailsLayout>
        </BookProductContext.Provider>
    );
};

export default ComboBookProductDetails;