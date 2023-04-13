import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Fragment, ReactElement, useState } from "react";
import DefaultAvatar from "../../../assets/images/default-avatar.png";
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
import CustomerModal from "../../../components/Modal/CustomerModal";
import StatusCard from "../../../components/StatusCard";
import { Roles } from "../../../constants/Roles";
import { useAuth } from "../../../context/AuthContext";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { UserService } from "../../../services/UserService";
import { IUser } from "../../../types/User/IUser";
import { NextPageWithLayout } from "../../_app";

const AdminCustomersPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const userService = new UserService(loginUser?.accessToken);
    const [selectedCustomer, setSelectedCustomer] = useState<IUser | undefined>(
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
        setShowUpdateModal,
        showUpdateModal,
    } = useTableManagementPage();

    const {
        data: userData,
        isLoading,
        isFetching,
    } = useQuery(
        ["customers", { search, page, size }],
        () =>
            userService.getUsersByAdmin({
                name: search,
                page,
                size,
                role: Roles.CUSTOMER.id,
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
            <PageHeading label="Khách hàng">
                <SearchForm
                    placeholder="Tìm kiếm khách hàng"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
            </PageHeading>

            {userData?.data && userData.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Mã số</TableHeader>
                        <TableHeader>Tên khách hàng</TableHeader>
                        <TableHeader>Địa chỉ & Điện thoại</TableHeader>
                        <TableHeader textAlignment="text-center">
                            Cấp độ
                        </TableHeader>
                        <TableHeader textAlignment="text-center">
                            Trạng thái
                        </TableHeader>
                        <TableHeader>
                            <span className="sr-only">Edit</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {userData.data.map((customer, index) => {
                            return (
                                <tr key={customer?.id}>
                                    <TableData className="text-sm font-medium uppercase text-gray-500">
                                        {customer?.code}
                                    </TableData>
                                    <TableData>
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={
                                                        customer?.imageUrl ||
                                                        DefaultAvatar.src
                                                    }
                                                    alt={customer?.name || ""}
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {customer?.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {customer?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableData>
                                    <TableData>
                                        <div className="text-sm text-gray-900">
                                            {customer?.addressViewModel &&
                                            customer?.address
                                                ? customer?.address
                                                : "Chưa có thông tin địa chỉ"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {customer?.phone ||
                                                "Chưa có số điện thoại"}
                                        </div>
                                    </TableData>
                                    <TableData textAlignment="text-center">
                                        {/* <Medal medalType={randomLevel.medal} /> */}
                                        <div className="text-sm font-medium capitalize text-gray-700">
                                            {customer?.customer?.level?.name}
                                        </div>
                                    </TableData>
                                    <TableData textAlignment="text-center">
                                        {customer?.status ? (
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
                                                setSelectedCustomer(customer);
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
                        onPageChange={setPage}
                        totalElements={userData?.metadata?.total || 0}
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
            {selectedCustomer && (
                <CustomerModal
                    maxWidth="max-w-2xl"
                    customer={selectedCustomer}
                    onClose={() => setShowUpdateModal(false)}
                    afterLeave={() => setSelectedCustomer(undefined)}
                    isOpen={showUpdateModal}
                />
            )}
        </Fragment>
    );
};
AdminCustomersPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminCustomersPage;
