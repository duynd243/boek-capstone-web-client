import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

type Props = {
    maxWidth?: string;
    children: React.ReactElement;
    isOpen: boolean;
    onClose: () => void;
    closeOnOverlayClick?: boolean;
    afterLeave?: () => void;
}

const TransitionModal: React.FC<Props> = ({
                                              maxWidth = "max-w-lg",
                                              children,
                                              isOpen,
                                              onClose,
                                              closeOnOverlayClick = true,
                                              afterLeave,
                                          }) => {


    const handleClose = () => {
        if (closeOnOverlayClick) {
            onClose();
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment} afterLeave={afterLeave}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={handleClose}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-60" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            // enter="ease-out duration-300"
                            // enterFrom="opacity-0 scale-95"
                            // enterTo="opacity-100 scale-100"
                            // leave="ease-in duration-200"
                            // leaveFrom="opacity-100 scale-100"
                            // leaveTo="opacity-0 scale-95"

                            enter="transition ease-in-out duration-200"
                            enterFrom="opacity-0 translate-y-4"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in-out duration-200"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-4"
                        >
                            <Dialog.Panel
                                className={`${maxWidth} max-h-full w-full overflow-auto rounded bg-white shadow-lg`}
                            >
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default TransitionModal;
