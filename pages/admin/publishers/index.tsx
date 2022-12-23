import React, {Fragment, ReactElement, useEffect, useState} from "react";
import {NextPageWithLayout} from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import Image from "next/image";
import CreateButton from "../../../components/Admin/CreateButton";
import {useAuth} from "../../../context/AuthContext";
import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import {SystemPublisherService} from "../../../services/System/System_PublisherService";
import {IPublisher} from "../../../types/user/IPublisher";
import TableWrapper from "../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../components/Admin/Table/TableHeader";
import TableBody from "../../../components/Admin/Table/TableBody";
import {getAvatarFromName} from "../../../utils/helper";
import TableData from "../../../components/Admin/Table/TableData";
import TableFooter from "../../../components/Admin/Table/TableFooter";
import EmptyState, {EMPTY_STATE_TYPE} from "../../../components/EmptyState";

const AdminPublishersPage: NextPageWithLayout = () => {
  const { loginUser } = useAuth();

  const publisherService = new SystemPublisherService(loginUser?.accessToken);
  const pageSizeOptions = [5, 10, 20, 50];
  const [size, setSize] = useState<number>(pageSizeOptions[0]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const router = useRouter();
  const [selectedPublisher, setSelectedPublisher] = useState<IPublisher>(); // Author to be updated (passed to AuthorModal)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showUpdateModal, setShowUpdateModal] = useState<boolean>(false);
  const { data: publisherData, isLoading } = useQuery(
    ["publishers", page, size, search],
    () =>
      publisherService.getPublishers({
        page,
        size,
        name: search || undefined,
      }),
    {
      keepPreviousData: true,
    }
  );
  useEffect(() => {
    const search = router.query.search as string;
    setSearch(search);
    setPage(1); // Reset page to 1 when search changes
  }, [router.query.search]);

  if (isLoading) return <LoadingSpinnerWithOverlay />;

  return (
    <Fragment>
      <PageHeading label="Nhà xuất bản">
        <SearchForm defaultValue={search} />
        <CreateButton
          onClick={() => setShowCreateModal(true)}
          label="Thêm nhà xuất bản"
        />
      </PageHeading>
      {publisherData?.data && publisherData?.data?.length > 0 ? (
        <TableWrapper>
          <TableHeading>
            <TableHeader>Mã số</TableHeader>
            <TableHeader>Tên nhà xuất bản</TableHeader>
            <TableHeader>Địa chỉ & Điện thoại</TableHeader>
            <TableHeader>
              <span className="sr-only">Actions</span>
            </TableHeader>
          </TableHeading>
          <TableBody>
            {publisherData?.data?.map((publisher) => (
              <tr key={publisher?.id}>
                <TableData className="text-sm font-medium uppercase text-gray-500">
                  {publisher?.code}
                </TableData>
                <TableData>
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <Image
                        width={100}
                        height={100}
                        className="h-10 w-10 rounded-full"
                        src={getAvatarFromName(publisher?.name)}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {publisher?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {publisher?.email}
                      </div>
                    </div>
                  </div>
                </TableData>
                <TableData>
                  <div className="text-sm text-gray-900">
                    {publisher?.address}
                  </div>
                  <div className="text-sm text-gray-500">
                    {publisher?.phoneNumber}
                  </div>
                </TableData>
                <TableData className="text-right text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Chỉnh sửa
                  </button>
                </TableData>
              </tr>
            ))}
          </TableBody>
          <TableFooter
            colSpan={4}
            size={size}
            setSize={setSize}
            page={page}
            setPage={setPage}
            metadata={publisherData?.metadata}
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
    </Fragment>
  );
};

AdminPublishersPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminPublishersPage;
