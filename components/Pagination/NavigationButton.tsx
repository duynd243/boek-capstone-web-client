import React from "react";
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

type Props = {
    type: "next" | "prev" | "first" | "last";
    onClick?: () => void;
    disabled?: boolean;
} & React.HTMLAttributes<HTMLButtonElement>;

const NavigationButton = ({ onClick, type, disabled }: Props) => {
    const icon = {
        next: MdNavigateNext,
        prev: MdNavigateBefore,
        first: MdFirstPage,
        last: MdLastPage,
    };
    const bgClass = !disabled ? "bg-white hover:bg-indigo-100" : "bg-white";

    return (
        <button
            disabled={disabled}
            className={`disabled:opacity-50 disabled:cursor-default rounded ${bgClass}`}
            onClick={onClick && !disabled ? onClick : undefined}
        >
            <span
                className="inline-flex items-center justify-center rounded leading-5 h-10 aspect-square text-slate-700 hover:text-slate-900">
                {icon[type]({})}
            </span>
        </button>
    );
};

export default NavigationButton;
