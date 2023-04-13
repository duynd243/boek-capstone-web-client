import { Tab } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Fragment, ReactElement, useState } from "react";
import { BsFillBriefcaseFill, BsShieldFillCheck } from "react-icons/bs";
import DefaultAvatar from "../../../assets/images/default-avatar.png";
import Chip from "../../../components/Admin/Chip";
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
import PersonnelModal, { PersonnelModalMode } from "../../../components/Modal/PersonnelModal";
import StatusCard from "../../../components/StatusCard";
import { Roles } from "../../../constants/Roles";
import { useAuth } from "../../../context/AuthContext";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { UserService } from "../../../services/UserService";
import { IUser } from "../../../types/User/IUser";
import { NextPageWithLayout } from "../../_app";

const PersonnelTabs = [
    // {
    //     id: 1,
    //     name: "Tất cả",
    //     icon: <BsListUl />,
    //     roleId: null,
    // },
    {
        id: 2,
        name: "Quản trị viên",
        icon: <BsShieldFillCheck />,
        roleId: Roles.SYSTEM.id,
    },
    {
        id: 3,
        name: "Nhân viên",
        icon: <BsFillBriefcaseFill />,
        roleId: Roles.STAFF.id,
    },
];

const AdminPersonnelsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const userService = new UserService(loginUser?.accessToken);
    const [selectedPersonnel, setSelectedPersonnel] = useState<IUser>();
    const [selectedTab, setSelectedTab] = useState(PersonnelTabs[0]);

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
        data: userData,
        isLoading,
        isFetching,
    } = useQuery(
        [
            "personnels",
            { search, page, size, role: selectedTab.roleId || undefined },
        ],
        () =>
            userService.getUsersByAdmin({
                name: search,
                page,
                size,
                role: selectedTab.roleId || undefined,
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
            <PageHeading label="Nhân sự">
                <SearchForm
                    placeholder="Tìm kiếm nhân sự"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
                <CreateButton
                    onClick={() => setShowCreateModal(true)}
                    label="Thêm nhân sự"
                />
            </PageHeading>
            <Tab.Group>
                <div className="mb-5">
                    <ul className="flex flex-wrap gap-2">
                        {PersonnelTabs.map((tab) => (
                            <Tab
                                onClick={() => {
                                    setSelectedTab(tab);
                                    setPage(1);
                                }}
                                as={"div"}
                                className={"focus:outline-none"}
                                key={tab.name}
                            >
                                {({ selected }) => {
                                    return (
                                        <Chip active={selected}>
                                            <div
                                                className="flex
                                                items-center gap-2
                                                 px-1.5 py-1"
                                            >
                                                {tab?.icon}
                                                {tab.name}
                                            </div>
                                        </Chip>
                                    );
                                }}
                            </Tab>
                        ))}
                    </ul>
                </div>
            </Tab.Group>
            {userData?.data && userData.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Mã số</TableHeader>
                        <TableHeader>Tên nhân sự</TableHeader>
                        <TableHeader>Địa chỉ & Điện thoại</TableHeader>
                        <TableHeader textAlignment="text-center">
                            Vai trò
                        </TableHeader>
                        <TableHeader textAlignment="text-center">
                            Trạng thái
                        </TableHeader>
                        <TableHeader>
                            <span className="sr-only">Edit</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {userData?.data.map((person) => {
                            return (
                                <tr key={person?.id}>
                                    <TableData className="text-sm font-medium uppercase text-gray-500">
                                        {person?.code}
                                    </TableData>
                                    <TableData>
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <Image
                                                    width={100}
                                                    height={100}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                    src={
                                                        person?.imageUrl ||
                                                        DefaultAvatar.src
                                                    }
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div
                                                    className="text-sm font-medium flex items-center gap-2 text-gray-900">
                                                    {person?.id ===
                                                        loginUser?.id && (
                                                            <div
                                                                className="text-white text-xs font-medium px-3.5 py-1 rounded-sm bg-indigo-500 uppercase">
                                                                Bạn
                                                            </div>
                                                        )}
                                                    {person?.name}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {person?.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableData>
                                    <TableData>
                                        <div className="text-sm text-gray-900">
                                            {person?.addressViewModel &&
                                            person?.address
                                                ? person?.address
                                                : "Chưa có thông tin địa chỉ"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {person?.phone ||
                                                "Chưa có số điện thoại"}
                                        </div>
                                    </TableData>

                                    <TableData textAlignment="text-center">
                                        <span
                                            className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase leading-5 text-slate-600">
                                            {person?.role ===
                                                Roles.SYSTEM.id && (
                                                    <>
                                                        <BsShieldFillCheck />
                                                        Quản trị viên
                                                    </>
                                                )}

                                            {person?.role ===
                                                Roles.STAFF.id && (
                                                    <>
                                                        <BsFillBriefcaseFill />
                                                        Nhân viên
                                                    </>
                                                )}
                                        </span>
                                    </TableData>
                                    <TableData textAlignment="text-center">
                                        {person?.status ? (
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
                                        {person?.id === loginUser?.id ? (
                                            <Link
                                                className="text-indigo-600 hover:text-indigo-700"
                                                href={"settings/profile"}
                                            >
                                                Chỉnh sửa
                                            </Link>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setSelectedPersonnel(
                                                        person,
                                                    );
                                                    setShowUpdateModal(true);
                                                }}
                                                className="text-indigo-600 hover:text-indigo-700"
                                            >
                                                Chỉnh sửa
                                            </button>
                                        )}
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
            <PersonnelModal
                maxWidth="max-w-2xl"
                action={PersonnelModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            {selectedPersonnel && (
                <PersonnelModal
                    maxWidth="max-w-2xl"
                    action={PersonnelModalMode.UPDATE}
                    personnel={selectedPersonnel}
                    onClose={() => setShowUpdateModal(false)}
                    afterLeave={() => setSelectedPersonnel(undefined)}
                    isOpen={showUpdateModal}
                />
            )}
        </Fragment>
    );
};
AdminPersonnelsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminPersonnelsPage;
