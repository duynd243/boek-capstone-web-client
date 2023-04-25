import { useState } from "react";
import { DateRangePicker, DateRangePickerValue } from "@tremor/react";
import { enUS } from "date-fns/locale";

type Props = {}
const Datepicker: React.FC<Props> = ({}) => {
    const [value, setValue] = useState<DateRangePickerValue>([
        new Date(2023, 0, 1),
        new Date(),
      ]);
    return (
        <DateRangePicker
        className="max-w-md mx-auto"
        value={value}
        onValueChange={setValue}
        locale={enUS}
        dropdownPlaceholder="Select"
      />
    );
};

export default Datepicker;