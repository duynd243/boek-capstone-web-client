import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import React from "react";
import {useForm} from "react-hook-form";
import {toast} from "react-hot-toast";
import {z} from "zod";
import {useAuth} from "../../context/AuthContext";
import {ImageUploadService} from "../../services/ImageUploadService";
import {
    CreateOrganizationParams,
    OrganizationService,
    UpdateOrganizationParams,
} from "../../services/OrganizationService";
import {IOrganization} from "../../types/Organization/IOrganization";
import {
    isImageFile,
    isValidFileSize,
    VIETNAMESE_PHONE_REGEX,
} from "../../utils/helper";
import SelectProfilePicture from "../SelectProfilePicture";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";

import {CgSpinnerAlt} from "react-icons/cg";

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
    const {loginUser} = useAuth();
    const queryClient = useQueryClient();
    const orgService = new OrganizationService(loginUser?.accessToken);
    const imageService = new ImageUploadService(loginUser?.accessToken);

    const commonMutationOptions = {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["organizations"]);
            handleOnClose();
        },
    };

    const createMutation = useMutation(
        (data: CreateOrganizationParams) => orgService.createOrganization(data),
        commonMutationOptions
    );
    const updateMutation = useMutation(
        (data: UpdateOrganizationParams) => orgService.updateOrganization(data),
        commonMutationOptions
    );
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file)
    );

    const OrganizationSchema = z.object({
        name: z
            .string()
            .min(2, "Tên tổ chức phải có ít nhất 2 ký tự")
            .max(50, "Tên tổ chức không được vượt quá 50 ký tự"),
        address: z
            .string()
            .min(2, "Địa chỉ phải có ít nhất 2 ký tự")
            .max(250, "Địa chỉ không được vượt quá 50 ký tự"),
        phone: z
            .string()
            .regex(VIETNAMESE_PHONE_REGEX, "Số điện thoại không hợp lệ"),
        imageUrl: z.string().optional(),
        previewFile: z.instanceof(File).optional(),
    });

    type OrganizationSchemaType = z.infer<typeof OrganizationSchema>;

    const {register, setValue, reset, getValues, handleSubmit, formState} =
        useForm<OrganizationSchemaType>({
            resolver: zodResolver(OrganizationSchema),
            values: {
                name: organization?.name || "",
                address: organization?.address || "",
                phone: organization?.phone || "",
                imageUrl: organization?.imageUrl,
            },
        });
    const {isSubmitting, isDirty} = formState;

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

    const onSubmit = async (data: OrganizationSchemaType) => {
        if (data?.previewFile) {
            toast
                .promise(uploadImageMutation.mutateAsync(data.previewFile), {
                    loading: "Đang tải ảnh lên",
                    success: (res) => {
                        if (res?.url) {
                            data.imageUrl = res.url;
                        }
                        return `Tải ảnh lên thành công`;
                    },
                    error: (error) => {
                        return (
                            error?.message || "Đã có lỗi xảy ra khi tải ảnh lên"
                        );
                    },
                })
                .catch((err) => console.log(err));
        }

        if (!data?.imageUrl) {
            toast.error("Vui lòng chọn ảnh đại diện");
            return;
        }
        switch (action) {
            case OrganizationModalMode.CREATE:
                toast
                    .promise(
                        createMutation.mutateAsync({
                            ...data,
                            imageUrl: data.imageUrl,
                        }),
                        {
                            loading: "Đang tạo tổ chức",
                            success: "Tạo tổ chức thành công",
                            error: (error) => {
                                return (
                                    error?.message ||
                                    "Đã có lỗi xảy ra khi tạo tổ chức"
                                );
                            },
                        }
                    )
                    .catch((err) => console.log(err));
                break;
            case OrganizationModalMode.UPDATE:
                if (!organization?.id) return;
                toast
                    .promise(
                        updateMutation.mutateAsync({
                            ...data,
                            id: organization.id,
                            imageUrl: data.imageUrl,
                        }),
                        {
                            loading: "Đang cập nhật tổ chức",
                            success: "Cập nhật tổ chức thành công",
                            error: (error) => {
                                return (
                                    error?.message ||
                                    "Đã có lỗi xảy ra khi cập nhật tổ chức"
                                );
                            },
                        }
                    )
                    .catch((err) => console.log(err));

                break;
        }
    };

    return (
        <TransitionModal
            afterLeave={afterLeave}
            maxWidth={maxWidth}
            isOpen={isOpen}
            onClose={handleOnClose}
            closeOnOverlayClick={false}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {isSubmitting && <Modal.Backdrop/>}
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
                    <Modal.FormLabel label="Ảnh đại diện"/>
                    <SelectProfilePicture
                        onChange={onFileChange}
                        defaultImageURL={organization?.imageUrl}
                    />
                    <Modal.FormInput<OrganizationSchemaType>
                        required={true}
                        label={"Tên tổ chức"}
                        formState={formState}
                        placeholder={"Nhập tên tổ chức"}
                        fieldName={"name"}
                        register={register}
                    />

                    <Modal.FormInput<OrganizationSchemaType>
                        required={true}
                        label={"Số điện thoại"}
                        formState={formState}
                        placeholder={"Nhập số điện thoại"}
                        fieldName={"phone"}
                        register={register}
                    />

                    <Modal.FormInput<OrganizationSchemaType>
                        required={true}
                        isTextArea={true}
                        label={"Địa chỉ"}
                        formState={formState}
                        placeholder={"Nhập địa chỉ"}
                        fieldName={"address"}
                        register={register}
                    />

                    <pre>
                        {/* {JSON.stringify(getValues(), null, 2)} */}
                    </pre>
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            disabled={isSubmitting}
                            onClick={handleOnClose}
                            type="button"
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Huỷ
                        </button>

                        <button
                            disabled={
                                isSubmitting ||
                                (action === OrganizationModalMode.UPDATE && !isDirty &&
                                    getValues().previewFile === undefined)
                            }
                            type="submit"
                            className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-300"
                        >
                            {isSubmitting ? (
                                <>
                                    {action === OrganizationModalMode.CREATE
                                        ? "Đang tạo"
                                        : "Đang cập nhật"}

                                    <CgSpinnerAlt
                                        className="animate-spin ml-2"
                                        size={18}
                                    />
                                </>
                            ) : action === OrganizationModalMode.CREATE ? (
                                "Tạo tổ chức"
                            ) : (
                                "Cập nhật tổ chức"
                            )}
                        </button>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default OrganizationModal;
