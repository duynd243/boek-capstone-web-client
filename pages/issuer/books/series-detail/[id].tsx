import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { useForm } from "react-hook-form";
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

type Props = {
    book: IBook;
};

const SeriesBookForm = ({ book }: Props) => {
    const UpdateSeriesBookSchema = z.object({
        id: z.number(),
        code: z.string(),
        genreId: z.number(),
        isbn10: z.string(),
        isbn13: z.string(),
        name: z.string(),
        imageUrl: z.string().optional(),
        coverPrice: z.coerce.number(),
        description: z.string(),
        releasedYear: z.coerce.number(),
        status: z.number(),
        updateBookItems: z.array(
            z.object({ bookId: z.number(), displayIndex: z.number() })
        ),
    });

    type FormType = Partial<z.infer<typeof UpdateSeriesBookSchema>>;

    const defaultValues: FormType = {
        id: book?.id,
        code: book?.code,
        genreId: book?.genreId,
        isbn10: book?.isbn10,
        isbn13: book?.isbn13,
        name: book?.name,
        imageUrl: book?.imageUrl,
        coverPrice: book?.coverPrice,
        description: book?.description,
        releasedYear: book?.releasedYear,
        status: book?.status,
        updateBookItems: book?.bookItems?.map((bookItem) => ({
            bookId: bookItem.bookId,
            displayIndex: bookItem.displayIndex,
        })),
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(UpdateSeriesBookSchema),
        defaultValues,
    });

    const onSubmit = async (data: FormType) => {
        console.log(data);
    };

    return (
        <form className="p-6 sm:p-10" onSubmit={handleSubmit(onSubmit)}>
            <Form.GroupLabel
                label={"Thông tin chung"}
                description={"Thông tin cơ bản về sách"}
            />
            <div className="mt-3 space-y-4">
                <Form.Input<FormType>
                    placeholder={"Nhập mã sách series"}
                    register={register}
                    fieldName={"code"}
                    label="Mã series"
                    required={true}
                    errorMessage={errors.code?.message}
                />
                <Form.Input<FormType>
                    placeholder={"Nhập tên sách series"}
                    register={register}
                    fieldName={"name"}
                    label="Tên sách series"
                    required={true}
                    errorMessage={errors.name?.message}
                />
                <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
                    <Form.Input<FormType>
                        placeholder={"Nhập ISBN10"}
                        register={register}
                        fieldName={"isbn10"}
                        label="ISBN10"
                        errorMessage={errors.isbn10?.message}
                    />
                    <Form.Input<FormType>
                        placeholder={"Nhập ISBN13"}
                        register={register}
                        fieldName={"isbn13"}
                        label="ISBN13"
                        errorMessage={errors.isbn13?.message}
                    />
                </div>
                <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
                    <Form.Input<FormType>
                        inputType={"number"}
                        placeholder={"Nhập năm phát hành"}
                        required={true}
                        register={register}
                        fieldName={"releasedYear"}
                        label="Năm phát hành"
                        errorMessage={errors.releasedYear?.message}
                    />
                    <Form.Input<FormType>
                        inputType={"number"}
                        placeholder={"Nhập giá bìa"}
                        required={true}
                        register={register}
                        fieldName={"coverPrice"}
                        label="Giá bìa"
                        errorMessage={errors.coverPrice?.message}
                    />
                </div>
                <Form.Label label={"Ảnh sản phẩm"} required={true} />
                <Form.ImageUploadPanel defaultImageURL={book?.imageUrl} />
                <Form.Divider />
                <Form.GroupLabel
                    label={"Thể loại"}
                    description="Thể loại chung của series sách"
                />
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
                <Form.GroupLabel
                    label={"Chọn sách"}
                    description="Chọn những sách cùng thể loại cho series"
                />
                <div className="mt-3">
                    <div className="mb-4 flex justify-end gap-4">
                        <CreateButton
                            label={"Thêm sách"}
                            onClick={() => {
                                //setShowAddBookModal(true);
                            }}
                        />
                    </div>
                </div>
            </div>
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
        () => bookService.getBookByIdByIssuer(Number(id)),
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
