import React, { memo,useState } from "react";
import TransitionModal from "./TransitionModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient,useQuery } from "@tanstack/react-query";
import { IssuerBookService } from "../../services/Issuer/Issuer_BookService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Modal from "./Modal";
import ErrorMessage from "../Form/ErrorMessage";
import Image from "next/image";
import { PublisherService } from './../../services/System/PublisherService';


export enum BookModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    action: BookModalMode;
    isOpen: boolean;
    onClose: () => void;
    book?: {
        id?: number;
        name?: string;
        code?: string;
        imageUrl?: string;
        isbn10?: string;
        isbn13?: string;
        price?: number;
        publisher?: { name?: string };
        releasedYear?: number;
        unitInStock?: number;
        size?: string;
        authorBooks?: { author?: { name?: string } }[];
        category?: { name?: string };
        language?: string;
    };
};

const BookModal: React.FC<Props> = ({ action, isOpen, onClose, book }) => {
    const [selectedPublisherId, setSelectedPublisherId] = useState<string | null>(
        null
      );
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const issuerBookService = new IssuerBookService(loginUser?.accessToken);
  const publisherService = new PublisherService(loginUser?.accessToken);
    const { data: publishers } = useQuery(['publisher'], () =>
    publisherService.getPublishers({
        size: 1000,
    })
);
    const updateBookMutation = useMutation(
        (payload: {
            id?: number; name?: string; code?: string; imageUrl?: string; isbn10?: string;
            isbn13?: string;
            price?: number;
            publisher?: { name?: string };
            releasedYear?: number;
            unitInStock?: number;
            size?: string;
            authorBooks?: { author?: { name?: string } }[];
            category?: { name?: string };
            language?: string;
        }) =>
            issuerBookService.updateBook(payload),
        {
            onSuccess: async () => {
                handleOnClose();
                await queryClient.invalidateQueries(["books"]);
            },
        }
    );

    const createBookMutation = useMutation(
        (payload: {
            name?: string; code?: string; imageUrl?: string; isbn10?: string;
            isbn13?: string;
            price?: number;
            publisher?: { name?: string };
            releasedYear?: number;
            unitInStock?: number;
            size?: string;
            authorBooks?: { author?: { name?: string } }[];
            category?: { name?: string };
            language?: string;
        }) => issuerBookService.createBook$Issuer(payload),
        {
            onSuccess: async () => {
                handleOnClose();
                await queryClient.invalidateQueries(["books"]);
            },
        }
    );

    const createSchema = Yup.object({
        bookName: Yup.string()
            .trim()
            .required("Tên sách không được để trống")
            .min(2, "Tên sách phải có ít nhất 2 ký tự")
            .max(100, "Tên sách không được vượt quá 100 ký tự"),
    });

    const updateSchema = createSchema.concat(
        Yup.object({
            bookName: Yup.string().test(
                "bookName",
                "Tên sách chưa có thay đổi",
                async (value) => {
                    if (value) {
                        return value !== book?.name;
                    }
                    return true;
                }
            ),
        })
    );

    const form = useFormik({
        enableReinitialize: true,
        initialValues: {
            bookName: action === BookModalMode.UPDATE ? book?.name : "",
        },
        validationSchema:
            action === BookModalMode.UPDATE ? updateSchema : createSchema,
        onSubmit: async (values) => {
            const payload = {
                id: book?.id,
                name: values.bookName,
                code: book?.code,
                imageUrl: book?.imageUrl,
                isbn10: book?.isbn10,
                isbn13: book?.isbn13,
                price: book?.price,
                publisher: book?.publisher,
                releasedYear: book?.releasedYear,
                unitInStock: book?.unitInStock,
                size: book?.size,
                authorBooks: book?.authorBooks,
                category: book?.category,
                language: book?.language
            };

            switch (action) {
                case BookModalMode.CREATE:
                    await toast.promise(createBookMutation.mutateAsync(payload), {
                        loading: "Đang thêm tên sách",
                        success: () => "Thêm tên sách thành công",
                        error: (error) => error?.message,
                    });
                    break;
                case BookModalMode.UPDATE:
                    await toast.promise(updateBookMutation.mutateAsync(payload), {
                        loading: "Đang cập nhật tên sách",
                        success: () => "Cập nhật tên sách thành công",
                        error: (error) => error?.message,
                    });
                    break;
            }
        },
    });
    const handleOnClose = () => {
        form.resetForm();
        onClose();
    };

    return (
        <TransitionModal
            isOpen={isOpen}
            onClose={handleOnClose}
            closeOnOverlayClick={false}
        >
            <form onSubmit={form.handleSubmit}
                // kéo dài chiều ngang của modal
                className="w-full max-w-2xl mx-auto bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4  "
            >
                <Modal.Header
                    title={
                        action === BookModalMode.CREATE
                            ? "Thêm sách"
                            // : `Thông Tin Sách: "${book?.name}"`
                            : `Thông Tin Chi Tiết`
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <Image
                    // cho hình sách nằm ra giữa
                    className="rounded cursor-pointer mx-auto object-cover border-2 border-gray-300 "
                    src={book?.imageUrl || "/images/book.png"}
                    width="100"
                    height="120"
                    alt="book"
                />
                <div className="pt-8">
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Tên sách <span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="bookName"
                                value={form.values.bookName}
                                onChange={form.handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                            {form.errors.bookName && form.touched.bookName && (
                                <ErrorMessage>{form.errors.bookName}</ErrorMessage>
                            )}
                        </div>

                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Mã sách <span className="text-rose-500">*</span>
                            </label>
                            <div className="item-center ">
                                <input
                                    name="bookName"
                                    value={book?.code}
                                    onChange={form.handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                                {form.errors.bookName && form.touched.bookName && (
                                    <ErrorMessage>{form.errors.bookName}</ErrorMessage>
                                )}
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookCode"
                            >
                                ISBN10<span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="bookName"
                                value={book?.isbn10}
                                onChange={form.handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                ISBN13 <span className="text-rose-500">*</span>
                            </label>
                            <div className="item-center ">
                                <input
                                    name="bookName"
                                    value={book?.isbn13}
                                    onChange={form.handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Giá<span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="bookName"
                                value={book?.price}
                                onChange={form.handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        {/* <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Nhà Phát Hành <span className="text-rose-500">*</span>
                            </label>
                            <div className="item-center ">
                                <input
                                    name="bookName"
                                    value={book?.publisher?.name}
                                    onChange={form.handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div> */}
                        <div className="sm:col-span-3">
                            <label
                                htmlFor="publisher"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nhà phát hành
                            </label>
                            <div className="mt-1">
                                <select
                                    onChange={(e) => setSelectedPublisherId(e.target.value)}
                                    value={selectedPublisherId!}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    name="publisher"
                                    id="publisher"
                                >
                                    {publishers?.data?.map((publisher) => (
                                        <option value={publisher?.id} key={publisher?.id}>
                                            {publisher?.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Năm Phát Hành<span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="bookName"
                                value={book?.releasedYear}
                                onChange={form.handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Lượng Tồn Kho <span className="text-rose-500">*</span>
                            </label>
                            <div className="item-center ">
                                <input
                                    name="bookName"
                                    value={book?.unitInStock}
                                    onChange={form.handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Tác Giả<span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="bookName"
                                value={book?.authorBooks?.map((a) => a.author?.name).join(", ")}
                                onChange={form.handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Thể Loại<span className="text-rose-500">*</span>
                            </label>
                            <div className="item-center ">
                                <input
                                    name="bookName"
                                    value={book?.category?.name}
                                    onChange={form.handleChange}
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Ngôn Ngữ<span className="text-rose-500">*</span>
                            </label>
                            <input
                                name="bookName"
                                value={book?.language}
                                onChange={form.handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            disabled={updateBookMutation.isLoading}
                            onClick={handleOnClose}
                            type="button"
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Huỷ
                        </button>

                        {/* <button
                            disabled={action === BookModalMode.CREATE ? createBookMutation.isLoading : updateBookMutation.isLoading}
                            type="submit"
                            className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
                        >
                            {action === BookModalMode.CREATE ?
                                (createBookMutation.isLoading ? "Đang thêm..." : "Thêm") :
                                (updateBookMutation.isLoading ? "Đang cập nhật..." : "Cập nhật")
                            }
                        </button> */}
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default memo(BookModal);
