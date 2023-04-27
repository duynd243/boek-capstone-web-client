import React, { useMemo, useState } from "react";
import useTableManagementPage from "./useTableManagementPage";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { OrderService } from "../services/OrderService";
import { Roles } from "../constants/Roles";

const useOrdersPage = ({
                           initStatusId,
                           orderType,
                       }: {
    initStatusId: number | undefined;
    orderType: number;
}) => {
    const { loginUser } = useAuth();
    const orderService = new OrderService(loginUser?.accessToken);
    const searchByOptions = [
        {
            value: "orderCode",
            label: "Tìm với Mã đơn hàng",
        },
        {
            value: "campaign",
            label: "Tìm với Tên hội sách",
        },
    ];
    const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>(initStatusId);
    const [searchBy, setSearchBy] = useState(searchByOptions[0].value);
    const {
        search,
        setSearch,
        setPage,
        page,
        size,
        onSizeChange,
        pageSizeOptions,

    } = useTableManagementPage();
    const queryParams = useMemo(() => {
        return {
            page,
            size,
            type: orderType,
            status: selectedStatusId,
            sort: "orderDate desc",
            "Campaign.Name": searchBy === "campaign" ? search : undefined,
            code: searchBy === "orderCode" ? search : undefined,
        };
    }, [page, size, orderType, selectedStatusId, searchBy, search]);


    const queryFn = function() {
        if (loginUser?.role === Roles.SYSTEM.id) {
            return orderService.getOrdersByAdmin(queryParams);
        } else if (loginUser?.role === Roles.ISSUER.id) {
            return orderService.getOrdersByIssuer(queryParams);
        }
        return Promise.reject();
    };

    const orderQuery = useQuery(["orders", queryParams],
        queryFn,
    );


    return {
        search,
        setSearch,
        searchBy,
        searchByOptions,
        setSearchBy,
        orderQuery,
        selectedStatusId,
        setSelectedStatusId,
        size,
        onSizeChange,
        pageSizeOptions,
        page,
        setPage,
    };
};

export default useOrdersPage;