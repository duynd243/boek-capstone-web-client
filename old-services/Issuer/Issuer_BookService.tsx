import React from "react";
import { AxiosInstance } from "axios";
import getAxiosClient from "../axiosClient";
import { IBaseListResponse } from "../../old-types/response/IBaseListResponse";
import { IBookResponse } from "../../old-types/response/IBookResponse";

export class IssuerBookService {
    private readonly axiosClient: AxiosInstance;

    constructor(accessToken?: string) {
        this.axiosClient = getAxiosClient(accessToken);
    }

    updateBook = async (params?: any) => {
        const response = await this.axiosClient.put<{
            id?: number;
            name?: string;
        }>("/issuer/books", params);
        return response.data;
    };
    getBooksByIssuer = async (params?: any) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<IBookResponse>
        >("/issuer/books", {
            params,
        });
        return response.data;
    };

    createBook$Issuer = async (data: IBookResponse) => {
        const response = await this.axiosClient.post<IBookResponse>(
            "/issuer/books",
            data,
        );
        return response.data;
    };
}
