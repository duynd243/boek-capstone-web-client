import { zodResolver } from "@hookform/resolvers/zod";
import React, { memo, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useAddress from "../../hooks/useAddress";
import { IDistrict } from "../../types/Address/IDistrict";
import { IProvince } from "../../types/Address/IProvince";
import { IWard } from "../../types/Address/IWard";
import { IUser } from "../../types/User/IUser";
import { isImageFile, isValidFileSize, VIETNAMESE_PHONE_REGEX } from "../../utils/helper";
import ErrorMessage from "../Form/ErrorMessage";
import SelectBox from "../SelectBox";
import ToggleButton from "../ToggleButton";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import SelectProfilePicture from "../SelectProfilePicture";
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { CreateUserParams, UpdateUserParams, UserService } from "../../services/UserService";
import { ImageUploadService } from "../../services/ImageUploadService";
import { Roles } from "../../constants/Roles";

export enum IssuerModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    afterLeave?: () => void;
    action: IssuerModalMode;
    isOpen: boolean;
    onClose: () => void;
    issuer?: IUser;
};

const IssuerModal: React.FC<Props> = ({
                                          maxWidth,
                                          action,
                                          isOpen,
                                          onClose,
                                          issuer,
                                          afterLeave,
                                      }) => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const userService = new UserService(loginUser?.accessToken);
    const imageService = new ImageUploadService(loginUser?.accessToken);

    const {
        provinces,
        districts,
        wards,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        selectedProvince,
        selectedDistrict,
        selectedWard,
    } = useAddress({
        defaultProvinceCode: issuer?.addressViewModel?.provinceCode,
        defaultDistrictCode: issuer?.addressViewModel?.districtCode,
        defaultWardCode: issuer?.addressViewModel?.wardCode,
    });
    const CreateIssuerSchema = z.object({
        name: z
            .string()
            .min(2, "Tên nhà phát hành phải có ít nhất 2 ký tự")
            .max(50, "Tên nhà phát hành không được vượt quá 50 ký tự"),
        email: z.string().email("Email không hợp lệ"),
        role: z.number().int(),
    });

    const UpdateIssuerSchema = CreateIssuerSchema.extend({
        id: z.string(),
        phone: z
            .string()
            .regex(VIETNAMESE_PHONE_REGEX, "Số điện thoại không hợp lệ"),
        imageUrl: z.string(),
        addressRequest: z.object({
            detail: z.string().min(1, "Địa chỉ chi tiết không được để trống"),
            provinceCode: z.number({
                required_error: "Tỉnh / Thành phố không được để trống",
            }),
            districtCode: z.number({
                required_error: "Quận / Huyện không được để trống",
            }),
            wardCode: z.number({
                required_error: "Phường / Xã không được để trống",
            }),
        }),
        previewFile: z.instanceof(File).optional(),
        status: z.boolean(),
    });

    type FormType = Partial<z.infer<typeof UpdateIssuerSchema>>;

    const defaultValues = {
        id: issuer?.id || "",
        name: issuer?.name || "",
        email: issuer?.email || "",
        phone: issuer?.phone || "",
        imageUrl: issuer?.imageUrl || "",
        addressRequest: {
            detail: issuer?.addressViewModel?.detail,
            provinceCode: issuer?.addressViewModel?.provinceCode,
            districtCode: issuer?.addressViewModel?.districtCode,
            wardCode: issuer?.addressViewModel?.wardCode,
        },
        previewFile: undefined,
        status: issuer?.status,
        role: Roles.ISSUER.id,
    };

    const {
        register,
        control,
        watch,
        reset,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormType>({
        resolver: zodResolver(
            action === IssuerModalMode.CREATE
                ? CreateIssuerSchema
                : UpdateIssuerSchema,
        ),
        defaultValues,
    });

    const handleOnClose = useCallback(() => {
        onClose();
        if (action === IssuerModalMode.CREATE) {
            reset();
        }
    }, [onClose, action, reset]);

    const commonMutationOptions = {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["issuers"]);
            handleOnClose();
        },
    };

    const createIssuerMutation = useMutation((data: CreateUserParams) => {
        return userService.createUserByAdmin(data);
    }, commonMutationOptions);

    const updateIssuerMutation = useMutation((data: UpdateUserParams) => {
        return userService.updateUserByAdmin(data);
    }, commonMutationOptions);

    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
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
                    },
                );
            } catch (error) {
                return;
            }
        }

        switch (action) {
            case IssuerModalMode.CREATE:

                try {
                    const createPayload = CreateIssuerSchema.parse(data);
                    await toast.promise(
                        createIssuerMutation.mutateAsync(createPayload),
                        {
                            loading: "Đang thêm nhà phát hành",
                            success: () => {
                                return "Thêm nhà phát hành thành công";
                            },
                            error: (error) => {
                                return error?.message || "Thêm nhà phát hành thất bại";
                            },
                        },
                    );
                } catch (error) {
                    return;
                }
                break;
            case IssuerModalMode.UPDATE:
                try {
                    const updatePayload = UpdateIssuerSchema.parse(data);
                    await toast.promise(
                        updateIssuerMutation.mutateAsync(updatePayload),
                        {
                            loading: "Đang cập nhật nhà phát hành",
                            success: () => {
                                return "Cập nhật nhà phát hành thành công";
                            },
                            error: (error) => {
                                return (
                                    error?.message ||
                                    "Cập nhật nhà phát hành thất bại"
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
                        action === IssuerModalMode.CREATE
                            ? "Thêm nhà phát hành"
                            : `Cập nhật ${issuer?.name} (${issuer?.code})`
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="space-y-3 py-4 px-5">
                    {action === IssuerModalMode.UPDATE && (
                        <>
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
                                        defaultImageURL={issuer?.imageUrl}
                                    />
                                )}
                            />
                        </>
                    )}
                    <Modal.FormInput<FormType>
                        disabled={action === IssuerModalMode.UPDATE}
                        readOnly={action === IssuerModalMode.UPDATE}
                        required={action === IssuerModalMode.CREATE}
                        placeholder="Nhập email"
                        register={register}
                        fieldName="email"
                        label="Địa chỉ email"
                        errorMessage={errors.email?.message}
                    />
                    <Modal.FormInput<FormType>
                        placeholder="Nhập tên nhà phát hành"
                        required={true}
                        register={register}
                        fieldName="name"
                        label="Tên nhà phát hành"
                        errorMessage={errors.name?.message}
                    />

                    {action === IssuerModalMode.UPDATE && (
                        <>
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
                                fieldName="addressRequest.detail"
                                label="Địa chỉ chi tiết"
                                errorMessage={
                                    errors?.addressRequest?.detail?.message
                                }
                            />
                            <div>
                                <Modal.FormLabel
                                    label="Tỉnh / Thành phố"
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name="addressRequest.provinceCode"
                                    render={({ field }) => (
                                        <SelectBox<IProvince>
                                            value={selectedProvince}
                                            placeholder="Chọn tỉnh / thành phố"
                                            onValueChange={(p) => {
                                                if (
                                                    p.code ===
                                                    watch(
                                                        "addressRequest.provinceCode",
                                                    )
                                                )
                                                    return;

                                                field.onChange(p.code);
                                                setValue(
                                                    "addressRequest.districtCode" as any,
                                                    undefined,
                                                );
                                                setValue(
                                                    "addressRequest.wardCode" as any,
                                                    undefined,
                                                );
                                                handleProvinceChange(p);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={provinces}
                                        />
                                    )}
                                />
                                <ErrorMessage>
                                    {
                                        errors?.addressRequest?.provinceCode
                                            ?.message
                                    }
                                </ErrorMessage>
                            </div>
                            <div>
                                <Modal.FormLabel
                                    label="Quận / Huyện"
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name="addressRequest.districtCode"
                                    render={({ field }) => (
                                        <SelectBox<IDistrict>
                                            value={selectedDistrict}
                                            placeholder="Chọn quận / huyện"
                                            onValueChange={(d) => {
                                                if (
                                                    d.code ===
                                                    watch(
                                                        "addressRequest.districtCode",
                                                    )
                                                )
                                                    return;
                                                field.onChange(d.code);
                                                setValue(
                                                    "addressRequest.wardCode" as any,
                                                    undefined,
                                                );
                                                handleDistrictChange(d);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={districts}
                                        />
                                    )}
                                />

                                <ErrorMessage>
                                    {
                                        errors.addressRequest?.districtCode
                                            ?.message
                                    }
                                </ErrorMessage>
                            </div>
                            <div>
                                <Modal.FormLabel
                                    label="Phường / Xã"
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name="addressRequest.wardCode"
                                    render={({ field }) => (
                                        <SelectBox<IWard>
                                            value={selectedWard}
                                            placeholder="Chọn phường / xã"
                                            onValueChange={(w) => {
                                                if (
                                                    w.code ===
                                                    watch(
                                                        "addressRequest.wardCode",
                                                    )
                                                )
                                                    return;
                                                field.onChange(w.code);
                                                handleWardChange(w);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={wards}
                                        />
                                    )}
                                />
                                <ErrorMessage>
                                    {errors.addressRequest?.wardCode?.message}
                                </ErrorMessage>
                            </div>
                            <Modal.FormLabel
                                fieldName="status"
                                label="Trạng thái"
                                required={true}
                            />
                            <div className="flex items-center justify-between">
                                <Modal.StatusSwitch
                                    enabled={watch("status") || false}
                                    enabledText="Nhà phát hành đang hoạt động"
                                    disabledText="Nhà phát hành sẽ bị vô hiệu hóa"
                                />
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <ToggleButton
                                            isCheck={watch("status") || false}
                                            onChange={(value) =>
                                                field.onChange(value)
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </>
                    )}
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
                                (!isDirty && action === IssuerModalMode.UPDATE)
                            }
                            type="submit"
                        >
                            <Modal.SubmitTextWithLoading
                                isLoading={isSubmitting}
                                text={
                                    action === IssuerModalMode.CREATE
                                        ? "Thêm nhà phát hành"
                                        : "Cập nhật NPH"
                                }
                                loadingText={
                                    action === IssuerModalMode.CREATE
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

export default memo(IssuerModal);
