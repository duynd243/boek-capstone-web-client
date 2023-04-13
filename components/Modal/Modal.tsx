import React from "react";

import { Dialog } from "@headlessui/react";
import Form from "../Form";
import Link from "next/link";
import { BsEmojiFrownFill, BsEmojiSmileFill } from "react-icons/bs";
import { CgSpinnerAlt } from "react-icons/cg";

type HeaderProps = {
    title: string;
    showCloseButton?: boolean;
    onClose?: () => void;
};

type FooterProps = {
    children: React.ReactNode;
};

const Header: React.FC<HeaderProps> = ({ title, showCloseButton, onClose }) => {
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
};
const Footer: React.FC<FooterProps> = ({ children }) => {
    return (
        <div className="border-t border-slate-200 px-5 py-4">{children}</div>
    );
};

const Backdrop: React.FC = () => {
    return (
        <div className="bg-black fixed top-0 right-0 bottom-0 left-0 z-[1000] opacity-30"></div>
    );
};

type ButtonProps = {
    children: React.ReactNode;
    href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>;

const PrimaryButton: React.FC<ButtonProps> = ({ children, href, ...rest }) => {
    const props = {
        ...rest,
        className:
            "m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50",
    };

    if (href) {
        return (
            <Link href={href} {...props}>
                {children}
            </Link>
        );
    }

    return <button {...props}>{children}</button>;
};

const SecondaryButton: React.FC<ButtonProps> = ({
                                                    children,
                                                    href,
                                                    ...rest
                                                }) => {
    const props = {
        ...rest,
        className:
            "m-btn bg-gray-100 text-slate-600 hover:bg-gray-200 disabled:opacity-50",
    };

    if (href) {
        return (
            <Link href={href} {...props}>
                {children}
            </Link>
        );
    }
    return <button {...props}>{children}</button>;
};

const StatusSwitch = ({
                          enabled,
                          enabledText,
                          disabledText,
                      }: {
    enabled: boolean;
    enabledText: string;
    disabledText: string;
}) => {
    return (
        <div>
            <div
                className={`${
                    enabled ? "bg-green-500" : "bg-rose-500"
                } flex w-fit items-center gap-2 rounded px-2.5 py-1 text-sm text-white transition`}
            >
                {enabled ? (
                    <>
                        Hoạt động <BsEmojiSmileFill />
                    </>
                ) : (
                    <>
                        Không hoạt động <BsEmojiFrownFill />
                    </>
                )}
            </div>
            <div className="mt-2 text-sm font-medium text-slate-600">
                {enabled ? enabledText : disabledText}
            </div>
        </div>
    );
};

const SubmitTextWithLoading = (props: {
    text: string;
    loadingText: string;
    isLoading: boolean;
}) => {
    return (
        <>
            {props.isLoading ? (
                <>
                    {props.loadingText}
                    <CgSpinnerAlt className="animate-spin ml-2" size={18} />
                </>
            ) : (
                props.text
            )}
        </>
    );
};

const Modal = {
    Backdrop,
    Header,
    Footer,
    FormInput: Form.Input,
    FormLabel: Form.Label,
    PrimaryButton,
    SecondaryButton,
    StatusSwitch,
    SubmitTextWithLoading,
};
export default Modal;
