import React, { Fragment, ReactElement, useMemo, useState } from 'react'
import { NextPageWithLayout } from "../../../../../_app";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import { useRouter } from "next/router";
import FormPageLayout from "../../../../../../components/Layout/FormPageLayout";
import WelcomeBanner from "../../../../../../components/WelcomBanner";
import { FormikProvider, useFormik } from "formik";
import Form from "../../../../../../components/Form";
import * as Yup from "yup";
import SelectBox from "../../../../../../components/SelectBox";
import ErrorMessage from "../../../../../../components/Form/ErrorMessage";
import { getFormatsOfBook, getIntersectedFormatOfBooks, isImageFile } from "../../../../../../utils/helper";
import CreateButton from "../../../../../../components/Admin/CreateButton";
import { toast } from "react-hot-toast";
import SelectSellingBookComboModal
    from "../../../../../../components/SelectSellingBookCombo/SelectSellingBookComboModal";
import { IBook } from "../../../../../../types/Book/IBook";
import SelectSellingBookComboTable
    from "../../../../../../components/SelectSellingBookCombo/SelectSellingBookComboTable";
import { BookFormats, IBookFormat } from "../../../../../../constants/BookFormats";
import { useAuth } from '../../../../../../context/AuthContext';
import { BookService } from './../../../../../../services/BookService';
import { BookProductService } from './../../../../../../services/BookProductService';
import { CampaignService } from './../../../../../../services/CampaignService';
import { any, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBookProductsFormatOptions, isValidFileSize } from './../../../../../../utils/helper';
import { useForm, Controller } from 'react-hook-form';
import { getBookFormatById } from './../../../../../../constants/BookFormats';
import { IoChevronBack } from 'react-icons/io5';
import TableWrapper from './../../../../../../components/Admin/Table/TableWrapper';
import TableHeading from './../../../../../../components/Admin/Table/TableHeading';
import TableBody from './../../../../../../components/Admin/Table/TableBody';
import TableData from './../../../../../../components/Admin/Table/TableData';
import Image from "next/image";
import TableHeader from "../../../../../../components/Admin/Table/TableHeader";
import { GenreService } from './../../../../../../services/GenreService';
import { IGenre } from './../../../../../../types/Genre/IGenre';
import ConfirmModal from './../../../../../../components/Modal/ConfirmModal';
import { ImageUploadService } from './../../../../../../services/ImageUploadService';



// const MAX_FILE_SIZE_IN_MB = 1;

// export interface IBookComboItem {
//     bookId: number,
//     displayIndex: number,
//     format: number,

//     withPdf: boolean,
//     withAudio: boolean,
//     displayPdfIndex: number,
//     displayAudioIndex: number,
// }

