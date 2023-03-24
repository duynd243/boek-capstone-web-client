
export interface IBasePaginationRequestParams {
    page?: number;
    size?: number;
    sort?: string;
}

export type IBaseRequestParams<T> = IBasePaginationRequestParams & Partial<T>;
