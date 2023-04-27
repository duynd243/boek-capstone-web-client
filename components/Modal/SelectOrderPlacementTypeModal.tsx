import React from "react";
import Modal from "./Modal";
import { RadioGroup } from "@headlessui/react";
import TransitionModal from "./TransitionModal";
import { useOrderStore } from "../../stores/OrderStore";
import OrderPlacementDetail from "../Customer/OrderPlacementDetail";
import OrderPlacementCard from "../Customer/OrderPlacementCard";


type Props = {
    isOpen: boolean;
    onClose: () => void;
}

const SelectOrderPlacementTypeModal: React.FC<Props> = ({
                                                            isOpen, onClose,
                                                        }) => {

    const orderType = useOrderStore((state) => state.orderType);
    const setOrderType = useOrderStore((state) => state.setOrderType);

    return (
        <TransitionModal
            maxWidth={"max-w-2xl"}
            isOpen={isOpen}
            onClose={onClose}>
            <>
                <Modal.Header
                    title={"Chọn hình thức nhận hàng"}
                    onClose={onClose}
                    showCloseButton={true}
                />
                <div className="py-5 px-5">
                    <RadioGroup
                        defaultChecked={true}
                        as={"div"}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto"
                        value={orderType} onChange={(value) => {
                        setOrderType(value);
                    }}>
                        {(["delivery", "pickup"] as const).map((type) => (
                            <RadioGroup.Option
                                key={type}
                                value={type}>
                                {({ checked }) => (
                                    <OrderPlacementCard
                                        checked={checked}
                                        orderType={type} />
                                )}
                            </RadioGroup.Option>),
                        )}
                    </RadioGroup>

                    <div className="mt-6 px-3">
                        <OrderPlacementDetail orderType={orderType} />
                    </div>
                    <div
                        className="mt-6 text-slate-700 border border-slate-200 bg-slate-50 rounded-md p-4">
                        Boek không chịu trách nhiệm về việc đổi trả sách của khách hàng.
                        Xin vui lòng liên hệ
                        với NPH để được hỗ trợ về việc đổi trả sách.
                    </div>
                </div>

                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <Modal.SecondaryButton
                            type="button"
                            onClick={onClose}
                        >
                            Huỷ
                        </Modal.SecondaryButton>

                        <Modal.PrimaryButton
                            type="button"
                            href={"/checkout"}
                        >
                            Tiếp tục
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>

                {/*<pre>*/}
                {/*    {JSON.stringify(orderType, null, 2)}*/}
                {/*</pre>*/}
            </>
        </TransitionModal>
    );
};

export default SelectOrderPlacementTypeModal;