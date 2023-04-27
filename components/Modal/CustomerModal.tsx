import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import useAddress from "../../hooks/useAddress";
import { ImageUploadService } from "../../services/ImageUploadService";
import { UserService } from "../../services/UserService";
import { IDistrict } from "../../types/Address/IDistrict";
import { IProvince } from "../../types/Address/IProvince";
import { IWard } from "../../types/Address/IWard";
import { IUser } from "../../types/User/IUser";
import {
    isImageFile,
    isValidFileSize,
    VIETNAMESE_PHONE_REGEX,
} from "../../utils/helper";
import ErrorMessage from "../Form/ErrorMessage";
import SelectBox from "../SelectBox";
import SelectProfilePicture from "../SelectProfilePicture";
import ToggleButton from "../ToggleButton";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";

type Props = {
    afterLeave?: () => void;
    maxWidth?: string;
    isOpen: boolean;
    onClose: () => void;
    customer?: IUser;
};

const CustomerModal: React.FC<Props> = ({
    afterLeave,
    maxWidth,
    isOpen,
    onClose,
    customer,
}) => {
    const { loginUser } = useAuth();
    const userService = new UserService(loginUser?.accessToken);
    const imageService = new ImageUploadService(loginUser?.accessToken);
    const queryClient = useQueryClient();

    const updateCustomerMutation = useMutation(
        (data: IUser) => {
            return userService.updateUserByAdmin(data);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["customers"]);
                onClose();
            },
        }
    );

    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file)
    );

    const UpdateCustomerSchema = z.object({
        name: z
            .string()
            .min(2, "Tên khách hàng phải có ít nhất 2 ký tự")
            .max(255, "Tên khách hàng không được vượt quá 255 ký tự"),
        email: z
            .string()
            .email("Email không hợp lệ")
            .max(255, "Email không được vượt quá 255 ký tự"),
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
        status: z.boolean(),
        previewFile: z.instanceof(File).optional(),
    });

    type FormType = Partial<z.infer<typeof UpdateCustomerSchema>>;

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
        defaultProvinceCode: customer?.addressViewModel?.provinceCode,
        defaultDistrictCode: customer?.addressViewModel?.districtCode,
        defaultWardCode: customer?.addressViewModel?.wardCode,
    });

    const defaultValues = useMemo(() => {
        return {
            name: customer?.name || "",
            email: customer?.email || "",
            phone: customer?.phone || "",
            imageUrl: customer?.imageUrl || "",
            status: customer?.status,
            addressRequest: {
                detail: customer?.addressViewModel?.detail || "",
                provinceCode: customer?.addressViewModel?.provinceCode,
                districtCode: customer?.addressViewModel?.districtCode,
                wardCode: customer?.addressViewModel?.wardCode,
            },
            previewFile: undefined,
        };
    }, [customer]);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormType>({
        resolver: zodResolver(UpdateCustomerSchema),
        defaultValues: defaultValues,
    });

    const onSubmit = async (data: FormType) => {
        if (!customer || !customer.id || !customer.role) return;

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

        const updateUser = {
            id: customer.id,
            role: customer.role,
            ...data,
        };

        try {
            await toast.promise(
                updateCustomerMutation.mutateAsync(updateUser),
                {
                    loading: "Đang cập nhật khách hàng",
                    success: () => {
                        return "Cập nhật khách hàng thành công";
                    },
                    error: (error) => {
                        return error?.message || "Cập nhật khách hàng thất bại";
                    },
                }
            );
        } catch (error) {
            console.log(error);
            return;
        }
    };
    return (
        <TransitionModal
            afterLeave={afterLeave}
            maxWidth={maxWidth}
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {isSubmitting && <Modal.Backdrop />}
                <Modal.Header
                    title={`Cập nhật ${customer?.name} (${customer?.code})`}
                    onClose={onClose}
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
                                defaultImageURL={customer?.imageUrl}
                            />
                        )}
                    />
                    <Modal.FormInput
                        placeholder="Nhập email"
                        register={register}
                        fieldName="email"
                        label="Địa chỉ email"
                        errorMessage={errors.email?.message}
                        disabled={true}
                        readOnly={true}
                    />

                    <Modal.FormInput<FormType>
                        placeholder="Nhập tên khách hàng"
                        required={true}
                        register={register}
                        fieldName="name"
                        label="Tên khách hàng"
                        errorMessage={errors.name?.message}
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
                        fieldName="addressRequest.detail"
                        label="Địa chỉ chi tiết"
                        errorMessage={errors.addressRequest?.detail?.message}
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
                                            watch("addressRequest.provinceCode")
                                        )
                                            return;

                                        field.onChange(p.code);
                                        setValue(
                                            "addressRequest.districtCode" as any,
                                            undefined
                                        );
                                        setValue(
                                            "addressRequest.wardCode" as any,
                                            undefined
                                        );
                                        handleProvinceChange(p);
                                    }}
                                    displayKey="nameWithType"
                                    dataSource={provinces}
                                />
                            )}
                        />
                        <ErrorMessage>
                            {errors.addressRequest?.provinceCode?.message}
                        </ErrorMessage>
                    </div>
                    <div>
                        <Modal.FormLabel label="Quận / Huyện" required={true} />
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
                                            watch("addressRequest.districtCode")
                                        )
                                            return;
                                        field.onChange(d.code);
                                        setValue(
                                            "addressRequest.wardCode" as any,
                                            undefined
                                        );
                                        handleDistrictChange(d);
                                    }}
                                    displayKey="nameWithType"
                                    dataSource={districts}
                                />
                            )}
                        />

                        <ErrorMessage>
                            {errors.addressRequest?.districtCode?.message}
                        </ErrorMessage>
                    </div>
                    <div>
                        <Modal.FormLabel label="Phường / Xã" required={true} />
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
                                            watch("addressRequest.wardCode")
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
                            enabledText="Khách hàng đang hoạt động"
                            disabledText="Khách hàng sẽ bị vô hiệu hóa"
                        />
                        <Controller
                            control={control}
                            name="status"
                            render={({ field }) => (
                                <ToggleButton
                                    isCheck={watch("status") || false}
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                />
                            )}
                        />
                    </div>
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <Modal.SecondaryButton
                            disabled={isSubmitting}
                            type="button"
                            onClick={onClose}
                        >
                            Huỷ
                        </Modal.SecondaryButton>
                        <Modal.PrimaryButton
                            disabled={isSubmitting || !isDirty}
                            type="submit"
                        >
                            <Modal.SubmitTextWithLoading
                                isLoading={isSubmitting}
                                text="Cập nhật"
                                loadingText="Đang lưu"
                            />
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default CustomerModal;
