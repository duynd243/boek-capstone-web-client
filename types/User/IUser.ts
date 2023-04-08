import { ICustomerLevel } from "./../CustomerLevel/ICustomerLevel";

import { IAddress } from "./../Address/IAddress";

export interface ICustomer {
    id: string;
    levelId?: number;
    dob?: string;
    gender?: boolean;
    point?: number;
    level?: ICustomerLevel;
    user?: IUser;
}

export interface IIssuer {
    id: string;
    description?: string;
    user?: IUser;
}

export interface IUser {
    id: string;
    code?: string;
    name?: string;
    email?: string;
    address?: string;
    addressViewModel?: IAddress;
    phone?: string;
    roleName?: string;
    role?: number;
    status?: boolean;
    statusName?: string;
    imageUrl?: string;
    customer?: ICustomer;
    issuer?: IIssuer;
    createdDate?: string;
    updatedDate?: string;
}
