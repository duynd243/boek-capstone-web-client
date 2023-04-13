import { BaseService } from "./BaseService";

export class ImageUploadService extends BaseService {
    uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await this.axiosClient.post("/images", formData);
        return response.data;
    };
}
