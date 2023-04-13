import React, { useState } from "react";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import { DateRange, DayPicker } from "react-day-picker";
import { vi } from "date-fns/locale";
import { GrPowerReset } from "react-icons/gr";
import { DAY_PICKER_CONTAINER, DAY_PICKER_SELECTED } from "../../constants/TailwindClasses";

type Props = {
    title: string,
    isOpen: boolean,
    value?: DateRange,
    onDismiss: () => void;
    onClose: (value: DateRange | undefined) => void;
}

const DateRangePickerModal: React.FC<Props> = ({
                                                   title,
                                                   isOpen,
                                                   value,
                                                   onDismiss,
                                                   onClose,
                                               }) => {
    const [selected, setSelected] = useState<DateRange | undefined>(value);
    const footer = <button
        onClick={() => setSelected(undefined)}
        className={"flex gap-2 m-btn w-full bg-slate-200"}>
        <GrPowerReset />
        <span>Đặt lại</span>
    </button>;

    return (
        <TransitionModal
            maxWidth={"max-w-sm"}
            isOpen={isOpen}
            onClose={onDismiss}
            closeOnOverlayClick={false}
        >
            <>
                <Modal.Header title={title} />
                <DayPicker
                    mode={"range"}
                    locale={vi}
                    defaultMonth={selected?.from}
                    modifiersClassNames={{
                        selected: DAY_PICKER_SELECTED,
                    }}
                    min={2}
                    fixedWeeks={true}
                    className={DAY_PICKER_CONTAINER}
                    selected={selected}
                    onSelect={setSelected}
                    footer={footer}
                />
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            onClick={onDismiss}
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Huỷ
                        </button>
                        <button
                            onClick={() => {
                                console.log(selected);
                                onClose(selected);
                            }}
                            className="m-btn bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Đồng ý
                        </button>
                    </div>
                </Modal.Footer>
            </>
        </TransitionModal>
    );
};

export default DateRangePickerModal;