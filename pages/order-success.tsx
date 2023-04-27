import React from "react";
import { NextPageWithLayout } from "./_app";
import CustomerLayout from "../components/Layout/CustomerLayout";
import { Player } from "@lottiefiles/react-lottie-player";


const OrderSuccess: NextPageWithLayout = () => {
    return (
        <Player
            src={"https://gist.githubusercontent.com/duynd243/438cdba191f205398e44a4eab17e4e2b/raw/dec618483112d607da1a0442c8ea7d312f19007e/success-animation"}
            className="player"
            autoplay
            loop
            style={{ height: '300px', width: '300px' }}
        />
    );
};

OrderSuccess.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;
export default OrderSuccess;