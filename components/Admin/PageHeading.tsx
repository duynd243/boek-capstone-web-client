import React from "react";

type Props = {
  label: string;
  children?: React.ReactNode;
};

const PageHeading: React.FC<Props> = ({ label, children }) => {
  return (
    <div className="mb-8 sm:flex sm:items-center sm:justify-between">
      {/* Left: Title */}
      <div className="mb-4 sm:mb-0">
        <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
          {label} ✨
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="grid grid-flow-col justify-start gap-2 sm:auto-cols-max sm:justify-end">
        {children}
      </div>
    </div>
  );
};

export default PageHeading;
