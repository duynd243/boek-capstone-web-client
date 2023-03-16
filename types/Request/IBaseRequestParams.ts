
export interface IBasePaginationRequestParams {
    page?: number;
    size?: number;
}

export type IBaseRequestParams<T> = IBasePaginationRequestParams & Partial<T>;
