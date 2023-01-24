import React, {Fragment, ReactElement, useState} from 'react'
import {NextPageWithLayout} from "../../../../../_app";
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import {useRouter} from "next/router";
import {GiBookmarklet} from "react-icons/gi";
import SelectSellingBookSeriesModal
    from "../../../../../../components/SelectSellingBookSeries/SelectSellingBookSeriesModal";

const SelectBookSeriesPage: NextPageWithLayout = () => {
    const router = useRouter();

    const [showModal, setShowModal] = useState(false);

    const campaignId = router.query.id;
    return (
        <Fragment>
            <div className='mx-auto max-w-6xl overflow-hidden rounded-md bg-white p-3'>
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

            <SelectSellingBookSeriesModal isOpen={showModal} onClose={() => setShowModal(false)}
                                          onItemSelect={(book) => {
                                              router.push(`/issuer/campaigns/${campaignId}/books/add-series/${book.id}`);
                                          }}/>
        </Fragment>
    )
}

SelectBookSeriesPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default SelectBookSeriesPage