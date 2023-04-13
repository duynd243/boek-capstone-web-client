import { IBaseRequestParams } from "../types/Request/IBaseRequestParams";
import { ILoginData } from "../types/User/ILoginData";
import { IBaseStatusResponse } from "../types/Commons/IBaseStatusResponse";
import { BaseService } from "./BaseService";
import { ICustomer, IUser } from "../types/User/IUser";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";

export type UpdateUserParams = Required<Pick<IUser, "id" | "role">> &
    Partial<IUser>;
export type CreateUserParams = Omit<UpdateUserParams, "id">;
export type GetUsersParams = IBaseRequestParams<IUser> & {
    withAddressDetail?: boolean;
}

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
        const response = await this.axiosClient.get<IUser>("/users/me");
        return response.data;
    };

    // admin
    getUsersByAdmin = async (
        params?: IBaseRequestParams<IUser> & { withAddressDetail?: boolean },
    ) => {
        const response = await this.axiosClient.get<IBaseListResponse<IUser>>(
            "/admin/users",
            {
                params,
            },
        );
        return response.data;
    };

    updateUserByAdmin = async (user: IUser) => {
        const response = await this.axiosClient.put<IUser>(
            `/admin/users`,
            user,
        );
        return response.data;
    };

    createUserByAdmin = async (user: CreateUserParams) => {
        const response = await this.axiosClient.post<IUser>(
            `/admin/users`,
            user,
        );
        return response.data;
    };

    updateProfileByIssuer = async (payload: {
        description?: string;
        user: UpdateUserParams;
    }) => {
        const response = await this.axiosClient.put<any>(
            `/users/issuer`,
            payload,
        );
        return response.data;
    };


    getProfileByCustomer = async () => {
        const response = await this.axiosClient.get<ICustomer>(
            `/users/me`,
        );
        return response.data;
    };

    updateProfileByCustomer = async (payload: any) => {
        const response = await this.axiosClient.put<any>(
            `/users/customer`,
            payload,
        );
        return response.data;
    };


    getUsers = async (
        params?: GetUsersParams,
    ) => {
        const response = await this.axiosClient.get<IBaseListResponse<IUser>>(
            "/users",
            {
                params,
            },
        );
        return response.data;
    };

    getAllUsers = async (
        params?: GetUsersParams,
    ): Promise<IUser[]> => {
        const response = await this.getUsers(params);
        const { data, metadata: { total } } = response;
        if (data.length < total) {
            const newResponse = await this.axiosClient.get<IBaseListResponse<IUser>>(
                "/users",
                {
                    params: {
                        ...params,
                        size: total,
                    },
                },
            );
            return newResponse.data.data;
        }
        return data;
    };
}
