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
    isDisabled?: boolean;
};

function useAddress({
                        defaultProvinceCode, defaultDistrictCode, defaultWardCode, isDisabled = false,
                    }:
                        Props) {

    const addressService = new AddressService();

    const [edited, setEdited] = useState(false);

    const [selectedProvince, setSelectedProvince] = useState<IProvince | null>(
        null,
    );

    const [selectedDistrict, setSelectedDistrict] = useState<IDistrict | null>(
        null,
    );

    const [selectedWard, setSelectedWard] = useState<IWard | null>(null);

    const { data: provinces, isInitialLoading: provincesLoading } = useQuery(
        ["provinces"],
        () => addressService.getProvinces(),
        {
            enabled: !isDisabled,
            onSuccess: (data) => {
                if (defaultProvinceCode && !selectedProvince && !edited) {
                    const defaultProvince = data.find(
                        (province) =>
                            province.code === defaultProvinceCode,
                    );
                    setSelectedProvince(defaultProvince || null);
                }
            },
        },
    );

    const { data: districts, isInitialLoading: districtsLoading } = useQuery(
        ["districts", selectedProvince?.code],
        () => {
            if (selectedProvince) {
                return addressService.getDistrictsByProvinceId(
                    selectedProvince.code,
                );
            }
            return [];
        },
        {
            enabled: !isDisabled && !!selectedProvince,
            onSuccess: (data) => {
                if (defaultDistrictCode && !selectedDistrict && !edited) {
                    const defaultDistrict = data.find(
                        (district) =>
                            district.code === defaultDistrictCode,
                    );
                    setSelectedDistrict(defaultDistrict || null);
                }
            },
        },
    );

    const { data: wards, isInitialLoading: wardsLoading } = useQuery(
        ["wards", selectedDistrict?.code],
        () => {
            if (selectedDistrict) {
                return addressService.getWardsByDistrictId(
                    selectedDistrict.code,
                );
            }
            return [];
        },
        {
            enabled: !isDisabled && !!selectedDistrict,
            onSuccess: (data) => {
                if (defaultWardCode && !selectedWard && !edited) {
                    const defaultWard = data.find(
                        (ward) => ward.code === defaultWardCode,
                    );
                    setSelectedWard(defaultWard || null);
                }
            },
        },
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
