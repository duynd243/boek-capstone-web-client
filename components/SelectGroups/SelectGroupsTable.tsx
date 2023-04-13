import React from "react";
import TableHeading from "../Admin/Table/TableHeading";
import TableHeader from "../Admin/Table/TableHeader";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import Image from "next/image";
import { getAvatarFromName } from "../../utils/helper";
import TableWrapper from "../Admin/Table/TableWrapper";
import { IGroup } from "../../types/Group/IGroup";

type Props = {
    selectedGroups: IGroup[];
    handleRemoveGroup: (group: IGroup) => void;
};

const SelectGroupsTable: React.FC<Props> = ({
                                                selectedGroups,
                                                handleRemoveGroup,
                                            }) => {


    return (
        <TableWrapper>
            <TableHeading>
                <TableHeader>Tên nhóm</TableHeader>
                <TableHeader>Mô tả</TableHeader>
                <TableHeader>
                    <span className="sr-only">Actions</span>
                </TableHeader>
            </TableHeading>
            <TableBody>
                {selectedGroups && selectedGroups?.length > 0 ? (
                    selectedGroups?.map((group, index) => {
                        return (
                            <tr key={group?.id}>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={getAvatarFromName(group?.name)}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {group?.name}
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData>
                                    <div className="text-sm text-gray-900">
                                        {group?.description}
                                    </div>
                                </TableData>

                                <TableData className="text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            handleRemoveGroup(group);
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
                            Chưa có nhóm nào được chọn
                        </TableData>
                    </tr>
                )}
            </TableBody>
        </TableWrapper>
    );
};

export default SelectGroupsTable;
