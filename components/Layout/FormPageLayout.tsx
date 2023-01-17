import React from "react";

type Props = {
  children: React.ReactNode;
};

const FormPageLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="mx-auto max-w-6xl overflow-hidden rounded-md bg-white">
      {children}
    </div>
  );
};

export default FormPageLayout;
