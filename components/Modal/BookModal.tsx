import React, { memo } from "react";
import TransitionModal from "./TransitionModal";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IssuerBookService } from "../../old-services/Issuer/Issuer_BookService";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import Modal from "./Modal";
import ErrorMessage from "../Form/ErrorMessage";

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
    };
};

const BookModal: React.FC<Props> = ({ action, isOpen, onClose, book }) => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const issuerBookService = new IssuerBookService(loginUser?.accessToken);

    const updateBookMutation = useMutation(
        (payload: { id?: number; name?: string }) =>
            issuerBookService.updateBook(payload),
        {
            onSuccess: async () => {
                handleOnClose();
                await queryClient.invalidateQueries(["books"]);
            },
        },
    );

    const createBookMutation = useMutation(
        (payload: { name?: string }) =>
            issuerBookService.createBook$Issuer(payload),
        {
            onSuccess: async () => {
                handleOnClose();
                await queryClient.invalidateQueries(["books"]);
            },
        },
    );

    const createSchema = Yup.object({
        bookName: Yup.string()
            .trim()
            .required("Tên sách không được để trống")
            .min(2, "Tên sách phải có ít nhất 2 ký tự")
            .max(50, "Tên sách không được vượt quá 50 ký tự"),
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
                },
            ),
        }),
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
            <form onSubmit={form.handleSubmit}>
                <Modal.Header
                    title={
                        action === BookModalMode.CREATE
                            ? "Thêm sách"
                            : `Cập nhật tên sách ${book?.name}`
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="py-4 px-5">
                    <div>
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

                        <button
                            disabled={
                                action === BookModalMode.CREATE
                                    ? createBookMutation.isLoading
                                    : updateBookMutation.isLoading
                            }
                            type="submit"
                            className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
                        >
                            {action === BookModalMode.CREATE
                                ? createBookMutation.isLoading
                                    ? "Đang thêm..."
                                    : "Thêm"
                                : updateBookMutation.isLoading
                                    ? "Đang cập nhật..."
                                    : "Cập nhật"}
                        </button>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default memo(BookModal);
