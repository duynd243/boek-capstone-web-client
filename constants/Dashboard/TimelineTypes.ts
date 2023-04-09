export const TimelineTypes = {
    Day: {
        id: 1,
        name: "Ngày",
        currentName: "Hôm nay",
    },

    Week: {
        id: 2,
        name: "Tuần",
        currentName: "Tuần này",
    },

    Month: {
        id: 3,
        name: "Tháng",
        currentName: "Tháng này",
    },

    Season: {
        id: 4,
        name: "Quý",
        currentName: "Quý này",
    },

    Year: {
        id: 5,
        name: "Năm",
        currentName: "Năm nay",
    },
} as const;