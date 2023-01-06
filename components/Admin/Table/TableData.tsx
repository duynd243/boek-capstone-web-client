import React, {TdHTMLAttributes} from "react";

type Props = {

    children: React.ReactNode;
    className?: string;
    textAlignment?: "text-left" | "text-center" | "text-right";
} & React.TdHTMLAttributes<HTMLTableDataCellElement>;

const TableData: React.FC<Props> = ({className, textAlignment, children, ...rest}) => {
    return (
        <td
            {...rest}
            className={`whitespace-nowrap px-6 py-4 ${textAlignment || "text-left"} ${
                className || ""
            }`}
        >
            {children}
        </td>
    );
};

export default TableData;
