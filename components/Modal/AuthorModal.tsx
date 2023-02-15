import React, {memo} from "react";
import TransitionModal from "./TransitionModal";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {SystemAuthorService} from "../../old-services/System/System_AuthorService";
import {useAuth} from "../../context/AuthContext";
import Modal from "./Modal";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {IAuthor} from "../../types/Author/IAuthor";
import {toast} from "react-hot-toast";

export enum AuthorModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    action: AuthorModalMode;
    isOpen: boolean;
    onClose: () => void;
    author?: IAuthor;
};

const AuthorModal: React.FC<Props> = ({
                                          maxWidth,
                                          action,
                                          isOpen,
                                          onClose,
                                          author,
                                      }) => {
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

        const AuthorSchema = z.object({
            authorName: z.string({required_error: "Tên tác giả không được để trống"})
                .min(2, {message: "Tên tác giả phải có ít nhất 2 ký tự"})
                .max(50, {message: "Tên tác giả không được vượt quá 50 ký tự"}),
        });

        type AuthorSchemaType = z.infer<typeof AuthorSchema>;

        const {register, setError, handleSubmit, reset, formState} = useForm<AuthorSchemaType>(
            {
                values: {
                    authorName: action === AuthorModalMode.UPDATE && author?.name ? author.name : "",
                },
                resolver: zodResolver(AuthorSchema),
            }
        )
        const onSubmit = async (data: AuthorSchemaType) => {
            if (action === AuthorModalMode.UPDATE && !formState.isDirty) {
                setError("authorName", {message: "Chưa có thay đổi"})
                return;
            }
            const payload = {
                id: author?.id,
                name: data.authorName,
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
        };
        const handleOnClose = () => {
            reset();
            onClose();
        };


        return (
            <TransitionModal
                maxWidth={maxWidth}
                isOpen={isOpen}
                onClose={handleOnClose}
                closeOnOverlayClick={false}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
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
                        <Modal.FormInput<AuthorSchemaType>
                            placeholder={'Nhập tên tác giả'}
                            formState={formState}
                            register={register}
                            fieldName={'authorName'}
                            label={'Tên tác giả'}/>
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

                            <button
                                disabled={formState.isSubmitting}
                                type="submit"
                                className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
                            >
                                {action === AuthorModalMode.CREATE
                                    ? createAuthorMutation.isLoading
                                        ? "Đang thêm..."
                                        : "Thêm"
                                    : updateAuthorMutation.isLoading
                                        ? "Đang cập nhật..."
                                        : "Cập nhật"}
                            </button>
                        </div>
                    </Modal.Footer>
                </form>
            </TransitionModal>
        );
    }
;

export default memo(AuthorModal);
