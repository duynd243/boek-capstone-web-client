import { ICustomer } from "../User/IUser";
import { IOrganization } from "../Organization/IOrganization";

export interface ICustomerOrganization {
    id: number;
    customerId: string;
    customer: ICustomer;
    organizations: {
        total: number;
        organization: IOrganization;
    }[];
}