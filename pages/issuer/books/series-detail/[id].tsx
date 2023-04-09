import React, {
    Fragment,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import CreateButton from "../../../../components/Admin/CreateButton";
import Form from "../../../../components/Form";
import AdminLayout from "../../../../components/Layout/AdminLayout";
import FormPageLayout from "../../../../components/Layout/FormPageLayout";
import WelcomeBanner from "../../../../components/WelcomBanner";
import { useAuth } from "../../../../context/AuthContext";
import { BookService } from "../../../../services/BookService";
import { IBook } from "../../../../types/Book/IBook";
import { NextPageWithLayout } from "../../../_app";
import { BsEmojiSmileFill } from 'react-icons/bs';
import { BsEmojiFrownFill } from 'react-icons/bs';
import ToggleButton from './../../../../components/ToggleButton';
import ErrorMessage from './../../../../components/Form/ErrorMessage';
import SelectBox from './../../../../components/SelectBox/index';
import { IGenre } from './../../../../types/Genre/IGenre';
import { GenreService } from './../../../../services/GenreService';
import TableWrapper from './../../../../components/Admin/Table/TableWrapper';
import TableHeading from './../../../../components/Admin/Table/TableHeading';
import TableHeader from './../../../../components/Admin/Table/TableHeader';
import TableBody from './../../../../components/Admin/Table/TableBody';
import TableData from './../../../../components/Admin/Table/TableData';
import Image from "next/image";
import { useCreateComboStore } from "../../../../stores/CreateComboStore";
import { ICreateComboStore } from './../../../../stores/CreateComboStore';
import { shallow } from 'zustand/shallow';
import { getAvatarFromName, getIntersectedArray, isImageFile, isValidFileSize } from './../../../../utils/helper';
import Link from 'next/link';
import ConfirmModal from './../../../../components/Modal/ConfirmModal';
import SelectBookSeriesModal from './../../../../components/SelectBookSeries/SelectBookSeriesModal';
import { toast } from 'react-hot-toast';
import { useStore } from 'zustand';
import { IoChevronBack } from 'react-icons/io5';
import TransitionModal from './../../../../components/Modal/TransitionModal';
import Modal from './../../../../components/Modal/Modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ImageUploadService } from './../../../../services/ImageUploadService';
import { BOOK_IMAGE_UPLOAD_CONTAINER } from "../../../../constants/TailwindClasses";



type Props = {
    book: IBook;
};

const SeriesBookForm = ({ book }: Props) => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const router = useRouter();
    const genreService = new GenreService();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
    const [showConfirmDisabledModal, setshowConfirmDisabledModal] = React.useState(false);
    const imageService = new ImageUploadService(loginUser?.accessToken);
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file)
    );
    const bookService = new BookService(loginUser?.accessToken);

    const updateSeriesBookMutation = useMutation((data: any) => {
        return bookService.updateSeriesBookByIssuer(data)
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['book']);
            router.push('/issuer/books');
        }
    });


    const UpdateSeriesBookSchema = z.object({

        imageUrl: z.string(),
        id: z.number(),
        code: z.string(),
        genreId: z.number(),
        isbn10: z.string(),
        isbn13: z.string(),
        name: z.string(),
        coverPrice: z.coerce.number(),
        description: z.string(),
        releasedYear: z.coerce.number(),
        status: z.number(),
        updateBookItems: z.array(
            z.object({ bookId: z.number(), displayIndex: z.number() })
        ).min(2),
        previewFile: z.instanceof(File).optional(),
    });

    const [selectedBooks, setSelectedBooks] = useState<Array<Partial<IBook>>>(book?.bookItems?.map((bookItem) => ({
        id: bookItem.bookId,
        name: bookItem?.book?.name,
        code: bookItem?.book?.code,
        imageUrl: bookItem?.book?.imageUrl,
        coverPrice: bookItem?.book?.coverPrice,
    })) || []);

    const [toDeleteBook, setToDeleteBook] = useState<
        Partial<IBook> | null
    >(null);

    const { data: genres } = useQuery(['genres'], () =>
        genreService.getChildGenres({

        })
    );
    const [showModal, setShowModal] = React.useState(false);

    const closeModal = () => {
        setShowModal(false);
    };

    type FormType = Partial<z.infer<typeof UpdateSeriesBookSchema>>;


    // const defaultValues: FormType = {

    //     code: book?.code,
    //     genreId: book?.genreId,
    //     isbn10: book?.isbn10,
    //     isbn13: book?.isbn13,
    //     name: book?.name,
    //     imageUrl: book?.imageUrl || "",
    //     coverPrice: book?.coverPrice,
    //     description: book?.description,
    //     releasedYear: book?.releasedYear,
    //     status: book?.status,
    //     updateBookItems: book?.bookItems?.map((bookItem) => ({
    //         bookId: bookItem.bookId,
    //         displayIndex: bookItem.displayIndex,
    //     })) || [],
    // };

    // console.log(defaultValues);
    const {
        register,
        handleSubmit,
        control,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormType>({
        resolver: zodResolver(UpdateSeriesBookSchema),
        defaultValues: {
            code: book?.code,
            genreId: book?.genreId,
            isbn10: book?.isbn10,
            isbn13: book?.isbn13,
            name: book?.name,
            coverPrice: book?.coverPrice,
            description: book?.description,
            releasedYear: book?.releasedYear,
            status: book?.status,
            updateBookItems: book?.bookItems?.map((bookItem) => ({
                bookId: bookItem.bookId,
                displayIndex: bookItem.displayIndex,
            })) || [],
        },
        values: {
            id: book.id,
            imageUrl: book?.imageUrl || "",
            updateBookItems: selectedBooks?.map((book, index) => (

                {
                    bookId: book.id as number,
                    displayIndex: index,
                })) || [],
        }
    });

    const handleAddBook = (book: IBook) => {


        // if (selectedBooks.length > 0) {
        //     console.log(selectedBooks)
        //     const currentAuthorIds = selectedBooks
        //         .filter((b) => b?.bookAuthors)
        //         .map((b) => b?.bookAuthors)
        //         .flat()
        //         .map((a) => a?.authorId) || [];

        //     const newBookAuthorIds = book?.bookAuthors?.map((a) => a?.authorId) || [];


        //     console.log(currentAuthorIds);
        //     console.log(newBookAuthorIds);

        //     const intersection = getIntersectedArray(currentAuthorIds, newBookAuthorIds);
        //     if (intersection.length === 0) {
        //         toast.error("Sách không có tác giả chung với các sách khác trong series");
        //         return;
        //     }
        // }

        setSelectedBooks((prev) => [...prev, book]);
        setShowAddBookModal(false);
    };

    const handleDeleteBook = (book: Partial<IBook>) => {
        setSelectedBooks((prev) => prev.filter((b) => b.id !== book.id));
        setShowDeleteModal(false);
    };


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
        try {
            const payload = UpdateSeriesBookSchema.parse(data);
            delete payload.previewFile;

            // console.log(JSON.stringify(payload));
            await toast.promise(updateSeriesBookMutation.mutateAsync(payload), {
                loading: "Đang cập nhật sách",
                success: () => {
                    return "Cập nhật sách thành công";
                },
                error: (err) => err?.message || "Cập nhật sách thất bại",
            });
            console.log(payload)
        } catch (error) {
            console.log(error);
            return;
        }
        console.log(data);
    };
    console.log(errors);
    return (
        <form className="p-6 sm:p-10" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-6">
                <Link
                    className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                    href="/issuer/books"
                >
                    <IoChevronBack size={"17"} />
                    <span>Quay lại</span>
                </Link>
            </div>
            <Form.GroupLabel
                label={"Thông tin chung"}
                description={"Thông tin cơ bản về sách"}
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
                        imageClassName={BOOK_IMAGE_UPLOAD_CONTAINER}
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
                    placeholder={"Nhập tên sách series"}
                    register={register}
                    fieldName={"name"}
                    label="Tên sách series"
                    required={true}
                    errorMessage={errors.name?.message}
                />
                 <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                 <div className="sm:col-span-2">
                 <Form.Input<FormType>
                        placeholder={"Nhập mã sách series"}
                        register={register}
                        fieldName={"code"}
                        label="Mã series"
                        required={true}
                        errorMessage={errors.code?.message}
                    />
                    </div>
                    <div className="sm:col-span-2">
                    <Form.Input<FormType>
                        placeholder={"Nhập ISBN10"}
                        register={register}
                        fieldName={"isbn10"}
                        label="ISBN10"
                        errorMessage={errors.isbn10?.message}
                    />
                    </div>
                    <div className="sm:col-span-2">
                    <Form.Input<FormType>
                        placeholder={"Nhập ISBN13"}
                        register={register}
                        fieldName={"isbn13"}
                        label="ISBN13"
                        errorMessage={errors.isbn13?.message}
                    />
                    </div>
                    <div className="sm:col-span-3">
                    <Form.Input<FormType>
                        inputType={"number"}
                        placeholder={"Nhập năm phát hành"}
                        required={true}
                        register={register}
                        fieldName={"releasedYear"}
                        label="Năm phát hành"
                        errorMessage={errors.releasedYear?.message}
                    />
                    </div>
                    <div className="sm:col-span-3">
                    <Form.Input<FormType>
                        inputType={"number"}
                        placeholder={"Nhập giá bìa"}
                        required={true}
                        register={register}
                        fieldName={"coverPrice"}
                        label="Giá bìa (đ)"
                        errorMessage={errors.coverPrice?.message}
                    />
                        </div>
                 </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-3 space-y-4">
                <Form.Divider />
                <Form.GroupLabel
                    label={"Thể loại"}
                    description="Thể loại chung của series sách"
                />
                <div>
                    <Form.Label label="Thể loại" required={true} />
                    <Controller
                        control={control}
                        name="genreId"
                        render={({ field }) => (
                            <SelectBox<IGenre>
                                value={
                                    genres?.find((g) => g.id === field.value) || null
                                }
                                displayKey='name'
                                dataSource={genres}
                                placeholder='Chọn thể loại'
                                onValueChange={(p) => {
                                    field.onChange(p.id);
                                }}
                            />
                        )}
                    />
                    {errors.genreId && (
                        <ErrorMessage>{errors.genreId.message}</ErrorMessage>
                    )}
                </div>

                <Form.Divider />

                <Form.GroupLabel
                    label={"Chọn sách"}
                    description="Chọn những sách cùng thể loại cho series"
                />
                <div className="mt-3">
                    <div className="mb-4 flex justify-end gap-4">
                        <CreateButton
                            label={"Thêm sách"}
                            onClick={() => {
                                setShowAddBookModal(true);
                            }}
                        />
                    </div>
                    <TableWrapper>
                        <TableHeading>
                            <TableHeader>Mã sách</TableHeader>
                            <TableHeader>Tên sách</TableHeader>
                            <TableHeader>Giá sách</TableHeader>
                            {/* <TableHeader>Nhà xuất bản</TableHeader> */}
                            {/* <TableHeader>Định dạng</TableHeader> */}
                            <TableHeader>
                                <span className="sr-only">Edit</span>
                            </TableHeader>
                        </TableHeading>
                        <TableBody>
                            {selectedBooks && selectedBooks?.length > 0 ? (
                                selectedBooks?.map((book) => {
                                    return (
                                        <tr key={book?.id}>
                                            <TableData className="text-sm font-medium uppercase text-gray-500">
                                                {book?.code}
                                            </TableData>
                                            <TableData className="max-w-72">
                                                <div className="flex items-center gap-4">
                                                    <Image
                                                        width={500}
                                                        height={500}
                                                        className="h-20 w-16 object-cover"
                                                        src={book.imageUrl || ""}
                                                        alt=""
                                                    />
                                                    <div className="max-w-56 overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                                                        {book.name}
                                                    </div>
                                                </div>
                                            </TableData>
                                            <TableData className="text-sm font-semibold text-emerald-600">
                                                {new Intl.NumberFormat("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }).format(book?.coverPrice || 0)}
                                            </TableData>
                                            {/* <TableData>
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            className="h-10 w-10 rounded-full"
                                                            src={getAvatarFromName(
                                                                book.publisher?.name
                                                            )}
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm text-gray-900">
                                                            {book.publisher?.name}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableData> */}
                                            <TableData className="text-right text-sm font-medium">
                                                <button
                                                    type="button"
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
                    <ErrorMessage>{errors.updateBookItems?.message}</ErrorMessage>
                </div>

                <Form.Divider />
                <Form.GroupLabel
                    label={"Mô tả"}
                    description="Mô tả về series sách"
                />
                <div className="mt-3">
                    <Form.Input<FormType>
                        isTextArea={true}
                        placeholder={"Nhập mô tả sách series"}
                        register={register}
                        fieldName={"description"}
                        label="Mô tả"
                        required={true}
                        errorMessage={errors.description?.message}
                    />
                </div>
                <Form.Divider />
                <Form.GroupLabel label="Trạng thái" />
                <Form.Label label="Trạng thái" />
                <div>
                    <Form.Label label="Trạng thái" required={true} />
                    <Controller
                        control={control}
                        name="status"
                        render={({ field }) => (
                            <div className="flex items-center justify-between">
                                <div>
                                    <div
                                        className={`${field.value ? "bg-green-500" : "bg-rose-500"
                                            } flex w-fit items-center gap-2 rounded px-2.5 py-1 text-sm text-white transition`}
                                    // onClick={() => field.onChange(!field.value ? 1 : 0)}
                                    >
                                        {field.value ? (
                                            <>
                                                Phát Hành <BsEmojiSmileFill />
                                            </>
                                        ) : (
                                            <>
                                                Ngừng phát hành <BsEmojiFrownFill />
                                            </>
                                        )}
                                    </div>
                                    <div className="mt-2 text-sm text-gray-700">
                                        {field.value
                                            ? "Sách đang phát hành"
                                            : "Sách bị ngừng phát hành"}
                                    </div>
                                    <ToggleButton
                                        isCheck={!!field.value}
                                        onChange={() => {
                                            // if (field.value === 1 && book?.campaigns && book?.campaigns.length > 0) {
                                            //     alert("Không thể ngưng phát hành khi sách đang có chiến dịch")
                                            // }
                                            if (field.value === 1 && true) {
                                                setshowConfirmDisabledModal(true);
                                            }
                                            else { field.onChange(field.value === 1 ? 0 : 1) }
                                        }}
                                    // field.onChange(field.value === 1 ? 0 : 1)}
                                    />
                                </div>
                            </div>
                        )}
                    />
                </div>

                <Form.Divider />
                <div className='flex justify-end gap-4'>
                    <Link
                        href={'books'}
                        className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                        Huỷ
                    </Link>
                    <button type="submit"
                        disabled={isSubmitting}
                        className="m-btn text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                        Lưu
                    </button>
                </div>
                {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
            </div>

            {watch("genreId") && <SelectBookSeriesModal
                key={watch("genreId")}
                onItemSelect={b => handleAddBook(b)}
                onClose={() => setShowAddBookModal(false)}
                isOpen={showAddBookModal}
                genreId={watch("genreId")}
                selectedBooks={selectedBooks}
            />}

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    if (toDeleteBook) {
                        handleDeleteBook(toDeleteBook);
                        toast.success("Xoá sách khỏi series thành công");
                    }
                    setShowDeleteModal(false);
                }}
                title={`Xoá ${toDeleteBook?.name}`}
                content={"Bạn có chắc chắn muốn xoá sách này khỏi series?"}
                confirmText={"Xoá"}
            />
            <ConfirmModal
                isOpen={showConfirmDisabledModal}
                onClose={() => setshowConfirmDisabledModal(false)}
                onConfirm={() => {
                    setValue("status", 0);
                    setshowConfirmDisabledModal(false);
                }}
                title={`Ngừng phát hành series`}
                confirmText={"Ngừng phát hành"}
                content={`Bạn có chắc chắn muốn ngừng phát hành series không?`}
            >
                <div>
                    {`Series đang có trong hội sách sau:`}
                </div>
                <div>
                    {`Hội sách xuyên Việt - Lan tỏa tri thức,`}
                </div>
                <div>
                    {`Campaign_Test_05`}
                </div>
            </ConfirmModal>
        </form>
    );
};

const UpdateSeriesBookPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const bookService = new BookService(loginUser?.accessToken);
    const { id } = router.query as { id: string };

    const { data: book, isLoading } = useQuery(
        ["book", id],
        () => bookService.getBookById$Issuer(Number(id)),
        {
            enabled: !!id,
        }
    );

    console.log(id);

    return (
        <FormPageLayout>
            <WelcomeBanner
                label="Chỉnh sửa thông tin sách series 📖"
                className="p-6 sm:p-10"
            />
            {book && <SeriesBookForm book={book} />}
        </FormPageLayout>
    );
};

UpdateSeriesBookPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default UpdateSeriesBookPage;