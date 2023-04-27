import { RadioGroup } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { BsFillBriefcaseFill, BsShieldFillCheck } from "react-icons/bs";
import { z } from "zod";
import { Roles } from "../../constants/Roles";
import { useAuth } from "../../context/AuthContext";
import useAddress from "../../hooks/useAddress";
import { ImageUploadService } from "../../services/ImageUploadService";
import { CreateUserParams, UpdateUserParams, UserService } from "../../services/UserService";
import { IDistrict } from "../../types/Address/IDistrict";
import { IProvince } from "../../types/Address/IProvince";
import { IWard } from "../../types/Address/IWard";
import { IUser } from "../../types/User/IUser";
import { isImageFile, isValidFileSize, VIETNAMESE_PHONE_REGEX } from "../../utils/helper";
import ErrorMessage from "../Form/ErrorMessage";
import SelectBox from "../SelectBox";
import SelectProfilePicture from "../SelectProfilePicture";
import ToggleButton from "../ToggleButton";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";

export enum PersonnelModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    action: PersonnelModalMode;
    isOpen: boolean;
    onClose: () => void;
    afterLeave?: () => void;
    personnel?: IUser;
};

const roleOptions = [
    {
        id: Roles.SYSTEM.id,
        name: "Quản trị viên",
        icon: BsShieldFillCheck,
    },
    {
        id: Roles.STAFF.id,
        name: "Nhân viên",
        icon: BsFillBriefcaseFill,
    },
];

