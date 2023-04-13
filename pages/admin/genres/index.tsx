import React, { Fragment, ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import Link from "next/link";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableData from "../../../components/Admin/Table/TableData";
import CategoryModal, { CategoryModalMode } from "../../../components/Modal/CategoryModal";
import { IGenre } from "../../../types/Genre/IGenre";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { GenreService } from "../../../services/GenreService";
import LoadingTopPage from "../../../components/LoadingTopPage";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import TableRowSkeleton from "../../../components/Admin/Table/TableRowSkeleton";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import StatusCard from "../../../components/StatusCard";
import TableFooter from "../../../components/Admin/Table/TableFooter";


const AdminCategoriesPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const genreService = new GenreService(loginUser?.accessToken);
    const [selectedGenre, setSelectedGenre] = useState<IGenre>();

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
        data: genreData,
        isLoading,
        isFetching,
        isInitialLoading,
    } = useQuery(
        ["genres", { search, page, size }],
        () =>
            genreService.getGenres({
                name: search,
                page,
                size,
                isParentGenre: true,
                withBooks: false,
            }),
        {
            keepPreviousData: true,
        },
    );

    if (isLoading) return <LoadingSpinnerWithOverlay />;

    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <PageHeading label="Thể loại sách">
                <SearchForm />
                <CreateButton
                    label="Thêm thể loại"
                    onClick={() => setShowCreateModal(true)}
                />
            </PageHeading>
            <TableWrapper>
                <TableHeading>
                    <TableHeader>Tên thể loại</TableHeader>

                    <TableHeader textAlignment="text-center">
                        Trạng thái
                    </TableHeader>
                    <TableHeader>
                        <span className="sr-only">Edit</span>
                    </TableHeader>
                </TableHeading>
                <TableBody>
                    {isInitialLoading
                        ? new Array(8).fill(0).map((_, index) => (
                            <TableRowSkeleton numberOfColumns={3} key={index} />
                        ))
                        : genreData?.data && genreData?.data?.length > 0 ?
                            genreData?.data?.map((genre) => {

                                return (
                                    <tr key={genre?.id}>
                                        <TableData className="text-sm font-medium">
                                            {genre?.name}
                                        </TableData>
                                        <TableData textAlignment="text-center">
                                            {genre?.status ? (
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
                                        <TableData
                                            className="text-right text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                            <button
                                                onClick={() => {
                                                    setSelectedGenre(genre);
                                                    setShowUpdateModal(true);
                                                }}
                                            >
                                                Chỉnh sửa
                                            </button>
                                            <Link
                                                href={`/admin/genres/${genre.id}/child-genres`}
                                                className="block"
                                            >
                                                Xem
                                            </Link>
                                        </TableData>
                                    </tr>
                                );
                            })
                            : <td colSpan={3} className="py-12">
                                {search ? <EmptyState status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND} /> :
                                    <EmptyState status={EMPTY_STATE_TYPE.NO_DATA} />}
                            </td>
                    }
                </TableBody>
                {genreData?.data && genreData?.data?.length > 0 && <TableFooter
                    colSpan={10}
                    size={size}
                    onSizeChange={onSizeChange}
                    page={page}
                    onPageChange={setPage}
                    totalElements={genreData?.metadata?.total || 0}
                    pageSizeOptions={pageSizeOptions}
                />}
            </TableWrapper>

            <CategoryModal
                action={CategoryModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            <CategoryModal
                action={CategoryModalMode.UPDATE}
                category={selectedGenre}
                onClose={() => setShowUpdateModal(false)}
                isOpen={showUpdateModal}
            />
        </Fragment>
    );
};

AdminCategoriesPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCategoriesPage;
