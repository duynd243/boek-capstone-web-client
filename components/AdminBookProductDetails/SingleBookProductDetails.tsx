import React from "react";
import { BookProductContext } from "../../context/BookProductContext";
import { IBookProduct } from "../../types/Book/IBookProduct";
import AdminBookProductDetailsLayout from "./AdminBookProductDetailsLayout";
import MainSection from "./MainSection";
import Form from "../Form";
import DetailsSection from "./DetailsSection";
import DescriptionSection from "./DescriptionSection";
import StatusCard from "./StatusCard";

type Props = {
    product: IBookProduct | undefined
}


const SingleBookProductDetails: React.FC<Props> = ({ product }) => {

    return (
        <BookProductContext.Provider value={product}>
            <AdminBookProductDetailsLayout>
                <StatusCard/>
                <Form.Divider />
                <MainSection />
                <Form.Divider />
                <DetailsSection />
                <Form.Divider />
                <DescriptionSection />
            </AdminBookProductDetailsLayout>
        </BookProductContext.Provider>
    );
};

export default SingleBookProductDetails;