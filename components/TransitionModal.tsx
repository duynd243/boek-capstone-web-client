import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

type Props = {
  children: React.ReactElement;
  isOpen: boolean;
  onClose: () => void;
  closeOnOverlayClick?: boolean;
};

const TransitionModal: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  closeOnOverlayClick = true,
}) => {
  const backDropRef = React.useRef(null);
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
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

        <div
          onClick={(event) => {
            if (closeOnOverlayClick && event?.target === backDropRef.current) {
              onClose();
            }
          }}
          className="fixed inset-0 overflow-y-auto"
        >
          <div
            ref={backDropRef}
            className="flex min-h-full items-center justify-center p-4"
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TransitionModal;
