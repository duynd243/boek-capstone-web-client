import React, { Fragment, ReactElement, useState } from "react";
import { NextPageWithLayout } from "../../../../_app";
import AdminLayout from "../../../../../components/Layout/AdminLayout";
import PageHeading from "../../../../../components/Admin/PageHeading";
import SearchForm from "../../../../../components/Admin/SearchForm";
import CreateButton from "../../../../../components/Admin/CreateButton";
import TableHeading from "../../../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../../../components/Admin/Table/TableHeader";
import TableBody from "../../../../../components/Admin/Table/TableBody";
import TableRowSkeleton from "../../../../../components/Admin/Table/TableRowSkeleton";
import TableData from "../../../../../components/Admin/Table/TableData";
import StatusCard from "../../../../../components/StatusCard";
import Link from "next/link";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../../../components/EmptyState";
import TableFooter from "../../../../../components/Admin/Table/TableFooter";
import TableWrapper from "../../../../../components/Admin/Table/TableWrapper";
import { useAuth } from "../../../../../context/AuthContext";
import { GenreService } from "../../../../../services/GenreService";
import { IGenre } from "../../../../../types/Genre/IGenre";
import useTableManagementPage from "../../../../../hooks/useTableManagementPage";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinnerWithOverlay from "../../../../../components/LoadingSpinnerWithOverlay";
import { useRouter } from "next/router";

const AdminGenresPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { id: parentId } = router.query;
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
        data: parentGenre,
    } = useQuery(
        ["parent-genre", { parentId }],
        () =>
            genreService.getGenreById(Number(parentId)),
        {
            //keepPreviousData: true,
            enabled: !!parentId,
        },
    );

    const {
        data: genreData,
        isLoading,
        isFetching,
        isInitialLoading,
    } = useQuery(
        ["child-genres", { parentId, search, page, size }],
        () =>
            genreService.getGenres({
                name: search,
                page,
                size,
                isParentGenre: false,
                parentId: Number(parentId),
                withBooks: false,
            }),
        {
            //keepPreviousData: true,
            enabled: !!parentId,
        },
    );

    if (isLoading) return <LoadingSpinnerWithOverlay />;
    return (
        <Fragment>
            <PageHeading label={`Chủ đề thuộc ${parentGenre?.name}`}>
                <SearchForm />
                <CreateButton label={"Thêm chủ đề"} onClick={() => setShowCreateModal(true)} />
            </PageHeading>
            <TableWrapper>
                <TableHeading>
                    <TableHeader>Tên chủ đề</TableHeader>
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
        </Fragment>
    );
};
AdminGenresPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminGenresPage;
