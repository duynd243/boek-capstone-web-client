import React from "react";

type Props = {
    value: number | string;
    onClick?: () => void;
    isActive?: boolean;
    disabled?: boolean;
};

const PageButton = ({ isActive, value, onClick, disabled }: Props) => {

    let colorClass = isActive
        ? "text-white bg-indigo-500"
        : onClick
            ? "text-slate-600 bg-white hover:bg-indigo-100"
            : "text-slate-600 bg-white";
    let cursorClass =
        isActive || !onClick ? "cursor-default" : "cursor-pointer";
    return (
        <button
            onClick={onClick && !disabled && !isActive ? onClick : undefined}
            className={`${colorClass} ${cursorClass} h-10 rounded inline-flex items-center justify-center leading-5 px-3.5 py-2`}
        >
            {value}
        </button>
    );
};

export default PageButton;
