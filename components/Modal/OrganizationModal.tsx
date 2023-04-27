import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import { ImageUploadService } from "../../services/ImageUploadService";
import {
    CreateOrganizationParams,
    OrganizationService,
    UpdateOrganizationParams,
} from "../../services/OrganizationService";
import { IOrganization } from "../../types/Organization/IOrganization";
import { isImageFile, isValidFileSize, VIETNAMESE_PHONE_REGEX } from "../../utils/helper";
import SelectProfilePicture from "../SelectProfilePicture";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import { defaultInputClass } from "../Form";
import { MdOutlineAdd, MdRemoveCircle } from "react-icons/md";
import ErrorMessage from "../Form/ErrorMessage";
import ToggleButton from "../ToggleButton";

export enum OrganizationModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    action: OrganizationModalMode;
    isOpen: boolean;
    onClose: () => void;
    afterLeave?: () => void;
    organization?: IOrganization;
};

const OrganizationModal: React.FC<Props> = ({
                                                maxWidth,
                                                action,
                                                isOpen,
                                                onClose,
                                                organization,
                                                afterLeave,
                                            }) => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const orgService = new OrganizationService(loginUser?.accessToken);
    const imageService = new ImageUploadService(loginUser?.accessToken);

    const [emails, setEmails] = React.useState<string[]>([]);

    const commonMutationOptions = {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["organizations"]);
            handleOnClose();
        },
    };

    const createMutation = useMutation(
        (data: CreateOrganizationParams) => orgService.createOrganization(data),
        commonMutationOptions,
    );
    const updateMutation = useMutation(
        (data: UpdateOrganizationParams) => orgService.updateOrganization(data),
        commonMutationOptions,
    );
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
    );

    const BaseOrganizationSchema = z.object({
        name: z
            .string()
            .min(2, "Tên tổ chức phải có ít nhất 2 ký tự")
            .max(255, "Tên tổ chức không được vượt quá 255 ký tự"),
        address: z
            .string()
            .min(2, "Địa chỉ phải có ít nhất 2 ký tự")
            .max(250, "Địa chỉ không được vượt quá 50 ký tự"),
        phone: z
        .string()
        .min(10, "Số điện thoại phải có ít nhất 10 ký tự")
        .max(50, "Số điện thoại không được vượt quá 50 ký tự"),
        imageUrl: z.string().optional(),
        previewFile: z.instanceof(File).optional(),
        organizationMembers: z.array(
            z.object(
                {
                    emailDomain: z.string().min(3, "Tên miền phải có ít nhất 3 ký tự"),
                    status: z.boolean().default(true),
                    isNewItem: z.boolean().default(true),
                },
            )).refine((value) => {
            return value.length === Array.from(new Set(value.map((v) => v.emailDomain.trim()))).length;
        }, "Các tên miền không được trùng nhau"),
    });

    const UpdateOrganizationSchema = BaseOrganizationSchema.extend({
        id: z.number().int().positive(),
    });

    type FormType = Partial<z.infer<typeof UpdateOrganizationSchema>>;

    const defaultValues: FormType = {
        id: organization?.id,
        name: organization?.name,
        address: organization?.address,
        phone: organization?.phone,
        imageUrl: organization?.imageUrl || undefined,
        previewFile: undefined,
        organizationMembers: organization?.members?.map(m => {
            return {
                emailDomain: m.emailDomain,
                status: m.status,
                isNewItem: false,
            };
        }) || [],
    };

    const {
        register,
        control,
        setValue,
        reset,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormType>({
        resolver: zodResolver(
            action === OrganizationModalMode.UPDATE
                ? UpdateOrganizationSchema
                : BaseOrganizationSchema,
        ),
        defaultValues,
    });

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control,
        name: "organizationMembers",
    });

    const handleOnClose = () => {
        reset();
        onClose();
    };

    const onFileChange = (file: File): boolean => {
        if (!isImageFile(file)) {
            toast.error("Tệp tải lên phải có định dạng ảnh");
            return false;
        }

        if (!isValidFileSize(file, 1)) {
            toast.error("Kích thước ảnh đại diện không được vượt quá 1MB");
            return false;
        }

        setValue("previewFile", file);
        return true;
    };

    const onSubmit = async (data: FormType) => {
        if (data.previewFile) {
            try {
                await toast.promise(
                    uploadImageMutation.mutateAsync(data.previewFile),
                    {
                        loading: "Đang tải ảnh lên",
                        success: (res) => {
                            if (res?.url) {
                                data.imageUrl = res.url;
                            }
                            return `Tải ảnh lên thành công`;
                        },
                        error: (error) => {
                            return (
                                error?.message ||
                                "Đã có lỗi xảy ra khi tải ảnh lên"
                            );
                        },
                    },
                );
            } catch (error) {
                return;
            }
        }
        switch (action) {
            case OrganizationModalMode.CREATE:
                try {
                    const createPayload = BaseOrganizationSchema.parse(data);
                    await toast.promise(
                        createMutation.mutateAsync(createPayload),
                        {
                            loading: "Đang tạo tổ chức",
                            success: "Tạo tổ chức thành công",
                            error: (error) => {
                                return (
                                    error?.message ||
                                    "Đã có lỗi xảy ra khi tạo tổ chức"
                                );
                            },
                        },
                    );
                } catch (error) {
                    return;
                }
                break;
            case OrganizationModalMode.UPDATE:
                try {
                    const updatePayload = UpdateOrganizationSchema.parse(data);
                    await toast.promise(
                        updateMutation.mutateAsync(updatePayload),
                        {
                            loading: "Đang cập nhật tổ chức",
                            success: "Cập nhật tổ chức thành công",
                            error: (error) => {
                                return (
                                    error?.message ||
                                    "Đã có lỗi xảy ra khi cập nhật tổ chức"
                                );
                            },
                        },
                    );
                } catch (error) {
                    return;
                }

                break;
        }
    };

    console.log(errors);

    return (
        <TransitionModal
            afterLeave={afterLeave}
            maxWidth={maxWidth}
            isOpen={isOpen}
            onClose={handleOnClose}
            closeOnOverlayClick={false}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {isSubmitting && <Modal.Backdrop />}
                <Modal.Header
                    title={
                        action === OrganizationModalMode.CREATE
                            ? "Thêm tổ chức"
                            : `Cập nhật tổ chức ${organization?.name}`
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
                                defaultImageURL={organization?.imageUrl}
                            />
                        )}
                    />
                    <Modal.FormInput<FormType>
                        required={true}
                        label={"Tên tổ chức"}
                        placeholder={"Nhập tên tổ chức"}
                        fieldName={"name"}
                        register={register}
                        errorMessage={errors.name?.message}
                    />

                    <Modal.FormInput<FormType>
                        required={true}
                        label={"Số điện thoại"}
                        placeholder={"Nhập số điện thoại"}
                        fieldName={"phone"}
                        register={register}
                        errorMessage={errors.phone?.message}
                    />

                    <Modal.FormInput<FormType>
                        required={true}
                        isTextArea={true}
                        label={"Địa chỉ"}
                        placeholder={"Nhập địa chỉ"}
                        fieldName={"address"}
                        register={register}
                        errorMessage={errors.address?.message}
                    />

                    <div>
                        <Modal.FormLabel label="Tên miền của tổ chức" />
                        <p className={"text-sm text-gray-500 mb-3"}>
                            Các tên miền đã tồn tại trước đó chỉ có thể thay đổi trạng thái và không thể xóa.
                        </p>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id}>
                                    <div
                                        className="flex items-center space-x-2"
                                    >
                                        <input
                                            className={defaultInputClass}
                                            type="text"
                                            disabled={!field.isNewItem}
                                            placeholder="Nhập tên miền"
                                            {...register(`organizationMembers.${index}.emailDomain` as const)}
                                        />
                                        <button
                                            type={"button"}
                                            className="disabled:opacity-50"
                                            disabled={!field.isNewItem}
                                            onClick={() => {
                                                remove(index);
                                            }}
                                        >
                                            <MdRemoveCircle className="text-red-500 w-6 h-6" />
                                        </button>

                                        <Controller
                                            name={`organizationMembers.${index}.status` as const}
                                            control={control}
                                            render={({ field: statusField }) => (
                                                <ToggleButton isCheck={statusField.value}
                                                              onChange={(value) => {
                                                                  statusField.onChange(value);
                                                              }} disabled={field.isNewItem} />
                                            )}
                                        />

                                    </div>
                                    <ErrorMessage>
                                        {errors.organizationMembers?.[index]?.emailDomain?.message}
                                    </ErrorMessage>
                                </div>
                            ))}
                        </div>
                        <ErrorMessage>
                            {errors.organizationMembers?.message}
                        </ErrorMessage>
                        <button
                            className="mt-3 flex gap-2 justify-center items-center text-sm font-medium rounded py-2 bg-indigo-100 text-indigo-500 w-full border border-dashed border-indigo-200"
                            type={"button"}
                            onClick={() => {
                                append({ emailDomain: "", status: true, isNewItem: true });
                            }}
                        >
                            <MdOutlineAdd />
                            Thêm tên miền
                        </button>
                    </div>
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
                                (action === OrganizationModalMode.UPDATE &&
                                    !isDirty)
                            }
                            type="submit"
                        >
                            <Modal.SubmitTextWithLoading
                                isLoading={isSubmitting}
                                text={
                                    action === OrganizationModalMode.CREATE
                                        ? "Thêm tổ chức"
                                        : "Cập nhật tổ chức"
                                }
                                loadingText={
                                    action === OrganizationModalMode.CREATE
                                        ? "Đang thêm"
                                        : "Đang cập nhật"
                                }
                            />
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>

                <pre>
                    {JSON.stringify(watch(), null, 2)}
                </pre>
            </form>
        </TransitionModal>
    );
};

export default OrganizationModal;
