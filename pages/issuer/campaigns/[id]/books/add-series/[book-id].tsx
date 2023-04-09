import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useFormik } from "formik";
import { useRouter } from "next/router";
import { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Form from "../../../../../../components/Form";
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import FormPageLayout from "../../../../../../components/Layout/FormPageLayout";
import WelcomeBanner from "../../../../../../components/WelcomBanner";
import { useAuth } from '../../../../../../context/AuthContext';
import { NextPageWithLayout } from "../../../../../_app";
import { getBookFormatById } from './../../../../../../constants/BookFormats';
import { BookService } from './../../../../../../services/BookService';

import Image from "next/image";
import { Controller } from 'react-hook-form';
import { IoChevronBack } from 'react-icons/io5';
import * as Yup from "yup";
import TableBody from "../../../../../../components/Admin/Table/TableBody";
import TableHeader from "../../../../../../components/Admin/Table/TableHeader";
import TableHeading from "../../../../../../components/Admin/Table/TableHeading";
import TableWrapper from "../../../../../../components/Admin/Table/TableWrapper";
import ErrorMessage from "../../../../../../components/Form/ErrorMessage";
import SelectBox from "../../../../../../components/SelectBox";
import { CampaignService } from '../../../../../../services/CampaignService';
import { BookFormats, IBookFormat } from '../../../../../../constants/BookFormats';
import { getBookProductsFormatOptions, getAvatarFromName } from './../../../../../../utils/helper';
import TableData from '../../../../../../components/Admin/Table/TableData';
import { BookProductService } from '../../../../../../services/BookProductService';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';



const AddSellingBookSeriesPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();
    const bookId = router.query['book-id'];

    const campaignId = router.query.id as string;

    const bookService  = new BookService(loginUser?.accessToken);
    const bookProductService = new BookProductService(loginUser?.accessToken);


    // const bookOdd = randomBooks.find(b => b.id === Number(bookId));
    const issuerCampaignService = new CampaignService(
        loginUser?.accessToken
    );
    // const bookId = router.query.id as string;


    const { data: book, isLoading } = useQuery(
        ["issuer_book", bookId],
        () => bookService.getBookById$Issuer(Number(bookId), { withCampaigns: true }),
        {
            refetchOnWindowFocus: false,
            enabled: !!bookId,
            onSuccess: (responseBook) => {
                reset({
                    bookId: Number(bookId),
                    campaignId: Number(campaignId),
                    saleQuantity: 0,
                    discount: 0,

                    commission: 0,
                    bookProductItems: responseBook?.bookItems?.map(i => {
                        return {
                            bookId: i.bookId,
                            displayIndex: i.displayIndex,
                            withPdf: false,
                            displayPdfIndex: 0,
                            withAudio: false,
                            displayAudioIndex: 0
                        }
                    }) || []
                });
            }
        }
    );
    const { data: campaigns } = useQuery(
        ["issuer_campaign", campaignId],
        () => issuerCampaignService.getCampaignByIdByIssuer(Number(campaignId)),{
            onSuccess: (data) => {
                reset(v=>({
                    ...v,
                    commission: data?.campaignCommissions?.find(c=>c.genreId  === book?.genre?.parentId)?.minimalCommission
                }))
            }
        }
    );

    const minimalCommission = campaigns?.campaignCommissions?.find(c => c.genreId === book?.genre?.parentId)?.minimalCommission || 0;

    const CreatOddBookSchema = z.object({
        bookId: z.literal(Number(bookId)),
        campaignId: z.literal(Number(campaignId)),
        format: z.number(),
        saleQuantity: z.coerce.number().min(1),
        discount: z.coerce.number().min(0).max(100),
        commission: z.coerce.number().min(0).max(100),
        bookProductItems: z.array(
            z.object({
                bookId: z.number(),
                // format: z.number(),
                displayIndex: z.number(),
                withPdf: z.boolean().default(false),
                displayPdfIndex: z.number(),
                withAudio: z.boolean().default(false),
                displayAudioIndex: z.number()
            })
        )
    });



    type FormType = Partial<z.infer<typeof CreatOddBookSchema>>;


    const { register, reset, watch, control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormType>({
        resolver: zodResolver(CreatOddBookSchema),
        
    });



    const createSeriesBookMutation = useMutation((data: any) => {
        return bookProductService.createSeriesBookProductByIssuer(data)
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['books', book?.id]);
            router.push(`/issuer/campaigns/${campaignId}`);
        }
    });
    const onSubmit = async (data: FormType) => {

        // alert(JSON.stringify(data));
        try {
            const payload = CreatOddBookSchema.parse(data);
            // payload.commission = 10;
            const bookProductItems = payload.bookProductItems?.map(i => {
                return {
                    ...i,
                    format: payload.format
                }
            });

            console.log(JSON.stringify(payload));
            await toast.promise(createSeriesBookMutation.mutateAsync({
                ...payload,
                bookProductItems
            }), {
                loading: "Đang thêm sách",
                success: () => {
                    return "Thêm sách thành công";
                },
                error: (err) => err?.message || "Thêm sách thất bại",
            });
            console.log(payload)
        } catch (error) {
            console.log(error);
            return;
        }
    }
    const availableFormats = getBookProductsFormatOptions(book, campaigns?.format);
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
        <FormPageLayout>
            <WelcomeBanner label={`Thêm sách series cho hội sách✨${campaigns?.name} 📚`} className="p-6 sm:p-10" />
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
                            src={book?.imageUrl || ''} alt={book?.name || ''} />
                        <div>
                        <div
                               className='inline mb-2 bg-blue-500 text-sm font-medium text-white py-2 px-3 w-fit rounded'>{book?.code}
                            </div>
                            <div
                            className='inline ml-2 mb-2 bg-amber-500 text-sm font-medium text-white py-2 px-3 w-fit rounded'>{book?.genre?.name}
                        </div>
                            <h1 className="mt-3 mb-2 text-2xl font-medium text-slate-800">{book?.name}</h1>
                    


                            {/* Price */}
                            <div className="text-emerald-600 font-medium text-xl mt-3">
                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(book?.coverPrice || 0)}
                            </div>

                            {/* Description */}
                            <div className="mt-3 text-sm text-gray-500">
                                {book?.description}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-3">
                            <Form.Input<FormType>
                                register={register}
                                inputType={'number'}
                                placeholder={"Giảm giá"}
                                fieldName={"discount"}
                                label={"Giảm giá (%)"}
                                errorMessage={errors?.discount?.message}
                            />
                             <Form.Input<FormType>
                                register={register}
                                inputType={'number'}
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
                                {book?.bookItems && book?.bookItems.length > 0 ? (
                                    book?.bookItems.map((book, index) => {
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
                                                                            id={`bonus-${format.id}-b${book.id}`}
                                                                            type="checkbox"
                                                                            {...register(registerName)}
                                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
                        <button className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                            Hủy
                        </button>
                        <button type="submit" className="m-btn text-white bg-indigo-600 hover:bg-indigo-700">
                            Thêm sách
                        </button>
                    </div>

                    <pre>{JSON.stringify(watch(), null, 2)}</pre>

                </form>
            </div>
        </FormPageLayout>
    )
}

AddSellingBookSeriesPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AddSellingBookSeriesPage