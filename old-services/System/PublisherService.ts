import { AxiosInstance } from "axios";
import getAxiosClient from "../axiosClient";
import { IBaseListResponse } from "../../old-types/response/IBaseListResponse";

export interface IPublisher {
    id?: number;
    code?: string;
    name?: string;
    email?: string;
    address?: string;
    phoneNumber?: string;
}

export class PublisherService {
    private readonly axiosClient: AxiosInstance;

    constructor(accessToken?: string) {
        this.axiosClient = getAxiosClient(accessToken);
    }

    getPublishers = async (params?: any) => {
        const response = await this.axiosClient.get<IBaseListResponse<IPublisher>>(
            "/publishers",
            {
                params,
            },
        );
        return response.data;
    };
}
