import Image from "next/image";
import React from "react";
import { ILevel } from "../../types/Level/ILevel";
import { getAvatarFromName } from "../../utils/helper";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import TableHeader from "../Admin/Table/TableHeader";
import TableHeading from "../Admin/Table/TableHeading";
import TableWrapper from "../Admin/Table/TableWrapper";

type Props = {
    selectedLevels: ILevel[];
    handleRemoveLevel: (level: ILevel) => void;
};

const SelectLevelsTable: React.FC<Props> = ({
    selectedLevels,
    handleRemoveLevel,
}) => {
    return (
        <TableWrapper>
            <TableHeading>
                <TableHeader>Tên cấp độ</TableHeader>
                <TableHeader>Điểm yêu cầu</TableHeader>
                <TableHeader>
                    <span className="sr-only">Actions</span>
                </TableHeader>
            </TableHeading>
            <TableBody>
                {selectedLevels && selectedLevels?.length > 0 ? (
                    selectedLevels?.map((level, index) => {
                        return (
                            <tr key={level?.id}>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={getAvatarFromName(
                                                    level?.name,
                                                    1
                                                )}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {level?.name}
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData>
                                    <div className="text-sm text-gray-900">
                                        {level?.conditionalPoint}
                                    </div>
                                </TableData>

                                <TableData className="text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            handleRemoveLevel(level);
                                        }}
                                        className="text-rose-600 hover:text-rose-800"
                                    >
                                        Xoá
                                    </button>
                                </TableData>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <TableData
                            colSpan={3}
                            textAlignment={"text-center"}
                            className="text-sm font-medium uppercase leading-10 text-gray-500 "
                        >
                            Chưa có cấp độ nào được chọn
                        </TableData>
                    </tr>
                )}
            </TableBody>
        </TableWrapper>
    );
};

export default SelectLevelsTable;
