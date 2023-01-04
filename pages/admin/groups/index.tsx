import React, {Fragment, ReactElement, useState} from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../_app";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import {faker} from "@faker-js/faker/locale/vi";
import TableData from "../../../components/Admin/Table/TableData";
import Image from "next/image";
import {getAvatarFromName} from "../../../utils/helper";
import GroupModal, {
    GroupModalMode,
} from "../../../components/Modal/GroupModal";
import ConfirmModal from "../../../components/Modal/ConfirmModal";

const AdminGroupsPage: NextPageWithLayout = () => {
    const [selectedGroup, setSelectedGroup] = useState<{
        code?: string;
        name?: string;
    }>();
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    return (
        <Fragment>
            <PageHeading label="Nhóm">
                <SearchForm defaultValue={""}/>
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm nhóm"
                />
            </PageHeading>
            <TableWrapper>
                <TableHeading>
                    <TableHeader>Mã số</TableHeader>
                    <TableHeader>Tên nhóm</TableHeader>
                    <TableHeader>
                        <span className="sr-only">Actions</span>
                    </TableHeader>
                </TableHeading>
                <TableBody>
                    {new Array(8).fill(1).map((org, index) => {
                        const randomName = faker.company.name();
                        const fakeGroup = {
                            code: `G${faker.datatype.number()}`,
                            name: randomName,
                        };
                        return (
                            <tr key={faker.datatype.uuid()}>
                                <TableData className="text-sm font-medium uppercase text-gray-500">
                                    {fakeGroup.code}
                                </TableData>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full"
                                                src={getAvatarFromName(fakeGroup.name)}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {randomName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {faker.company.companySuffix()}
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData className="space-x-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedGroup(fakeGroup);
                                            setShowUpdateModal(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedGroup(fakeGroup);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-rose-600 hover:text-rose-700"
                                    >
                                        Xoá
                                    </button>
                                </TableData>
                            </tr>
                        );
                    })}
                </TableBody>
            </TableWrapper>
            <GroupModal
                action={GroupModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            <GroupModal
                action={GroupModalMode.UPDATE}
                group={selectedGroup}
                onClose={() => setShowUpdateModal(false)}
                isOpen={showUpdateModal}
            />

            <ConfirmModal isOpen={showDeleteModal}
                          onClose={() => setShowDeleteModal(false)}
                          onConfirm={() => setShowDeleteModal(false)}
                          title={`Xoá nhóm ${selectedGroup?.name}`}
                          content={'Bạn có chắc chắn muốn xoá nhóm này?'}
                          confirmText={'Xoá'}
            />
        </Fragment>
    );
};
AdminGroupsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminGroupsPage;
