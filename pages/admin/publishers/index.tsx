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
import PublisherModal, { PublisherModalMode } from "../../../components/Modal/PublisherModal";
import { useAuth } from "../../../context/AuthContext";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { PublisherService } from "../../../services/PublisherService";
import { IPublisher } from "../../../types/Publisher/IPublisher";
import { getAvatarFromName } from "../../../utils/helper";
import { NextPageWithLayout } from "../../_app";

const AdminPublishersPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const [selectedPublisher, setSelectedPublisher] = useState<IPublisher>();
    const publisherService = new PublisherService(loginUser?.accessToken);
    const queryClient = useQueryClient();

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
        setShowDeleteModal,
        showDeleteModal,
    } = useTableManagementPage();

    const {
        data: publisherData,
        isLoading,
        isFetching,
    } = useQuery(
        ["publishers", { search, page, size }],
        () =>
            publisherService.getPublishers({
                name: search,
                page,
                size,
            }),
        {
            keepPreviousData: true,
        },
    );

    const deletePublisherMutation = useMutation(
        (id: number) => publisherService.deletePublisher(id),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["publishers"]);
            },
            onSettled: () => {
                setShowDeleteModal(false);
                setSelectedPublisher(undefined);
                setPage(1);
            },
        },
    );

    const handleDeletePublisher = useCallback(async () => {
        if (selectedPublisher?.id) {
            await toast.promise(
                deletePublisherMutation.mutateAsync(selectedPublisher.id),
                {
                    loading: "Đang xoá nhà xuất bản",
                    success: "Xoá nhà xuất bản thành công",
                    error: (err) => err?.message || "Xoá nhà xuất bản thất bại",
                },
            );
        }
    }, [deletePublisherMutation, selectedPublisher?.id]);

    if (isLoading) return <LoadingSpinnerWithOverlay />;

    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <PageHeading label="Nhà xuất bản">
                <SearchForm
                    placeholder="Tìm kiếm nhà xuất bản"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm NXB"
                />
            </PageHeading>
            {publisherData?.data && publisherData?.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Mã số</TableHeader>
                        <TableHeader>Tên nhà xuất bản</TableHeader>
                        <TableHeader>Địa chỉ & Điện thoại</TableHeader>
                        <TableHeader>
                            <span className="sr-only">Actions</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {publisherData?.data?.map((publisher) => (
                            <tr key={publisher?.id}>
                                <TableData className="text-sm font-medium uppercase text-gray-500">
                                    {publisher?.code}
                                </TableData>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={publisher?.imageUrl || getAvatarFromName(publisher?.name)}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {publisher?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {publisher?.email}
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData>
                                    <div className="text-sm text-gray-900">
                                        {publisher?.address}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {publisher?.phone}
                                    </div>
                                </TableData>
                                <TableData className="space-x-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedPublisher(publisher);
                                            setShowUpdateModal(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-700"
                                    >
                                        Chỉnh sửa
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedPublisher(publisher);
                                            setShowDeleteModal(true);
                                        }}
                                        className="text-rose-600 hover:text-rose-700"
                                    >
                                        Xoá
                                    </button>
                                </TableData>
                            </tr>
                        ))}
                    </TableBody>
                    <TableFooter
                        colSpan={4}
                        size={size}
                        onPageChange={setPage}
                        page={page}
                        totalElements={publisherData?.metadata?.total || 0}
                        onSizeChange={onSizeChange}
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

            <PublisherModal
                action={PublisherModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            {selectedPublisher && (
                <PublisherModal
                    action={PublisherModalMode.UPDATE}
                    publisher={selectedPublisher}
                    onClose={() => setShowUpdateModal(false)}
                    afterLeave={() => setSelectedPublisher(undefined)}
                    isOpen={showUpdateModal}
                />
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeletePublisher}
                title={`Xoá nhà xuất bản ${selectedPublisher?.name}`}
                content={"Bạn có chắc chắn muốn xoá nhà xuất bản này?"}
                confirmText={"Xoá"}
            />
        </Fragment>
    );
};

AdminPublishersPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminPublishersPage;
