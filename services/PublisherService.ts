import { IBaseRequestParams } from "./../types/Request/IBaseRequestParams";
import { BaseService } from "./BaseService";
import { IBaseListResponse } from "../types/Commons/IBaseListResponse";
import { IPublisher } from "../types/Publisher/IPublisher";

export type UpdatePublisherParams = Required<Omit<IPublisher, "code">>;

export type CreatePublisherParams = Omit<UpdatePublisherParams, "id">;

export class PublisherService extends BaseService {
    getPublishers = async (params?: IBaseRequestParams<IPublisher>) => {
        const response = await this.axiosClient.get<
            IBaseListResponse<IPublisher>
        >("/publishers", {
            params,
        });
        return response.data;
    };

    getAllPublishers = async (): Promise<IPublisher[]> => {
        const response = await this.getPublishers();
        const { data, metadata: { total } } = response;
        if (data.length < total) {
            const newResponse = await this.axiosClient.get<
                IBaseListResponse<IPublisher>
            >("/publishers", {
                params: {
                    size: total,
                },
            });
            return newResponse.data.data;
        }
        return data;
    }

    deletePublisher = async (id: number) => {
        const response = await this.axiosClient.delete<IPublisher>(
            `/admin/publishers/${id}`
        );
        return response.data;
    };

    createPublisher = async (data: CreatePublisherParams) => {
        const response = await this.axiosClient.post<IPublisher>(
            "/admin/publishers",
            data
        );
        return response.data;
    };

    updatePublisher = async (data: UpdatePublisherParams) => {
        const response = await this.axiosClient.put<IPublisher>(
            "/admin/publishers",
            data
        );
        return response.data;
    };
}
