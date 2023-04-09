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

    const [selectedStatusId, setSelectedStatusId] = useState<number | undefined>(initStatusId);
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
            "Campaign.Name": search,

        };
    }, [page, size, orderType, selectedStatusId, search]);


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