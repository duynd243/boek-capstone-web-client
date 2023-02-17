import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {AddressService} from "../services/AddressService";
import {IProvince} from "../types/Address/IProvince";
import {IDistrict} from "../types/Address/IDistrict";
import {IWard} from "../types/Address/IWard";

function useAddress() {
    const addressService = new AddressService();

    const [selectedProvince, setSelectedProvince] = useState<IProvince | null>(null);
    const [selectedDistrict, setSelectedDistrict] = useState<IDistrict | null>(null);
    const [selectedWard, setSelectedWard] = useState<IWard | null>(null);

    const handleProvinceChange = (province: IProvince) => {
        if (province.code === selectedProvince?.code) return;
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedWard(null);
    }

    const handleDistrictChange = (district: IDistrict) => {
        if (district.code === selectedDistrict?.code) return;
        setSelectedDistrict(district);
        setSelectedWard(null);
    }

    const handleWardChange = (ward: IWard) => {
        if (ward.code === selectedWard?.code) return;
        setSelectedWard(ward);
    }

    const {data: provinces} = useQuery(['provinces'], () => addressService.getProvinces());

    const {data: districts} = useQuery(['districts', selectedProvince?.code],
        () => {
            if (selectedProvince) {
                return addressService.getDistrictsByProvinceId(selectedProvince.code);
            }
            return [];
        }, {
            enabled: !!selectedProvince,
        });
    const {data: wards} = useQuery(['wards', selectedDistrict?.code],
        () => {
            if (selectedDistrict) {
                return addressService.getWardsByDistrictId(selectedDistrict.code);
            }
            return [];
        }, {
            enabled: !!selectedDistrict,
        }
    );


    return {
        handleDistrictChange,
        handleProvinceChange,
        handleWardChange,
        provinces,
        districts,
        wards,
        selectedProvince,
        selectedDistrict,
        selectedWard,
    }
}

export default useAddress;