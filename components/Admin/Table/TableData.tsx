import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const TableData: React.FC<Props> = ({ className, children }) => {
  return (
    <td className={`whitespace-nowrap px-6 py-4 ${className || ""}`}>
      {children}
    </td>
  );
};

export default TableData;
