import React, { Fragment } from "react";
import Modal from "./Modal";
import { HiExclamationCircle } from "react-icons/hi2";
import TransitionModal from "./TransitionModal";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: string;
  confirmText: string;
  cancelText?: string;
};

const ConfirmModal: React.FC<Props> = (props) => {
  return (
    <TransitionModal closeOnOverlayClick={false} {...props}>
      <Fragment>
        <Modal.Header title={props.title} />
        <div className="flex items-center gap-3 p-5">
          <div className="rounded-full bg-rose-100 p-1.5">
            <HiExclamationCircle className="text-3xl text-rose-500" />
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
              className="m-btn bg-rose-600 text-white hover:bg-rose-700"
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
