import React, { memo } from "react";
import Link from "next/link";
import { IoAdd } from "react-icons/io5";

type Props = {
    href?: string;
    onClick?: () => void;
    label: string;
    className?: string;
};

const CreateButton: React.FC<Props> = ({ label, onClick, href, className }) => {
    const commonProps = {
        className: `m-btn gap-1 bg-indigo-500 text-white hover:bg-indigo-600 ${className}`,
    };

    const children = (
        <>
            <IoAdd size={16} />
            <span className="hidden sm:block">{label}</span>
        </>
    );
    return href ? (
        <Link href={href} {...commonProps}>
            {children}
        </Link>
    ) : (
        <button onClick={onClick} {...commonProps}>
            {children}
        </button>
    );
};

export default memo(CreateButton);
