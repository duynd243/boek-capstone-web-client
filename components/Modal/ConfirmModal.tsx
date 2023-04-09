import React, {Fragment} from "react";
import Modal from "./Modal";
import {HiExclamationCircle} from "react-icons/hi2";
import TransitionModal from "./TransitionModal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    content: string;
    contentDetail?: string;
    confirmText: string;
    cancelText?: string;
    color?: string;
    children?: React.ReactNode; 
    disableButtons?: boolean;
};

const ConfirmModal: React.FC<Props> = (props) => {

    let iconColor = props.color ? `text-${props.color}-600` : "text-rose-600";
    let iconBgColor = props.color ? `bg-${props.color}-100` : "bg-rose-100";
    let primaryButtonColor = props.color ? `bg-${props.color}-600 hover:bg-${props.color}-700` : "bg-rose-600 hover:bg-rose-700";
    return (
        <TransitionModal closeOnOverlayClick={false} {...props}>
            <Fragment>
                <Modal.Header title={props.title}/>
                {props.children ? 
                <div className="flex items-center gap-3 p-5">
                    <p className="text-base font-medium text-slate-800">
                        {props.children}
                    </p>
                </div>
                : null }
                <div className="flex items-center gap-3 p-5">
                    <div className={`rounded-full p-1.5 ${iconBgColor}`}>
                        <HiExclamationCircle className={`text-3xl ${iconColor}`}/>
                    </div>
                    <div className="flex flex-col">
                        <p className="text-base font-medium text-slate-800">
                            {props.content}
                        </p>
                        <p className="text-base text-slate-500 mt-2 empty:hidden">
                            {props.contentDetail}
                        </p>
                    </div>
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            disabled={props.disableButtons}
                            onClick={props.onClose}
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200 disabled:opacity-50"
                        >
                            {props.cancelText || "Huỷ"}
                        </button>
                        <button
                            disabled={props.disableButtons}
                            onClick={props.onConfirm}
                            className={`m-btn text-white ${primaryButtonColor} disabled:opacity-50`}
                        >
                            {props.confirmText}
                        </button>
                    </div>
                </Modal.Footer>
            </Fragment>
        </TransitionModal>
    );
};

export default ConfirmModal;
