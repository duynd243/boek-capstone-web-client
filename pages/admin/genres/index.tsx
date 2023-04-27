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
import { IGenre } from "../../../types/Genre/IGenre";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import { GenreService } from "../../../services/GenreService";
import LoadingTopPage from "../../../components/LoadingTopPage";
import TableRowSkeleton from "../../../components/Admin/Table/TableRowSkeleton";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../components/EmptyState";
import StatusCard from "../../../components/StatusCard";
import TableFooter from "../../../components/Admin/Table/TableFooter";
import Image from "next/image";
import { getAvatarFromName } from "../../../utils/helper";
import GenreModal, { GenreModalMode } from "../../../components/Modal/GenreModal";
import Breadcrumbs from "../../../components/Breadcrumbs";


const AdminGenresPage: NextPageWithLayout = () => {
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
    );

    return (
        <Fragment>
            {isInitialLoading && <LoadingTopPage />}
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
                                            className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                            <div className={"flex space-x-2.5 justify-end"}>
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
                                            </div>
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
                action={GenreModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            {selectedGenre && (
                <GenreModal
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
