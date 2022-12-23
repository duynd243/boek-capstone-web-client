import React from "react";

type Props = {
  children: React.ReactNode;
};

const TableBody: React.FC<Props> = ({ children }) => {
  return (
    <tbody className="divide-y divide-gray-200 bg-white">{children}</tbody>
  );
};

export default TableBody;
