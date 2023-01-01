import React, { Fragment } from "react";
import TransitionModal from "./TransitionModal";
import Modal from "./Modal";
import { HiExclamationCircle } from "react-icons/hi2";
import { useRouter } from "next/router";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  // doLogout: () => void;
};



const CreateBookModal: React.FC<Props> = (props) => {
  const handleAddBook = () => {
    router.push("/issuer/books/create");
  };
  const router = useRouter();
  return (
    <TransitionModal closeOnOverlayClick={false} {...props}>
      <Fragment>
        <Modal.Header title="Thêm sách lẻ mới" />
        <div className="flex items-center gap-3 p-5">
          <div className="rounded-full bg-rose-100 p-1.5">
            <HiExclamationCircle className="text-3xl text-rose-500" />
          </div>
          <p className="text-base font-medium text-slate-800">
            Bạn có chắc chắn muốn thêm một sách lẻ mới?
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
              onClick={() => {
                handleAddBook();
              }}
              className="m-btn bg-rose-600 text-white hover:bg-rose-700"
            >
              Thêm sách
            </button>
          </div>
        </Modal.Footer>
      </Fragment>
    </TransitionModal>
  );
};

export default CreateBookModal;
