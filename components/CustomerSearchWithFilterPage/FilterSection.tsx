import React from "react";
import { Disclosure, Transition } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

type Props = {
    defaultOpen?: boolean;
    label: string;
    children: React.ReactNode;
    count?: number;
}

const FilterSection: React.FC<Props> = (
    {
        defaultOpen = false,
        label,
        children,
        count,
    },
) => {
    return <Disclosure defaultOpen={defaultOpen}>
        <>
            <Disclosure.Button
                className="flex gap-1 items-center justify-between w-full px-4 py-3 text-sm font-medium text-left text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                <div className={"flex items-center justify-between grow"}>
                    <span>{label}</span>

                    <span
                        className={`text-white shrink-0 bg-blue-500 rounded-full py-1 px-3 text-xs font-medium ml-1.5 ${(count && count > 0) ? "visible" : "invisible"}`}>
                        {count}
                    </span>
                </div>
                <FiChevronDown
                    className={`ui-open:transform ui-open:rotate-180 w-4 h-4 text-gray-500`}
                />
            </Disclosure.Button>

            <Transition
                enter="transition duration-300 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Disclosure.Panel className="mt-4 px-1">
                    {children}
                </Disclosure.Panel>
            </Transition>
        </>
    </Disclosure>;
};

export default FilterSection;