import React from "react";

type Props = {
    text: string;
    showAllButtonVisible?: boolean;
    onShowAllClick?: () => void;
    children?: React.ReactNode;

}

const Heading: React.FC<Props> = ({ text, onShowAllClick, showAllButtonVisible = false, children }) => {
    return (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-1">
            <div className="text-base font-semibold text-slate-800">
                {text}
            </div>
            {showAllButtonVisible && (
                <>
                    <button
                        onClick={onShowAllClick}
                        className="text-sm font-medium text-indigo-500 hover:text-indigo-600 disabled:text-gray-500">
                        Xem tất cả
                    </button>
                    {children}
                </>
            )}
        </div>
    );
};

export default Heading;