const AddSellingBookComboPage: NextPageWithLayout = () => {
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [toDeleteBook, setToDeleteBook] = useState<Partial<IBook> & { bookId?: number } | null>(null);

    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();
    const bookId = router.query['book-id'];

    const campaignId = router.query.id as string;

    const bookService = new BookService(loginUser?.accessToken);
    const bookProductService = new BookProductService(loginUser?.accessToken);
    const genreService = new GenreService();
    const imageService = new ImageUploadService(loginUser?.accessToken);
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file)
    );


    // const bookOdd = randomBooks.find(b => b.id === Number(bookId));
    const issuerCampaignService = new CampaignService(
        loginUser?.accessToken
    );
    // const bookId = router.query.id as string;


    const { data: book, isLoading } = useQuery(
        ["issuer_book"],
        () => bookService.getBooks$Issuer({ withCampaigns: true }),
        {
            refetchOnWindowFocus: false,
        }
    );


    const { data: campaigns } = useQuery(
        ["issuer_campaign", campaignId],
        () => issuerCampaignService.getCampaignByIdByIssuer(Number(campaignId)),
    );

    const parentGenresOfCampaign = useMemo(() => campaigns?.campaignCommissions?.map(c => c.genre) || [], [campaigns]);


    const { data: childGenres } = useQuery(
        ["child-genres", campaignId],
        () => genreService.getChildGenres({
            status: true
        }), {
        select: (data) => {
            return data?.filter(g => {
                return parentGenresOfCampaign?.findIndex(p => p?.id === g.parentId) !== -1
            })
        }
    },
    );

    console.log("childGenres", childGenres)



    const defaultValues: FormType = {
        campaignId: Number(campaignId),
        saleQuantity: 0,
        commission: 0,
        salePrice: 0,
        description: book?.description,
        bookProductItems: []
    };

    const CreatComboBookSchema = z.object({
        campaignId: z.literal(Number(campaignId)),
        format: z.number(),
        genreId: z.number(),
        title: z.string()
        .max(255, "Tên Combo không được vượt quá 255 ký tự"),
        description: z.string(),
        imageUrl: z.string().optional(),
        salePrice: z.coerce.number().min(1),
        saleQuantity: z.coerce.number().min(1),
        commission: z.coerce.number().min(0).max(100),
        previewFile: z.instanceof(File).optional(),
        bookProductItems: z.array(
            z.object({
                bookId: z.number(),
                // format: z.number(),
                displayIndex: z.number(),
                withPdf: z.boolean().default(false),
                displayPdfIndex: z.number(),
                withAudio: z.boolean().default(false),
                displayAudioIndex: z.number(),
                coverPrice: z.number().optional(),
                name: z.string().optional(),
                pdfExtraPrice: z.coerce.number().optional(),
                audioExtraPrice: z.coerce.number().optional(),

                code: z.string().optional(),
                imageUrl: z.string().optional()
            })
        )
    });
    const { register, reset, watch, control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormType>({
        resolver: zodResolver(CreatComboBookSchema),
        defaultValues,
    });



    type FormType = Partial<z.infer<typeof CreatComboBookSchema>>;



    const createComboBookMutation = useMutation((data: any) => {
        return bookProductService.createComboBookProductByIssuer(data)
    }, {
        onSuccess: () => {
            queryClient.invalidateQueries(['books', book?.id]);
            router.push(`/issuer/campaigns/${campaignId}`);
        }
    });
    const onSubmit = async (data: FormType) => {


        if (data.previewFile) {
            try {
                await toast.promise(uploadImageMutation.mutateAsync(data.previewFile), {
                    loading: "Đang tải ảnh lên",
                    success: (res) => {
                        data.imageUrl = res?.url;
                        return "Tải ảnh lên thành công";
                    },
                    error: "Tải ảnh lên thất bại",
                });
            } catch (error) {
                console.log(error);
                return;
            }
        }

        // alert(JSON.stringify(data));
        try {
            const payload = CreatComboBookSchema.parse(data);

            // payload.commission = 10;

            console.log(JSON.stringify(payload));
            await toast.promise(createComboBookMutation.mutateAsync({
                ...payload,
                bookProductItems: payload.bookProductItems.map((i, index) => {
                    return {
                        ...i,
                        format: payload.format,
                        displayIndex: index,
                        displayPdfIndex: index,
                        displayAudioIndex: index,
                    }
                })
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

    const clearAllSelectedBooks = () => {
        if (watch("bookProductItems") !== undefined && watch("bookProductItems")?.length > 0) {
            toast("Tất cả sách đã chọn sẽ bị xóa khi bạn chọn lại thể loại sách");
        }
        setValue("bookProductItems", []);
    }


    const selectedgenreId = parentGenresOfCampaign?.find(g => g?.id === watch('genreId'));

    const handleAddBookItem = (book: IBook) => {
        const currentBookProductItems = [...watch("bookProductItems") || []];
        const newBookProductItem = {
            bookId: book.id,
            displayIndex: 0,
            withPdf: false,
            displayPdfIndex: 0,
            withAudio: false,
            displayAudioIndex: 0,
            name: book?.name,
            pdfExtraPrice: book?.pdfExtraPrice,
            audioExtraPrice: book?.audioExtraPrice,
            code: book?.code,
            imageUrl: book?.imageUrl,
            coverPrice: book?.coverPrice
        };
        setValue("bookProductItems", [...currentBookProductItems, newBookProductItem]);
        setShowAddBookModal(false)
    }

    const handleDeleteBook = (book: Partial<IBook> & { bookId?: number }) => {
        const currentBookProductItems = [...watch("bookProductItems") || []];
        const newBookProductItems = currentBookProductItems.filter(i => i.bookId !== book?.bookId);
        setValue("bookProductItems", newBookProductItems);
        setToDeleteBook(null)
    }


    const selectedBookItems = watch("bookProductItems") || [];


    function getMinimalCommission(genreId: number) {
        return campaigns?.campaignCommissions?.find(c=>c.genreId  === genreId)?.minimalCommission || 0;
    }


    // --------------------------------
    // const commonFormats = useMemo(
    //     () => getIntersectedFormatOfBooks(form.values.bookProductItems),
    //     [form.values.bookProductItems]
    // );
    // const notifyCommonFormatsChange = (newCommonFormats: IBookFormat[]) => {
    //     if (newCommonFormats.length !== commonFormats.length
    //         && form.values.selectedFormat
    //     ) {
    //         form.setFieldValue('selectedFormat', null);
    //         toast('Thay đổi sách đã làm thay đổi danh sách tuỳ chọn cho định dạng của combo. Vui lòng chọn lại định dạng.');
    //     }
    // }

    // const handleAddBook = (book: IBook) => {
    //     const item = {
    //         ...book,
    //         bookId: book?.id,
    //         displayIndex: 0,
    //         format: undefined,
    //         availableFormats: getFormatsOfBook(book),
    //         withPdf: false,
    //         withAudio: false,
    //         displayPdfIndex: 1,
    //         displayAudioIndex: 2,
    //     }
    //     const newCommonFormats = getIntersectedFormatOfBooks([...form.values.bookProductItems, item]);
    //     notifyCommonFormatsChange(newCommonFormats);
    //     form.setFieldValue('bookProductItems', [...form.values.bookProductItems, item]);
    //     setShowAddBookModal(false);
    // }


    // const onBonusChange = (check: boolean, bookId: number, formatId: number) => {
    //     const newBookProductItems = form.values.bookProductItems.map((item: IBook & IBookComboItem) => {
    //         if (item?.bookId === bookId) {
    //             if (formatId === BookFormats.PDF.id) {
    //                 return {
    //                     ...item,
    //                     withPdf: check,
    //                 }
    //             } else if (formatId === BookFormats.AUDIO.id) {
    //                 return {
    //                     ...item,
    //                     withAudio: check,
    //                 }
    //             }
    //         }
    //         return item;
    //     });
    //     form.setFieldValue('bookProductItems', newBookProductItems);
    // }

    // const clearAllBonuses = () => {
    //     const newBookProductItems = form.values.bookProductItems.map((item: IBook & IBookComboItem) => {
    //         return {
    //             ...item,
    //             withPdf: false,
    //             withAudio: false,
    //         }
    //     });
    //     form.setFieldValue('bookProductItems', newBookProductItems);
    // }

    // const availableFormatBonuses: IBookFormat[] = useMemo(() => {
    //     return commonFormats
    //         .filter(format => format.id !== (form.values.selectedFormat as unknown as IBookFormat)?.id
    //             && format.id !== BookFormats.PAPER.id
    //         )
    // }, [commonFormats, form.values.selectedFormat]);

    // const areAllAudioBonusesSelected = useMemo(() => {
    //     return form.values.bookProductItems.every((item: IBook & IBookComboItem) => item.withAudio);
    // }, [form.values.bookProductItems]);

    // const areAllPdfBonusesSelected = useMemo(() => {
    //     return form.values.bookProductItems.every((item: IBook & IBookComboItem) => item.withPdf);
    // }, [form.values.bookProductItems]);


    // const toggleAllBonuses = (formatId: number, check: boolean) => {
    //     const newBookProductItems = form.values.bookProductItems.map((item: IBook & IBookComboItem) => {
    //         if (formatId === BookFormats.PDF.id) {
    //             return {
    //                 ...item,
    //                 withPdf: check,
    //             }
    //         } else if (formatId === BookFormats.AUDIO.id) {
    //             return {
    //                 ...item,
    //                 withAudio: check,
    //             }
    //         }
    //         return item;
    //     });
    //     form.setFieldValue('bookProductItems', newBookProductItems);
    // }

    // const handleRemoveBook = (book: (IBook & IBookComboItem)) => {
    //     const newBookProductItems = form.values.bookProductItems.filter((item: IBook & IBookComboItem) => item.bookId !== book.bookId);
    //     const newCommonFormats = getIntersectedFormatOfBooks(newBookProductItems);
    //     notifyCommonFormatsChange(newCommonFormats);
    //     form.setFieldValue('bookProductItems', newBookProductItems);

    // }


    return (

        <Fragment>
            <FormPageLayout>
                <WelcomeBanner label={`Thêm sách combo cho ✨${campaigns?.name} 📚`} className="p-6 sm:p-10" />
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
                            description={"Thông tin cơ bản về combo"}
                        />
                        <div className="mt-3 space-y-4">
                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="cover-photo"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Ảnh bìa<span className="text-rose-500">*</span>
                                    </label>
                                    <Controller
                                        control={control}
                                        name="previewFile"
                                        render={({ field }) => (
                                            <Form.ImageUploadPanel
                                                onChange={(file) => {
                                                    if (!isImageFile(file)) {
                                                        toast.error("Vui lòng tải lên tệp hình ảnh");
                                                        return false;
                                                    }
                                                    // check file size
                                                    if (!isValidFileSize(file, 1)) {
                                                        toast.error("Kích thước tệp tối đa là 1MB");
                                                        return false;
                                                    }

                                                    field.onChange(file)
                                                    return true;
                                                }}
                                                defaultImageURL={book?.imageUrl} />
                                        )}
                                    />
                                </div>
                                <div className="sm:col-span-4">
                                    <Form.Input<FormType>
                                        placeholder={
                                            "VD: Combo Sách giáo khoa 6, 7, 8"
                                        }
                                        register={register}
                                        fieldName={"title"}
                                        label="Tên combo"
                                        required={true}
                                        errorMessage={errors.title?.message}
                                    />
                                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                        <div className="sm:col-span-3">
                                            <Form.Input<FormType>
                                                register={register}
                                                required={true}
                                                inputType={'number'}
                                                placeholder={"Giá bán"}
                                                fieldName={"salePrice"}
                                                label={"Giá bán (đ) "}
                                                errorMessage={errors?.salePrice?.message}
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <Form.Input<FormType>
                                                register={register}
                                                required={true}
                                                inputType={'number'}
                                                placeholder={"Số lượng"}
                                                fieldName={"saleQuantity"}
                                                label={"Số lượng"}
                                                errorMessage={errors?.saleQuantity?.message}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Form.Divider />
                        <Form.GroupLabel
                            label={"Định dạng"}
                            description={"Định dạng sách sẽ bán và tặng kèm"}
                        />
                        <div className="mt-3 space-y-4">
                            <div>
                                <Form.Label required={true} label={"Định dạng combo"} />
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
                                    {/* {form.values.selectedFormat ? (availableFormatBonuses?.length > 0 ? availableFormatBonuses.map((format) => (
                                        <div key={format.id} className="relative flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id={`bonus-${format.id}`}
                                                    name="bonus"
                                                    type="checkbox"
                                                    checked={format.id === BookFormats.PDF.id && areAllPdfBonusesSelected
                                                        || format.id === BookFormats.AUDIO.id && areAllAudioBonusesSelected
                                                    }
                                                    value={format.id}
                                                    onChange={(e) => {
                                                        toggleAllBonuses(format.id, e.target.checked);
                                                    }
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor={`bonus-${format.id}`}
                                                    className="text-sm font-medium text-gray-600"
                                                >
                                                    Tất cả sách {format?.displayName} trong series
                                                </label>
                                            </div>
                                        </div>
                                    )) :
                                        <div className="text-gray-500 text-sm">Không tìm thấy tặng kèm hàng loạt khả
                                            dụng.</div>) : (
                                        <div className="text-gray-500 text-sm">Bạn cần chọn định dạng để xem được
                                            các mục tặng kèm khả dụng.</div>
                                    )} */}
                                </div>
                            </div>
                        </div>

                        <Form.Divider />
                        <Form.GroupLabel
                            label={"Thể loại"}
                            description={"Thể loại chung cho các sách được chọn vào combo"}
                        />
                        <div className='mt-3 '>
                            <Form.Label required={true} label={"Thể loại combo"} />
                            <Controller
                                control={control}
                                name="genreId"
                                render={({ field }) => (
                                    <SelectBox<IGenre>
                                        placeholder={"Chọn thể loại"}
                                        value={selectedgenreId || null}
                                        onValueChange={(value) => {
                                            if (value) {
                                                field.onChange(value.id);
                                                setValue('commission', getMinimalCommission(value.id))
                                                clearAllSelectedBooks();
                                                clearAllBonuses();
                                                // clear all selected books
                                            }
                                        }}
                                        dataSource={parentGenresOfCampaign as IGenre[]}
                                        displayKey={"name"}
                                    />
                                )}

                            />
                            <ErrorMessage>{errors.format?.message}</ErrorMessage>
                        </div>
                        <Form.Divider />
                        <Form.GroupLabel
                            label={"Chiết khấu"}
                            description={"Chiết khấu theo thể loại Combo"}
                        />
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <Form.Input<FormType>
                                    register={register}
                                    required={true}
                                    inputType={'number'}
                                    placeholder={"Chiết khấu"}
                                    fieldName={"commission"}
                                    label={"Chiết khấu (%) "}   
                                    errorMessage={errors?.commission?.message}
                                    disabled={!watch("genreId")}
                                />
                            </div>
                        </div>
                        <Form.Divider />
                        <Form.GroupLabel
                            label={"Chọn sách combo"}
                            description={"Chọn sách combo để bán"}
                        />
                        <div className="mt-3">
                            <div className="mb-4 flex justify-end gap-4">
                                <CreateButton
                                    disabled={!watch("genreId")}
                                    label={"Thêm sách"}
                                    onClick={() => {
                                        setShowAddBookModal(true);
                                    }}
                                />
                            </div>
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
                                        {selectedBookItems.length > 0 ? (
                                            selectedBookItems?.map((book, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <TableData className="text-sm font-medium uppercase text-gray-500">
                                                            {book?.code}
                                                        </TableData>
                                                        <TableData className="max-w-72">
                                                            <div className="flex items-center gap-4">
                                                                <Image
                                                                    width={500}
                                                                    height={500}
                                                                    className="h-20 w-16 object-cover"
                                                                    src={book?.imageUrl || ""}
                                                                    alt=""
                                                                />
                                                                <div
                                                                    className="max-w-56 overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                                                                    {book?.name}
                                                                </div>
                                                            </div>
                                                        </TableData>
                                                        <TableData className="text-sm font-semibold text-emerald-600">
                                                            {book?.coverPrice} ₫
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
                                                        <TableData>
                                                            <button
                                                                type='button'
                                                                onClick={() => {
                                                                    setToDeleteBook(book);
                                                                    setShowDeleteModal(true);
                                                                }}
                                                                className="text-rose-600 hover:text-rose-800"
                                                            >
                                                                Xoá
                                                            </button>
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
                            {/* <SelectSellingBookComboTable
                                selectedFormat={form.values.selectedFormat}
                                selectedBooks={form.values.bookProductItems}
                                onBonusChange={onBonusChange}
                                handleRemoveBook={handleRemoveBook} /> */}

                        </div>
                        <Form.Divider />
                        <Form.GroupLabel label="Mô tả" />
                        <Form.Input<FormType>
                            isTextArea={true}
                            required={true}
                            label="Mô tả"
                            register={register}
                            fieldName="description"
                            errorMessage={errors.description?.message}
                        />
                        <Form.Divider />
                        <div className='flex justify-end gap-4'>
                            <button className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                                Hủy
                            </button>
                            <button type="submit" className="m-btn text-white bg-indigo-600 hover:bg-indigo-700">
                                Thêm vào hội sách
                            </button>
                        </div>
                        <pre>{JSON.stringify(watch(), null, 2)}</pre>
                    </form>
                </div>
            </FormPageLayout>
            <SelectSellingBookComboModal
                isOpen={showAddBookModal}
                onClose={() => setShowAddBookModal(false)}
                genreId={watch('genreId')}
                selectedBooks={selectedBookItems}
                onItemSelect={(b) => {
                    handleAddBookItem(b)
                }} />

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    if (toDeleteBook) {
                        handleDeleteBook(toDeleteBook);
                        toast.success("Xoá sách khỏi combo thành công");
                    }
                    setShowDeleteModal(false);
                }}
                title={`Xoá ${toDeleteBook?.name}`}
                content={"Bạn có chắc chắn muốn xoá sách này khỏi combo?"}
                confirmText={"Xoá"}
            />
        </Fragment>
    )
}

AddSellingBookComboPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AddSellingBookComboPage