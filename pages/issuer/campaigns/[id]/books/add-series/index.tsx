import React, {Fragment, ReactElement, useState} from 'react'
import {NextPageWithLayout} from "../../../../../_app";
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import {useRouter} from "next/router";
import {GiBookmarklet} from "react-icons/gi";
import SelectSellingBookSeriesModal
    from "../../../../../../components/SelectSellingBookSeries/SelectSellingBookSeriesModal";
import SelectBookSeriesProductModal from "../../../../../../components/SelectBookSeries/SelectBookSeriesProductModal";
import { IoChevronBack } from 'react-icons/io5';


import { useAuth } from '../../../../../../context/AuthContext';
import { CampaignService } from '../../../../../../services/CampaignService';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import SelectBookSeriesModal from "../../../../../../components/SelectBookSeries/SelectBookSeriesModal";

const SelectBookSeriesPage: NextPageWithLayout = () => {
    const router = useRouter();

    const {loginUser} = useAuth();
    const campaignService = new CampaignService(loginUser?.accessToken);
    const [showModal, setShowModal] = useState(false);

    const campaignId = router.query.id;

    const { data: campaign, isFetching, isInitialLoading, isError } = useQuery(
        ["issuer_campaign", campaignId],
        () => campaignService.getCampaignByIdByIssuer(Number(campaignId)),
        {
            enabled: !!campaignId,
        }
    );

    const genreIds = useMemo(() => campaign?.campaignCommissions?.map(c => c.genre?.id) || [], [campaign]);
    return (
        <Fragment>
            <div className='mx-auto max-w-6xl overflow-hidden rounded-md bg-white p-3'>
            <div className="mb-6">
                    <button
                        className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                        onClick={() => router.back()}
                    >
                        <IoChevronBack size={"17"} />
                        <span>Quay lại</span>
                    </button>
                </div>
                <div
                    className="flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-10 h-96">
                    <GiBookmarklet className="h-20 w-20 text-gray-400"/>
                    <div className="ml-4 text-center">
                        <h1 className="text-2xl font-medium text-gray-400">Thêm sách series vào hội sách</h1>
                        <button
                            disabled={showModal}
                            onClick={() => setShowModal(true)}
                            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                            Chọn từ kho sách
                        </button>
                    </div>
                </div>
            </div>

            <SelectBookSeriesModal
                campaignId={Number(campaignId)}
                isOpen={showModal} 
                onClose={() => setShowModal(false)}
                genreIds={genreIds}
                isSeries={true}
                onItemSelect={(book) => {
                    router.push(`/issuer/campaigns/${campaignId}/books/add-series/${book.id}`);
                }} />
        </Fragment>
    )
}

SelectBookSeriesPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default SelectBookSeriesPage