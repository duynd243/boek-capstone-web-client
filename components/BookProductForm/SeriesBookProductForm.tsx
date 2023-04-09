import React from 'react'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { IoChevronBack } from 'react-icons/io5';
import Form from '../Form';
import Image from 'next/image';
import { IBookProduct } from '../../types/Book/IBookProduct';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBookProductsFormatOptions } from '../../utils/helper';
import { BookFormats, getBookFormatById, IBookFormat } from './../../constants/BookFormats';
import { Controller } from 'react-hook-form';
import SelectBox from './../SelectBox/index';
import ErrorMessage from './../Form/ErrorMessage';
import { IBook } from '../../types/Book/IBook';
import { toast } from 'react-hot-toast';
import { BookProductService } from '../../services/BookProductService';
import { useAuth } from '../../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import TableWrapper from './../Admin/Table/TableWrapper';
import TableHeading from './../Admin/Table/TableHeading';
import TableHeader from './../Admin/Table/TableHeader';
import TableBody from './../Admin/Table/TableBody';
import TableData from './../Admin/Table/TableData';
import useEditBookProduct from './useEditBookProduct';
import { useContext } from 'react';
import { CampaignContext } from './../../context/CampaignContext';


type Props = {
    product: IBookProduct;
    editBasicInfoOnly?: boolean;
}

