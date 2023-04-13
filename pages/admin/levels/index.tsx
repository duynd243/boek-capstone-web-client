import { useQuery } from "@tanstack/react-query";
import { Fragment, ReactElement, useState } from "react";
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
import LevelModal, { LevelModalMode } from "../../../components/Modal/LevelModal";
import StatusCard from "../../../components/StatusCard";
import { useAuth } from "../../../context/AuthContext";
import useTableManagementPage from "../../../hooks/useTableManagementPage";
import { LevelService } from "../../../services/LevelService";
import { ILevel } from "../../../types/Level/ILevel";
import { NextPageWithLayout } from "../../_app";

const AdminLevelsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const levelService = new LevelService(loginUser?.accessToken);
    const [selectedLevel, setSelectedLevel] = useState<ILevel | undefined>(
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
        setShowCreateModal,
        showCreateModal,
        setShowUpdateModal,
        showUpdateModal,
    } = useTableManagementPage();

    const {
        data: levelData,
        isLoading,
        isFetching,
    } = useQuery(
        ["levels", { search, page, size }],
        () =>
            levelService.getLevels({
                name: search,
                page,
                size,
                withCustomers: false,
            }),
        {
            keepPreviousData: true,
        },
    );
    if (isLoading) return <LoadingSpinnerWithOverlay />;
    return (
        <Fragment>
            {isFetching && <LoadingTopPage />}
            <PageHeading label="Cấp độ khách hàng">
                <SearchForm
                    placeholder="Tìm kiếm cấp độ"
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
                <CreateButton
                    label="Thêm cấp độ"
                    onClick={() => setShowCreateModal(true)}
                />
            </PageHeading>
            {levelData?.data && levelData?.data?.length > 0 ? (
                <TableWrapper>
                    <TableHeading>
                        <TableHeader>Tên cấp độ</TableHeader>
                        <TableHeader textAlignment="text-center">
                            Số lượng điểm
                        </TableHeader>
                        <TableHeader textAlignment="text-center">
                            Trạng thái
                        </TableHeader>
                        <TableHeader>
                            <span className="sr-only">Edit</span>
                        </TableHeader>
                    </TableHeading>
                    <TableBody>
                        {levelData?.data?.map((level) => (
                            <tr key={level.id}>
                                <TableData className="text-sm font-medium">
                                    {level?.name}
                                </TableData>
                                <TableData
                                    textAlignment="text-center"
                                    className="text-sm"
                                >
                                    {level?.conditionalPoint}
                                </TableData>
                                <TableData textAlignment="text-center">
                                    {level?.status ? (
                                        <StatusCard
                                            variant="success"
                                            label="Hoạt động"
                                        />
                                    ) : (
                                        <StatusCard
                                            variant="error"
                                            label="Bị vô hiệu hóa"
                                        />
                                    )}
                                </TableData>
                                <TableData
                                    className="text-right text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                    <button
                                        onClick={() => {
                                            setSelectedLevel(level);
                                            setShowUpdateModal(true);
                                        }}
                                    >
                                        Chỉnh sửa
                                    </button>
                                </TableData>
                            </tr>
                        ))}
                    </TableBody>
                    <TableFooter
                        colSpan={4}
                        size={size}
                        onSizeChange={onSizeChange}
                        page={page}
                        onPageChange={(page) => setPage(page)}
                        totalElements={levelData?.metadata?.total || 0}
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

            <LevelModal
                action={LevelModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            {selectedLevel && (
                <LevelModal
                    action={LevelModalMode.UPDATE}
                    level={selectedLevel}
                    onClose={() => setShowUpdateModal(false)}
                    afterLeave={() => setSelectedLevel(undefined)}
                    isOpen={showUpdateModal}
                />
            )}
        </Fragment>
    );
};

AdminLevelsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AdminLevelsPage;
