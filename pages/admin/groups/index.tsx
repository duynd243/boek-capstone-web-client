import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Fragment, ReactElement, useState } from "react";
import CreateButton from "../../../components/Admin/CreateButton";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableData from "../../../components/Admin/Table/TableData";
import TableFooter from "../../../components/Admin/Table/TableFooter";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import AdminLayout from "../../../components/Layout/AdminLayout";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import LoadingTopPage from "../../../components/LoadingTopPage";
import GroupModal, {
    GroupModalMode,
} from "../../../components/Modal/GroupModal";
import StatusCard from "../../../components/StatusCard";
import { useAuth } from "../../../context/AuthContext";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { GroupService } from "../../../services/GroupService";
import { IGroup } from "../../../types/Group/IGroup";
import { getAvatarFromName } from "../../../utils/helper";
import { NextPageWithLayout } from "../../_app";

const AdminGroupsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const [selectedGroup, setSelectedGroup] = useState<IGroup | undefined>(
        undefined
    );

    const groupService = new GroupService(loginUser?.accessToken);

    const {
        search,
        setSearch,
        page,
        size,
        onSizeChange,
        pageSizeOptions,
        setPage,
        setShowCreateModal,
        showCreateModal,
        setShowUpdateModal,
        showUpdateModal,
    } = useTableManagementPage();

    const {
        data: groupData,
        isLoading,
        isFetching,
    } = useQuery(
        ["groups", { search, page, size }],
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

    if (isLoading) return <LoadingSpinnerWithOverlay />;
    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <PageHeading label="Nhóm">
                <SearchForm
                    placeholder="Tìm kiếm nhóm"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm nhóm"
                />
            </PageHeading>

            {groupData?.data && groupData?.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Tên nhóm</TableHeader>
                        <TableHeader>Mô tả</TableHeader>
                        <TableHeader textAlignment="text-center">
                            Trạng thái
                        </TableHeader>
                        <TableHeader>
                            <span className="sr-only">Actions</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {groupData?.data?.map((group) => {
                            return (
                                <tr key={group?.id}>
                                    <TableData>
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={getAvatarFromName(
                                                        group.name
                                                    )}
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

                                    <TableData textAlignment="text-center">
                                        {group?.status ? (
                                            <StatusCard
                                                label="Hoạt động"
                                                variant="success"
                                            />
                                        ) : (
                                            <StatusCard
                                                label="Bị vô hiệu hóa"
                                                variant="error"
                                            />
                                        )}
                                    </TableData>
                                    <TableData className="text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedGroup(group);
                                                setShowUpdateModal(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-700"
                                        >
                                            Chỉnh sửa
                                        </button>
                                    </TableData>
                                </tr>
                            );
                        })}
                    </TableBody>
                    <TableFooter
                        colSpan={4}
                        size={size}
                        onSizeChange={onSizeChange}
                        page={page}
                        onPageChange={setPage}
                        totalPages={groupData?.metadata?.total || 0}
                        pageSizeOptions={pageSizeOptions}
                    />
                </TableWrapper>
            ) : (
                <div className="pt-8">
                    {search ? (
                        <EmptyState
                            keyword={search}
                            status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                        />
                    ) : (
                        <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />
                    )}
                </div>
            )}
            <GroupModal
                action={GroupModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            {selectedGroup && (
                <GroupModal
                    action={GroupModalMode.UPDATE}
                    group={selectedGroup}
                    onClose={() => setShowUpdateModal(false)}
                    afterLeave={() => setSelectedGroup(undefined)}
                    isOpen={showUpdateModal}
                />
            )}
        </Fragment>
    );
};
AdminGroupsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminGroupsPage;
