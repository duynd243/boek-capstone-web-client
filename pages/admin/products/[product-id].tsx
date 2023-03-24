
import { ReactElement } from 'react';
import { NextPageWithLayout } from '../../../../../_app';
import AdminLayout from './../../../../../../components/Layout/AdminLayout';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../../../context/AuthContext';
import { BookProductService } from './../../../../../../services/BookProductService';


const IssuerBookProductDetailPage: NextPageWithLayout = () => {


    const router = useRouter();
    const {id: campaignId} = router.query;
    const {loginUser} = useAuth();
    const bookProductService = new BookProductService(loginUser?.accessToken);

    const {data: campaign, isLoading} = useQuery(
        ["admin_campaign", campaignId],
        () => campaignService.getCampaignByIdByAdmin(Number(campaignId), {
            withAddressDetail: true,
        }),
        {
            enabled: !!campaignId,
        }
    );
    return <>123</>
}
 IssuerBookProductDetailPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default IssuerBookProductDetailPage