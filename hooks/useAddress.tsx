import {useState} from "react";
import {IProvince} from "../types/Address/IProvince";
import {IDistrict} from "../types/Address/IDistrict";
import {IWard} from "../types/Address/IWard";

function useAddress() {
    const [province, setProvince] = useState<IProvince | null>(null);
    const [district, setDistrict] = useState<IDistrict | null>(null);
    const [ward, setWard] = useState<IWard | null>(null);
}

export default useAddress;