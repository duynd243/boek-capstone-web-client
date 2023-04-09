
import { ReactElement } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import LoadingSpinnerWithOverlay from './../../../components/LoadingSpinnerWithOverlay';
import EmptyState, { EMPTY_STATE_TYPE } from '../../../components/EmptyState';
import FormPageLayout from './../../../components/Layout/FormPageLayout';
import WelcomeBanner from './../../../components/WelcomBanner/index';
import { useAuth } from '../../../context/AuthContext';
import { NextPageWithLayout } from '../../_app';
import { BookProductService } from '../../../services/BookProductService';
import AdminLayout from './../../../components/Layout/AdminLayout';
import { BookTypes } from '../../../constants/BookTypes';
import SingleBookProductForm from './../../../components/BookProductForm/SingleBookProductForm';
import ComboBookProductForm from '../../../components/BookProductForm/ComboBookProductForm';
import SeriesBookProductForm from './../../../components/BookProductForm/SeriesBookProductForm';
import { CampaignService } from '../../../services/CampaignService';
import { CampaignContext } from '../../../context/CampaignContext';
import { BookProductStatuses } from '../../../constants/BookProductStatuses';
import { CampaignStatuses} from '../../../constants/CampaignStatuses';
import { useMutation } from '@tanstack/react-query';




const IssuerBookProductDetailPage: NextPageWithLayout = () => {


    const router = useRouter();
    const productId = router.query['product-id'];
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
        ["issuer_campaign", product?.campaignId],
        () => campaignService.getCampaignByIdByIssuer(Number(product?.campaignId)),
    );


    
    const editBasicInfoOnly = product?.status === BookProductStatuses.Selling.id && campaign?.status === CampaignStatuses.STARTING.id;


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
                    label={`Chỉnh sửa sách ${product?.title} 📚`}
                    className="p-6 sm:p-10"
                />


                <CampaignContext.Provider value={campaign}>
                    {product?.type === BookTypes.Single.id && (
                        <SingleBookProductForm editBasicInfoOnly={editBasicInfoOnly} product={product} />
                    )}
                    {product?.type === BookTypes.Combo.id && (
                        <ComboBookProductForm editBasicInfoOnly={editBasicInfoOnly} action='update' product={product} />
                    )}
                    {product?.type === BookTypes.Series.id && (
                        <SeriesBookProductForm editBasicInfoOnly={editBasicInfoOnly} product={product} />
                    )}
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
IssuerBookProductDetailPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default IssuerBookProductDetailPage