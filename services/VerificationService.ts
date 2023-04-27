import { BaseService } from "./BaseService";

export class VerificationService extends BaseService {
    sendOTP = async (data?: any) => {
        const response = await this.axiosClient.post(
            "/verification/otp",
            data,
            {
                withCredentials: true,
            }
        );
        return response.data;
    };

    verifyOTP = async (data?: any) => {
        const response = await this.axiosClient.post(
            "/verification/otp-validation",
            data, {
                withCredentials: true,
            }
        );
        return response.data;
    }

}
