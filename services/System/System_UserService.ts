import { AxiosInstance } from "axios";
import getAxiosClient from "../axiosClient";
import { IBaseListResponse } from "../../types/IBaseListResponse";

export class SystemUserService {
  private readonly axiosClient: AxiosInstance;

  constructor(accessToken?: string) {
    this.axiosClient = getAxiosClient(accessToken);
  }

  // getUsers = async (params?: any) => {
  //   const response = await this.axiosClient.get<IBaseListResponse<IUser>>(
  //     "/admin/users",
  //     {
  //       params,
  //     }
  //   );
  //   return response.data;
  // };
}
