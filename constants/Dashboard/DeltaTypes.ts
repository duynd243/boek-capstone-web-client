export const DeltaTypes = {
    Increase: {
        id: 1,
        name: "Tăng",
        deltaType: "increase"
    },
    Decrease: {
        id: 2,
        name: "Giảm",
        deltaType: "decrease"
    },
    Unchanged: {
        id: 3,
        name: "Bằng",
        deltaType: "unchanged"
    },
} as const;

export function getDeltaTypeById(id: number | null) {
    return Object.values(DeltaTypes).find((item) => item.id === id);
}