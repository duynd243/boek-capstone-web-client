import React from "react";

type Props = {
    children: React.ReactNode;
};

const SidebarBlockWrapper: React.FC<Props> = ({ children }) => {
    return (
        <div className="rounded-sm border border-slate-200 bg-white p-5 shadow lg:w-72 xl:w-80 empty:hidden">
            {children}
        </div>
    );
};

export default SidebarBlockWrapper;
