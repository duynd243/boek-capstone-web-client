import { AxiosInstance } from "axios";
import getAxiosClient from "../axiosClient";

export class SystemAuthorService {
  private readonly axiosClient: AxiosInstance;

  constructor(accessToken?: string) {
    this.axiosClient = getAxiosClient(accessToken);
  }

  updateAuthor = async (params?: any) => {
    const response = await this.axiosClient.put<{
      id?: number;
      name?: string;
    }>("/admin/authors", params);
    return response.data;
  };
}
