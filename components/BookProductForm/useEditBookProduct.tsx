import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { BookProductService } from "./../../services/BookProductService";
import { useRouter } from "next/router";

const useEditBookProduct = () => {

    const { loginUser } = useAuth();
    const router = useRouter();
    const queryClient = useQueryClient();
    const bookProductService = new BookProductService(loginUser?.accessToken);
    const editBasicInfoMutation = useMutation((payload: any) => bookProductService.updateBasicInfoBookProductByIssuer(payload), {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["issuer_product"]);
            await router.push(`/issuer/products`);
        },
    });

    return {
        editBasicInfoMutation,
    };
};

export default useEditBookProduct;