import React, { Fragment } from "react";
import TransitionModal from "./TransitionModal";
import Modal from "./Modal";
import { HiExclamationCircle } from "react-icons/hi2";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  doLogout: () => void;
};

const LogoutModal: React.FC<Props> = (props) => {
  return (
    <TransitionModal closeOnOverlayClick={false} {...props}>
      <Fragment>
        <Modal.Header title="Đăng xuất" />
        <div className="flex items-center gap-3 p-5">
          <div className="rounded-full bg-rose-100 p-1.5">
            <HiExclamationCircle className="text-3xl text-rose-500" />
          </div>
          <p className="text-base text-slate-700">
            Bạn có chắc chắn muốn đăng xuất?
          </p>
        </div>
        <Modal.Footer>
          <div className="flex flex-wrap justify-end space-x-2">
            <button
              onClick={props.onClose}
              className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
            >
              Huỷ
            </button>
            <button
              onClick={props.doLogout}
              className="m-btn bg-rose-600 text-white hover:bg-rose-700"
            >
              Đăng xuất
            </button>
          </div>
        </Modal.Footer>
      </Fragment>
    </TransitionModal>
  );
};

export default LogoutModal;
