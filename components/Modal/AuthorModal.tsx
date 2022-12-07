import React from "react";
import TransitionModal from "./TransitionModal";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {SystemAuthorService} from "../../services/System/System_AuthorService";
import {useAuth} from "../../context/AuthContext";
import {toast} from "react-hot-toast";
import Modal from "./Modal";
import ErrorMessage from "../Form/ErrorMessage";

export enum AuthorModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    action: AuthorModalMode;
    isOpen: boolean;
    onClose: () => void;
    author?: {
        id?: number;
        name?: string;
    };
};

const AuthorModal: React.FC<Props> = ({action, isOpen, onClose, author}) => {
    const {loginUser} = useAuth();
    const queryClient = useQueryClient();
    const systemAuthorService = new SystemAuthorService(loginUser?.accessToken);

    const updateAuthorMutation = useMutation(
        (payload: { id?: number; name?: string }) =>
            systemAuthorService.updateAuthor(payload),
        {
            onSuccess: async () => {
                handleOnClose();
                await queryClient.invalidateQueries(["authors"]);
            },
        }
    );

    const createAuthorMutation = useMutation(
        (payload: { name?: string }) => systemAuthorService.createAuthor(payload),
        {
            onSuccess: async () => {
                handleOnClose();
                await queryClient.invalidateQueries(["authors"]);
            },
        }
    );

    const createSchema = Yup.object({
        authorName: Yup.string()
            .trim()
            .required("Tên tác giả không được để trống")
            .min(2, "Tên tác giả phải có ít nhất 2 ký tự")
            .max(50, "Tên tác giả không được vượt quá 50 ký tự"),
    });

    const updateSchema = createSchema.concat(
        Yup.object({
            authorName: Yup.string().test(
                "authorName",
                "Tên tác giả chưa có thay đổi",
                async (value) => {
                    if (value) {
                        return value !== author?.name;
                    }
                    return true;
                }
            ),
        })
    );

    const form = useFormik({
        enableReinitialize: true,
        initialValues: {
            authorName: action === AuthorModalMode.UPDATE ? author?.name : "",
        },
        validationSchema:
            action === AuthorModalMode.UPDATE ? updateSchema : createSchema,
        onSubmit: async (values) => {
            const payload = {
                id: author?.id,
                name: values.authorName,
            };

            switch (action) {
                case AuthorModalMode.CREATE:
                    await toast.promise(createAuthorMutation.mutateAsync(payload), {
                        loading: "Đang thêm tác giả",
                        success: () => "Thêm tác giả thành công",
                        error: (error) => error?.message,
                    });
                    break;
                case AuthorModalMode.UPDATE:
                    await toast.promise(updateAuthorMutation.mutateAsync(payload), {
                        loading: "Đang cập nhật tác giả",
                        success: () => "Cập nhật tác giả thành công",
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
                        action === AuthorModalMode.CREATE
                            ? "Thêm tác giả"
                            : `Cập nhật tác giả ${author?.name}`
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="py-4 px-5">
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="authorName"
                        >
                            Tên tác giả <span className="text-rose-500">*</span>
                        </label>
                        <input
                            name="authorName"
                            value={form.values.authorName}
                            onChange={form.handleChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            type="text"
                        />
                        {form.errors.authorName && form.touched.authorName && (
                            <ErrorMessage>
                                {form.errors.authorName}
                            </ErrorMessage>
                        )}
                    </div>
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            disabled={updateAuthorMutation.isLoading}
                            onClick={handleOnClose}
                            type="button"
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Huỷ
                        </button>
                        {action === AuthorModalMode.CREATE ? (
                            <button
                                disabled={createAuthorMutation.isLoading}
                                type="submit"
                                className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
                            >
                                {createAuthorMutation.isLoading ? "Đang thêm..." : "Thêm"}
                            </button>
                        ) : (
                            <button
                                disabled={updateAuthorMutation.isLoading}
                                type="submit"
                                className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
                            >
                                {updateAuthorMutation.isLoading
                                    ? "Đang cập nhật..."
                                    : "Cập nhật"}
                            </button>
                        )}
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default AuthorModal;
