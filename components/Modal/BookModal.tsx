import React, { memo, useState } from "react";
import TransitionModal from "./TransitionModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { IssuerBookService } from "../../services/Issuer/Issuer_BookService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import Modal from "./Modal";
import ErrorMessage from "../Form/ErrorMessage";
import Image from "next/image";
import { PublisherService } from './../../services/System/PublisherService';
import { IBaseListResponse } from "../../types/response/IBaseListResponse";
import { IBookResponse } from "../../types/response/IBookResponse";
import ToggleButton from "../ToggleButton";
import {
    BsEmojiFrownFill,
    BsEmojiSmileFill,
} from "react-icons/bs";
import { getFormattedPrice } from "../../utils/helper";



export enum BookModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    action: BookModalMode;
    isOpen: boolean;
    maxWidth?: string;
    onClose: () => void;
    book?: {
        id?: number;
        name?: string;
        description?: string;
        code?: string;
        imageUrl?: string;
        isbn10?: string;
        isbn13?: string;
        price?: number;
        publisher?: { name?: string };
        releasedYear?: number;
        unitInStock?: number;
        page?: number;
        size?: string;
        authorBooks?: { author?: { name?: string } }[];
        category?: { name?: string };
        language?: string;
        status?: boolean;
    };
};

const BookModal: React.FC<Props> = ({ action, maxWidth, isOpen, onClose, book }) => {
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
            page?: number;
            description?: string;
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
            page?: number;
            description?: string;
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
            bookStatus: action === BookModalMode.UPDATE ? book?.status : true,
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
                language: book?.language,
                page: book?.page,
                description: book?.description,
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
    const [showMore, setShowMore] = useState (false);

    return (
        <TransitionModal
            maxWidth={maxWidth}
            isOpen={isOpen}
            onClose={handleOnClose}
            closeOnOverlayClick={false}
        >
            <form onSubmit={form.handleSubmit}>
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
                <div className="space-y-10 py-4 px-5">
                    <Image
                        // cho hình sách nằm ra giữa
                        className="rounded cursor-pointer mx-auto object-cover border-2 border-gray-300 "
                        src={book?.imageUrl || "/images/book.png"}
                        width="100"
                        height="120"
                        alt="book"
                    />
                    <Modal.Header
                        title={
                            action === BookModalMode.CREATE
                                ? "Thêm sách"
                                // : `Thông Tin Sách: "${book?.name}"`
                                : `Thông tin chung`
                        }
                        onClose={handleOnClose}
                    />
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            {/* <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Trạng thái
                            </label> */}
                            {action === BookModalMode.UPDATE && (
                                <>
                                    <Modal.FormLabel
                                        fieldName="personnelStatus"
                                        label="Trạng thái"
                                    // required={true}
                                    />
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div
                                                className={`${form.values.bookStatus
                                                    ? "bg-rose-500"
                                                    : "bg-green-500"
                                                    } flex w-fit items-center gap-2 rounded px-2.5 py-1 text-sm text-white transition`}
                                            >
                                                {form.values.bookStatus ? (
                                                    <>
                                                        Ngừng Phát Hành <BsEmojiFrownFill />
                                                    </>
                                                ) : (
                                                    <>
                                                        Phát Hành <BsEmojiSmileFill />
                                                    </>
                                                )}
                                            </div>
                                            <div className="mt-2 text-sm text-gray-700">
                                                {form.values.bookStatus
                                                    ? "Sách sẽ bị vô hiệu hóa"
                                                    : "Sách đang phát hành"}
                                            </div>
                                        </div>
                                        {/* <ToggleButton
                                    isCheck={form.values.bookStatus || false}
                                    onChange={(value) => {
                                        form.setFieldValue("bookStatus", value);
                                    }}
                                /> */}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Tên sách
                            </label>
                            <input
                                disabled={true}
                                name="bookName"
                                value={form.values.bookName}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Mô tả
                            </label>
                            <span>
                                {showMore ? book?.description : `${book?.description?.substring(0, 250)}`}
                                <button className="btn" onClick={() => setShowMore(!showMore)}>
                                    {showMore ? "Show less" : "Show more"}
                                </button>
                            </span>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Mã sách
                            </label>
                            <div className="item-center ">
                                <input
                                    disabled={true}
                                    name="bookName"
                                    value={book?.code}
                                    onChange={form.handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                    // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookCode"
                            >
                                ISBN10
                            </label>
                            <input
                                disabled={true}
                                name="bookName"
                                value={book?.isbn10}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                                ISBN13
                            </label>
                            <div className="item-center ">
                                <input
                                    disabled={true}
                                    name="bookName"
                                    value={book?.isbn13}
                                    onChange={form.handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                    // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Giá bìa
                            </label>
                            <input
                                disabled={true}
                                name="bookName"
                                // value={book?.price}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                                // value={new Intl.NumberFormat("vi-VN", {
                                //     style: "currency",
                                //     currency: "VND",
                                // }).getFormattedPrice(book?.price)}
                                value={book?.price && getFormattedPrice(book?.price)}
                            />
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Kích thước
                            </label>
                            <div className="item-center ">
                                <input
                                    disabled={true}
                                    name="bookName"
                                    value={book?.size}
                                    onChange={form.handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                    // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Số trang
                            </label>
                            <input
                                disabled={true}
                                name="bookName"
                                value={book?.page}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                            {/* <div className="mt-1">
                                <select
                                disabled={true}
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
                            </div> */}
                            <input
                                disabled={true}
                                name="bookName"
                                value={book?.publisher?.name}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Năm Phát Hành
                            </label>
                            <input
                                disabled={true}
                                name="bookName"
                                value={book?.releasedYear}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                                Số Lượng
                            </label>
                            <div className="item-center ">
                                <input
                                    disabled={true}
                                    name="bookName"
                                    value={book?.unitInStock}
                                    onChange={form.handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                    // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Ngôn ngữ
                            </label>
                            <input
                                disabled={true}
                                name="bookName"
                                // value={book?.authorBooks?.map((a) => a.author?.name).join(", ")}
                                value={book?.language}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                                Thể Loại
                            </label>
                            <div className="item-center ">
                                <input
                                    disabled={true}
                                    name="bookName"
                                    value={book?.category?.name}
                                    onChange={form.handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                    // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>
                    <Modal.Header
                        title={
                            action === BookModalMode.CREATE
                                ? "Thêm sách"
                                // : `Thông Tin Sách: "${book?.name}"`
                                : `Tác giả và Dịch giả`
                        }
                        onClose={handleOnClose}
                    />
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Tác giả
                            </label>
                            <div className="item-center ">
                                <input
                                    disabled={true}
                                    name="bookName"
                                    value={book?.authorBooks?.map((a) => a.author?.name).join(", ")}
                                    onChange={form.handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                    // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Dịch giả
                            </label>
                            <input
                                disabled={true}
                                name="bookName"
                                // value={book?.authorBooks?.map((a) => a.author?.name).join(", ")}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                    <Modal.Header
                        title={
                            action === BookModalMode.CREATE
                                ? "Thêm sách"
                                // : `Thông Tin Sách: "${book?.name}"`
                                : `Định dạng`
                        }
                        onClose={handleOnClose}
                    />
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-6">
                            <label
                                className="mb-1 block text-sm font-medium"
                                htmlFor="bookName"
                            >
                                Định dạng
                            </label>
                            <div className="item-center ">
                                <input
                                    disabled={true}
                                    name="bookName"
                                    value={"Sách điện tử"}
                                    onChange={form.handleChange}
                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                    // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-6">
                            <label
                                className="mb-1 block text-sm font-medium margin-top-20"
                                htmlFor="bookName"
                            >
                                Đường link cho sách điện tử
                            </label>
                            <input
                                disabled={true}
                                name="bookName"
                                value={"https://multiselect-react-dropdown.vercel.app/?path=/story/multiselect-dropdown--grouping"}
                                onChange={form.handleChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                // className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                type="text"
                            />
                        </div>
                    </div>
                    <Modal.Header
                        title={
                            action === BookModalMode.CREATE
                                ? "Thêm sách"
                                // : `Thông Tin Sách: "${book?.name}"`
                                : `Bảng sách có trong : "${book?.name}" (Chỉ dành cho Sách combo hoặc Sách series)`
                        }
                        onClose={handleOnClose}
                    />

                    <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Tên sách
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Hình ảnh
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        Định dạng
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="font-medium w-[180px] text-ellipsis overflow-hidden">
                                                    {book?.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="font-medium w-[180px] text-ellipsis overflow-hidden">
                                                    <Image
                                                        className="rounded cursor-pointer"
                                                        src={book?.imageUrl || ""}
                                                        width="80"
                                                        height="100"
                                                        alt={book?.name || ""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="font-medium w-[180px] text-ellipsis overflow-hidden">
                                                    Sách giấy
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
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
                                (updateBookMutation.isLoading ? "Đang cập nhật..." : "Cập nhật trạng thái")
                            }
                        </button> */}
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default memo(BookModal)