import React, { Fragment, useContext, useState } from "react";
import { BookProductContext } from "../../context/BookProductContext";
import Image from "next/image";
import { getFormattedTime } from "../../utils/helper";
import { AiOutlineNumber } from "react-icons/ai";
import { MdDiscount } from "react-icons/md";
import { BookProductStatuses, getBookProductStatusById } from "../../constants/BookProductStatuses";
import { useAuth } from "../../context/AuthContext";
import { BookProductService } from "../../services/BookProductService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ImBook } from "react-icons/im";
import { HiReceiptPercent } from "react-icons/hi2";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "../Form";
import SidebarButton from "../CampaignDetails/SidebarButton";
import ConfirmModal from "../Modal/ConfirmModal";
import { toast } from "react-hot-toast";

type Props = {}

const StatusCard: React.FC<Props> = ({}) => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const bookProductService = new BookProductService(loginUser?.accessToken);
    const product = useContext(BookProductContext);
    const bookStatus = getBookProductStatusById(product?.status);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [updateStatus, setUpdateStatus] = useState(false);


    const updateBookProductStatusMutation = useMutation(async (payload: any) => {
        if (!updateStatus) return bookProductService.rejectBookProductByAdmin(payload);
        return bookProductService.acceptBookProductByAdmin(payload);
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["admin_product"]);
            await queryClient.invalidateQueries(["admin_products"]);
        },
    });

    const FormSchema = z.object({
        id: z.string(),
        note: z.string().optional(),
    });

    type FormType = Partial<z.infer<typeof FormSchema>>;

    const { watch, register, handleSubmit } = useForm<FormType>({
        resolver: zodResolver(FormSchema),
        values: {
            id: product?.id,
        },
    });

    const onSubmit = async (data: FormType) => {
        try {
            const payload = FormSchema.parse(data);
            await toast.promise(updateBookProductStatusMutation.mutateAsync(payload), {
                loading: "Đang xử lý...",
                success: () => {
                    return updateStatus ? "Duyệt thành công" : "Từ chối thành công";
                },
                error: (err) => err?.message || "Đã có lỗi xảy ra",
            });
        } catch (e) {
            console.log(e);
            return;
        }

        setShowConfirmModal(false);
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white border rounded-sm"
        >

            <div className="px-6">
                <div className={`${bookStatus?.label?.classNames} w-fit px-3 py-1 my-6 font-medium !text-xs`}>
                    {bookStatus?.displayName}
                </div>
                <div className="flex items-center">
                    <Image src={product?.issuer?.user?.imageUrl || ""}
                           alt={""}
                           className={"rounded-full w-12 h-12 object-cover flex-shrink-0"}
                           width={500}
                           height={500} />
                    <div className="ml-3">
                        <h1 className="font-medium text-slate-800">
                            {product?.issuer?.user?.name} đã thêm sách bán này vào hội sách {product?.campaign?.name}
                        </h1>
                        <div className="font-medium text-sm text-gray-500">
                            {getFormattedTime(product?.createdDate, "HH:mm - dd/MM/yyyy")}
                            {product?.updatedDate ? ` (cập nhật lần cuối ${getFormattedTime(product?.updatedDate, "HH:mm - dd/MM/yyyy")})` : ""}
                        </div>
                    </div>
                </div>

                {/*Metadata*/}
                <div className="my-6 border grid sm:grid-cols-2 shadow-sm rounded-md p-3 gap-3 bg-white">
                    <div className="flex items-center gap-2">
                        <AiOutlineNumber
                            className="fill-white bg-blue-600 w-5 h-5 rounded-full p-1"
                        />
                        <div className="font-medium text-sm text-gray-500">
                            Số lượng bán: <span className="font-medium">{product?.saleQuantity}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <HiReceiptPercent
                            className="fill-white bg-green-600 w-5 h-5 rounded-full p-1"
                        />
                        <div className="font-medium text-sm text-gray-500">
                            Giảm giá: <span className="font-medium">{product?.discount}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <MdDiscount
                            className="fill-white bg-rose-600 w-5 h-5 rounded-full p-1"
                        />
                        <div className="font-medium text-sm text-gray-500">
                            Chiết khấu: <span className="font-medium">{product?.commission}%</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <ImBook
                            className="fill-white bg-yellow-500 w-5 h-5 rounded-full p-1"
                        />
                        <div className="font-medium text-sm text-gray-500">
                            Loại sách: <span className="font-medium">{product?.typeName}</span>
                        </div>
                    </div>
                </div>

                {product?.status === BookProductStatuses.Pending.id ?
                    <div className="mb-6">
                        <Form.Input<FormType>
                            isTextArea={true}
                            register={register}
                            fieldName={"note"}
                            placeholder={"Nhập ghi chú"}
                            label={"Ghi chú"} />

                    </div> :
                    <div className="bg-slate-50 rounded text-sm text-slate-600 mb-6 px-3 py-2 border border-slate-200">
                        📝 {product?.note || "Không có ghi chú"}
                    </div>
                }
            </div>

            {/*Action buttons*/}
            {product?.status === BookProductStatuses.Pending.id && <Fragment>
                <div className="md:flex space-y-2 md:space-y-0 items-center gap-2 p-6 bg-gray-50 md:flex-row-reverse">
                    <SidebarButton
                        onClick={() => {
                            setShowConfirmModal(true);
                            setUpdateStatus(true);
                        }}
                    >
                        Chấp nhận
                    </SidebarButton>

                    <SidebarButton
                        onClick={() => {
                            setShowConfirmModal(true);
                            setUpdateStatus(false);
                        }}
                        variant={"secondary"}
                    >
                        Từ chối
                    </SidebarButton>
                </div>
                <ConfirmModal
                    color={updateStatus ? "indigo" : ""}
                    disableButtons={updateBookProductStatusMutation.isLoading}
                    isOpen={showConfirmModal}
                    onClose={() => setShowConfirmModal(false)}
                    onConfirm={handleSubmit(onSubmit)}
                    title={updateStatus ? "Chấp nhận sách bán" : "Từ chối sách bán"}
                    content={updateStatus ? "Bạn có chắc chắn chấp nhận sách bán này?" : "Bạn có chắc chắn từ chối sách bán này?"}
                    confirmText={updateStatus ? "Chấp nhận" : "Từ chối"}
                />
            </Fragment>
            }
        </form>
    );
};

export default StatusCard;