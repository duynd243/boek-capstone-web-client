import React from "react";

type Props = {
    children: React.ReactNode;
};

const TableWrapper: React.FC<Props> = ({ children }) => {
    return (
        <div className="flex flex-col">
            <div className="overflow-x-auto border border-slate-200 shadow-lg rounded-sm">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow">
                        <table className="min-w-full divide-y divide-gray-200 bg-slate-50">
                            {children}
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableWrapper;
