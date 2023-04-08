import React from "react";

type Props = {
    children: React.ReactNode;
    onClearFilters: () => void;
    clearFiltersDisabled?: boolean;
}

const FilterSidebar: React.FC<Props> = ({ children, onClearFilters, clearFiltersDisabled = true }) => {
    return (
        <div className="md:w-80 shrink-0 bg-white">
            <div
                className="sticky top-20 shadow-sm border rounded ">
                <div className={"py-4 px-5 border-b"}>
                    <h3 className={"text-xl font-bold"}>Lọc kết quả</h3>
                    <button
                        disabled={clearFiltersDisabled}
                        className={"text-sm font-medium text-red-500 hover:text-red-700 disabled:text-gray-300"}
                        onClick={onClearFilters}
                    >
                        Xóa tất cả bộ lọc
                    </button>
                </div>

                <div className={"px-4 py-1 space-y-4 my-3 max-h-[calc(100vh-12rem)] overflow-y-auto"}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;