import React from "react";
import { Dropdown, DropdownItem } from "@tremor/react";

type Props = {
    hideResult: boolean;
    showingListLength: number;
    totalListLength: number;
    value: string;
    sortOptions: { name: string, value: string }[];
    onSortChange: (value: string) => void;
    itemName?: string;
}

const SortPanel: React.FC<Props> = ({
                                        value,
                                        sortOptions,
                                        hideResult,
                                        showingListLength,
                                        totalListLength,
                                        onSortChange,
                                        itemName = "kết quả",
                                    }) => {
    return (
        <div
            className="flex flex-wrap gap-3 items-center justify-between border p-4 bg-white rounded shadow-sm">
            <div className="flex items-center gap-2">
                                <span className="text-sm shrink-0 text-gray-700">
                                    Sắp xếp theo
                                </span>

                <Dropdown
                    value={value}
                    onValueChange={onSortChange}
                >
                    {sortOptions?.map((option) => (
                        <DropdownItem

                            value={option.value} key={option.value}
                            text={option.name}
                        />
                    ))}
                </Dropdown>
            </div>

            {!hideResult &&
                <div className={"text-sm text-gray-700"}>
                    Đang hiển thị <span
                    className={"font-medium"}>{showingListLength}/{totalListLength}</span> {itemName}
                </div>
            }
        </div>
    );
};

export default SortPanel;