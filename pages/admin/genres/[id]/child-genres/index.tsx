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
import GenreModal, { GenreModalMode } from "../../../../../components/Modal/GenreModal";
import Image from "next/image";
import { getAvatarFromName } from "../../../../../utils/helper";

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
            <PageHeading label={`Thể loại thuộc ${parentGenre?.name}`}>
                <SearchForm />
                <CreateButton label={"Thêm thể loại"} onClick={() => setShowCreateModal(true)} />
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
                                        <TableData>
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0">
                                                    <Image
                                                        width={100}
                                                        height={100}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        src={getAvatarFromName(
                                                            genre?.name,
                                                        )}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {genre?.name}
                                                    </div>
                                                </div>
                                            </div>
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

            <GenreModal
                title={`Thêm thể loại con cho ${parentGenre?.name}`}
                action={GenreModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                parentId={Number(parentId)}
                isOpen={showCreateModal}
            />

            {selectedGenre && (
                <GenreModal
                    parentId={Number(parentId)}
                    action={GenreModalMode.UPDATE}
                    genre={selectedGenre}
                    onClose={() => {
                        setShowUpdateModal(false);
                    }}
                    afterLeave={() => setSelectedGenre(undefined)}
                    isOpen={showUpdateModal}
                />
            )}
        </Fragment>
    );
};
AdminGenresPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminGenresPage;
