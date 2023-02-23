import React, {useCallback, useState} from "react";
import TransitionModal from "./TransitionModal";
import {DayPicker, DayPickerBase} from "react-day-picker";
import Modal from "./Modal";
import {format} from "date-fns";
import {defaultInputClass} from "../Form";
import {vi} from "date-fns/locale";
import {DAY_PICKER_CONTAINER, DAY_PICKER_SELECTED} from "../../constants/TailwindClasses";

type Props = {
    title: string;
    minDate?: Date;
    maxDate?: Date;
    value?: Date;
    isOpen: boolean;
    onDismiss: () => void;
    onClose: (date: Date | undefined) => void;
} & DayPickerBase;

const DateTimePickerModal: React.FC<Props> = ({
                                                  onDismiss,
                                                  title,
                                                  minDate,
                                                  maxDate,
                                                  value,
                                                  isOpen,
                                                  onClose,
                                                  ...rest
                                              }) => {
    const [date, setDate] = useState<Date | undefined>(value);
    const [time, setTime] = useState<string>(
        value ? format(value, "HH:mm") : "00:00"
    );

    const handleClose = useCallback(() => {
        onClose?.(
            date && time
                ? new Date(`${format(date, "yyyy-MM-dd")}T${time}`)
                : undefined
        );
    }, [date, onClose, time]);

    const timePicker = (
        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
            <div className="font-medium text-slate-800">Chọn giờ</div>
            <input
                className={`${defaultInputClass} !w-fit !font-medium`}
                type={"time"}
                value={time}
                onChange={(e) => {
                    setTime(e.target.value || "00:00");
                }}
            />
        </div>
    );

    return (
        <TransitionModal
            maxWidth={"max-w-sm"}
            isOpen={isOpen}
            onClose={onDismiss}
            closeOnOverlayClick={false}
        >
            <>
                <Modal.Header title={title}/>
                <DayPicker
                    locale={vi}
                    defaultMonth={value}
                    modifiersClassNames={{
                        selected: DAY_PICKER_SELECTED,
                    }}
                    fixedWeeks={true}
                    className={DAY_PICKER_CONTAINER}
                    selected={date}
                    onDayClick={setDate}
                    footer={timePicker}
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
                            onClick={handleClose}
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

export default DateTimePickerModal;
