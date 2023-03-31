import React from "react";

type Props = {
    numberOfColumns: number;
}

const TableRowSkeleton: React.FC<Props> = ({ numberOfColumns }) => {
    return (
        <tr>
            {Array.from({ length: numberOfColumns }, (_, i) => (
                <td key={i} className={"animate-pulse p-4"}>
                    <div className="h-2.5 bg-gray-200 rounded-full mb-2.5"></div>
                    <div className="h-2.5 bg-gray-200 rounded-full w-9/12"></div>
                </td>
            ))}
        </tr>
    );
};

export default TableRowSkeleton;