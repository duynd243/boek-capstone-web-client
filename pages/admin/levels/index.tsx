import React, {Fragment, ReactElement, useCallback, useState} from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../_app";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import CreateButton from "../../../components/Admin/CreateButton";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import TableData from "../../../components/Admin/Table/TableData";
import {customerLevels} from "../customers";
import {faker} from "@faker-js/faker/locale/vi";
import LevelModal, {LevelModalMode,} from "../../../components/Modal/LevelModal";
import {useAuth} from "../../../context/AuthContext";
import useSearchQuery from "../../../hooks/useSearchQuery";
import {LevelService} from "../../../services/LevelService";
import {ILevel} from "../../../types/Level/ILevel";
import {useQuery} from "@tanstack/react-query";

const AdminLevelsPage: NextPageWithLayout = () => {
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

    const {loginUser} = useAuth();
    const [page, setPage] = useState<number>(1);
    const {search, setSearch} = useSearchQuery("search", () => setPage(1));
    const levelService = new LevelService(loginUser?.accessToken);
    const pageSizeOptions = [5, 10, 20, 50];
    const [size, setSize] = useState<number>(pageSizeOptions[0]);
    const [selectedLevel, setSelectedLevel] = useState<ILevel>();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const onSizeChange = useCallback((newSize: number) => {
        setSize(newSize);
        setPage(1);
    }, []);

    const {
        data: levelData,
        isLoading,
        isFetching,
    } = useQuery(
        ["levels", {search, page, size}],
        () =>
            levelService.getLevels({
                name: search,
                page,
                size,
            }),
        {
            keepPreviousData: true,
        }
    );

    return (
        <Fragment>
            <PageHeading label="Cấp độ khách hàng">
                <SearchForm/>
                <CreateButton
                    label="Thêm cấp độ"
                    onClick={() => setShowCreateModal(true)}
                />
            </PageHeading>
            <TableWrapper>
                <TableHeading>
                    <TableHeader>Tên cấp độ</TableHeader>
                    <TableHeader textAlignment="text-center">Số lượng điểm</TableHeader>
                    <TableHeader textAlignment="text-center">Trạng thái</TableHeader>
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
                            <TableData textAlignment="text-center" className="text-sm">
                                {level?.conditionalPoint}
                            </TableData>
                            <TableData textAlignment="text-center">
                                {level?.status ? (
                                    <span
                                        className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
                    Hoạt động
                  </span>
                                ) : (
                                    <span
                                        className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold uppercase leading-5 text-red-800">
                    Bị vô hiệu hóa
                  </span>
                                )}
                            </TableData>
                            <TableData className="text-right text-sm font-medium text-indigo-600 hover:text-indigo-900">
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
            </TableWrapper>

            <LevelModal
                action={LevelModalMode.CREATE}
                onClose={() => setShowCreateModal(false)}
                isOpen={showCreateModal}
            />

            <LevelModal
                action={LevelModalMode.UPDATE}
                level={selectedLevel}
                onClose={() => setShowUpdateModal(false)}
                isOpen={showUpdateModal}
            />
        </Fragment>
    );
};

AdminLevelsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AdminLevelsPage;
