import React from "react";
import { IBook } from "./../../types/Book/IBook";
import { z } from "zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Form from "../Form";
import { isImageFile } from "../../utils/helper";
import { isValidFileSize } from "./../../utils/helper";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";
import { LanguageService } from "./../../services/LanguageService";
import { GenreService } from "./../../services/GenreService";
import { AuthorService } from "./../../old-services/AuthorService";
import { BookService } from "./../../services/BookService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import SelectBox from "./../SelectBox/index";
import { IPublisher } from "./../../types/Publisher/IPublisher";
import { PublisherService } from "./../../services/PublisherService";
import { IGenre } from "./../../types/Genre/IGenre";
import CreateButton from "../Admin/CreateButton";
import SelectAuthorModal from "./../SelectAuthor/SelectAuthorModal";
import SelectAuthorTable from "./../SelectAuthor/SelectAuthorTable";
import { ImageUploadService } from "./../../services/ImageUploadService";
import { useRouter } from "next/router";
import { BsEmojiFrownFill, BsEmojiSmileFill } from "react-icons/bs";
import ToggleButton from "./../ToggleButton";
import { IoChevronBack } from "react-icons/io5";
import ConfirmModal from "./../Modal/ConfirmModal";
import { BOOK_IMAGE_UPLOAD_CONTAINER } from "../../constants/TailwindClasses";

type Props = {
    book: IBook;
}

