import React from "react";
import SelectBox from "../SelectBox";

type Props = {
    hideResult: boolean;
    showingListLength: number;
    totalListLength: number;
    value: { name: string, value: string };
    sortOptions: { name: string, value: string }[];
    onSortChange: (value: { name: string, value: string }) => void;
    itemName?: string;
}

const SortPanel: React.FC<Props> = ({
                                        value,
                                        sortOptions,
                                        hideResult,
                                        showingListLength,
                                        totalListLength,
                                        onSortChange,
                                        itemName = "kết quả"
                                    }) => {
    return (
        <div
            className="flex flex-wrap gap-3 items-center justify-between border p-4 bg-white rounded shadow-sm">
            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-700">
                                    Sắp xếp theo
                                </span>
                <SelectBox<typeof sortOptions[number]>
                    searchable={false}
                    placeholder={"Chọn"}
                    value={value}
                    onValueChange={onSortChange}
                    dataSource={sortOptions}
                    displayKey={"name"}
                />
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