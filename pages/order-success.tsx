import React from "react";
import { NextPageWithLayout } from "./_app";
import CustomerLayout from "../components/Layout/CustomerLayout";
import { Player } from "@lottiefiles/react-lottie-player";
import Link from "next/link";


const OrderSuccess: NextPageWithLayout = () => {
    return (
        <div>
            <Player
                src={"https://gist.githubusercontent.com/duynd243/438cdba191f205398e44a4eab17e4e2b/raw/dec618483112d607da1a0442c8ea7d312f19007e/success-animation"}
                className="player"
                autoplay
                loop
                style={{ height: "300px", width: "300px" }}
            />
            <h1 className="text-center text-gray-800 text-3xl font-bold">Đặt hàng thành công</h1>
            <p className="text-center mt-3 text-gray-600 text-lg">Cảm ơn bạn đã mua hàng tại Boek.</p>

            <div className={'flex justify-center'}>
                <Link href="/products"
                  className="text-center mt-8 text-white bg-indigo-500 py-2.5 px-6 rounded hover:bg-indigo-600">Tiếp tục mua hàng</Link>
            </div>


        </div>
    );
};

OrderSuccess.getLayout = (page) => <CustomerLayout>{page}</CustomerLayout>;
export default OrderSuccess;