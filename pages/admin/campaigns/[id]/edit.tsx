import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Fragment, ReactElement } from "react";
import OfflineCampaignForm from "../../../../components/CampaignForm/OfflineCampaignForm";
import OnlineCampaignForm from "../../../../components/CampaignForm/OnlineCampaignForm";
import EmptyState, { EMPTY_STATE_TYPE } from "../../../../components/EmptyState";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import FormPageLayout from "../../../../components/Layout/FormPageLayout";
import LoadingSpinnerWithOverlay from "../../../../components/LoadingSpinnerWithOverlay";
import WelcomeBanner from "../../../../components/WelcomBanner";
import { CampaignFormats } from "../../../../constants/CampaignFormats";
import { useAuth } from "../../../../context/AuthContext";
import { CampaignContext } from "../../../../context/CampaignContext";
import { CampaignService } from "../../../../services/CampaignService";
import { NextPageWithLayout } from "../../../_app";
import useCampaign from "../../../../hooks/useCampaign";
import BasicCampaignForm from "../../../../components/CampaignForm/BasicCampaignForm";

const CampaignEditPage: NextPageWithLayout = () => {
    const router = useRouter();
    const { id: campaignId } = router.query;
    const { loginUser } = useAuth();
    const campaignService = new CampaignService(loginUser?.accessToken);

    const { data: campaign, isLoading } = useQuery(
        ["admin_campaign", campaignId],
        () => campaignService.getCampaignByIdByAdmin(Number(campaignId), {
            withAddressDetail: true,
        }),
        {
            enabled: !!campaignId,
        },
    );

    const { isOnlyBasicInfoEditable } = useCampaign({ campaign });

    function getLabel() {
        if (isOnlyBasicInfoEditable) return "Chỉnh sửa thông tin cơ bản 🏪";
        if (campaign?.format === CampaignFormats.OFFLINE.id) {
            return "Chỉnh sửa hội sách trực tiếp 🏪";
        }
        if (campaign?.format === CampaignFormats.ONLINE.id) {
            return "Chỉnh sửa hội sách trực tuyến 🏪";
        }
        return "Chỉnh sửa hội sách 🏪";
    }

    return (
        <Fragment>
            {isLoading && <LoadingSpinnerWithOverlay label={"Đang tải..."} />}
            {!isLoading && !campaign && (
                <EmptyState
                    status={EMPTY_STATE_TYPE.NO_DATA}
                    customMessage={`Không tìm thấy hội sách có mã: ${campaignId}`}
                />
            )}

            {/*TODO:*/}
            {/*Thêm các case hiển thị khi không thể edit campaign: đã bắt đầu, đã kết thúc, đã xóa, ...*/}

            {!isLoading && campaign && (
                <FormPageLayout>
                    <WelcomeBanner
                        label={getLabel()}
                        className="p-6 sm:p-10"
                    />
                    <CampaignContext.Provider value={campaign}>
                        {isOnlyBasicInfoEditable && <BasicCampaignForm />}
                        {!isOnlyBasicInfoEditable && campaign?.format === CampaignFormats.OFFLINE.id && (
                            <OfflineCampaignForm action={"UPDATE"} />
                        )}
                        {!isOnlyBasicInfoEditable && campaign?.format === CampaignFormats.ONLINE.id && (
                            <OnlineCampaignForm action={"UPDATE"} />
                        )}
                    </CampaignContext.Provider>
                </FormPageLayout>
            )}
        </Fragment>
    );
};
CampaignEditPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default CampaignEditPage;
