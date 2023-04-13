import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Fragment, ReactElement, useState } from "react";
import DefaultAvatar from "../../../assets/images/default-avatar.png";
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
import IssuerModal, { IssuerModalMode } from "../../../components/Modal/IssuerModal";
import StatusCard from "../../../components/StatusCard";
import { Roles } from "../../../constants/Roles";
import { useAuth } from "../../../context/AuthContext";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { UserService } from "../../../services/UserService";
import { IUser } from "../../../types/User/IUser";
import { isValidImageSrc } from "../../../utils/helper";
import { NextPageWithLayout } from "../../_app";

const AdminIssuersPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const userService = new UserService(loginUser?.accessToken);
    const [selectedIssuer, setSelectedIssuer] = useState<IUser | undefined>(
        undefined,
    );

    const {
        search,
        setSearch,
        page,
        size,
        onSizeChange,
        pageSizeOptions,
        setPage,
        showCreateModal,
        setShowCreateModal,
        setShowUpdateModal,
        showUpdateModal,
    } = useTableManagementPage();

    const {
        data: issuerData,
        isLoading,
        isFetching,
    } = useQuery(
        ["issuers", { search, page, size }],
        () =>
            userService.getUsersByAdmin({
                name: search,
                page,
                size,
                role: Roles.ISSUER.id,
                withAddressDetail: true,
            }),
        {
            keepPreviousData: true,
        },
    );

    if (isLoading) return <LoadingSpinnerWithOverlay />;

    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <PageHeading label="Nhà phát hành">
                <SearchForm
                    placeholder="Tìm kiếm nhà phát hành"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm NPH"
                />
            </PageHeading>
            {issuerData?.data && issuerData.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Mã số</TableHeader>
                        <TableHeader>Tên nhà phát hành</TableHeader>
                        <TableHeader>Địa chỉ & Điện thoại</TableHeader>
                        <TableHeader>Mô tả</TableHeader>
                        <TableHeader textAlignment="text-center">
                            Trạng thái
                        </TableHeader>
                        <TableHeader>
                            <span className="sr-only">Edit</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {issuerData?.data?.map((issuer) => {
                            return (
                                <tr key={issuer?.id}>
                                    <TableData className="text-sm font-medium uppercase text-gray-500">
                                        {issuer?.code}
                                    </TableData>
                                    <TableData>
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={
                                                        issuer?.imageUrl &&
                                                        isValidImageSrc(
                                                            issuer?.imageUrl,
                                                        )
                                                            ? issuer?.imageUrl
                                                            : DefaultAvatar.src
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {issuer?.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {issuer?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableData>
                                    <TableData>
                                        <div className="text-sm text-gray-900 w-72 truncate">
                                            {issuer?.addressViewModel &&
                                            issuer?.address
                                                ? issuer?.address
                                                : "Chưa có thông tin địa chỉ"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {issuer?.phone ||
                                                "Chưa có số điện thoại"}
                                        </div>
                                    </TableData>

                                    <TableData>
                                        <span className="text-sm font-medium uppercase text-gray-500">
                                            {issuer?.issuer?.description || "-"}
                                        </span>
                                    </TableData>
                                    <TableData textAlignment="text-center">
                                        {issuer?.status ? (
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
                                                setSelectedIssuer(issuer);
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
                        colSpan={6}
                        size={size}
                        onSizeChange={onSizeChange}
                        page={page}
                        onPageChange={(page) => setPage(page)}
                        totalElements={issuerData?.metadata?.total || 0}
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

            <IssuerModal
                action={IssuerModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            {selectedIssuer && (
                <IssuerModal
                    maxWidth="max-w-2xl"
                    action={IssuerModalMode.UPDATE}
                    issuer={selectedIssuer}
                    onClose={() => setShowUpdateModal(false)}
                    afterLeave={() => setSelectedIssuer(undefined)}
                    isOpen={showUpdateModal}
                />
            )}
        </Fragment>
    );
};
AdminIssuersPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminIssuersPage;
