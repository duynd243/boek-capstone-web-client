import { BaseService } from "./BaseService";

export class LanguageService extends BaseService {
    getLanguages = async (params?: any) => {
        const response = await this.axiosClient.get<string[]>(
            "/languages",
            {
                params,
            }
        );
        return response.data;
    };
}