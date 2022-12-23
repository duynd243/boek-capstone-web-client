export interface IPaginationMetaData {
  page: number;
  size: number;
  total: number;
}

export interface IBaseListResponse<T> {
  metadata: IPaginationMetaData;
  data: T[];
}
