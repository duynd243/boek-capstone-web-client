import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useSearchQuery(queryKey: string, onChange?: () => void) {
    const router = useRouter();
    const searchFromUrl = router.query[queryKey] as string;
    const [search, setSearch] = useState<string>(searchFromUrl || "");

    useEffect(() => {
        (async () => {
            if (searchFromUrl !== search) {
                await router.push(
                    {
                        pathname: router.pathname,
                        query: {
                            ...router.query,
                            [queryKey]: search,
                        },
                    },
                    undefined,
                    { shallow: true }
                );
                if (onChange) {
                    onChange();
                }
            }
        })();
    }, [onChange, queryKey, router, search, searchFromUrl]);

    return {
        search,
        setSearch,
    };
}

export default useSearchQuery;