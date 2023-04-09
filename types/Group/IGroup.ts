import {ICustomer} from "../User/IUser";
import {ICampaign} from "../Campaign/ICampaign";

export interface IGroup {
    id: number;
    name?: string;
    description?: string;
    status: boolean;
    statusName?: string;
    customers?: ICustomer[];
    campaigns?: ICampaign[];
}
