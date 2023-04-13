import React, { Fragment, useContext } from "react";
import Form from "../Form";
import { BookProductContext } from "../../context/BookProductContext";

type Props = {}

const DetailsSection: React.FC<Props> = ({}) => {

    const product = useContext(BookProductContext);
    const { book } = product || {};
    const details = [
        {
            label: "Nhà xuất bản",
            value: book?.publisher?.name,
        }, {
            label: "ISBN10",
            value: book?.isbn10,
        }, {
            label: "ISBN13",
            value: book?.isbn13,
        }, {
            label: "Năm phát hành",
            value: book?.releasedYear,
        }, {
            label: "Số trang",
            value: book?.page,
        }, {
            label: "Kích thước",
            value: book?.size,
        }, {
            label: "Dịch giả",
            value: book?.translator,
        },
    ];
    return (
        <Fragment>
            <Form.GroupLabel
                label={"Thông tin chi tiết"}
                description={"Thông tin chi tiết về sách"}
            />
            <div className="mt-3 space-y-4 md:space-y-0 md:flex gap-6 overflow-x-auto">
                <table className="table-auto w-full border rounded shadow">
                    <tbody>

                    {details.filter(d => d.value).map((detail, index) => (
                        <tr key={index} className="group">
                            <td
                                className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 bg-gray-100 w-1/3">
                                {detail.label}
                            </td>
                            <td
                                className={`px-6 py-4 whitespace-nowrap text-sm text-slate-700 group-even:bg-gray-50`}>
                                {detail.value}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </Fragment>
    );
};

export default DetailsSection;