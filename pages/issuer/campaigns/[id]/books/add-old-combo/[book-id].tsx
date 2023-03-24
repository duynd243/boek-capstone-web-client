import { useQuery } from '@tanstack/react-query';
import { useRouter } from "next/router";
import { Fragment, ReactElement } from 'react';
import EmptyState, { EMPTY_STATE_TYPE } from '../../../../../../components/EmptyState';
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import { useAuth } from '../../../../../../context/AuthContext';
import { BookProductService } from '../../../../../../services/BookProductService';
import { CampaignService } from '../../../../../../services/CampaignService';
import { NextPageWithLayout } from "../../../../../_app";
import LoadingSpinnerWithOverlay from './../../../../../../components/LoadingSpinnerWithOverlay';
import FormPageLayout from './../../../../../../components/Layout/FormPageLayout';
import WelcomeBanner from './../../../../../../components/WelcomBanner/index';
import { CampaignContext } from './../../../../../../context/CampaignContext';
import ComboBookProductForm from './../../../../../../components/BookProductForm/ComboBookProductForm';



const AddOldComboPage: NextPageWithLayout = () => {
    const router = useRouter();
    const productId = router.query['book-id'];
    const campaignId = router.query['id'];
    const { loginUser } = useAuth();
    const bookProductService = new BookProductService(loginUser?.accessToken);
    const campaignService = new CampaignService(loginUser?.accessToken);

    const { data: product, isLoading } = useQuery(
        ["issuer_product", productId],
        () => bookProductService.getBookProductByIdByIssuer(productId as string),
        {
            enabled: !!productId,
        }
    );

    const { data: campaign } = useQuery(
        ["issuer_campaign", campaignId],
        () => campaignService.getCampaignByIdByIssuer(Number(campaignId)),
    );
    return <Fragment>
        {isLoading && <LoadingSpinnerWithOverlay label={"Đang tải..."} />}
        {!isLoading && !product && (
            <EmptyState
                status={EMPTY_STATE_TYPE.NO_DATA}
                customMessage={`Không tìm thấy sách bán có mã: ${productId}`}
            />
        )}

        {/*TODO:*/}
        {/*Thêm các case hiển thị khi không thể edit campaign: đã bắt đầu, đã kết thúc, đã xóa, ...*/}

        {product && (
            <FormPageLayout>
                <WelcomeBanner
                    label={`Chỉnh sửa ....`}
                    className="p-6 sm:p-10"
                />


                <CampaignContext.Provider value={campaign}>

                    <ComboBookProductForm action='create-old' product={product} />
                </CampaignContext.Provider>




                {/* <CampaignContext.Provider value={campaign}>
                {campaign?.format === CampaignFormats.OFFLINE.id ? (
                    <OfflineCampaignForm action={"UPDATE"}/>
                ) : (
                    <OnlineCampaignForm action={"UPDATE"}/>
                )}
            </CampaignContext.Provider> */}
            </FormPageLayout>
        )}
    </Fragment>
}

AddOldComboPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AddOldComboPage