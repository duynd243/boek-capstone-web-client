import React, {Fragment, ReactElement} from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../_app";
import SearchForm from "../../../components/Admin/SearchForm";
import PageHeading from "../../../components/Admin/PageHeading";
import ParticipantCard from "../../../components/ParticipantCard";

const AdminParticipantsPage: NextPageWithLayout = () => {

    return (
        <Fragment>
            <PageHeading label="Danh sách yêu cầu tham gia hội sách">
            </PageHeading>
            <div className='bg-white px-4 rounded'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8 p-4'>
                    {new Array(10).fill(0).map((_, index) => <ParticipantCard key={index}/>)}
                </div>
            </div>
        </Fragment>
    );
};

AdminParticipantsPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminParticipantsPage;