const SeriesBookProductForm = ({ product,  editBasicInfoOnly = false }: Props) => {



    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    
  const { editBasicInfoMutation } = useEditBookProduct();

    const router = useRouter();

    const bookProductService = new BookProductService(loginUser?.accessToken);

    // const bookId = router.query.id as string;
    const campaign = useContext(CampaignContext);
    const minimalCommission = campaign
    ?.campaignCommissions
    ?.find((c) => c?.genreId === product?.genre?.parentId)?.minimalCommission || 0;


    const UpdateSeriesBookProductSchema = z.object({
        id: z.string(),
        format: z.number(),
        saleQuantity: z.coerce.number().min(1),
        discount: z.coerce.number().min(0).max(100),
        commission: z.coerce.number().min(minimalCommission).max(100),
        status: z.number(),
        bookProductItems: z.array(
            z.object({
                bookId: z.number(),
                format: z.number(),
                displayIndex: z.number(),
                withPdf: z.boolean(),
                displayPdfIndex: z.number(),
                withAudio: z.boolean(),
                displayAudioIndex: z.number(),
                book: z.any(),
            })
        )
    })



    type FormType = Partial<z.infer<typeof UpdateSeriesBookProductSchema>>;
    const defaultValues: FormType = {
        id: product?.id,
        saleQuantity: product?.saleQuantity || 0,
        discount: product?.discount || 0,
        commission: product?.commission || 0,
        format: product?.format,
        status: product?.status,
        bookProductItems: product?.bookProductItems?.map(i => {
            return {
                "bookId": i?.bookId,
                "format": i?.format,
                "displayIndex": i?.displayIndex,
                "withPdf": i?.withPdf,
                "displayPdfIndex": i?.displayPdfIndex || 1,
                "withAudio": i?.withAudio,
                "displayAudioIndex": i?.displayAudioIndex || 2,
                book: {
                    name: i?.book?.name,
                    pdfExtraPrice: i?.pdfExtraPrice,
                    audioExtraPrice: i?.audioExtraPrice,
                    code: i?.book?.code,
                    imageUrl: i?.book?.imageUrl,
                    coverPrice: i?.book?.coverPrice
                }
            }
        }) || []
    };

    const { register, reset, watch, control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormType>({
        resolver: zodResolver(UpdateSeriesBookProductSchema),
        defaultValues,
    });



    const updateSeriesBookProductMutation = useMutation((data: any) => {
        return bookProductService.updateSeriesBookProductByIssuer(data)
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['issuer_product']);
            await router.push(`/issuer/products`);
        }
    });
    const onSubmit = async (data: FormType) => {

        // alert(JSON.stringify(data));
        if(editBasicInfoOnly){
            try {
                const payload = {
                  id: data.id,
                  saleQuantity: data.saleQuantity,
                  status: 3
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
                console.log(payload)
              } catch (error) {
                console.log(error);
                return;
              }
        } else {
            try {
                const payload = UpdateSeriesBookProductSchema.parse(data);
                // payload.commission = 10;
                const bookProductItems = payload.bookProductItems?.map(i => {
                    return {
                        ...i,
                        format: payload.format
                    }
                });
    
                console.log(JSON.stringify(payload));
                await toast.promise(updateSeriesBookProductMutation.mutateAsync({
                    ...payload,
                    bookProductItems
                }), {
                    loading: "Đang cập nhập series",
                    success: () => {
                        return "Cập nhập series thành công";
                    },
                    error: (err) => err?.message || "Cập nhập series thất bại",
                });
                console.log(payload)
            } catch (error) {
                console.log(error);
                return;
            }
        }
        
    }
    const availableFormats = getBookProductsFormatOptions({
        ...product?.book,
        fullPdfAndAudio: true,
    } as (IBook | undefined), product?.campaign?.format);
    const selectedFormat = getBookFormatById(watch('format'));

    const availableBonuses = availableFormats.filter((format) => format.id !== selectedFormat?.id && format.id !== BookFormats.PAPER.id);
    console.log(errors);


    const clearAllBonuses = () => {
        const currentBookProductItems = [...watch("bookProductItems") || []];

        setValue("bookProductItems", currentBookProductItems.map(i => {
            return {
                ...i,
                withAudio: false,
                withPdf: false,
            }
        }));
    }


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
                <div className='mt-3 space-y-4 md:space-y-0 md:flex gap-6'>
                    <Image
                        width={1000}
                        height={1000}
                        className={'rounded-md w-64 h-72 object-cover max-w-full shadow-md'}
                        src={product?.book?.imageUrl || ''} alt={product?.book?.name || ''} />
                    <div>
                        <div
                            className='inline mb-2 bg-blue-500 text-sm font-medium text-white py-2 px-3 w-fit rounded'>{product?.book?.code}
                        </div>
                        <div
                            className='inline ml-2 mb-2 bg-amber-500 text-sm font-medium text-white py-2 px-3 w-fit rounded'>{product?.book?.genre?.name}
                        </div>
                        <h1 className="mt-3 mb-2 text-2xl font-medium text-slate-800">{product?.book?.name}</h1>
                        {/* <div className="text-gray-500">NXB: {product?.book?.publisher?.name}</div> */}


                        {/* Price */}
                        <div className="text-emerald-600 font-medium text-xl mt-3">{
                            product?.book?.coverPrice
                        } ₫</div>

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
                            disabled={editBasicInfoOnly}
                            inputType={'number'}
                            placeholder={"Giảm giá"}
                            fieldName={"discount"}
                            label={"Giảm giá (%)"}
                            errorMessage={errors?.discount?.message}
                        />
                        <Form.Input<FormType>
                            register={register}
                            inputType={'number'}
                            disabled={editBasicInfoOnly}
                            placeholder={"Chiết khấu"}
                            fieldName={"commission"}
                            label={`Chiết khấu (tối thiểu phải từ ${minimalCommission}%)`}
                            errorMessage={errors?.commission?.message}
                        />
                        <Form.Input<FormType>
                            register={register}
                            inputType={'number'}
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
                                            clearAllBonuses()
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
                            {/*{selectedFormat ? (availableBonuses?.length > 0 ? availableBonuses.map((format) => (*/}
                            {/*    <div key={format.id} className="relative flex items-start">*/}
                            {/*        <div className="flex h-5 items-center">*/}
                            {/*            <input*/}
                            {/*                id={`bonus-${format.id}`}*/}
                            {/*                name="bonus"*/}
                            {/*                type="checkbox"*/}
                            {/*                value={format.id}*/}
                            {/*                onChange={(event => {*/}
                            {/*                    if (event.target.checked) {*/}
                            {/*                        handleAddBonus(format.id);*/}
                            {/*                    } else {*/}
                            {/*                        handleRemoveBonus(format.id);*/}
                            {/*                    }*/}
                            {/*                })*/}
                            {/*                }*/}
                            {/*                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"*/}
                            {/*            />*/}
                            {/*        </div>*/}
                            {/*        <div className="ml-3 text-sm">*/}
                            {/*            <label*/}
                            {/*                htmlFor={`bonus-${format.id}`}*/}
                            {/*                className="text-sm font-medium text-gray-600"*/}
                            {/*            >*/}
                            {/*                Tất cả sách {format.name} trong series*/}
                            {/*            </label>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}
                            {/*)) : <div className="text-gray-500 text-sm">Không tìm thấy tặng kèm khả dụng.</div>) : (*/}
                            {/*    <div className="text-gray-500 text-sm">Bạn cần chọn định dạng để xem được các mục*/}
                            {/*        tặng kèm khả dụng.</div>*/}
                            {/*)}*/}
                        </div>
                    </div>
                </div>

                <Form.Divider />
                <Form.GroupLabel
                    label={"Chọn sách series"}
                    description={"Chọn sách series để bán"}
                />
                <div className="mt-3">
                    <TableWrapper>
                        <TableHeading>
                            <TableHeader>Mã sách</TableHeader>
                            <TableHeader>Tên sách</TableHeader>
                            <TableHeader>Giá bìa</TableHeader>
                            {/* <TableHeader>Nhà xuất bản</TableHeader> */}
                            <TableHeader>Tặng kèm</TableHeader>
                        </TableHeading>
                        <TableBody>
                            {watch('bookProductItems') !== undefined && watch('bookProductItems')?.length > 0 ? (
                                watch('bookProductItems')?.map((book, index) => {
                                    return (
                                        <tr key={index}>
                                            <TableData className="text-sm font-medium uppercase text-gray-500">
                                                {book?.book?.code}
                                            </TableData>
                                            <TableData className="max-w-72">
                                                <div className="flex items-center gap-4">
                                                    <Image
                                                        width={500}
                                                        height={500}
                                                        className="h-20 w-16 object-cover"
                                                        src={book?.book?.imageUrl || ""}
                                                        alt=""
                                                    />
                                                    <div
                                                        className="max-w-56 overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                                                        {book?.book?.name}
                                                    </div>
                                                </div>
                                            </TableData>
                                            <TableData className="text-sm font-semibold text-emerald-600">
                                                {book?.book?.coverPrice} ₫
                                            </TableData>
                                            {/* <TableData>
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <Image
                                                                width={100}
                                                                height={100}
                                                                className="h-10 w-10 rounded-full"
                                                                src={book?.book?.publisher?.imageUrl || getAvatarFromName(book?.book?.publisher?.name)}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm text-gray-900">
                                                                {book?.book?.publisher?.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableData> */}
                                            <TableData
                                                textAlignment="text-center"
                                                className="text-sm text-gray-500"
                                            >

                                                {watch("format") &&
                                                    <>

                                                        {availableBonuses?.length > 0 ? availableBonuses?.map((format) => {
                                                            const registerName = format.id === BookFormats.PDF.id ?
                                                                `bookProductItems.${index}.withPdf` as const :
                                                                `bookProductItems.${index}.withAudio` as const;
                                                            const extraPrice = format.id === BookFormats.PDF.id ?
                                                                book?.book?.pdfExtraPrice : book?.book?.audioExtraPrice

                                                            return (
                                                                <div
                                                                    key={format.id}
                                                                    className="relative flex items-center gap-2">
                                                                    <input
                                                                    disabled={editBasicInfoOnly}
                                                                        id={`bonus-${format.id}-b${book.id}`}
                                                                        type="checkbox"
                                                                        {...register(registerName)}
                                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                                                                    />
                                                                    <label
                                                                        htmlFor={`bonus-${format.id}-b${book.id}`}
                                                                        className="text-sm font-medium text-gray-600"
                                                                    >
                                                                        {format.displayName} - <span
                                                                            className="text-emerald-600 font-medium">
                                                                            {new Intl.NumberFormat("vi-VN", {
                                                                                style: "currency",
                                                                                currency: "VND",
                                                                            }).format(extraPrice)}</span>

                                                                    </label>
                                                                </div>
                                                            )
                                                        })
                                                            : <div className="text-gray-500 text-sm">-</div>}
                                                    </>
                                                }

                                                {!watch("format") && <div>Bạn cần chọn định dạng để xem được các mục tặng kèm khả dụng.</div>}

                                            </TableData>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <TableData
                                        colSpan={6}
                                        textAlignment={"text-center"}
                                        className="text-sm font-medium uppercase leading-10 text-gray-500 "
                                    >
                                        Chưa có sách nào được chọn
                                    </TableData>
                                </tr>
                            )}
                        </TableBody>
                    </TableWrapper>

                </div>
                <Form.Divider />
                <div className='flex justify-end gap-4'>
                    <button type='button' className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                        Hủy
                    </button>
                    <button type="submit" className="m-btn text-white bg-indigo-600 hover:bg-indigo-700">
                        Cập nhập Series
                    </button>
                </div>

                <pre>{JSON.stringify(watch(), null, 2)}</pre>

            </form>
        </div>
    )
}

export default SeriesBookProductForm