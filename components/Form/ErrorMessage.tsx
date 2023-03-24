import React from "react";

type Props = {
    children: React.ReactNode;
};

const ErrorMessage: React.FC<Props> = ({ children }) => {
    return (
        <div className="mt-1.5 rounded bg-rose-50 py-2 px-3 text-sm font-medium text-rose-500 empty:hidden">
            {children}
        </div>
    );
};

export default ErrorMessage;
