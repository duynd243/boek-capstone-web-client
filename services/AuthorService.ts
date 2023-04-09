import { IBaseRequestParams } from "./../types/Request/IBaseRequestParams";
import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IAuthor } from "../types/Author/IAuthor";

export type UpdateAuthorParams = Required<Pick<IAuthor, "id" | "name">> &
    Partial<Pick<IAuthor, "description" | "imageUrl">>;

export type CreateAuthorParams = Omit<UpdateAuthorParams, "id">;

export class AuthorService extends BaseService {
    getAuthorsByAdmin = async (params?: IBaseRequestParams<IAuthor>) => {
        const response = await this.axiosClient.get<IBaseListResponse<IAuthor>>(
            "/admin/authors",
            {
                params,
            },
        );
        return response.data;
    };

    getAuthors = async (params?: IBaseRequestParams<IAuthor>) => {
        const response = await this.axiosClient.get<IBaseListResponse<IAuthor>>(
            "/authors",
            {
                params,
            },
        );
        return response.data;
    };


    getAllAuthors = async (): Promise<IAuthor[]> => {
        const response = await this.getAuthors();
        const { data, metadata: { total } } = response;
        if (data.length < total) {
            const newResponse = await this.getAuthors({
                size: total,
            });
            return newResponse.data;
        }
        return data;
    };

    deleteAuthor = async (id: number) => {
        const response = await this.axiosClient.delete<IAuthor>(
            `/admin/authors/${id}`,
        );
        return response.data;
    };

    createAuthor = async (data: CreateAuthorParams) => {
        const response = await this.axiosClient.post<IAuthor>(
            "/admin/authors",
            data,
        );
        return response.data;
    };

    updateAuthor = async (data: UpdateAuthorParams) => {
        const response = await this.axiosClient.put<IAuthor>(
            "/admin/authors",
            data,
        );
        return response.data;
    };
}