const BookForm = ({ book }: Props) => {

    const { loginUser } = useAuth();

    const queryClient = useQueryClient();

    const [showSelectAuthorModal, setShowSelectAuthorModal] = React.useState(false);
    const imageService = new ImageUploadService(loginUser?.accessToken);
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
    );


    const languageService = new LanguageService();
    const genreService = new GenreService();
    const publisherService = new PublisherService(loginUser?.accessToken);
    const authorService = new AuthorService(loginUser?.accessToken);
    // const categoryService = new CategoryService(loginUser?.accessToken);
    // const bookService = new IssuerBookService(loginUser?.accessToken);
    const bookService = new BookService(loginUser?.accessToken);
    const router = useRouter();

    const [showModal, setShowModal] = React.useState(false);
    const [showConfirmDisabledModal, setshowConfirmDisabledModal] = React.useState(false);

    const closeModal = () => {
        setShowModal(false);
    };
    const updateBookMutation = useMutation((data: any) => {
        return bookService.updateBookByIssuer(data);
    }, {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["issuer_book"]);
            await queryClient.invalidateQueries(["issuer_books"]);
            await router.push("/issuer/books");
        },
    });

    const { data: books } = useQuery(["books"], () =>
        bookService.getBooksByIssuer({
            size: 1000,
        }),
    );
    const { data: publishers } = useQuery(["publisher"], () =>
        publisherService.getPublishers({
            size: 1000,
        }),
    );
    const { data: authors } = useQuery(["authors"], () =>
        authorService.getAuthors({
            size: 1000,
        }),
    );
    const { data: languages } = useQuery(["languages"], () =>
        languageService.getLanguages(),
    );
    const { data: genres } = useQuery(["genres"], () =>
        genreService.getChildGenres({}),
    );

    const UpdateBookSchema = z.object({
        id: z.number(),
        code: z.string().min(1),
        genreId: z.number(),
        publisherId: z.number(),
        isbn10: z.coerce.string().optional(),
        isbn13: z.coerce.string().optional(),
        name: z.string().min(1),
        translator: z.string(),
        imageUrl: z.string(),
        coverPrice: z.coerce.number(),
        description: z.string().min(1),
        language: z.string().min(1),
        size: z.string().min(1),
        releasedYear: z.coerce.number(),
        page: z.coerce.number(),
        pdfExtraPrice: z.coerce.number().optional(),
        pdfTrialUrl: z.string().nullable(),
        audioExtraPrice: z.coerce.number().optional(),
        audioTrialUrl: z.string().nullable(),
        status: z.number(),
        authors: z.array(z.number()).min(1, "Vui lòng chọn ít nhất 1 tác giả"),
        previewFile: z.instanceof(File).optional(),
    });


    console.log(languages);


    const languageOptions = languages?.map((language) => ({
        value: language,
    }));

    const statusOptions = book?.status === 1 ? [
        {
            value: 1,
            label: "Đang phát hành",
        },
        {
            value: 0,
            label: "Ngừng phát hành",
        },
    ] : [
        {
            value: 0,
            label: "Ngừng phát hành",
        },
        {
            value: 1,
            label: "Đang phát hành",
        },
    ];


    type FormType = Partial<z.infer<typeof UpdateBookSchema>>;

    const defaultValues: FormType = {
        id: book?.id,
        code: book?.code,
        genreId: book?.genreId,
        publisherId: book?.publisherId,
        isbn10: book?.isbn10,
        isbn13: book?.isbn13,
        name: book?.name,
        translator: book?.translator,
        imageUrl: book?.imageUrl,
        coverPrice: book?.coverPrice,
        description: book?.description,
        language: book?.language,
        size: book?.size,
        releasedYear: book?.releasedYear,
        page: book?.page,
        pdfExtraPrice: book?.pdfExtraPrice,
        pdfTrialUrl: book?.pdfTrialUrl,
        audioExtraPrice: book?.audioExtraPrice,
        audioTrialUrl: book?.audioTrialUrl,
        status: book?.status,
        authors: book?.bookAuthors?.filter((ba) => ba.authorId !== undefined)?.map((ba) => ba.authorId) || [],
        previewFile: undefined,
    };


    const { register, watch, control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(UpdateBookSchema),
        defaultValues,
    });

    const { fields: authorFields, append: appendAuthor } = useFieldArray<FormType>({
        control,
        name: "authors" as never,
    });

    const handleRemoveAuthor = (authorId: number) => {
        const newAuthorFields = watch("authors")?.filter((id) => id !== authorId);
        setValue("authors", newAuthorFields);
    };


    const selectedAuthor = authors?.data?.filter((author) => watch("authors")?.includes(author.id));

    const onSubmit = async (data: FormType) => {
        // await updateBookWithToast(updateBookMutation.mutateAsync(data));

        if (!data.imageUrl && !data.previewFile) {
            toast.error("Vui lòng chọn ảnh sản phẩm");
            return;
        }

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
            const payload = UpdateBookSchema.parse(data);
            delete payload.previewFile;

            // console.log(JSON.stringify(payload));
            await toast.promise(updateBookMutation.mutateAsync({
                ...payload,
                pdfTrialUrl: payload?.pdfTrialUrl && payload?.pdfTrialUrl?.length > 0 ? payload?.pdfTrialUrl : null,
                audioTrialUrl: payload?.audioTrialUrl && payload?.audioTrialUrl?.length > 0 ? payload?.audioTrialUrl : null,
                pdfExtraPrice: payload.pdfExtraPrice || null,
                audioExtraPrice: payload.audioExtraPrice || null,
            }), {
                loading: "Đang cập nhật sách",
                success: () => {
                    return "Cập nhật sách thành công";
                },
                error: (err) => err?.message || "Cập nhật sách thất bại",
            });
            console.log(payload);
        } catch (error) {
            console.log(error);
            return;
        }
    };

    console.log(errors);

    return (

        <>
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

                                            field.onChange(file);
                                            return true;
                                        }}
                                        defaultImageURL={book?.imageUrl}
                                        style={{ width: "100px", height: "100px" }}
                                    />
                                )}
                            />
                        </div>

                        <div className="sm:col-span-4">
                            <Form.Input<FormType>
                                required={true}
                                label="Tên sách"
                                register={register}
                                fieldName="name"
                                errorMessage={errors.name?.message}
                            />
                            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                <div className="sm:col-span-2">
                                    <Form.Input<FormType>
                                        required={true}
                                        label="Mã sách"
                                        register={register}
                                        fieldName="code"
                                        errorMessage={errors.code?.message}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Form.Input<FormType>
                                        // required={true}
                                        label={"ISBN10"}
                                        register={register}
                                        fieldName="isbn10"
                                        errorMessage={errors.isbn10?.message}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Form.Input<FormType>
                                        // required={true}
                                        label={"ISBN13"}
                                        register={register}
                                        fieldName="isbn13"
                                        errorMessage={errors.isbn13?.message}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <Form.Input<FormType>
                                        inputType="number"
                                        required={true}
                                        label={"Giá bìa (đ)"}
                                        register={register}
                                        fieldName="coverPrice"
                                        errorMessage={errors.coverPrice?.message}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <Form.Input<FormType>
                                        required={true}
                                        label={"Kích thước"}
                                        register={register}
                                        fieldName="size"
                                        errorMessage={errors.size?.message}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <Form.Label label="Ngôn ngữ" required={true} />
                                    <Controller
                                        control={control}
                                        name="language"
                                        render={({ field }) => (
                                            <SelectBox<{
                                                value: string;
                                            }>
                                                value={
                                                    field.value ? {
                                                        value: field.value,
                                                    } : null
                                                }
                                                displayKey="value"
                                                dataSource={languageOptions}
                                                placeholder="Chọn ngôn ngữ"
                                                onValueChange={(l) => {
                                                    field.onChange(l.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <Form.Input<FormType>
                                        inputType="number"
                                        required={true}
                                        label={"Năm xuất bản"}
                                        register={register}
                                        fieldName="releasedYear"
                                        errorMessage={errors.releasedYear?.message}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <Form.Input<FormType>
                                        inputType="number"
                                        required={true}
                                        label={"Số trang"}
                                        register={register}
                                        fieldName="page"
                                        errorMessage={errors.page?.message}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <Form.Label label="Nhà xuất bản" required={true} />
                                    <Controller
                                        control={control}
                                        name="publisherId"
                                        render={({ field }) => (
                                            <SelectBox<IPublisher>
                                                value={
                                                    publishers?.data?.find((p) => p.id === field.value) || null
                                                }
                                                displayKey="name"
                                                dataSource={publishers?.data}
                                                placeholder="Chọn nhà xuất bản"
                                                onValueChange={(p) => {
                                                    field.onChange(p.id);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="sm:col-span-3">
                                    <Form.Label label="Thể loại" required={true} />
                                    <Controller

                                        control={control}
                                        name="genreId"
                                        render={({ field }) => (
                                            <SelectBox<IGenre>
                                                disabled={!book?.allowChangingGenre}
                                                value={
                                                    genres?.find((g) => g.id === field.value) || null
                                                }
                                                displayKey="name"
                                                dataSource={genres}
                                                placeholder="Chọn thể loại"
                                                onValueChange={(p) => {
                                                    field.onChange(p.id);
                                                }}
                                            />
                                        )}
                                    />
                                    {!book?.allowChangingGenre ?
                                        <div className="text-sm text-gray-500 mt-2">
                                            Không thay đổi được vì có trong sách series, hội sách đang diễn ra, hay đơn
                                            hàng đang xử lý
                                        </div>
                                        : null}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <Form.Divider />
                <Form.GroupLabel label="Tác giả và dịch giả" />
                <div className="mt-3 space-y-4">
                    <Form.Input<FormType>
                        label={"Dịch giả"}
                        register={register}
                        fieldName="translator"
                        errorMessage={errors.translator?.message}
                    />

                    <Form.Label label={"Tác giả"} required={true} />
                    <div className="mb-4 flex justify-end gap-4">
                        <CreateButton
                            label={"Thêm tác giả"}
                            onClick={() => {
                                setShowSelectAuthorModal(true);
                            }}
                        />

                        <SelectAuthorModal
                            isOpen={showSelectAuthorModal}
                            onClose={() => setShowSelectAuthorModal(false)}
                            onItemSelect={(author) => {
                                appendAuthor(author.id);
                                setShowSelectAuthorModal(false);
                            }
                            }
                            selectedAuthors={selectedAuthor || []}
                        />


                    </div>
                    <SelectAuthorTable
                        selectedAuthors={selectedAuthor || []}
                        handleRemoveAuthor={(author) => {
                            handleRemoveAuthor(author.id);
                        }}
                    />
                </div>


                <Form.Divider />
                <Form.GroupLabel label="Định dạng" />
                <div className="mt-3 space-y-4">
                    <div className="grid sm:grid-cols-2 gap-y-6 gap-x-4">
                        <Form.Input<FormType>
                            label={"Link PDF Trial"}
                            register={register}
                            fieldName="pdfTrialUrl"
                            errorMessage={errors.pdfTrialUrl?.message}
                        />
                        <Form.Input<FormType>
                            label={"Giá kèm PDF"}
                            register={register}
                            fieldName="pdfExtraPrice"
                            errorMessage={errors.pdfExtraPrice?.message}
                        />

                        <Form.Input<FormType>
                            label={"Link Audio Trial"}
                            register={register}
                            fieldName="audioTrialUrl"
                            errorMessage={errors.audioTrialUrl?.message}
                        />

                        <Form.Input<FormType>
                            inputType="number"
                            label={"Giá kèm Audio"}
                            register={register}
                            fieldName="audioExtraPrice"
                            errorMessage={errors.audioExtraPrice?.message}
                        />
                    </div>
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
                <Form.GroupLabel label="Trạng thái" />
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
                                            } else {
                                                field.onChange(field.value === 1 ? 0 : 1);
                                            }
                                        }}
                                        // field.onChange(field.value === 1 ? 0 : 1)}
                                    />
                                </div>
                            </div>
                        )}
                    />
                </div>

                <Form.Divider />
                <div className="flex justify-end gap-4">
                    <Link
                        href={"/issuer/books"}
                        className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                        Huỷ
                    </Link>
                    <button type="submit"
                            disabled={isSubmitting}
                            className="m-btn text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                        Lưu
                    </button>
                </div>
                {/* <ConfirmModal
                    isOpen={showConfirmDisabledModal}
                    onClose={() => setshowConfirmDisabledModal(false)}
                    onConfirm={() => {
                        setValue("status", 0);
                        setshowConfirmDisabledModal(false);
                    }}
                    title={`Ngừng phát hành sách`}
                    content={`Bạn có chắc chắn muốn Ngừng phát hành sách?<br>Sách đang có trong hội sách sau:<br>Hội sách xuyên Việt - Lan tỏa tri thức, Campaign_Test_05`}
                    confirmText={"Ngừng phát hành"}
                /> */}
                <ConfirmModal
                    isOpen={showConfirmDisabledModal}
                    onClose={() => setshowConfirmDisabledModal(false)}
                    onConfirm={() => {
                        setValue("status", 0);
                        setshowConfirmDisabledModal(false);
                    }}
                    title={`Ngừng phát hành sách`}
                    confirmText={"Ngừng phát hành"}
                    content={`Bạn có chắc chắn muốn ngừng phát hành sách không?`}
                >
                    <div>
                        {`Sách đang có trong hội sách sau:`}
                    </div>
                    <div>
                        {`Hội sách xuyên Việt - Lan tỏa tri thức,`}
                    </div>
                    <div>
                        {`Campaign_Test_05`}
                    </div>
                </ConfirmModal>

            </form>
            {/* <pre>{JSON.stringify(watch(), null, 2)}</pre> */}
        </>
    );

};


export default BookForm;

