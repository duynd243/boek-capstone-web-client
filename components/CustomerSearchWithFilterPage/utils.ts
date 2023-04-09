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

export function getSortedArray<T>(array: T[], sortKey: keyof T, idArray: any[]) {
    return array?.sort((a, b) => {
        if (idArray.includes(a[sortKey] as any) && !idArray.includes(b[sortKey] as any)) {
            return -1;
        }
        if (!idArray.includes(a[sortKey] as any) && idArray.includes(b[sortKey] as any)) {
            return 1;
        }
        return 0;
    });
}