import React, { Fragment, useContext } from "react";
import Form from "../Form";
import { BookProductContext } from "../../context/BookProductContext";

type Props = {}

const DescriptionSection: React.FC<Props> = ({}) => {
    const product = useContext(BookProductContext);
    return (
        <Fragment>
            <Form.GroupLabel
                label={"Mô tả sách"}
            />
            <div className="mt-3">
                <div className="text-sm text-gray-500">
                    {product?.description}
                </div>
            </div>
        </Fragment>
    );
};

export default DescriptionSection;