import { ICustomer } from "../User/IUser";
import { IGroup } from "../Group/IGroup";

export interface ICustomerGroup {
    id: number;
    customerId: string;
    customer: ICustomer;
    groups: {
        total: number;
        group: IGroup;
    }[];
}