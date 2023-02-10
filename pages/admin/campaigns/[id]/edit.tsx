import React, {Fragment, ReactElement} from "react";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../../_app";
import {useRouter} from "next/router";
import {useAuth} from "../../../../context/AuthContext";
import {CampaignService} from "../../../../services/CampaignService";
import {useQuery} from "@tanstack/react-query";
import EmptyState, {EMPTY_STATE_TYPE} from "../../../../components/EmptyState";
import LoadingSpinnerWithOverlay from "../../../../components/LoadingSpinnerWithOverlay";
import FormPageLayout from "../../../../components/Layout/FormPageLayout";
import WelcomeBanner from "../../../../components/WelcomBanner";
import CampaignForm, {CampaignFormAction} from "../../../../components/CampaignForm";
import {FormikProvider, useFormik} from "formik";

const CampaignEditPage: NextPageWithLayout = () => {
    const router = useRouter();
    const {id: campaignId} = router.query;
    const {loginUser} = useAuth();
    const campaignService = new CampaignService(loginUser?.accessToken);

    const {data: campaign, isLoading} = useQuery(
        ["campaign", campaignId],
        () => campaignService.getCampaignById(Number(campaignId)),
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            retry: false,
        }
    );
    const form = useFormik({
        enableReinitialize: true,
        initialValues: {
            ...campaign,
            organizations: [...campaign?.campaignOrganizations?.map(co => co?.organization) || []],
            campaignCommissions: [...campaign?.campaignCommissions?.map(cc => {
                return {
                    ...cc,
                    genreName: cc?.genre?.name,
                }
            }) || []],
            groups: [...campaign?.campaignGroups?.map(cg => cg?.group) || []],
            startOnlineDate: campaign?.startOnlineDate ? new Date(campaign?.startOnlineDate) : undefined,
            endOnlineDate: campaign?.endOnlineDate ? new Date(campaign?.endOnlineDate) : undefined,
            startOfflineDate: campaign?.startOfflineDate ? new Date(campaign?.startOfflineDate) : undefined,
            endOfflineDate: campaign?.endOfflineDate ? new Date(campaign?.endOfflineDate) : undefined,
        },
        onSubmit: async (values) => {
            console.log(JSON.stringify(values, null, 2));
        }
    })
    return (
        <Fragment>
            {isLoading && <LoadingSpinnerWithOverlay label={'Đang tải...'}/>}
            {!isLoading && !campaign &&
                <EmptyState status={EMPTY_STATE_TYPE.NO_DATA}
                            customMessage={`Không tìm thấy hội sách có mã: ${campaignId}`}/>
            }

            {/*TODO:*/}
            {/*Thêm các case hiển thị khi không thể edit campaign: đã bắt đầu, đã kết thúc, đã xóa, ...*/}

            {campaign &&
                <FormPageLayout>
                    <WelcomeBanner label="Chỉnh sửa hội sách 🏪" className="p-6 sm:p-10"/>
                    <FormikProvider value={form}>
                        <CampaignForm formikForm={form} action={CampaignFormAction.UPDATE}/>
                    </FormikProvider>
                </FormPageLayout>
            }
        </Fragment>
    );
};
CampaignEditPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default CampaignEditPage;
