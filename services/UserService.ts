import {ILoginData} from "../types/User/ILoginData";
import {IBaseStatusResponse} from "../types/Commons/IBaseStatusResponse";
import {BaseService} from "./BaseService";
import {IUser} from "../types/User/IUser";
import {IBaseListResponse} from "../types/Commons/IBaseListResponse";

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

    getUsersByAdmin = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IUser>>("/admin/users", {
            params,
        });
        return response.data;
    }
}
