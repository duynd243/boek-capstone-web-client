import React, { Fragment, useState } from "react";
import { defaultInputClass } from "../Form";
import { HiCheckCircle } from "react-icons/hi2";
import { Combobox, Transition } from "@headlessui/react";
import { BiChevronDown } from "react-icons/bi";

type Props<T> = {
    placeholder: string;
    value: T | null;
    onValueChange: (value: T) => void;
    dataSource: T[] | undefined;
    displayKey: keyof T;
    searchable?: boolean;
};

const MultipleSelectBox = <T extends Record<string, any>>({
                                                              placeholder,
                                                              value,
                                                              onValueChange,
                                                              dataSource,
                                                              displayKey,
                                                              searchable = true,
                                                          }: Props<T>) => {
    const [search, setSearch] = useState("");

    const searchedOptions = dataSource?.filter((option) => {
        return option?.[displayKey].toLowerCase().includes(search.toLowerCase());
    });

    return (
        <Combobox value={value} onChange={onValueChange}>
            <div className="relative">
                <Combobox.Button>
                    <Combobox.Input
                        readOnly={!searchable}
                        placeholder={placeholder}
                        className={`${defaultInputClass} ${searchable ? "" : "cursor-pointer pointer-events-none"} truncate`}
                        displayValue={(value: T) => value?.[displayKey] ?? ""}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <BiChevronDown
                            className="h-5 w-5 text-gray-400 transition duration-200 ui-open:rotate-180"
                            aria-hidden="true"
                        />
                    </div>
                </Combobox.Button>

                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                    afterLeave={() => setSearch("")}
                >
                    <Combobox.Options
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        {searchedOptions && searchedOptions?.length > 0 ? (
                            searchedOptions.map((option, index) => (
                                <Combobox.Option
                                    className="relative cursor-default select-none rounded py-2 px-4 text-gray-700 ui-selected:font-medium ui-selected:text-gray-900 ui-active:bg-indigo-600 ui-active:text-white"
                                    key={index}
                                    value={option}
                                >
                                    {({ selected }) => (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm">{option?.[displayKey]}</span>
                                            {selected && (
                                                <HiCheckCircle
                                                    className="fill-indigo-600 text-lg ui-active:fill-white" />
                                            )}
                                        </div>
                                    )}
                                </Combobox.Option>
                            ))
                        ) : (
                            <div className="py-1 text-center text-sm text-gray-400">
                                Không có kết quả
                            </div>
                        )}
                    </Combobox.Options>
                </Transition>
            </div>
        </Combobox>
    );
};

export default MultipleSelectBox;
