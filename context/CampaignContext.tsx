import { createContext } from "react";
import { ICampaign } from "../types/Campaign/ICampaign";
import { ICustomerCampaign } from "../types/Campaign/ICustomerCampaign";


export const CampaignContext = createContext<ICampaign | undefined>(undefined);
export const CustomerCampaignContext = createContext<ICustomerCampaign | undefined>(undefined);