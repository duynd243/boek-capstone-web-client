import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { memo, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { IPublisher } from "../../types/Publisher/IPublisher";
import {
    isImageFile,
    isValidFileSize,
    VIETNAMESE_PHONE_REGEX,
} from "../../utils/helper";
import SelectProfilePicture from "../SelectProfilePicture";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import {
    CreatePublisherParams,
    PublisherService,
    UpdatePublisherParams,
} from "../../services/PublisherService";
import { useAuth } from "../../context/AuthContext";
import { ImageUploadService } from "../../services/ImageUploadService";
import ErrorMessage from "../Form/ErrorMessage";

export enum PublisherModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    action: PublisherModalMode;
    isOpen: boolean;
    onClose: () => void;
    afterLeave?: () => void;
    publisher?: IPublisher;
};

const PublisherModal: React.FC<Props> = ({
    maxWidth,
    action,
    isOpen,
    onClose,
    publisher,
    afterLeave,
}) => {
    const BasePublisherSchema = z.object({
        name: z
            .string()
            .min(2, "Tên nhà xuất bản phải có ít nhất 2 ký tự")
            .max(50, "Tên nhà xuất bản không được vượt quá 50 ký tự"),
        email: z.string().email("Email không hợp lệ"),
        address: z
            .string()
            .min(2, "Địa chỉ phải có ít nhất 2 ký tự")
            .max(250, "Địa chỉ không được vượt quá 50 ký tự"),
        phone: z
            .string()
            .regex(VIETNAMESE_PHONE_REGEX, "Số điện thoại không hợp lệ"),
        imageUrl: z.string().optional(),
        previewFile: z.instanceof(File),
    });

    const UpdatePublisherSchema = BasePublisherSchema.extend({
        id: z.number().int().positive(),
        previewFile: z.instanceof(File).optional(),
        imageUrl: z.string(),
    });

    type FormType = Partial<z.infer<typeof UpdatePublisherSchema>>;

    const defaultValues: FormType = {
        id: publisher?.id,
        name: publisher?.name,
        email: publisher?.email,
        address: publisher?.address,
        phone: publisher?.phone,
        imageUrl: publisher?.imageUrl || "",
        previewFile: undefined,
    };

    const {
        register,
        control,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormType>({
        resolver: zodResolver(
            action === PublisherModalMode.CREATE
                ? BasePublisherSchema
                : UpdatePublisherSchema
        ),
        defaultValues,
    });
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const publisherService = new PublisherService(loginUser?.accessToken);
    const imageService = new ImageUploadService(loginUser?.accessToken);

    const handleOnClose = useCallback(() => {
        reset();
        setValue("previewFile", undefined);
        onClose();
    }, [reset, onClose, setValue]);

    const commonMutationOptions = {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["publishers"]);
            handleOnClose();
        },
    };

    const createPublisherMutation = useMutation(
        (data: CreatePublisherParams) => {
            return publisherService.createPublisher(data);
        },
        commonMutationOptions
    );

    const updatePublisherMutation = useMutation(
        (data: UpdatePublisherParams) => {
            return publisherService.updatePublisher(data);
        },
        commonMutationOptions
    );

    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file)
    );
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
                    }
                );
            } catch (error) {
                return;
            }
        }

        if (!data.imageUrl) return;
        switch (action) {
            case PublisherModalMode.CREATE:
                try {
                    const createPayload = BasePublisherSchema.parse(data);
                    await toast.promise(
                        createPublisherMutation.mutateAsync({
                            ...createPayload,
                            imageUrl: data.imageUrl,
                        }),
                        {
                            loading: "Đang thêm nhà xuất bản",
                            success: () => {
                                return "Thêm nhà xuất bản thành công";
                            },
                            error: (error) => {
                                return (
                                    error?.mesage ||
                                    "Thêm nhà xuất bản thất bại"
                                );
                            },
                        }
                    );
                } catch (error) {
                    return;
                }
                break;
            case PublisherModalMode.UPDATE:
                try {
                    const updatePayload = UpdatePublisherSchema.parse(data);
                    await toast.promise(
                        updatePublisherMutation.mutateAsync(updatePayload),
                        {
                            loading: "Đang cập nhật nhà xuất bản",
                            success: () => {
                                return "Cập nhật nhà xuất bản thành công";
                            },
                            error: (error) => {
                                return (
                                    error?.message ||
                                    "Cập nhật nhà xuất bản thất bại"
                                );
                            },
                        }
                    );
                } catch (error) {
                    return;
                }
                break;
        }
    };

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
                        action === PublisherModalMode.CREATE
                            ? "Thêm nhà xuất bản"
                            : `Cập nhật ${publisher?.name} (${publisher?.code})`
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="space-y-3 py-4 px-5">
                    <Modal.FormLabel label="Ảnh đại diện" required={true} />
                    <Controller
                        name="previewFile"
                        control={control}
                        render={({ field }) => (
                            <SelectProfilePicture
                                onChange={(file) => {
                                    if (!isImageFile(file)) {
                                        toast.error(
                                            "Tệp tải lên phải có định dạng ảnh"
                                        );
                                        return false;
                                    }
                                    if (!isValidFileSize(file, 1)) {
                                        toast.error(
                                            "Kích thước ảnh đại diện không được vượt quá 1MB"
                                        );
                                        return false;
                                    }
                                    field.onChange(file);
                                    return true;
                                }}
                                defaultImageURL={publisher?.imageUrl}
                            />
                        )}
                    />
                    <ErrorMessage>
                        {errors.previewFile?.message &&
                            "Ảnh đại diện không hợp lệ"}
                    </ErrorMessage>
                    <Modal.FormInput<FormType>
                        placeholder="Nhập tên nhà xuất bản"
                        required={true}
                        register={register}
                        fieldName="name"
                        label="Tên nhà xuất bản"
                        errorMessage={errors.name?.message}
                    />
                    <Modal.FormInput<FormType>
                        placeholder="Nhập email"
                        required={true}
                        register={register}
                        fieldName="email"
                        label="Địa chỉ email"
                        errorMessage={errors.email?.message}
                    />
                    <Modal.FormInput<FormType>
                        placeholder="Nhập số điện thoại"
                        required={true}
                        register={register}
                        fieldName="phone"
                        label="Số điện thoại"
                        errorMessage={errors.phone?.message}
                    />
                    <Modal.FormInput<FormType>
                        isTextArea={true}
                        placeholder="Nhập địa chỉ"
                        required={true}
                        register={register}
                        fieldName="address"
                        label="Địa chỉ"
                        errorMessage={errors.address?.message}
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
                                (!isDirty &&
                                    action === PublisherModalMode.UPDATE)
                            }
                            type="submit"
                        >
                            <Modal.SubmitTextWithLoading
                                isLoading={isSubmitting}
                                text={
                                    action === PublisherModalMode.CREATE
                                        ? "Thêm nhà xuất bản"
                                        : "Cập nhật NXB"
                                }
                                loadingText={
                                    action === PublisherModalMode.CREATE
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

export default memo(PublisherModal);
