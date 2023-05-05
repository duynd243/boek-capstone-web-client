import React, { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { IoChevronBack } from "react-icons/io5";
import Form from "../Form";
import Image from "next/image";
import { IBookProduct } from "../../types/Book/IBookProduct";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getBookProductsFormatOptions } from "../../utils/helper";
import { BookFormats, getBookFormatById, IBookFormat } from "./../../constants/BookFormats";
import SelectBox from "./../SelectBox/index";
import ErrorMessage from "./../Form/ErrorMessage";
import { IBook } from "../../types/Book/IBook";
import { toast } from "react-hot-toast";
import { BookProductService } from "../../services/BookProductService";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CampaignContext } from "./../../context/CampaignContext";
import useEditBookProduct from "./useEditBookProduct";

type Props = {
    product: IBookProduct;
    editBasicInfoOnly?: boolean;
}

const SingleBookProductForm = ({ product, editBasicInfoOnly = false }: Props) => {

    const router = useRouter();

    const { loginUser } = useAuth();

    const { editBasicInfoMutation } = useEditBookProduct();


    const campaign = useContext(CampaignContext);
    const queryClient = useQueryClient();

    const minimalCommission = campaign
        ?.campaignCommissions
        ?.find((c) => c?.genreId === product?.genre?.parentId)?.minimalCommission || 0;

    const UpdateBookProductSchema = z.object({
        id: z.string(),
        format: z.number(),
        saleQuantity: z.coerce.number().min(1),
        discount: z.coerce.number().min(0).max(100),
        commission: z.coerce.number().min(minimalCommission).max(100),
        withPdf: z.boolean(),
        displayPdfIndex: z.number(),
        withAudio: z.boolean(),
        displayAudioIndex: z.number(),
        status: z.number(),
    });


    type FormType = Partial<z.infer<typeof UpdateBookProductSchema>>;

    const defaultValues: FormType = {
        id: product?.id,
        saleQuantity: product?.saleQuantity || 0,
        discount: product?.discount || 0,
        commission: product?.commission || 0,
        withPdf: product?.withPdf || false,
        displayPdfIndex: 1,
        withAudio: product?.withAudio || false,
        displayAudioIndex: 2,
        format: product?.format,
        status: product?.status,
    };


    const {
        register,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormType>({
        resolver: zodResolver(UpdateBookProductSchema),
        defaultValues,
    });
    const bookProductService = new BookProductService(loginUser?.accessToken);
    const updateOddBookProductMutation = useMutation((data: any) => {
        return bookProductService.updateOddBookProductByIssuer(data);
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["issuer_product"]);
            await router.push(`/issuer/products`);
        },
    });

    const availableFormats = getBookProductsFormatOptions({
        ...product?.book,
        fullPdfAndAudio: true,
    } as (IBook | undefined), product?.campaign?.format);
    const selectedFormat = getBookFormatById(watch("format"));

    const availableBonuses = availableFormats.filter((format) => format.id !== selectedFormat?.id && format.id !== BookFormats.PAPER.id);


    const onSubmit = async (data: FormType) => {


        //alert(JSON.stringify(data));

        if (editBasicInfoOnly) {
            try {
                const payload = {
                    id: data.id,
                    saleQuantity: data.saleQuantity,
                    status: 3,
                };

                // payload.commission = 10;
                await toast.promise(editBasicInfoMutation.mutateAsync({
                    ...payload,
                }), {
                    loading: "Đang cập nhập sách",
                    success: () => {
                        return "Cập nhập sách thành công";
                    },
                    error: (err) => err?.message || "Cập nhập sách thất bại",
                });
                console.log(payload);
            } catch (error) {
                console.log(error);
                return;
            }
        } else {
            try {
                const payload = UpdateBookProductSchema.parse(data);
                // payload.commission = 10;

                console.log(JSON.stringify(payload));
                await toast.promise(updateOddBookProductMutation.mutateAsync(payload), {
                    loading: "Đang cập nhập sách",
                    success: () => {
                        return "Chỉnh sửa sách thành công";
                    },
                    error: (err) => err?.message || "Chỉnh sửa sách thất bại",
                });
                console.log(payload);
            } catch (error) {
                console.log(error);
                return;
            }
        }

    };

    console.log("errors", errors);
    return (
        <div>
            <form className="p-6 sm:p-10" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-6">
                    <button
                        type="button"
                        className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                        onClick={() => router.back()}
                    >
                        <IoChevronBack size={"17"} />
                        <span>Quay lại</span>
                    </button>
                </div>
                <Form.GroupLabel
                    label={"Thông tin chung"}
                    description={"Thông tin cơ bản về sách"}
                />
                <div className="mt-3 space-y-4 md:space-y-0 md:flex gap-6">
                    <Image
                        width={1200}
                        height={1200}
                        className={"rounded-md w-64 h-72 object-cover max-w-full shadow-md"}
                        src={product?.book?.imageUrl || ""} alt={product?.book?.name || ""} />
                    <div>
                        <div
                            className="inline mb-2 bg-blue-500 text-sm font-medium text-white py-2 px-3 w-fit rounded">{product?.book?.code}
                        </div>
                        <div
                            className="inline ml-2 mb-2 bg-amber-500 text-sm font-medium text-white py-2 px-3 w-fit rounded">{product?.book?.genre?.name}
                        </div>
                        <h1 className="mt-3 mb-2 text-2xl font-medium text-slate-800">{product?.title}</h1>
                        <div className="text-gray-500">NXB: {product?.book?.publisher?.name}</div>


                        {/* Price */}
                        <div className="text-emerald-600 font-medium text-xl mt-3">{
                            product?.book?.coverPrice
                        } ₫
                        </div>

                        {/* Description */}
                        <div className="mt-3 text-sm text-gray-500">
                            {product?.book?.description}
                        </div>
                    </div>
                </div>

                <div className="mt-4 space-y-4">
                    <div className="grid gap-y-4 gap-x-4 sm:grid-cols-3">
                        <Form.Input<FormType>
                            register={register}
                            inputType={"number"}
                            disabled={editBasicInfoOnly}
                            placeholder={"Giảm giá"}
                            fieldName={"discount"}
                            label={"Giảm giá (%)"}
                            errorMessage={errors?.discount?.message}
                        />
                        <Form.Input<FormType>
                            register={register}
                            inputType={"number"}
                            disabled={editBasicInfoOnly}
                            placeholder={"Chiết khấu"}
                            fieldName={"commission"}
                            label={`Chiết khấu (tối thiểu phải từ ${minimalCommission}%)`}
                            errorMessage={errors?.commission?.message}
                        />
                        <Form.Input<FormType>
                            register={register}
                            inputType={"number"}
                            placeholder={"Nhập số lượng sách sẽ được bán"}
                            required={true}
                            fieldName={"saleQuantity"}
                            label={"Số lượng"}
                            errorMessage={errors?.saleQuantity?.message}
                        />
                    </div>
                </div>
                <Form.Divider />
                <Form.GroupLabel
                    label={"Định dạng"}
                    description={"Định dạng sách sẽ bán và tặng kèm"}
                />
                <div className="mt-3 space-y-4">
                    <div>
                        <Form.Label required={true} label={"Định dạng sách"} />
                        <Controller
                            control={control}
                            name="format"
                            render={({ field }) => (
                                <SelectBox<IBookFormat>
                                    placeholder={"Chọn định dạng"}
                                    value={selectedFormat || null}
                                    disabled={editBasicInfoOnly}
                                    onValueChange={(value) => {
                                        if (value) {
                                            field.onChange(value.id);
                                            setValue("withPdf", false);
                                            setValue("withAudio", false);
                                        }
                                    }}
                                    dataSource={availableFormats}
                                    displayKey={"displayName"}
                                />
                            )}

                        />
                        <ErrorMessage>{errors.format?.message}</ErrorMessage>
                    </div>
                    <div>
                        <Form.Label label={"Tặng kèm"} />
                        <div className="grid sm:grid-cols-2">
                            {selectedFormat ? (availableBonuses?.length > 0 ? availableBonuses.map((format) => {
                                const registerName = format.id === BookFormats.PDF.id ? "withPdf" : "withAudio";
                                return (
                                    <div key={format.id} className="relative flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input
                                                disabled={editBasicInfoOnly}
                                                id={`bonus-${format.id}`}
                                                type="checkbox"
                                                {...register(registerName)}
                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label
                                                htmlFor={`bonus-${format.id}`}
                                                className="text-sm font-medium text-gray-600"
                                            >
                                                Sách {format.displayName} -
                                                {selectedFormat?.id === BookFormats.PAPER.id ? (
                                                    //If the format is a paper book, it will display 2 checkboxes that are audio books and pdf books, each checkbox has a different value
                                                    <span
                                                        className="text-gray-500">{format?.id === BookFormats.PDF.id ? (
                                                        <span
                                                            className="text-gray-500">{product?.book?.pdfExtraPrice} ₫</span>
                                                    ) : (
                                                        <span
                                                            className="text-gray-500">{product?.book?.audioExtraPrice} ₫</span>
                                                    )
                                                    }</span>
                                                ) : selectedFormat?.id === BookFormats.PDF.id ? (
                                                    <span
                                                        className="text-gray-500">{product?.book?.audioExtraPrice} ₫</span>
                                                ) : (
                                                    <span
                                                        className="text-gray-500">{product?.book?.pdfExtraPrice} ₫</span>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                );
                            }) : <div className="text-gray-500 text-sm">Không tìm thấy tặng kèm khả dụng.</div>) : (
                                <div className="text-gray-500 text-sm">Bạn cần chọn định dạng để xem được các mục
                                    tặng kèm khả dụng.</div>
                            )}
                        </div>
                    </div>
                </div>
                <Form.Divider />
                <div className="flex justify-end gap-4">
                    <button type="button" className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                        Hủy
                    </button>
                    <button type="submit" className="m-btn text-white bg-indigo-600 hover:bg-indigo-700">
                        Thêm sách
                    </button>
                </div>
            </form>
            {/*<pre>{JSON.stringify(watch(), null, 2)}</pre>*/}
        </div>
    );
};

export default SingleBookProductForm;