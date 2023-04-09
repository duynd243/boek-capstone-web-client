import {ICustomer} from "../User/IUser";
import {ICampaign} from "../Campaign/ICampaign";

export interface IOrganization {
    id: number;
    name?: string;
    address?: string;
    phone?: string;
    imageUrl?: string;
    customers?: ICustomer[];
    campaigns?: ICampaign[];
}
