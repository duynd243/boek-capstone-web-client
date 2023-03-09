import React from "react";
import { Switch } from "@headlessui/react";

type Props = {
    isCheck: boolean;
    onChange: (value: boolean) => void;
};

const ToggleButton: React.FC<Props> = ({ isCheck, onChange }) => {
    return (
        <Switch
            checked={isCheck}
            onChange={onChange}
            className={`${
                isCheck ? "bg-green-500" : "bg-gray-200"
            } relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none`}
        >
            <span
                aria-hidden="true"
                className={`${
                    isCheck ? "translate-x-5" : "translate-x-0"
                } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </Switch>
    );
};

export default ToggleButton;
