import { AxiosInstance } from "axios";
import getAxiosClient from "../axiosClient";
import { IPublisher } from "../../old-types/user/IPublisher";
import { IBaseListResponse } from "../../old-types/IBaseListResponse";

export class SystemPublisherService {
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
