import React, {Fragment, ReactElement, useCallback, useState} from "react";
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
import {useAuth} from "../../../context/AuthContext";
import useSearchQuery from "../../../hooks/useSearchQuery";
import {LevelService} from "../../../services/LevelService";
import {ILevel} from "../../../types/Level/ILevel";
import {IGroup} from "../../../types/Group/IGroup";
import {GroupService} from "../../../services/GroupService";
import {useQuery} from "@tanstack/react-query";

const AdminGroupsPage: NextPageWithLayout = () => {
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

    const {loginUser} = useAuth();
    const [page, setPage] = useState<number>(1);
    const {search, setSearch} = useSearchQuery("search", () => setPage(1));
    const groupService = new GroupService(loginUser?.accessToken);
    const pageSizeOptions = [5, 10, 20, 50];
    const [size, setSize] = useState<number>(pageSizeOptions[0]);
    const [selectedGroup, setSelectedGroup] = useState<IGroup>();


    const onSizeChange = useCallback((newSize: number) => {
        setSize(newSize);
        setPage(1);
    }, []);

    const {
        data: groupData,
        isLoading,
        isFetching,
    } = useQuery(
        ["groups", {search, page, size}],
        () =>
            groupService.getGroups({
                name: search,
                page,
                size,
            }),
        {
            keepPreviousData: true,
        }
    );
    return (
        <Fragment>
            <PageHeading label="Nhóm">
                <SearchForm/>
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm nhóm"
                />
            </PageHeading>
            <TableWrapper>
                <TableHeading>
                    <TableHeader>Tên nhóm</TableHeader>
                    <TableHeader>Mô tả</TableHeader>
                    <TableHeader>
                        <span className="sr-only">Actions</span>
                    </TableHeader>
                </TableHeading>
                <TableBody>
                    {groupData?.data?.map((group, index) => {
                        const randomName = faker.company.name();
                        const fakeGroup = {
                            code: `G${faker.datatype.number()}`,
                            name: randomName,
                        };
                        return (
                            <tr key={faker.datatype.uuid()}>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full"
                                                src={getAvatarFromName(group.name)}
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
                                <TableData className="space-x-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedGroup(group);
                                            setShowUpdateModal(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Chỉnh sửa
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedGroup(group);
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

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => setShowDeleteModal(false)}
                title={`Xoá nhóm ${selectedGroup?.name}`}
                content={"Bạn có chắc chắn muốn xoá nhóm này?"}
                confirmText={"Xoá"}
            />
        </Fragment>
    );
};
AdminGroupsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminGroupsPage;
