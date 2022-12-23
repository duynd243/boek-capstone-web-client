import React from "react";

type Props = {
  children: React.ReactNode;
};

const TableHeading: React.FC<Props> = ({ children }) => {
  return (
    <thead className="text-xs">
      <tr>{children}</tr>
    </thead>
  );
};

export default TableHeading;
