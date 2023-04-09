import React from "react";

type Props = {
    textAlignment?: "text-left" | "text-center" | "text-right";
    children: React.ReactNode;
};

const TableHeader: React.FC<Props> = ({ textAlignment, children }) => {
    return (
        <th
            scope="col"
            className={`p-6 font-medium uppercase tracking-wider text-gray-500 ${
                textAlignment || "text-left"
            }`}
        >
            {children}
        </th>
    );
};

export default TableHeader;
