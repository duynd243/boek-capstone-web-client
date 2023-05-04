import React, { Fragment } from "react";
import { NextPageWithLayout } from "../../_app";
import CustomerLayout from "../../../components/Layout/CustomerLayout";
import CustomerSettingsLayout from "../../../components/Layout/CustomerSettingsLayout";
import Link from "next/link";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useAuth } from "../../../context/AuthContext";
import { OrderService } from "../../../services/OrderService";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getOrderStatusById } from "../../../constants/OrderStatuses";
import OrderDetailCard from "../../../components/CustomerOrder/OrderDetailCard";
import { IOrderDetail } from "../../../types/Order/IOrder";
import { getOrderPaymentMethodById } from "../../../constants/OrderPaymentMethods";
import Image from "next/image";
import { OrderTypes } from "../../../constants/OrderTypes";
import { getFormattedTime } from "../../../utils/helper";
import { BsCheck } from "react-icons/bs";
import { HiXMark } from "react-icons/hi2";
import useOrderTimeline from "../../../hooks/useOrderTimeline";

const mockOrder = {
    "id": "6df2cf81-ec57-454d-a823-0e69681894b1",
    "code": "#6234690988519",
    "customerId": "dbd56597-5ac9-4145-8385-b0ea7ad58622",
    "campaignId": 71,
    "campaignStaffId": null,
    "customerName": "Duy Nguyễn",
    "customerPhone": "0902167344",
    "customerEmail": "duyndse@gmail.com",
    "address": "76 Đặng Nghiêm, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
    "freight": 15000.0000,
    "payment": 2,
    "paymentName": "Thanh toán ZaloPay",
    "type": 1,
    "typeName": "Giao hàng",
    "note": "Boek: ",
    orderDate: "2023-04-01T11:03:03.857",
    "availableDate": null,
    shippingDate: "2023-04-04T09:33:29.663",
    shippedDate: "2023-04-04T09:33:51.947",
    "receivedDate": null,
    "cancelledDate": null,
    status: 5,
    statusName: "Đã giao",
    "total": 141000,
    "subTotal": 140000,
    "discountTotal": -14000,
    "freightName": "Nội thành",
    "campaign": {
        "id": 71,
        "code": "95140287-27db-4135-a133-ece416013e03",
        "name": "Hội sách TP. HCM - Tháng 4/2023",
        "description": "Quy mô sự kiện: gần 200 đơn vị tham gia với 900 gian hàng, có các đơn vị nổi bật như: Alpha Books, Saigon Books, công ty Minh Long, nhà sách Phương Nam,...\n\nCác hoạt động: hàng trăm chương trình hoạt động sôi nổi, đặc sắc được tổ chức tại sân khấu trung tâm, Nhà hội thảo và tại gian hàng các đơn vị tham gia. Giảm giá từ 10% - 50% cho tất cả các loại sách bán tại Hội sách và nhiều quà tặng hấp dẫn dành cho khách hàng,...",
        "imageUrl": "http://res.cloudinary.com/dsyy2ay9q/image/upload/v1681086892/unnlosvor0vw0ll4xh9f.jpg",
        "format": 1,
        "address": "123 Trần Hưng Đạo, Phường 01, Quận 5, Thành phố Hồ Chí Minh",
        "addressViewModel": null,
        "startDate": "2023-04-11T17:00:00",
        "endDate": "2023-04-29T17:00:00",
        "isRecurring": false,
        "status": 2,
        "createdDate": "2023-04-10T00:34:56.423",
        "updatedDate": null,
        "formatName": "Trực tiếp",
        "statusName": "Hội sách diễn ra",
    },
    "campaignStaff": null,
    "customer": {
        "levelId": 5,
        "dob": "2001-03-23T03:00:00",
        "gender": true,
        "point": 157,
        "user": {
            "id": "dbd56597-5ac9-4145-8385-b0ea7ad58622",
            "code": "C944880229",
            "name": "Duy Nguyễn",
            "email": "duyndse@gmail.com",
            "address": "76 Đặng Nghiêm, Phường Long Thạnh Mỹ, Thành phố Thủ Đức, Thành phố Hồ Chí Minh",
            "addressViewModel": null,
            "phone": "0902167344",
            "roleName": "Customer",
            "role": 4,
            "status": true,
            "statusName": "Hoạt động",
            "imageUrl": "http://res.cloudinary.com/dsyy2ay9q/image/upload/v1677349378/nyjo881cfo6heiupybev.jpg",
            "createdDate": "2023-01-02T12:46:02.703",
            "updatedDate": "2023-04-09T09:50:54.22",
        },
    },
    "orderDetails": [{
        "id": 71,
        "orderId": "6df2cf81-ec57-454d-a823-0e69681894b1",
        "bookProductId": "428cbbfb-0414-4463-bd54-fbbf47ee10b0",
        "quantity": 4,
        "price": 31500.0000,
        "discount": 10,
        "withPdf": false,
        "withAudio": false,
        "total": 126000,
        "subTotal": 140000,
        "bookProduct": {
            "id": "428cbbfb-0414-4463-bd54-fbbf47ee10b0",
            "bookId": 129,
            "genreId": 14,
            "campaignId": 71,
            "issuerId": "7ab32644-a6e5-4738-8302-7729e1966460",
            "title": "Kỳ Án Siêu Nhiên 10",
            "description": "Năm 11 tuổi, Kotoko Iwanaga bị yêu quái bắt cóc trong hai tuần và được yêu cầu trở thành \"Thần thông thái\" của họ. Cô nhanh chóng đồng ý nhưng phải trả giá bằng mắt phải và chân trái. Trong khi đó, Sakuragawa Kuro, một sinh viên đại học 22 tuổi, vừa chia tay bạn gái sau khi anh ta bỏ trốn một mình khi cả hai gặp phải kappa. Kotoko nhanh chóng nhận ra có gì đó không bình thường ở Kuro. Bằng kiến thức uyên thâm và khả năng suy luận của mình, cô đã yêu cầu Kuro hợp tác trong việc phá các vụ án do thế lực siêu nhiên gây ra.",
            "imageUrl": "http://res.cloudinary.com/dsyy2ay9q/image/upload/v1680941475/tzxpi0lmqxqagrgdvk0z.jpg",
            "saleQuantity": 50,
            "discount": 10,
            "salePrice": 31500.0000,
            "type": 1,
            "typeName": "Sách lẻ",
            "format": 1,
            "formatName": "Sách giấy",
            "withPdf": false,
            "pdfExtraPrice": null,
            "displayPdfIndex": 0,
            "withAudio": false,
            "displayAudioIndex": 0,
            "audioExtraPrice": null,
            "status": 3,
            "statusName": "Đang bán",
            "note": "(04/10/2023 00:40:14) Admin: Đồng ý xét duyệt",
            "createdDate": "2023-04-10T00:38:57.24",
            "updatedDate": "2023-04-10T00:40:14.683",
            "fullPdfAndAudio": false,
            "onlyPdf": false,
            "onlyAudio": false,
            "book": {
                "id": 129,
                "code": "TB0129",
                "genreId": 14,
                "publisherId": 4,
                "issuerId": "7ab32644-a6e5-4738-8302-7729e1966460",
                "isbn10": null,
                "isbn13": "9786041216556",
                "name": "Kỳ Án Siêu Nhiên 10",
                "translator": "Phương Quyên",
                "imageUrl": "http://res.cloudinary.com/dsyy2ay9q/image/upload/v1680941475/tzxpi0lmqxqagrgdvk0z.jpg",
                "coverPrice": 35000.0000,
                "description": "Năm 11 tuổi, Kotoko Iwanaga bị yêu quái bắt cóc trong hai tuần và được yêu cầu trở thành \"Thần thông thái\" của họ. Cô nhanh chóng đồng ý nhưng phải trả giá bằng mắt phải và chân trái. Trong khi đó, Sakuragawa Kuro, một sinh viên đại học 22 tuổi, vừa chia tay bạn gái sau khi anh ta bỏ trốn một mình khi cả hai gặp phải kappa. Kotoko nhanh chóng nhận ra có gì đó không bình thường ở Kuro. Bằng kiến thức uyên thâm và khả năng suy luận của mình, cô đã yêu cầu Kuro hợp tác trong việc phá các vụ án do thế lực siêu nhiên gây ra.",
                "language": "Tiếng Việt",
                "size": "11,3x17,6cm",
                "releasedYear": 2023,
                "page": 204,
                "isSeries": false,
                "pdfExtraPrice": null,
                "pdfTrialUrl": null,
                "audioExtraPrice": null,
                "audioTrialUrl": null,
                "status": 1,
                "statusName": null,
                "createdDate": "2023-04-08T10:20:00",
                "updatedDate": null,
                "fullPdfAndAudio": false,
                "onlyPdf": false,
                "onlyAudio": false,
            },
            "issuer": {
                "id": "7ab32644-a6e5-4738-8302-7729e1966460",
                "description": null,
                "user": {
                    "id": "7ab32644-a6e5-4738-8302-7729e1966460",
                    "code": "I147834970",
                    "name": "NXB Trẻ",
                    "email": "manhhungtran2308@gmail.com",
                    "address": "161B Lý Chính Thắng, Phường 12, Quận 3, Thành phố Hồ Chí Minh",
                    "addressViewModel": null,
                    "phone": "0939316289",
                    "roleName": "Issuer",
                    "role": 2,
                    "status": true,
                    "statusName": "Hoạt động",
                    "imageUrl": "http://res.cloudinary.com/dsyy2ay9q/image/upload/v1678123981/wkv6ndrodsfwtjwxetfj.jpg",
                    "createdDate": "2023-01-02T12:41:33.083",
                    "updatedDate": "2023-04-09T16:31:45.91",
                },
            },
            "bookProductItems": [],
        },
    }],
};
const CustomerOrderDetailsPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const orderService = new OrderService(loginUser?.accessToken);
    const {
        query: { id },
    } = useRouter();
    const {
        data: order,
        isInitialLoading,
    } = useQuery(["order", id],
        () => orderService.getOrderByIdByCustomer(id as string), {
            enabled: !!id,
        });


    const { orderTimeline } = useOrderTimeline(order);


    const orderStatus = getOrderStatusById(order?.status);
    const orderPaymentMethod = getOrderPaymentMethodById(order?.payment);
    return (
        <div className={"p-4 sm:p-6"}>
            {/*Back button*/}

            <Link href="/orders"
                  className="underline underline-offset-2 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                <IoIosArrowRoundBack />
                Danh sách đơn hàng
            </Link>


            <div className="mt-4 flex items-center justify-between">
                <h1 className="text-2xl font-medium text-gray-700 mt-4">Chi tiết đơn hàng <span
                    className="font-semibold">
                {order?.code}</span></h1>
                <div
                    className={`w-fit text-sm font-medium px-3 py-1 rounded ${orderStatus?.labelColor}`}>
                    {orderStatus && orderStatus?.displayName}
                </div>
            </div>

            {/*<ol className="relative border-l border-gray-200">*/}
            {/*    {orderTimeline.filter(timeline => timeline.date).reverse()*/}
            {/*        .map((timeline, index) => <li key={index} className="mb-10 ml-4">*/}
            {/*            <div*/}
            {/*                className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border border-white ${timeline?.cancelled ? "bg-red-500" : "bg-green-500"}`}></div>*/}

            {/*            <h3 className="text-lg font-medium text-gray-900 ">*/}
            {/*                {timeline.title}*/}
            {/*            </h3>*/}
            {/*            <time className="mb-1 text-sm font-normal leading-none text-gray-400">*/}
            {/*                {getFormattedTime(timeline.date || undefined, "HH:mm:ss dd/MM/yyyy")}*/}
            {/*            </time>*/}
            {/*        </li>)}*/}

            {/*</ol>*/}


            {isInitialLoading ? <div>Đang tải...</div> : <Fragment>
                <ol className="items-center sm:flex justify-between px-4 mt-8">
                    {orderTimeline.filter(timeline => timeline.date)
                        .map((timeline, index) =>
                            <li key={index} className="relative mb-6 sm:mb-0 w-full">
                                <div className="flex items-center">
                                    <div
                                        className={`z-10 flex items-center justify-center w-6 h-6 ${timeline?.cancelled ? "bg-red-100" : "bg-green-100"} rounded-full ring-0 ring-white 0 sm:ring-8 shrink-0`}>
                                        {timeline?.cancelled ? <HiXMark className="w-4 h-4 text-red-500" /> :
                                            <BsCheck className="w-4 h-4 text-green-500" />}
                                    </div>
                                    <div className="hidden sm:flex w-full bg-gray-200 h-0.5 0"></div>
                                </div>
                                <div className="mt-3 sm:pr-8">
                                    <h3 className="font-medium text-gray-700">
                                        {timeline.title}
                                    </h3>
                                    <time className="block mb-2 text-sm font-normal leading-none text-gray-400">
                                        {getFormattedTime(timeline.date || undefined, "HH:mm, dd/MM/yyyy")}
                                    </time>
                                </div>
                            </li>,
                        )}
                </ol>


                <div className="bg-gray-50 mt-8 p-4 sm:p-6 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-700">Ghi chú</h3>
                    <p className="text-sm text-gray-500 mt-2">
                        {order?.note ?
                            order?.note?.split(";")?.map((note, index) => {
                                return (
                                    <span key={index} className="block">
                                        {note}
                                    </span>
                                );
                            })
                            : "Không có ghi chú"}
                    </p>
                </div>


                <div className={"divide-y divide-gray-200 mt-8"}>
                    {order?.orderDetails?.map((orderDetail) => {
                        return (
                            <OrderDetailCard
                                key={orderDetail?.id}
                                orderDetail={orderDetail as IOrderDetail} />
                        );
                    })}
                </div>
                <div className="mt-8">
                    <h2 className="sr-only">Billing Summary</h2>

                    <div
                        className="bg-gray-50 py-6 px-4 sm:px-6 sm:rounded-lg lg:px-8 lg:py-8 lg:grid lg:grid-cols-12 lg:gap-x-8">
                        <dl className="grid grid-cols-2 gap-6 text-sm sm:grid-cols-2 md:gap-x-8 lg:col-span-7">
                            <div>
                                <dt className="font-medium text-gray-900">Thông tin nhận hàng</dt>
                                <dd className="mt-3 text-gray-500">
                                    <span className="block font-medium uppercase">{order?.customerName}</span>
                                    <span className="block mt-2">{order?.customerPhone}</span>
                                    <span
                                        className="block mt-2">{order?.address || "Địa chỉ nhận hàng chưa được cập nhật"}</span>
                                </dd>
                            </div>
                            <div>
                                <dt className="font-medium text-gray-900">Phương thức thanh toán</dt>
                                <div className="mt-3">
                                    <dd className="-ml-4 -mt-4 flex flex-wrap items-center">
                                        <div className="ml-4 mt-4 flex-shrink-0">
                                            <Image
                                                width={500}
                                                height={500}
                                                className="h-6 w-6"
                                                src={orderPaymentMethod?.logo?.src || ""}
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-2 mt-4">
                                            <p className="text-gray-600 font-medium">
                                                {order?.paymentName}
                                            </p>
                                        </div>
                                    </dd>
                                </div>
                            </div>
                        </dl>

                        <dl className="mt-8 divide-y divide-gray-200 text-sm lg:mt-0 lg:col-span-5">
                            <div className="pb-4 flex items-center justify-between">
                                <dt className="text-gray-600">Tạm tính</dt>
                                <dd className="font-medium text-gray-900">{new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(
                                    order?.subTotal || 0,
                                )}</dd>
                            </div>
                            <div className="py-4 flex items-center justify-between">
                                <dt className="text-gray-600">Phí vận chuyển</dt>
                                <dd className="font-medium text-gray-900">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order?.freight || 0)}
                                </dd>
                            </div>
                            <div className="py-4 flex items-center justify-between">
                                <dt className="text-gray-600">Giảm giá</dt>
                                <dd className="font-medium text-gray-900">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order?.discountTotal || 0)}
                                </dd>
                            </div>
                            <div className="pt-4 flex text-base items-center justify-between">
                                <dt className="font-medium text-gray-900">Tổng tiền
                                    <div className="text-gray-500 text-sm font-normal">(Đã bao gồm VAT nếu có)</div>
                                </dt>
                                <dd className="font-medium text-indigo-600">
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order?.total || 0)}
                                </dd>
                            </div>

                            {/*<div className="py-4 border-none bg-indigo-100 mt-2 rounded px-3 flex items-center justify-between">*/}
                            {/*    <dt className="text-indigo-600">Điểm thưởng</dt>*/}
                            {/*    <dd className="font-medium text-indigo-900">*/}
                            {/*        123*/}
                            {/*    </dd>*/}
                            {/*</div>*/}
                        </dl>
                    </div>
                </div>
            </Fragment>}
        </div>
    );
};

CustomerOrderDetailsPage.getLayout = (page) => <CustomerLayout><CustomerSettingsLayout>
    {page}
</CustomerSettingsLayout></CustomerLayout>;

export default CustomerOrderDetailsPage;