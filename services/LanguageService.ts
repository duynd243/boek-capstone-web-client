import { BaseService } from "./BaseService";

export class LanguageService extends BaseService {
    getLanguages = async () => {
        const response = await this.axiosClient.get<string[]>("/languages");
        return response.data;
    }
}
