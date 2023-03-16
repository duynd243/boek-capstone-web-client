import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { AddressService } from "../services/AddressService";
import { IDistrict } from "../types/Address/IDistrict";
import { IProvince } from "../types/Address/IProvince";
import { IWard } from "../types/Address/IWard";

type Props = {
    defaultProvinceCode?: number;
    defaultDistrictCode?: number;
    defaultWardCode?: number;
};

function useAddress(props: Props) {

    const addressService = new AddressService();

    const [edited, setEdited] = useState(false);

    const [selectedProvince, setSelectedProvince] = useState<IProvince | null>(
        null
    );

    const [selectedDistrict, setSelectedDistrict] = useState<IDistrict | null>(
        null
    );

    const [selectedWard, setSelectedWard] = useState<IWard | null>(null);

    const { data: provinces, isLoading: provincesLoading } = useQuery(
        ["provinces"],
        () => addressService.getProvinces(),
        {
            onSuccess: (data) => {
                if (props?.defaultProvinceCode && !selectedProvince && !edited) {
                    const defaultProvince = data.find(
                        (province) =>
                            province.code === props.defaultProvinceCode
                    );
                    setSelectedProvince(defaultProvince || null);
                }
            },
        }
    );

    const { data: districts, isLoading: districtsLoading } = useQuery(
        ["districts", selectedProvince?.code],
        () => {
            if (selectedProvince) {
                return addressService.getDistrictsByProvinceId(
                    selectedProvince.code
                );
            }
            return [];
        },
        {
            enabled: !!selectedProvince,
            onSuccess: (data) => {
                if (props?.defaultDistrictCode && !selectedDistrict && !edited) {
                    const defaultDistrict = data.find(
                        (district) =>
                            district.code === props.defaultDistrictCode
                    );
                    setSelectedDistrict(defaultDistrict || null);
                }
            },
        }
    );

    const { data: wards, isLoading: wardsLoading } = useQuery(
        ["wards", selectedDistrict?.code],
        () => {
            if (selectedDistrict) {
                return addressService.getWardsByDistrictId(
                    selectedDistrict.code
                );
            }
            return [];
        },
        {
            enabled: !!selectedDistrict,
            onSuccess: (data) => {
                if (props?.defaultWardCode && !selectedWard && !edited) {
                    const defaultWard = data.find(
                        (ward) => ward.code === props.defaultWardCode
                    );
                    setSelectedWard(defaultWard || null);
                }
            },
        }
    );

    const handleProvinceChange = (province: IProvince) => {
        if (province.code === selectedProvince?.code) return;
        setEdited(true);
        setSelectedProvince(province);
        setSelectedDistrict(null);
        setSelectedWard(null);
    };

    const handleDistrictChange = (district: IDistrict) => {
        if (district.code === selectedDistrict?.code) return;
        setEdited(true);
        setSelectedDistrict(district);
        setSelectedWard(null);
    };

    const handleWardChange = (ward: IWard) => {
        if (ward.code === selectedWard?.code) return;
        setEdited(true);
        setSelectedWard(ward);
    };

    return {
        handleDistrictChange,
        handleProvinceChange,
        handleWardChange,
        provinces,
        districts,
        wards,
        provincesLoading,
        districtsLoading,
        wardsLoading,
        selectedProvince,
        selectedDistrict,
        selectedWard,
    };
}

export default useAddress;