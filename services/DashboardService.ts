import { BaseService } from "./BaseService";

export class DashboardService extends BaseService {


    // region Admin
    getAdminDashboardComparisonNewCustomers = async (
        params: any,
    ) => {
        const response = await this.axiosClient.post("/admin/dashboard/new-customers", params);
        return response.data;
    };

    getAdminDashboardComparisonNewOrders = async (
        params: any,
    ) => {
        const response = await this.axiosClient.post("/admin/dashboard/orders", params);
        return response.data;
    };

}
