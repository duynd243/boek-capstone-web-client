import React, { memo } from "react";
import TransitionModal from "./TransitionModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import Modal from "./Modal";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IAuthor } from "../../types/Author/IAuthor";
import { toast } from "react-hot-toast";
import { AuthorService, CreateAuthorParams, UpdateAuthorParams } from "../../services/AuthorService";
import SelectProfilePicture from "../SelectProfilePicture";
import { isImageFile, isValidFileSize } from "../../utils/helper";
import { ImageUploadService } from "../../services/ImageUploadService";

export enum AuthorModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    action: AuthorModalMode;
    isOpen: boolean;
    onClose: () => void;
    afterLeave?: () => void;
    author?: IAuthor;
};

const AuthorModal: React.FC<Props> = ({
                                          maxWidth,
                                          action,
                                          isOpen,
                                          onClose,
                                          afterLeave,
                                          author,
                                      }) => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const authorService = new AuthorService(loginUser?.accessToken);
    const imageService = new ImageUploadService(loginUser?.accessToken);
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
    );

    const commonMutationOptions = {
        onSuccess: async () => {
            handleOnClose();
            await queryClient.invalidateQueries(["authors"]);
        },
    };

    const updateAuthorMutation = useMutation(
        (payload: UpdateAuthorParams) => authorService.updateAuthor(payload),
        commonMutationOptions,
    );

    const createAuthorMutation = useMutation(
        (payload: CreateAuthorParams) => authorService.createAuthor(payload),
        commonMutationOptions,
    );

    const BaseAuthorSchema = z.object({
        name: z
            .string()
            .min(2, { message: "Tên tác giả phải có ít nhất 2 ký tự" })
            .max(255, { message: "Tên tác giả không được vượt quá 255 ký tự" }),
        description: z
            .string()
            .max(500, "Mô tả không được vượt quá 500 ký tự")
            .optional(),
        imageUrl: z.string().optional(),
        previewFile: z.instanceof(File).optional(),
    });

    const UpdateAuthorSchema = BaseAuthorSchema.extend({
        id: z.number().int().positive(),
    });

    type FormType = Partial<z.infer<typeof UpdateAuthorSchema>>;

    const defaultValues: FormType = {
        id: author?.id,
        name: author?.name,
        description: author?.description,
        imageUrl: author?.imageUrl || undefined,
        previewFile: undefined,
    };

    const {
        register,
        control,
        watch,
        setError,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<FormType>({
        resolver: zodResolver(
            action === AuthorModalMode.UPDATE
                ? UpdateAuthorSchema
                : BaseAuthorSchema,
        ),
        defaultValues,
    });
    const onSubmit = async (data: FormType) => {
        if (data.previewFile) {
            try {
                await toast.promise(
                    uploadImageMutation.mutateAsync(data.previewFile),
                    {
                        loading: "Đang tải ảnh lên",
                        success: (res) => {
                            data.imageUrl = res?.url;
                            return "Tải ảnh lên thành công";
                        },
                        error: (error) => {
                            return "Tải ảnh lên thất bại";
                        },
                    },
                );
            } catch (error) {
                return;
            }
        }

        switch (action) {
            case AuthorModalMode.CREATE:
                try {
                    const payload = BaseAuthorSchema.parse(data);
                    await toast.promise(
                        createAuthorMutation.mutateAsync(payload),
                        {
                            loading: "Đang thêm tác giả",
                            success: () => "Thêm tác giả thành công",
                            error: (error) =>
                                error?.message || "Thêm tác giả thất bại",
                        },
                    );
                } catch (error) {
                    return;
                }
                break;
            case AuthorModalMode.UPDATE:
                try {
                    const payload = UpdateAuthorSchema.parse(data);
                    await toast.promise(
                        updateAuthorMutation.mutateAsync(payload),
                        {
                            loading: "Đang cập nhật tác giả",
                            success: () => "Cập nhật tác giả thành công",
                            error: (error) => error?.message,
                        },
                    );
                } catch (error) {
                    return;
                }
                break;
        }
    };
    const handleOnClose = () => {
        reset();
        onClose();
    };

    console.log(errors);

    return (
        <TransitionModal
            maxWidth={maxWidth}
            isOpen={isOpen}
            onClose={handleOnClose}
            closeOnOverlayClick={false}
            afterLeave={afterLeave}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {isSubmitting && <Modal.Backdrop />}
                <Modal.Header
                    title={
                        action === AuthorModalMode.CREATE
                            ? "Thêm tác giả"
                            : `Cập nhật tác giả ${author?.name}`
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="space-y-3 py-4 px-5">
                    <Modal.FormLabel label="Ảnh đại diện" />
                    <Controller
                        name="previewFile"
                        control={control}
                        render={({ field }) => (
                            <SelectProfilePicture
                                onChange={(file) => {
                                    if (!isImageFile(file)) {
                                        toast.error(
                                            "Tệp tải lên phải có định dạng ảnh",
                                        );
                                        return false;
                                    }
                                    if (!isValidFileSize(file, 1)) {
                                        toast.error(
                                            "Kích thước ảnh đại diện không được vượt quá 1MB",
                                        );
                                        return false;
                                    }
                                    field.onChange(file);
                                    return true;
                                }}
                                defaultImageURL={author?.imageUrl}
                            />
                        )}
                    />
                    <Modal.FormInput<FormType>
                        placeholder={"Nhập tên tác giả"}
                        register={register}
                        required={true}
                        fieldName={"name"}
                        label={"Tên tác giả"}
                        errorMessage={errors.name?.message}
                    />

                    <Modal.FormInput<FormType>
                        isTextArea={true}
                        rows={6}
                        placeholder={"Nhập mô tả tác giả"}
                        register={register}
                        fieldName={"description"}
                        label={"Mô tả"}
                        errorMessage={errors.description?.message}
                    />
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <Modal.SecondaryButton
                            disabled={isSubmitting}
                            onClick={handleOnClose}
                            type="button"
                        >
                            Huỷ
                        </Modal.SecondaryButton>

                        <Modal.PrimaryButton
                            disabled={
                                isSubmitting ||
                                (!isDirty && action === AuthorModalMode.UPDATE)
                            }
                            type="submit"
                        >
                            <Modal.SubmitTextWithLoading
                                isLoading={isSubmitting}
                                text={
                                    action === AuthorModalMode.CREATE
                                        ? "Thêm"
                                        : "Cập nhật"
                                }
                                loadingText={
                                    action === AuthorModalMode.CREATE
                                        ? "Đang thêm"
                                        : "Đang cập nhật"
                                }
                            />
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};
export default memo(AuthorModal);
