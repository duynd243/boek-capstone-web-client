export const getStringArrayFromQueryKey = (queryKey: string | string[] | undefined) => {
    if (Array.isArray(queryKey)) {
        return queryKey;
    }
    if (typeof queryKey === "string") {
        return [queryKey];
    }
    return [];
};
export const getNumberArrayFromQueryKey = (queryKey: string | string[] | undefined) => {
    return getStringArrayFromQueryKey(queryKey).filter((x) => !isNaN(Number(x))
        && x !== "").map((x) => Number(x));
};