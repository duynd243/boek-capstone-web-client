import React, {
    Fragment,
    ReactElement,
    useCallback,
    useEffect,
    useState,
} from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import Image from "next/image";
import { useAuth } from "../../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import { useRouter } from "next/router";
import AuthorModal, {
    AuthorModalMode,
} from "../../../components/Modal/AuthorModal";
import TableFooter from "../../../components/Admin/Table/TableFooter";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import TableData from "../../../components/Admin/Table/TableData";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import { getAvatarFromName } from "../../../utils/helper";
import LoadingTopPage from "../../../components/LoadingTopPage";
import { IAuthor } from "../../../types/Author/IAuthor";
import useSearchQuery from "../../../hooks/useSearchQuery";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { AuthorService } from "../../../services/AuthorService";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import { toast } from "react-hot-toast";

const AdminAuthorsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const authorService = new AuthorService(loginUser?.accessToken);
    const [selectedAuthor, setSelectedAuthor] = useState<IAuthor>();

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
        data: authorData,
        isLoading,
        isFetching,
    } = useQuery(
        ["authors", { search, page, size }],
        () =>
            authorService.getAuthors({
                page,
                size,
                name: search,
            }),
        {
            keepPreviousData: true,
        }
    );

    const deleteAuthorMutation = useMutation(
        (id: number) => authorService.deleteAuthor(id),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["authors"]);
            },
            onSettled: () => {
                setShowDeleteModal(false);
                setSelectedAuthor(undefined);
                setPage(1);
            },
        }
    );

    const handleDeleteAuthor = useCallback(async () => {
        if (selectedAuthor?.id) {
            await toast.promise(
                deleteAuthorMutation.mutateAsync(selectedAuthor.id),
                {
                    loading: "Đang xoá tác giả",
                    success: "Xoá tác giả thành công",
                    error: (err) => err?.message || "Xoá tác giả thất bại",
                }
            );
        }
    }, [deleteAuthorMutation, selectedAuthor?.id]);

    if (isLoading) return <LoadingSpinnerWithOverlay />;

    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <PageHeading label="Tác giả">
                <SearchForm
                    placeholder="Tìm kiếm tác giả"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm tác giả"
                />
            </PageHeading>

            {authorData?.data && authorData?.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Tên tác giả</TableHeader>
                        <TableHeader>Mô tả</TableHeader>
                        <TableHeader>
                            <span className="sr-only">Edit</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {authorData?.data?.map((author) => (
                            <tr key={author?.id}>
                                <TableData>
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <Image
                                                width={100}
                                                height={100}
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={author?.imageUrl || getAvatarFromName(
                                                    author?.name
                                                )}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {author?.name}
                                            </div>
                                        </div>
                                    </div>
                                </TableData>
                                <TableData>
                                    <div className="text-sm text-gray-900 truncate w-[400px]">
                                        {author?.description || "Chưa có mô tả"}
                                    </div>
                                </TableData>
                                <TableData className="space-x-4 text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedAuthor(author);
                                            setShowUpdateModal(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-700"
                                    >
                                        Chỉnh sửa
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedAuthor(author);
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
                        colSpan={3}
                        size={size}
                        onSizeChange={onSizeChange}
                        page={page}
                        onPageChange={(page) => setPage(page)}
                        totalPages={authorData?.metadata?.total || 0}
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

            <AuthorModal
                action={AuthorModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            {selectedAuthor && (
                <AuthorModal
                    action={AuthorModalMode.UPDATE}
                    author={selectedAuthor}
                    onClose={() => {
                        setShowUpdateModal(false);
                    }}
                    afterLeave={() => setSelectedAuthor(undefined)}
                    isOpen={showUpdateModal}
                />
            )}

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAuthor}
                title={`Xoá tác giả ${selectedAuthor?.name}`}
                content={"Bạn có chắc chắn muốn xoá tác giả này?"}
                confirmText={"Xoá"}
            />
        </Fragment>
    );
};

AdminAuthorsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminAuthorsPage;
