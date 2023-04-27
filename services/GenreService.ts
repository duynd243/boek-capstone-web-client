import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IGenre } from "../types/Genre/IGenre";

export class GenreService extends BaseService {
    getGenres = async (
        params?: any,
    ) => {
        const response = await this.axiosClient.get<IBaseListResponse<IGenre>>(
            "/genres",
            {
                params,
            });
        return response.data;
    };
    getChildGenres = async (params?: any) => {
        const response = await this.axiosClient.get<IGenre[]>(
            "/genres/child-genres",
            {
                params,
            });
        return response.data;
    };


    getGenreById = async (id: number) => {
        const response = await this.axiosClient.get<IGenre>(`/genres/${id}`);
        return response.data;
    };

    createGenre = async (data: any) => {
        const response = await this.axiosClient.post<IGenre>("/admin/genres", data);
        return response.data;
    };

    updateGenre = async (data: any) => {
        const response = await this.axiosClient.put<IGenre>(`admin/genres`, data);
        return response.data;
    };
}
