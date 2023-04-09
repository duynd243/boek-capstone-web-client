import React, { Fragment, ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import useOrdersPage from "../../../hooks/useOrdersPage";
import { OrderTypes } from "../../../constants/OrderTypes";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import OrderTable from "../../../components/OrderPage/OrderTable";
import { DeliveryOrderTabs } from "../../../constants/OrderStatuses";
import OrderTabs from "../../../components/OrderPage/OrderTabs";

const AdminDeliveryOrdersPage: NextPageWithLayout = () => {
    const {
        search,
        setSearch,
        orderQuery,
        selectedStatusId,
        setSelectedStatusId,
        size,
        onSizeChange,
        pageSizeOptions,
        page,
        setPage,
    } = useOrdersPage({
        initStatusId: DeliveryOrderTabs[0].id,
        orderType: OrderTypes.DELIVERY.id,
    });

    const { data: orderData, isInitialLoading } = orderQuery;


    return (
        <Fragment>
            <PageHeading label="Đơn giao hàng">
                <SearchForm
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
            </PageHeading>
            <OrderTabs tabs={DeliveryOrderTabs}
                       orderData={orderData}
                       onStatusChange={statusId => setSelectedStatusId(statusId)}
                       isInitialLoading={isInitialLoading} />

            <OrderTable
                isInitialLoading={isInitialLoading}
                orderData={orderData}
                search={search}
                setSearch={setSearch}
                pageSizeOptions={pageSizeOptions}
                page={page}
                setPage={setPage}
                size={size}
                onSizeChange={onSizeChange} />
        </Fragment>
    );
};

AdminDeliveryOrdersPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AdminDeliveryOrdersPage;