import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { Fragment, ReactElement, useCallback, useState } from "react";
import { toast } from "react-hot-toast";
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
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import OrganizationModal, { OrganizationModalMode } from "../../../components/Modal/OrganizationModal";
import { useAuth } from "../../../context/AuthContext";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { OrganizationService } from "../../../services/OrganizationService";
import { IOrganization } from "../../../types/Organization/IOrganization";
import { getAvatarFromName } from "../../../utils/helper";
import { NextPageWithLayout } from "../../_app";

const AdminOrganizationsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const orgService = new OrganizationService(loginUser?.accessToken);
    const [selectedOrg, setSelectedOrg] = useState<IOrganization>();

    const {
        search,
        setSearch,
        page,
        size,
        onSizeChange,
        pageSizeOptions,
        setPage,
        showDeleteModal,
        setShowDeleteModal,
        setShowCreateModal,
        setShowUpdateModal,
        showCreateModal,
        showUpdateModal,
    } = useTableManagementPage();

    const queryClient = useQueryClient();
    const deleteOrganizationMutation = useMutation(
        (id: number) => orgService.deleteOrganization(id),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["organizations"]);
            },
            onSettled: () => {
                setShowDeleteModal(false);
            },
        },
    );

    const {
        data: orgData,
        isLoading,
        isFetching,
    } = useQuery(
        ["organizations", { search, page, size }],
        () =>
            orgService.getOrganizations({
                name: search,
                page,
                size,
            }),
        {
            keepPreviousData: true,
        },
    );

    const handleDeleteOrganization = useCallback(async () => {
        if (selectedOrg?.id) {
            await toast.promise(
                deleteOrganizationMutation.mutateAsync(selectedOrg?.id),
                {
                    loading: "Đang xoá tổ chức",
                    success: "Xoá tổ chức thành công",
                    error: (err) => err?.message || "Xoá tổ chức thất bại",
                },
            );
        }
    }, [deleteOrganizationMutation, selectedOrg?.id]);

    if (isLoading) return <LoadingSpinnerWithOverlay />;

    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <PageHeading label="Tổ chức">
                <SearchForm
                    placeholder="Tìm kiếm tổ chức"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm tổ chức"
                />
            </PageHeading>

            {orgData?.data && orgData?.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Tên tổ chức</TableHeader>
                        <TableHeader>Địa chỉ & Điện thoại</TableHeader>
                        <TableHeader>
                            <span className="sr-only">Actions</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {orgData?.data?.map((org) => {
                            return (
                                <tr key={org?.id}>
                                    <TableData>
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={
                                                        org?.imageUrl ||
                                                        getAvatarFromName(
                                                            org?.name,
                                                        )
                                                    }
                                                    alt={org?.name || ""}
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
                                        <div className="text-sm text-gray-900">
                                            {org?.address}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {org?.phone}
                                        </div>
                                    </TableData>
                                    <TableData className="space-x-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setSelectedOrg(org);
                                                setShowUpdateModal(true);
                                            }}
                                            className="text-indigo-600 hover:text-indigo-700"
                                        >
                                            Chỉnh sửa
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedOrg(org);
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
                    <TableFooter
                        colSpan={3}
                        size={size}
                        onSizeChange={onSizeChange}
                        page={page}
                        onPageChange={setPage}
                        totalElements={orgData?.metadata?.total || 0}
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

            <OrganizationModal
                action={OrganizationModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                afterLeave={() => setSelectedOrg(undefined)}
                isOpen={showCreateModal}
            />

            {selectedOrg && (
                <OrganizationModal
                    action={OrganizationModalMode.UPDATE}
                    organization={selectedOrg}
                    onClose={() => setShowUpdateModal(false)}
                    afterLeave={() => setSelectedOrg(undefined)}
                    isOpen={showUpdateModal}
                />
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteOrganization}
                title={`Xoá tổ chức ${selectedOrg?.name}`}
                content={"Bạn có chắc chắn muốn xoá tổ chức này?"}
                confirmText={"Xoá"}
            />
        </Fragment>
    );
};
AdminOrganizationsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminOrganizationsPage;
