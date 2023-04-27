import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AddressService } from "../services/AddressService";

type Props = {
    defaultProvinceCode?: number;
    defaultDistrictCode?: number;
    defaultWardCode?: number;
    isDisabled?: boolean;
}
export default function useSelectAddress({
                                             defaultProvinceCode,
                                             defaultDistrictCode,
                                             defaultWardCode,
                                             isDisabled = false,
                                         }: Props) {
    const addressService = new AddressService();
    const [selectedProvinceCode, setSelectedProvinceCode] = useState<number | undefined>(defaultProvinceCode);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState<number | undefined>(defaultDistrictCode);
    const [selectedWardCode, setSelectedWardCode] = useState<number | undefined>(defaultWardCode);


    const {
        data: provinces,
        isInitialLoading: provincesLoading,
    } = useQuery(["provinces"], () => addressService.getProvinces(), {
        enabled: !isDisabled,
    });

    const {
        data: districts,
        isInitialLoading: districtsLoading,
    } = useQuery(["districts", selectedProvinceCode],
        () => {
            if (selectedProvinceCode) {
                return addressService.getDistrictsByProvinceId(selectedProvinceCode);
            }
            return [];
        }, {
            enabled: !isDisabled && !!selectedProvinceCode,
        });

    const {
        data: wards,
        isInitialLoading: wardsLoading,
    } = useQuery(["wards", selectedDistrictCode],
        () => {
            if (selectedDistrictCode) {
                return addressService.getWardsByDistrictId(selectedDistrictCode);
            }
            return [];
        }
        , {
            enabled: !isDisabled && !!selectedDistrictCode,
        },
    );


    const onProvinceChange = (provinceCode: number) => {
        setSelectedProvinceCode(provinceCode);
        setSelectedDistrictCode(undefined);
        setSelectedWardCode(undefined);
    }

    const onDistrictChange = (districtCode: number) => {
        setSelectedDistrictCode(districtCode);
        setSelectedWardCode(undefined);
    }

    const onWardChange = (wardCode: number) => {
        setSelectedWardCode(wardCode);
    }

    const selectedProvince = (provinces || []).find((p) => p.code === selectedProvinceCode);
    const selectedDistrict = (districts || []).find((d) => d.code === selectedDistrictCode);
    const selectedWard = (wards || []).find((w) => w.code === selectedWardCode);

    return {
        selectedProvinceCode,
        onProvinceChange,
        selectedDistrictCode,
        onDistrictChange,
        selectedWardCode,
        onWardChange,
        provinces,
        districts,
        wards,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        provincesLoading,
        districtsLoading,
        wardsLoading,
    };

}
