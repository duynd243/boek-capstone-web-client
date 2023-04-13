import React from "react";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import { IMockOrder } from "./OrderDetailsModal";
import { OrderPickUpStatuses } from "../../constants/OrderPickUpStatuses";
import { OrderPickUpTypes } from "../../constants/OrderPickUpTypes";

type Props = {
    maxWidth?: string;
    isOpen: boolean;
    onClose: () => void;
    order?: IMockOrder;
}

const OrderStatusPickUpModal: React.FC<Props> = ({ maxWidth, isOpen, order, onClose }) => {

    const handleOnClose = () => {
        onClose();
    };


    const orderType = OrderPickUpTypes.PICKUP;
    const statuses = orderType.availableStatuses.filter((status) => {
        return status.id !== OrderPickUpStatuses.CANCELLED.id;
    });

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
                    title={"Cập nhật trạng thái đơn hàng"}
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="py-4 px-5">
                    {/*<Modal.FormInput<AuthorSchemaType>*/}
                    {/*    placeholder={'Nhập tên tác giả'}*/}
                    {/*    formState={formState}*/}
                    {/*    register={register}*/}
                    {/*    fieldName={'authorName'}*/}
                    {/*    label={'Tên tác giả'}/>*/}
                    <Modal.FormLabel label={"Trạng thái đơn hàng"} required={true} />
                    <div className="mt-1">
                        <select
                            id="status"
                            name="status"
                            className="m-select w-full"
                            defaultValue={order?.status}
                        >
                            {statuses.map((status) => {
                                return <option
                                    key={status.id}
                                    value={status.id}>{status.displayName}</option>;
                            })}
                            {/*<option value="Đang xử lý">Đang xử lý</option>*/}
                            {/*<option value="Đang giao hàng">Đang giao hàng</option>*/}
                            {/*<option value="Đã giao hàng">Đã giao hàng</option>*/}
                            {/*<option value="Đã hủy">Đã hủy</option>*/}
                        </select>
                    </div>
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
                            Cập nhật
                        </button>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default OrderStatusPickUpModal;