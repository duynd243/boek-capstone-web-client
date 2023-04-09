import React, { Fragment, useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { IOrder } from "../../../types/Order/IOrder";
import { useForm, Controller } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import { getNextUpdateStatus, getOrderStatusById, OrderStatuses } from './../../../constants/OrderStatuses';
import Image from "next/image";
import { getFormattedTime } from './../../../utils/helper';
import Form from "../../Form";
import SidebarButton from './../../CampaignDetails/SidebarButton';
import ConfirmModal from './../ConfirmModal';
import { OrderService } from './../../../services/OrderService';
import Link from 'next/link';
import { IoChevronBack } from 'react-icons/io5';
import { useRouter } from 'next/router';
import { ICampaignOrganization } from "../../../types/Campaign_Organization/ICampaignOrganization";
import { HiMapPin, HiOutlineChevronDown } from "react-icons/hi2";
import EmptySection from './../../CampaignDetails/EmptySection';
import { CampaignContext } from './../../../context/CampaignContext';
import OrganizationCard from './../../CampaignDetails/OrganizationCard';
import { CampaignService } from './../../../services/CampaignService';
import { useQuery } from "@tanstack/react-query";
import ContentHeader from './../../CampaignDetails/ContentHeader';
import SelectBox from './../../SelectBox/index';
import useAddress from './../../../hooks/useAddress';
import Index from './../../../pages/index';


type Props = {
    order: IOrder | undefined;
    campaignOrganization: ICampaignOrganization;
}

const StatusCard: React.FC<Props> = ({ order, campaignOrganization }) => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const orderService = new OrderService(loginUser?.accessToken);
    //const product = useContext(BookProductContext);
    const orderStatus = getOrderStatusById(order?.status);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);
    const [showConfirmAdressModal, setShowConfirmAdressModal] = useState(false);
    const router = useRouter();
    const { data: addresses } = useQuery(
        ["address"], () => {
            if (order) {
                return orderService.getOrderAddressesIdByIssuer(order?.id);
            }
        },
        {
            enabled: !!order,
            select: (data) => {
                return data?.map((item, index) => {
                    return {
                        id: index,
                        value: item,
                    };
                }) || [];
            }
        }
    )

    const updateOrderStatusMutation = useMutation(async (payload: any) => {
        if (showConfirmAdressModal) return orderService.updatePickUpOrderAdress(payload);
        if (!updateStatus) return orderService.updateCancelOrderStatus(payload);
        // if (showConfirmAdressModal) return orderService.updatePickUpOrderAdress(payload);
        const nextStatus = getNextUpdateStatus(order?.status, order?.type);


        switch (nextStatus) {
            case OrderStatuses.SHIPPING:
                return orderService.updateOrderToShippingStatus(payload);
                break;
            case OrderStatuses.SHIPPED:
                return orderService.updateShippingToShippedStatus(payload);
                break;
            case OrderStatuses.WAITING_RECEIVE:
                return orderService.updatePickUpOrderToShippingStatus(payload);
                break;
        }

        return Promise.reject("Không thể cập nhật trạng thái đơn hàng");
    }
        , {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["order"]);
            },
        });

    const FormSchema = z.object({
        id: z.string(),
        note: z.string().optional(),
        address: z.string(),
    });

    type FormType = Partial<z.infer<typeof FormSchema>>;

    const { watch, register, handleSubmit, control } = useForm<FormType>({
        resolver: zodResolver(FormSchema),
        values: {
            id: order?.id,
            address: order?.address,
        },
    });

    const onSubmit = async (data: FormType) => {
        try {
            const payload = FormSchema.parse(data);
            await toast.promise(updateOrderStatusMutation.mutateAsync(payload), {
                loading: "Đang xử lý...",
                success: () => {
                    return updateStatus ? "Cập nhập trạng thái thành công" : "Hủy thành công";
                },
                error: (err) => err?.message || "Đã có lỗi xảy ra",
            });
        } catch (e) {
            console.log(e);
            return;
        }

        setShowConfirmModal(false);
        setShowConfirmAdressModal(false);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border rounded-sm"
        >
            {/* <div className={"w-fit px-3 py-1 my-6 font-medium !text-xs"}>
                <button
                    className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                    href="/issuer/books"
                >
                    <IoChevronBack size={"17"} />
                    <span>Quay lại</span>
                </button>
            </div> */}
            <div className={"w-fit px-3 py-1 my-6 font-medium !text-xs"}>
                <Link
                    className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                    href={order?.type === 1 ? "/issuer/orders/delivery" : "/issuer/orders/pickup"}
                >
                    <IoChevronBack size={"17"} />
                    <span>Quay lại</span>
                </Link>
            </div>
            <div className="px-6">
                <div className={`${orderStatus?.labelColor} w-fit px-3 py-1 my-6 font-medium !text-xs`}>
                    {orderStatus?.displayName}
                </div>
                <div className="flex items-center">
                    <Image src={order?.customer?.user?.imageUrl || ""}
                        alt={""}
                        className={"rounded-full w-12 h-12 object-cover flex-shrink-0"}
                        width={500}
                        height={500} />
                    <div className="ml-3">
                        <h1 className="font-medium text-slate-800">
                            {order?.customer?.user?.name} đã thêm đơn hàng này vào hội sách {order?.campaign?.name}
                        </h1>
                        <div className="font-medium text-sm text-gray-500">
                            {getFormattedTime(order?.orderDate, "HH:mm - dd/MM/yyyy")}
                        </div>
                    </div>
                </div>


                <div className="bg-slate-50 rounded text-sm text-slate-600 mb-6 px-3 py-2 border border-slate-200">
                    📝 {order?.note || "Không có ghi chú"}
                </div>
                {order?.type === 2 && <div className="bg-slate-50 rounded text-sm text-slate-600 mb-6 px-3 py-2 border border-slate-200">
                    📝 {order?.address || "Chưa có địa chỉ nhận hàng"}
                </div>}


                {order?.status !== OrderStatuses.CANCELLED.id &&
                    <div className="mb-6">
                        <Form.Input<FormType>
                            isTextArea={true}
                            register={register}
                            fieldName={"note"}
                            placeholder={"Nhập ghi chú"}
                            label={"Ghi chú"} />

                    </div>}
                {order?.type === 2 &&  order?.status !== OrderStatuses.SHIPPED.id &&
                    <Fragment>
                            <Form.Label label={"Địa chỉ nhận hàng"} />
                        <Controller
                            control={control}
                            name="address"
                            render={({ field }) => (
                                <SelectBox
                                    value={addresses?.find((address) => address.value === field.value) || null}
                                    placeholder={"Chọn địa chỉ nhận hàng"}
                                    onValueChange={(v) => {
                                        field.onChange(v?.value);
                                    }}
                                    displayKey="value"
                                    dataSource={addresses}
                                />
                            )}
                        />
                    </Fragment>
                }
            </div>
            {/*Action buttons*/}
            <Fragment>
                <div className="p-6 bg-gray-50 space-y-2">

                    {order?.status !== OrderStatuses.CANCELLED.id && order?.status === OrderStatuses.WAITING_RECEIVE.id && order?.status !== OrderStatuses.SHIPPED.id && <SidebarButton
                        onClick={() => {
                            setShowConfirmAdressModal(true);
                          
                        }}
                    >

                        Cập nhập địa chỉ
                    </SidebarButton>}

                    <div className="md:flex space-y-2 md:space-y-0 items-center gap-2  md:flex-row-reverse">
                        {order?.status !== OrderStatuses.CANCELLED.id && order?.status !== OrderStatuses.WAITING_RECEIVE.id && order?.status !== OrderStatuses.SHIPPED.id && <SidebarButton
                            onClick={() => {
                                setShowConfirmModal(true);
                                setUpdateStatus(true);
                            }}
                        >

                            Chuyển sang {getNextUpdateStatus(order?.status, order?.type)?.displayName?.toLowerCase()}
                        </SidebarButton>}

                        {order?.status === OrderStatuses.PROCESSING.id && <SidebarButton
                            onClick={() => {
                                setShowConfirmModal(true);
                                setUpdateStatus(false);
                            }}
                            variant={"secondary"}
                        >
                            Huỷ đơn hàng
                        </SidebarButton>}
                    </div>
                </div>
                <ConfirmModal
                    color={updateStatus ? "indigo" : ""}
                    //disableButtons={false}
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleSubmit(onSubmit)}
                    title={updateStatus ? `Chuyển sang ${getNextUpdateStatus(order?.status, order?.type)?.displayName?.toLowerCase()}` : "Hủy đơn hàng"}
                    content={updateStatus ? `Bạn có chắc muốn chuyển trạng thái đơn hàng sang ${getNextUpdateStatus(order?.status, order?.type)?.displayName?.toLowerCase()}` : "Bạn có chắc muốn hủy đơn hàng này?"}
                    confirmText={updateStatus ? "Chấp nhận" : "Xác nhận huỷ"}
                />
                <ConfirmModal
                    color={ "indigo"}
                    //disableButtons={false}
                    isOpen={showConfirmAdressModal}
                    onClose={() => setShowConfirmAdressModal(false)}
                    onConfirm={handleSubmit(onSubmit)}
                    title={"Cập nhập địa chỉ đơn hàng"}
                    content={"Bạn có chắc muốn cập nhập địa chỉ đơn hàng này?"}
                    confirmText={"Cập nhập"}
                />
            </Fragment>

            {/* <pre>
                {JSON.stringify(watch(), null, 2)}
            </pre> */}

        </form>
    );
};

export default StatusCard;