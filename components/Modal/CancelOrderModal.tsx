import React from 'react'
import {IMockOrder} from "./OrderDetailsModal";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import {useFormik} from "formik";

type Props = {
    maxWidth?: string;
    isOpen: boolean;
    onClose: () => void;
    order?: IMockOrder;
}

const CancelOrderModal: React.FC<Props> = ({maxWidth, isOpen, order, onClose}) => {
    const handleOnClose = () => {
        onClose();
    }
    const form = useFormik({
        initialValues: {

        },
        onSubmit: (values) => {

        }
    })
    return (
        <TransitionModal
            maxWidth={maxWidth}
            isOpen={isOpen}
            onClose={handleOnClose}
            closeOnOverlayClick={false}
        >
            <form onSubmit={() => {
            }}>
                <Modal.Header
                    title={'Huỷ đơn hàng'}
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="py-4 px-5">
                    <Modal.FormInputOld
                        isTextArea={true}
                        placeholder="Nhập lý do huỷ đơn hàng"
                        required={true}
                        formikForm={form}
                        fieldName="personnelAddress"
                        label="Lý do huỷ"
                    />
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            disabled={false}
                            onClick={handleOnClose}
                            type="button"
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Huỷ
                        </button>

                        <button
                            disabled={false}
                            type="submit"
                            className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
                        >
                            Xác nhận
                        </button>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    )
}

export default CancelOrderModal