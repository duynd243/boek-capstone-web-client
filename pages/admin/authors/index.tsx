import React, {Fragment, ReactElement, useEffect, useState} from "react";
import {NextPageWithLayout} from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import Image from "next/image";
import {useAuth} from "../../../context/AuthContext";
import {AuthorService} from "../../../services/AuthorService";
import {useQuery} from "@tanstack/react-query";
import DefaultAvatar from "../../../assets/images/default-avatar.png";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import {useRouter} from "next/router";
import AuthorModal, {AuthorModalMode,} from "../../../components/Modal/AuthorModal";
import TableFooter from "../../../components/Admin/TableFooter";

const AdminAuthorsPage: NextPageWithLayout = () => {
    const {loginUser} = useAuth();
    const authorService = new AuthorService(loginUser?.accessToken);
    const pageSizeOptions = [5, 10, 20, 50];
    const [size, setSize] = useState(pageSizeOptions[0]);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState<string>("");
    const router = useRouter();
    const [selectedAuthor, setSelectedAuthor] = useState<{
        id?: number;
        name?: string;
    }>(); // Author to be updated (passed to AuthorModal)
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

    useEffect(() => {
        setSearch(router.query.search as string);
    }, [router.query.search]);

    const {data: authorData, isLoading} = useQuery(
        ["authors", page, size, search],
        () =>
            authorService.getAuthors({
                page,
                size,
                name: search || undefined,
            }),
        {
            keepPreviousData: true,
        }
    );

    if (isLoading) return <LoadingSpinnerWithOverlay/>;

    return (
        <Fragment>
            <PageHeading label="Tác giả">
                <SearchForm defaultValue={search}/>
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm tác giả"
                />
            </PageHeading>
            {authorData?.data && authorData?.data?.length > 0 ? (
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="overflow-hidden border border-slate-200 shadow sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-slate-100 text-xs">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="px-6 py-6 text-left font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            Tên tác giả
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Edit</span>
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                    {authorData?.data?.map((author) => (
                                        <tr key={author?.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            className="h-10 w-10 rounded-full"
                                                            src={DefaultAvatar.src}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {author?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                <button
                                                    onClick={() => {
                                                        setSelectedAuthor(author);
                                                        setShowUpdateModal(true);
                                                    }}
                                                    className="text-indigo-600 hover:text-indigo-900"
                                                >
                                                    Chỉnh sửa
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>

                                    <TableFooter size={size}
                                                 setSize={setSize}
                                                 page={page}
                                                 setPage={setPage}
                                                 total={authorData?.metadata?.total || 0}
                                                 pageSizeOptions={pageSizeOptions}/>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Ko có</div>
            )}

            <AuthorModal
                action={AuthorModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            <AuthorModal
                action={AuthorModalMode.UPDATE}
                author={selectedAuthor as { id?: number; name?: string }}
                onClose={() => setShowUpdateModal(false)}
                isOpen={showUpdateModal}
            />
        </Fragment>
    );
};

AdminAuthorsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminAuthorsPage;
