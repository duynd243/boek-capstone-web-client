import { ILoginData } from "../types/User/ILoginData";
import { IBaseStatusResponse } from "../types/Commons/IBaseStatusResponse";
import { BaseService } from "./BaseService";

export class UserService extends BaseService {
  loginWithFirebaseIdToken = async (idToken: string) => {
    const response = await this.axiosClient.post<{
      status: IBaseStatusResponse;
      data: ILoginData;
    }>("/login", {
      idToken,
    });
    return response.data;
  };
}
