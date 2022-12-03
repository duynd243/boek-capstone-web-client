import { AxiosInstance } from "axios";
import getAxiosClient from "./axiosClient";
import { IBaseStatusResponse } from "../types/IBaseStatusResponse";
import { ILoginUser } from "../types/ILoginUser";

export class UserService {
  private readonly axiosClient: AxiosInstance;

  constructor(accessToken?: string) {
    this.axiosClient = getAxiosClient(accessToken);
  }

  loginWithFirebaseIdToken = async (idToken: string) => {
    const response = await this.axiosClient.post<{
      status: IBaseStatusResponse;
      data: ILoginUser;
    }>("/login", {
      idToken,
    });
    return response.data;
  };
}
