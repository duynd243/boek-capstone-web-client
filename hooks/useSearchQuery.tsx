import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useSearchQuery(queryKey: string, onChange?: () => void) {
    const router = useRouter();
    const searchFromUrl = router.query[queryKey] as string;
    const [search, setSearch] = useState<string>(searchFromUrl || "");

    useEffect(() => {
        (async () => {
            if (router.isReady && searchFromUrl !== search) {
                await router.push(
                    {
                        pathname: router.pathname,
                        query: {
                            ...router.query,
                            [queryKey]: search,
                        },
                    },
                    undefined,
                    { shallow: true },
                );
            }
        })();
    }, [queryKey, router, search, searchFromUrl]);


    useEffect(() => {
        if (onChange && searchFromUrl !== search) {
            onChange();
        }
    }, [onChange, search, searchFromUrl]);

    return {
        search,
        setSearch,
    };
}

export default useSearchQuery;