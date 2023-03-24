import { createContext } from "react";
import { ICampaign } from "../types/Campaign/ICampaign";


export const CampaignContext = createContext<ICampaign | undefined>(undefined);

