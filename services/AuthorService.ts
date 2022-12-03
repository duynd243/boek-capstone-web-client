import { AxiosInstance } from "axios";
import getAxiosClient from "./axiosClient";
import { IBaseListResponse } from "../types/IBaseListResponse";

export class AuthorService {
  private readonly axiosClient: AxiosInstance;

  constructor(accessToken?: string) {
    this.axiosClient = getAxiosClient(accessToken);
  }

  getAuthors = async (params?: any) => {
    const response = await this.axiosClient.get<
      IBaseListResponse<{
        id?: number;
        name?: string;
      }>
    >("/authors", {
      params,
    });
    return response.data;
  };
}