const PersonnelModal: React.FC<Props> = ({
                                             maxWidth,
                                             action,
                                             isOpen,
                                             onClose,
                                             afterLeave,
                                             personnel,
                                         }) => {
    console.log(personnel, roleOptions);
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
        defaultProvinceCode: personnel?.addressViewModel?.provinceCode,
        defaultDistrictCode: personnel?.addressViewModel?.districtCode,
        defaultWardCode: personnel?.addressViewModel?.wardCode,
    });
    const BasePersonnelSchema = z.object({
        name: z
            .string()
            .min(2, "Tên nhân sự phải có ít nhất 2 ký tự")
            .max(255, "Tên nhân sự không được vượt quá 255 ký tự"),
        email: z.string().email("Email không hợp lệ"),
        role: z
            .number({
                required_error: "Vai trò của nhân sự không được để trống",
            })
            .int(),
    });

    const UpdatePersonnelSchema = BasePersonnelSchema.extend({
        id: z.string(),
        phone: z
            .string()
            .min(10, "Số điện thoại phải có ít nhất 10 ký tự")
            .max(50, "Số điện thoại không được vượt quá 50 ký tự"),
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

    type FormType = Partial<z.infer<typeof UpdatePersonnelSchema>>;

    const defaultValues = {
        id: personnel?.id || "",
        name: personnel?.name || "",
        email: personnel?.email || "",
        phone: personnel?.phone || "",
        imageUrl: personnel?.imageUrl || "",
        addressRequest: {
            detail: personnel?.addressViewModel?.detail,
            provinceCode: personnel?.addressViewModel?.provinceCode,
            districtCode: personnel?.addressViewModel?.districtCode,
            wardCode: personnel?.addressViewModel?.wardCode,
        },
        previewFile: undefined,
        status: personnel?.status,
        role: personnel?.role,
    };

    const {
        register,
        control,
        reset,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormType>({
        resolver: zodResolver(
            action === PersonnelModalMode.CREATE
                ? BasePersonnelSchema
                : UpdatePersonnelSchema,
        ),
        defaultValues,
    });

    const { loginUser } = useAuth();
    const userService = new UserService(loginUser?.accessToken);
    const imageService = new ImageUploadService(loginUser?.accessToken);
    const queryClient = useQueryClient();
    const commonMutationOptions = {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["personnels"]);
            handleOnClose();
        },
    };

    const createPersonnelMutation = useMutation((data: CreateUserParams) => {
        return userService.createUserByAdmin(data);
    }, commonMutationOptions);

    const updatePersonnelMutation = useMutation((data: UpdateUserParams) => {
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
            case PersonnelModalMode.CREATE:
                try {
                    const createPayload = BasePersonnelSchema.parse(data);
                    await toast.promise(
                        createPersonnelMutation.mutateAsync(createPayload),
                        {
                            loading: "Đang thêm nhân sự",
                            success: () => {
                                return "Thêm nhân sự thành công";
                            },
                            error: (error) => {
                                return (
                                    error?.message || "Thêm nhân sự thất bại"
                                );
                            },
                        },
                    );
                } catch (error) {
                    return;
                }
                break;
            case PersonnelModalMode.UPDATE:
                try {
                    const updatePayload = UpdatePersonnelSchema.parse(data);
                    await toast.promise(
                        updatePersonnelMutation.mutateAsync(updatePayload),
                        {
                            loading: "Đang cập nhật nhân sự",
                            success: () => {
                                return "Cập nhật nhân sự thành công";
                            },
                            error: (error) => {
                                return (
                                    error?.message ||
                                    "Cập nhật nhân sự thất bại"
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

    const handleOnClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);
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
                        action === PersonnelModalMode.CREATE
                            ? "Thêm nhân sự"
                            : `Cập nhật ${personnel?.name} (${personnel?.code})`
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="space-y-3 py-4 px-5">
                    {action === PersonnelModalMode.UPDATE && (
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
                                        defaultImageURL={personnel?.imageUrl}
                                    />
                                )}
                            />
                        </>
                    )}

                    <Modal.FormInput<FormType>
                        disabled={action === PersonnelModalMode.UPDATE}
                        readOnly={action === PersonnelModalMode.UPDATE}
                        required={action === PersonnelModalMode.CREATE}
                        placeholder="Nhập email"
                        register={register}
                        fieldName="email"
                        label="Địa chỉ email"
                        errorMessage={errors.email?.message}
                    />
                    <Modal.FormInput<FormType>
                        placeholder="Nhập tên nhân sự"
                        required={true}
                        register={register}
                        fieldName="name"
                        label="Tên nhân sự"
                        errorMessage={errors.name?.message}
                    />

                    {action === PersonnelModalMode.UPDATE && (
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
                                    enabledText="Nhân sự đang hoạt động"
                                    disabledText="Nhân sự sẽ bị vô hiệu hóa"
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

                    <Modal.FormLabel
                        fieldName="role"
                        label="Vai trò"
                        required={true}
                    />

                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                            <RadioGroup
                                className="grid gap-2.5 sm:grid-cols-2"
                                value={field.value}
                                onChange={(value) => field.onChange(value)}
                            >
                                {roleOptions.map((role) => (
                                    <RadioGroup.Option
                                        key={role.id}
                                        value={role.id}
                                    >
                                        {({ checked }) => (
                                            <div
                                                className={`${
                                                    checked
                                                        ? "bg-gradient-to-l from-blue-500 to-blue-600 text-white"
                                                        : "border bg-white text-slate-600"
                                                } relative flex cursor-pointer items-center gap-3 rounded-lg px-5 py-4 text-sm font-medium focus:outline-none`}
                                            >
                                                <role.icon className="h-5 w-5"></role.icon>
                                                {role.name}
                                            </div>
                                        )}
                                    </RadioGroup.Option>
                                ))}
                            </RadioGroup>
                        )}
                    />

                    <ErrorMessage>{errors?.role?.message}</ErrorMessage>
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
                                    action === PersonnelModalMode.UPDATE)
                            }
                            type="submit"
                        >
                            <Modal.SubmitTextWithLoading
                                isLoading={isSubmitting}
                                text={
                                    action === PersonnelModalMode.CREATE
                                        ? "Thêm nhân sự"
                                        : "Cập nhật nhân sự"
                                }
                                loadingText={
                                    action === PersonnelModalMode.CREATE
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

export default PersonnelModal;
