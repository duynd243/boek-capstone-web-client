import { useCallback } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { Roles } from "../../constants/Roles";
import { UserService } from "../../services/UserService";

export default function useCustomerSearchWithFilterPage(
    setPage: (page: number) => void,
) {
    const userService = new UserService();
    const router = useRouter();
    const onParamsChange = useCallback(
        async (queryKey: string, value: undefined | string | number | string[] | number[]) => {
            await router.push({
                pathname: router.pathname,
                query: {
                    ...router.query,
                    [queryKey]: value,
                },
            });
            setPage(1);
        },
        [router, setPage],
    );

    const {
        data: issuers,
    } = useQuery(["issuers"],
        () => userService.getAllUsers({
            role: Roles.ISSUER.id,
        }),
    );
    return {
        onParamsChange,
        issuers,
    };
}