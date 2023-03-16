import { IBaseRequestParams } from "./../types/Request/IBaseRequestParams";
import { ILoginData } from "../types/User/ILoginData";
import { IBaseStatusResponse } from "../types/Commons/IBaseStatusResponse";
import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IUser } from './../types/User/IUser';

export type UpdateUserParams = Required<Pick<IUser, 'id' | 'role'>> & Partial<IUser>;
export type CreateUserParams = Omit<UpdateUserParams, 'id'>;

export class UserService extends BaseService {
    // common
    loginWithFirebaseIdToken = async (idToken: string) => {
        const response = await this.axiosClient.post<{
            status: IBaseStatusResponse;
            data: ILoginData;
        }>("/login", {
            idToken,
        });
        return response.data;
    };


    getLoggedInUser = async () => {
        const response = await this.axiosClient.get<IUser| {id: string, description?: string, user: IUser}>("/users/me");
        return response.data;
    };

    // admin
    getUsersByAdmin = async (
        params?: IBaseRequestParams<IUser> & { withAddressDetail?: boolean }
    ) => {
        const response = await this.axiosClient.get<IBaseListResponse<IUser>>(
            "/admin/users",
            {
                params,
            }
        );
        return response.data;
    };

    updateUserByAdmin = async (user: IUser) => {
        const response = await this.axiosClient.put<IUser>(
            `/admin/users`,
            user
        );
        return response.data;
    };

    createUserByAdmin = async (user: CreateUserParams) => {
        const response = await this.axiosClient.post<IUser>(
            `/admin/users`,
            user
        );
        return response.data;
    };
    updateProfileByIssuer = async (payload: {
        description?: string,
        user: UpdateUserParams,
    }) => {
        const response = await this.axiosClient.put<any>(
            `/users/issuer`,
            payload
        );
        return response.data;
    }
}