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