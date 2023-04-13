import { AxiosInstance } from "axios";
import getAxiosClient from "./axiosClient";
import { IBaseListResponse } from "../old-types/IBaseListResponse";
import { IAuthor } from "../types/Author/IAuthor";

export class AuthorService {
    private readonly axiosClient: AxiosInstance;

    constructor(accessToken?: string) {
        this.axiosClient = getAxiosClient(accessToken);
    }

    getAuthors = async (params?: any) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<IAuthor>
        >("/authors", {
            params,
        });
        return response.data;
    };
}
