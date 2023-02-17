import {BaseService} from "./BaseService";
import {IProvince} from "../types/Address/IProvince";
import {IDistrict} from "../types/Address/IDistrict";
import {IWard} from "../types/Address/IWard";

export class AddressService extends BaseService {
    getProvinces = async () => {
        const response = await this.axiosClient.get<IProvince[]>("/provinces");
        return response.data;
    }

    getDistrictsByProvinceId = async (provinceId: number) => {
        const response = await this.axiosClient.get<IDistrict[]>(`/provinces/${provinceId}/districts`);
        return response.data;
    }

    getWardsByDistrictId = async (districtId: number) => {
        const response = await this.axiosClient.get<IWard[]>(`/districts/${districtId}/wards`);
        return response.data;
    }
}
