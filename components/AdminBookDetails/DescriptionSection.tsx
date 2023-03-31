import React, { Fragment, useContext } from "react";
import Form from "../Form";
import { BookContext } from "../../context/BookContext";

type Props = {}

const DescriptionSection: React.FC<Props> = ({}) => {
    const book = useContext(BookContext);
    return (
        <Fragment>
            <Form.GroupLabel
                label={"Mô tả sách"}
            />
            <div className="mt-3">
                <div className="text-sm text-gray-500">
                    {book?.description}
                </div>
            </div>
        </Fragment>
    );
};

export default DescriptionSection;