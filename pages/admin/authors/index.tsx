import React, {Fragment, ReactElement, useCallback, useEffect, useState} from "react";
import {NextPageWithLayout} from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import Image from "next/image";
import {useAuth} from "../../../context/AuthContext";
import {AuthorService} from "../../../old-services/AuthorService";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import {useRouter} from "next/router";
import AuthorModal, {
    AuthorModalMode,
} from "../../../components/Modal/AuthorModal";
import TableFooter from "../../../components/Admin/Table/TableFooter";
import EmptyState, {EMPTY_STATE_TYPE} from "../../../components/EmptyState";
import TableData from "../../../components/Admin/Table/TableData";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import {getAvatarFromName} from "../../../utils/helper";
import LoadingTopPage from "../../../components/LoadingTopPage";
import {IAuthor} from "../../../types/Author/IAuthor";
import useSearchQuery from "../../../hooks/useSearchQuery";

const AdminAuthorsPage: NextPageWithLayout = () => {
    const {loginUser} = useAuth();
    const authorService = new AuthorService(loginUser?.accessToken);
    const pageSizeOptions = [5, 10, 20, 50];
    const [size, setSize] = useState<number>(pageSizeOptions[0]);
    const [page, setPage] = useState<number>(1);
    const {search, setSearch} = useSearchQuery("search", () => setPage(1));
    const router = useRouter();
    const [selectedAuthor, setSelectedAuthor] = useState<IAuthor>(); // Author to be updated (passed to AuthorModal)
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
    const {
        data: authorData,
        isLoading,
        isFetching,
    } = useQuery(
        ["authors", {search, page, size}],
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
    const onSizeChange = useCallback(
        (newSize: number) => {
            setSize(newSize);
            setPage(1);
        },
        [],
    );

    if (isLoading) return <LoadingSpinnerWithOverlay/>;

    return (
        <Fragment>
            {isFetching && <LoadingTopPage/>}
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
                                                className="h-10 w-10 rounded-full"
                                                src={getAvatarFromName(author?.name)}
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
                                <TableData className="text-right text-sm font-medium">
                                    <button
                                        onClick={() => {
                                            setSelectedAuthor(author);
                                            setShowUpdateModal(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Chỉnh sửa
                                    </button>
                                </TableData>
                            </tr>
                        ))}
                    </TableBody>
                    <TableFooter
                        colSpan={2}
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
                        <EmptyState status={EMPTY_STATE_TYPE.NO_DATA}/>
                    )}
                </div>
            )}

            <AuthorModal
                action={AuthorModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            <AuthorModal
                action={AuthorModalMode.UPDATE}
                author={selectedAuthor}
                onClose={() => {
                    setShowUpdateModal(false);
                }}
                isOpen={showUpdateModal}
            />
        </Fragment>
    );
};

AdminAuthorsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminAuthorsPage;
