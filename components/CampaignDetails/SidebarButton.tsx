import Link from "next/link";
import React from "react";

type Props = {
    children: React.ReactNode;
    href?: string;
    variant?: "primary" | "secondary";
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
} & React.HTMLAttributes<HTMLButtonElement> & React.HTMLAttributes<HTMLAnchorElement>;

const variantClasses = {
    primary: "m-btn bg-indigo-500 text-white w-full hover:bg-indigo-600",
    secondary: "m-btn bg-white !border-slate-200 !shadow text-slate-600 w-full border bg-slate-50 hover:!border-slate-300",
};

const SidebarButton: React.FC<Props> = (props) => {

    const commonProps = {
        type: props.type || "button",
        className: `${variantClasses[props.variant || "primary"]}`,
    };
    return props.href ? (
        <Link href={props.href} {...commonProps}>
            {props.children}
        </Link>
    ) : (
        <button onClick={props.onClick} {...commonProps}>
            {props.children}
        </button>
    );
};

export default SidebarButton;
