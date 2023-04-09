import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { IoChevronBack } from 'react-icons/io5';
import { z } from 'zod';
import Form from "../../../../../../components/Form";
import ErrorMessage from "../../../../../../components/Form/ErrorMessage";
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import FormPageLayout from "../../../../../../components/Layout/FormPageLayout";
import SelectBox from "../../../../../../components/SelectBox";
import WelcomeBanner from "../../../../../../components/WelcomBanner";
import { BookFormats, IBookFormat } from '../../../../../../constants/BookFormats';
import { useAuth } from '../../../../../../context/AuthContext';
import { BookProductService } from '../../../../../../services/BookProductService';
import { BookService } from '../../../../../../services/BookService';
import { IBook } from '../../../../../../types/Book/IBook';
import { NextPageWithLayout } from "../../../../../_app";
import { getBookFormatById } from '../../../../../../constants/BookFormats';
import { IssuerCampaignService } from '../../../../../../old-services/Issuer/Issuer_CampaignService';
import { CampaignFormats } from '../../../../../../constants/CampaignFormats';
import { CampaignService } from '../../../../../../services/CampaignService';
import { getBookProductsFormatOptions } from '../../../../../../utils/helper';


const AddSellingBookPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();
    const bookId = router.query['book-id'];
    const issuerCampaignService = new CampaignService(
        loginUser?.accessToken
    );
    const bookService  = new BookService(loginUser?.accessToken);
    const bookProductService = new BookProductService(loginUser?.accessToken);
    // const bookId = router.query.id as string;
    const campaignId = router.query.id as string;


    const { data: book, isLoading } = useQuery(
        ["issuer_book", bookId],
        () => bookService.getBookById$Issuer(Number(bookId), { withCampaigns: true }),
        {
            refetchOnWindowFocus: false,
            enabled: !!bookId,
        }
    );
    const { data: campaigns } = useQuery(
        ["issuer_campaign", campaignId],
        () => issuerCampaignService.getCampaignByIdByIssuer(Number(campaignId)),
    );

    const updateOddBookMutation = useMutation((data: any) => {
        return bookProductService.updateOddBookProductByIssuer(data)
    }, {
        onSuccess: async () => {

            await queryClient.invalidateQueries(['issuer_books']);
            await queryClient.invalidateQueries(['books']);
            await router.push(`/issuer/campaigns/${campaignId}`);
        }
    });
    // const createOddBookMutation = useMutation(
    //     (values: any) => bookService.createOddBookByIssuer(values)
    // );

    const UpdateOddBookSchema = z.object({
        bookId: z.literal(Number(bookId)),
        campaignId: z.literal(Number(campaignId)),
        format: z.number(),
        saleQuantity: z.coerce.number().min(1),
        discount: z.coerce.number().min(0).max(100),
        commission: z.coerce.number().min(0).max(100),
        withPdf: z.boolean().default(false),
        displayPdfIndex: z.number(),
        withAudio: z.boolean().default(false),
        displayAudioIndex: z.number()
    });


    type FormType = Partial<z.infer<typeof UpdateOddBookSchema>>;

    const defaultValues: FormType = {
        bookId : Number(bookId),
        campaignId: Number(campaignId),
        saleQuantity: 0,
        discount: 0,
        commission: 0,
        withPdf: false,
        displayPdfIndex: 0,
        withAudio: false,
        displayAudioIndex: 0
    };


    const { register, watch, control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormType>({
        resolver: zodResolver(UpdateOddBookSchema),
        defaultValues,
    });


    const availableFormats = getBookProductsFormatOptions(book, campaigns?.format);
    const selectedFormat = getBookFormatById(watch('format'));

    const availableBonuses = availableFormats.filter((format) => format.id !== selectedFormat?.id && format.id !== BookFormats.PAPER.id);
    console.log(errors);



    const onSubmit = async (data: FormType) => {

        //alert(JSON.stringify(data));
        try {
            const payload = UpdateOddBookSchema.parse(data);
            // payload.commission = 10;

            console.log(JSON.stringify(payload));
            await toast.promise(updateOddBookMutation.mutateAsync(payload), {
                loading: "Đang cập sách",
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
    }


    return (
        <FormPageLayout>
            <WelcomeBanner label={`Chỉnh sửa sách bán lẻ cho hội sách✨${campaigns?.name} 📚`} className="p-6 sm:p-10" />
            <div>
                <form className="p-6 sm:p-10" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-6">
                        <button
                            type='button'
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
                            width={1200}
                            height={1200}
                            className={'rounded-md w-64 h-72 object-cover max-w-full shadow-md'}
                            src={book?.imageUrl || ''} alt={book?.name || ''} />
                        <div>
                            <div
                                className='mb-2 bg-blue-500 text-sm font-medium text-white py-2 px-3 w-fit rounded'>{book?.code}
                            </div>
                            <h1 className="mb-2 text-2xl font-medium text-slate-800">{book?.name}</h1>
                            <div className="text-gray-500">NXB: {book?.publisher?.name}</div>


                            {/* Price */}
                            <div className="text-emerald-600 font-medium text-xl mt-3">{
                                book?.coverPrice
                            } ₫</div>

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
                                label={"Chiết khấu (%)"}
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
                                                        <span className="text-gray-500">{format?.id === BookFormats.PDF.id ? (
                                                            <span className="text-gray-500">{book?.pdfExtraPrice} ₫</span>
                                                        ) : (
                                                            <span className="text-gray-500">{book?.audioExtraPrice} ₫</span>
                                                        )
                                                        }</span>
                                                    ) : selectedFormat?.id === BookFormats.PDF.id ? (
                                                        <span className="text-gray-500">{book?.audioExtraPrice} ₫</span>
                                                    ) : (
                                                        <span className="text-gray-500">{book?.pdfExtraPrice} ₫</span>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    )
                                }) : <div className="text-gray-500 text-sm">Không tìm thấy tặng kèm khả dụng.</div>) : (
                                    <div className="text-gray-500 text-sm">Bạn cần chọn định dạng để xem được các mục
                                        tặng kèm khả dụng.</div>
                                )}
                            </div>
                        </div>
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
                </form>
                <pre>{JSON.stringify(watch(), null, 2)}</pre>
            </div>
        </FormPageLayout >
    )
}

AddSellingBookPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AddSellingBookPage