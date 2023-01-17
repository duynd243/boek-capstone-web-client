import React from "react";
import TableHeading from "../Admin/Table/TableHeading";
import TableHeader from "../Admin/Table/TableHeader";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import Image from "next/image";
import { getAvatarFromName } from "../../utils/helper";
import TableWrapper from "../Admin/Table/TableWrapper";
import { IOrganization } from "../../types/Organization/IOrganization";

type Props = {
  selectedOrganizations: IOrganization[];
  handleRemoveOrganization: (organization: IOrganization) => void;
};

const SelectOrganizationsTable: React.FC<Props> = ({
  selectedOrganizations,
  handleRemoveOrganization,
}) => {
  return (
    <TableWrapper>
      <TableHeading>
        <TableHeader>Tên tổ chức</TableHeader>
        <TableHeader>Địa chỉ & Điện thoại</TableHeader>
        <TableHeader>
          <span className="sr-only">Actions</span>
        </TableHeader>
      </TableHeading>
      <TableBody>
        {selectedOrganizations && selectedOrganizations?.length > 0 ? (
          selectedOrganizations?.map((org) => {
            return (
              <tr key={org?.id}>
                <TableData>
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        width={100}
                        height={100}
                        className="h-10 w-10 rounded-full object-cover"
                        src={org?.imageUrl || getAvatarFromName(org?.name)}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {org?.name}
                      </div>
                    </div>
                  </div>
                </TableData>
                <TableData>
                  <div className="text-sm text-gray-900">{org?.address}</div>
                  <div className="text-sm text-gray-500">{org?.phone}</div>
                </TableData>
                <TableData className="text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      handleRemoveOrganization(org);
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
              colSpan={6}
              textAlignment={"text-center"}
              className="text-sm font-medium uppercase leading-10 text-gray-500 "
            >
              Chưa có tổ chức nào được chọn
            </TableData>
          </tr>
        )}
      </TableBody>
    </TableWrapper>
  );
};

export default SelectOrganizationsTable;
