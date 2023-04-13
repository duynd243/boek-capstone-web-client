import { useRouter } from "next/router";
import { useCallback } from "react";
import { getStringArrayFromQueryKey } from "../utils/query-helper";

function useSearchQuery(queryKey: string,
                        onChange?: () => void) {
    const router = useRouter();
    const searchFromQuery = getStringArrayFromQueryKey(router.query[queryKey])[0] || "";
    const onSearchChange = useCallback(
        async (value: undefined | string | number | string[] | number[]) => {
            await router.push({
                pathname: router.pathname,
                query: {
                    ...router.query,
                    [queryKey]: value,
                },
            });
            if (onChange) {
                onChange();
            }
        },
        [onChange, queryKey, router],
    );
    return {
        searchFromQuery,
        onSearchChange,
    };
}

export default useSearchQuery;