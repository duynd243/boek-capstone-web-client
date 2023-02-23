export interface AddressViewModel {
    detail: string;
    provinceCode: number;
    districtCode: number;
    wardCode: number;
}

export interface Level {
    id: number;
    name: string;
    conditionalPoint: number;
    status: boolean;
    statusName: string;
}

export interface Customer {
    id: string;
    levelId: number;
    dob: Date;
    gender: boolean;
    point: number;
    level: Level;
}

export interface Issuer {
    id: string;
    description: string;
}

export interface IUser {
    id: string;
    code: string;
    name: string;
    email: string;
    address: string;
    addressViewModel: AddressViewModel;
    phone: string;
    roleName: string;
    role: number;
    status: boolean;
    statusName: string;
    imageUrl: string;
    customer: Customer;
    issuer: Issuer;
}