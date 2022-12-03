import React from "react";
import TransitionModal from "../TransitionModal";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {SystemAuthorService} from "../../services/System/System_AuthorService";
import {useAuth} from "../../context/AuthContext";
import {toast} from "react-hot-toast";


export enum AuthorModalMode {
    Create,
    Update
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

const AuthorModal: React.FC<Props> = ({
                                          action,
                                          isOpen,
                                          onClose,
                                          author
                                      }) => {
    const {loginUser} = useAuth();
    const queryClient = useQueryClient();
    const systemAuthorService = new SystemAuthorService(loginUser?.accessToken);

    const updateAuthorMutation = useMutation(
        (payload: { id?: number; name?: string }) =>
            systemAuthorService.updateAuthor(payload),
        {
            onSuccess: async () => {
                onClose();
                await queryClient.invalidateQueries(["authors"]);
            },
        }
    );

    const createAuthorMutation = useMutation(
        (payload: { name?: string }) =>
            systemAuthorService.createAuthor(payload),
        {
            onSuccess: async () => {
                onClose();
                await queryClient.invalidateQueries(["authors"]);
            }
        }
    );

    const form = useFormik({
        enableReinitialize: true,
        initialValues: {
            authorName: action === AuthorModalMode.Update ? author?.name : "",
        },
        validationSchema: Yup.object({
            authorName: Yup.string()
                .trim()
                .required("Tên tác giả không được để trống"),
        }),
        onSubmit: async (values) => {
            const payload = {
                id: author?.id,
                name: values.authorName,
            };

            switch (action){
                case AuthorModalMode.Create:
                    await toast.promise(createAuthorMutation.mutateAsync(payload), {
                        loading: "Đang thêm tác giả",
                        success: () => "Thêm tác giả thành công",
                        error: (error) => error?.message,
                    });
                    break;
                case AuthorModalMode.Update:
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
            closeOnOverlayClick={false}
            isOpen={isOpen}
            onClose={handleOnClose}
        >
            <form
                onSubmit={form.handleSubmit}
                className="max-h-full w-full max-w-lg overflow-auto rounded bg-white shadow-lg"
            >
                <div className="border-b border-slate-200 px-5 py-3">
                    <div className="flex items-center justify-between">
                        <div className="font-semibold text-slate-800">
                            {action === AuthorModalMode.Create ? 'Thêm tác giả' : 'Cập nhật thông tin tác giả'}
                        </div>
                        <button
                            type="button"
                            onClick={handleOnClose}
                            className="text-slate-400 hover:text-slate-500"
                        >
                            <div className="sr-only">Close</div>
                            <svg className="h-4 w-4 fill-current">
                                <path
                                    d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="px-5 py-4">
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
                            <div className="mt-1 text-sm text-rose-500">
                                {form.errors.authorName}
                            </div>
                        )}
                    </div>
                </div>
                <div className="border-t border-slate-200 px-5 py-4">
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            disabled={updateAuthorMutation.isLoading}
                            onClick={handleOnClose}
                            type="button"
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Huỷ
                        </button>
                        {action === AuthorModalMode.Create ?
                            <button
                                disabled={createAuthorMutation.isLoading}
                                type="submit"
                                className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
                            >
                                {createAuthorMutation.isLoading ? "Đang thêm..." : "Thêm"}
                            </button> :
                            <button
                                disabled={updateAuthorMutation.isLoading}
                                type="submit"
                                className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
                            >
                                {updateAuthorMutation.isLoading ? "Đang cập nhật..." : "Cập nhật"}
                            </button>
                        }
                    </div>
                </div>
            </form>
        </TransitionModal>
    );
};

export default AuthorModal;
