import React, { Fragment, ReactElement } from "react";
import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import PageHeading from "../../../components/Admin/PageHeading";
import SearchForm from "../../../components/Admin/SearchForm";
import useOrdersPage from "../../../hooks/useOrdersPage";
import { PickupOrderTabs } from "../../../constants/OrderStatuses";
import { OrderTypes } from "../../../constants/OrderTypes";
import OrderTable from "../../../components/OrderPage/OrderTable";
import OrderTabs from "../../../components/OrderPage/OrderTabs";
import { Dropdown, DropdownItem } from "@tremor/react";


const AdminPickupOrdersPage: NextPageWithLayout = () => {
    const {
       search,
        setSearch,
        orderQuery,
        searchBy,
        setSearchBy,
        searchByOptions,
        setSelectedStatusId,
        size,
        onSizeChange,
        pageSizeOptions,
        page,
        setPage,
    } = useOrdersPage({
        initStatusId: PickupOrderTabs[0].id,
        orderType: OrderTypes.PICKUP.id,
    });

    const { data: orderData, isInitialLoading } = orderQuery;


    return (
        <Fragment>
            <PageHeading label="Đơn tại quầy">
                <Dropdown
                    onValueChange={(value) => {
                        setSearchBy(value);
                    }}
                    value={searchBy} placeholder={"Tìm kiếm theo"}>
                    {searchByOptions.map((option, index) => (
                        <DropdownItem key={index} value={option.value} text={option.label}/>
                    ))}
                </Dropdown>
                <SearchForm
                    value={search}
                    onSearchSubmit={(value) => setSearch(value)}
                />
            </PageHeading>

            <OrderTabs tabs={PickupOrderTabs}
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

AdminPickupOrdersPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AdminPickupOrdersPage;