import { AxiosInstance } from 'axios';
import getAxiosClient from "../axiosClient";
import { IBaseListResponse } from '../../types/response/IBaseListResponse';
import { ICategory } from './../../types/category/ICategory';

export class CategoryService {
    private readonly axiosClient: AxiosInstance;

    constructor(accessToken?: string) {
        this.axiosClient = getAxiosClient(accessToken);
    }

    getCategories = async (params?: any) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<ICategory>
        >('/categories', {
            params,
        });
        return response.data;
    };
}
