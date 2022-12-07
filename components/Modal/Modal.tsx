import React from "react";

import {Dialog} from "@headlessui/react";

type HeaderProps = {
    title: string;
    showCloseButton?: boolean;
    onClose?: () => void;
};

type FooterProps = {
    children: React.ReactNode;
};
const Header: React.FC<HeaderProps> = ({title, showCloseButton, onClose}) => {
    return (
        <Dialog.Title className="border-b border-slate-200 px-5 py-3">
            <div className="flex items-center justify-between">
                <div className="font-semibold text-slate-800">{title}</div>
                {showCloseButton && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-500"
                    >
                        <div className="sr-only">Close</div>
                        <svg className="h-4 w-4 fill-current">
                            <path
                                d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                        </svg>
                    </button>
                )}
            </div>
        </Dialog.Title>
    );
}
const Footer: React.FC<FooterProps> = ({children}) => {
    return (
        <div className="border-t border-slate-200 px-5 py-4">
            {children}
        </div>
    );
}
const Modal = {
    Header,
    Footer,
};
export default Modal;