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
    confirmText: string;
    cancelText?: string;
    color?: string;
};

const ConfirmModal: React.FC<Props> = (props) => {

    let iconColor = props.color ? `text-${props.color}-600` : "text-rose-600";
    let iconBgColor = props.color ? `bg-${props.color}-100` : "bg-rose-100";
    let primaryButtonColor = props.color ? `bg-${props.color}-600 hover:bg-${props.color}-700` : "bg-rose-600 hover:bg-rose-700";
    return (
        <TransitionModal closeOnOverlayClick={false} {...props}>
            <Fragment>
                <Modal.Header title={props.title}/>
                <div className="flex items-center gap-3 p-5">
                    <div className={`rounded-full p-1.5 ${iconBgColor}`}>
                        <HiExclamationCircle className={`text-3xl ${iconColor}`}/>
                    </div>
                    <p className="text-base font-medium text-slate-800">
                        {props.content}
                    </p>
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            onClick={props.onClose}
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            {props.cancelText || "Huỷ"}
                        </button>
                        <button
                            onClick={props.onConfirm}
                            className={`m-btn text-white ${primaryButtonColor}`}
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
