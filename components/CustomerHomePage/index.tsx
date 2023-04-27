import { Tab } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { NextPageWithLayout } from "../../pages/_app";
import { CampaignService } from "../../services/CampaignService";
import CampaignCard from "../CampaignCard";

const CustomerHomePage: NextPageWithLayout = () => {
    const { loginUser, logOut } = useAuth();
    const campaignService = new CampaignService(loginUser?.accessToken);

    const { data } = useQuery(["campaigns_home"], () =>
        campaignService.getHomepageCampaigns()
    );
    return (
        <div className={"space-y-6"}>
            {data?.hierarchicalCustomerCampaigns?.map((hcc, index) => (
                <div key={index} className={""}>
                    <h1 className="text-2xl font-semibold text-gray-800">
                        {hcc?.title}
                    </h1>
                    <Tab.Group>
                        <Tab.List className={"flex flex-wrap gap-2"}>
                            {hcc?.subHierarchicalCustomerCampaigns?.map(
                                (shcc, index) => {
                                    return (
                                        <Tab
                                            as={"div"}
                                            className={"focus:outline-none"}
                                            key={index}
                                        >
                                            <div className="cursor-pointer ui-selected:border-indigo-500 ui-selected:text-indigo-600 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm">
                                                {shcc?.subTitle}
                                            </div>
                                        </Tab>
                                    );
                                }
                            )}
                        </Tab.List>
                        <Tab.Panels>
                            {hcc?.subHierarchicalCustomerCampaigns?.map(
                                (shcc, index) => {
                                    return (
                                        <Tab.Panel key={index}>
                                            <div
                                                className={
                                                    "grid grid-cols-3 gap-4 mt-4"
                                                }
                                            >
                                                {shcc?.campaigns?.map(
                                                    (campaign, index) => (
                                                        <CampaignCard
                                                            key={campaign?.id}
                                                            horizontalOnly={
                                                                true
                                                            }
                                                            campaign={campaign}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </Tab.Panel>
                                    );
                                }
                            )}
                        </Tab.Panels>
                    </Tab.Group>
                </div>
            ))}

            {data?.unhierarchicalCustomerCampaigns?.map((ucc, index) => {
                return (
                    <div key={index} className={""}>
                        <h1 className="text-2xl font-semibold text-gray-800">
                            {ucc?.title}
                        </h1>
                        <div className={"grid grid-cols-3 gap-4 mt-4"}>
                            {ucc?.campaigns?.map((campaign, index) => (
                                <CampaignCard
                                    key={campaign?.id}
                                    horizontalOnly={true}
                                    campaign={campaign}
                                />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
export default CustomerHomePage;
