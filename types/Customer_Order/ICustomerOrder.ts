import { IOrder } from "../Order/IOrder";
import { ICustomer } from "../User/IUser";

export interface ICustomerOrder extends ICustomer {
    orders: IOrder[];
}