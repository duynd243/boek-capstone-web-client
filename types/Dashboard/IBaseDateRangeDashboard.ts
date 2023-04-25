
export interface ITimeLine {
    id: number
    title: string
    type: number
    startDate: string
    endDate: string
    timeLength: number
    seasonType: number  
    year: number
}

export interface IBaseDateRangeDashboard<T> {
    total: number;
    models: {
        timeLine: ITimeLine;
        total: number;
        status: number;
        data: T[];
    }[];
}
