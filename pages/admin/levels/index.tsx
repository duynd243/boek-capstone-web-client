import React, {Fragment, ReactElement, useState} from 'react'
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
import LevelModal, {LevelModalMode} from "../../../components/Modal/LevelModal";

const AdminLevelsPage: NextPageWithLayout = () => {
    const [selectedLevel, setSelectedLevel] = useState<typeof customerLevels[0]>();
    const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
    const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);

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
                    {customerLevels.map((level) => (
                        <tr key={level.id}>
                            <TableData className="text-sm font-medium">
                                {level.name}
                            </TableData>
                            <TableData textAlignment="text-center" className="text-sm">
                                {level.requiredPoint}
                            </TableData>
                            <TableData textAlignment="text-center">
                                {faker.datatype.boolean() ? (
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
}

AdminLevelsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AdminLevelsPage