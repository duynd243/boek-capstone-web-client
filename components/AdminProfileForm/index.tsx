import Image from "next/image";
import React, {useEffect, useId} from "react";
import {Controller, useFormContext} from "react-hook-form";
import {toast} from "react-hot-toast";
import {z} from "zod";
import DefaultAvatar from "../../assets/images/default-avatar.png";
import useAddress from "../../hooks/useAddress";
import {IDistrict} from "../../types/Address/IDistrict";
import {IProvince} from "../../types/Address/IProvince";
import {IWard} from "../../types/Address/IWard";
import {isImageFile, isValidFileSize, VIETNAMESE_PHONE_REGEX,} from "../../utils/helper";
import Form from "../Form";
import ErrorMessage from "../Form/ErrorMessage";
import SelectBox from "../SelectBox";

type Props = {
    onSubmit: (data: UpdateProfileFormType) => Promise<void>;
};

export const UpdateProfileSchema = z.object({
    id: z.string(),
    name: z
        .string()
        .min(2, "Họ và tên phải có ít nhất 2 ký tự")
        .max(50, "Họ và tên không được vượt quá 50 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    phone: z
        .string()
        .regex(VIETNAMESE_PHONE_REGEX, "Số điện thoại không hợp lệ"),
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
    previewFile: z.any().optional(),
    imageUrl: z.string(),
    role: z.number().int(),
    status: z.boolean().default(true),
    code: z.string().optional(),
});

export type UpdateProfileFormType = Partial<
    z.infer<typeof UpdateProfileSchema>
>;

const AdminProfileForm = ({onSubmit}: Props) => {

    const inputId = useId();
    const {
        handleSubmit,
        control,
        register,
        setValue,
        watch,
        formState: {errors, isDirty, isSubmitting},
    } = useFormContext<UpdateProfileFormType>();

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
        defaultProvinceCode: watch("addressRequest.provinceCode"),
        defaultDistrictCode: watch("addressRequest.districtCode"),
        defaultWardCode: watch("addressRequest.wardCode"),
    });

    const previewImage =
        watch("previewFile") && watch("previewFile") instanceof File
            ? URL.createObjectURL(watch("previewFile") as File)
            : watch("imageUrl");

    useEffect(() => {
        return () => {
            if (previewImage) URL.revokeObjectURL(previewImage);
        };
    }, [previewImage]);

    console.log(watch("previewFile"));

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h2 className="text-lg font-medium leading-6 text-gray-900">
                    Hồ sơ
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Thông tin này sẽ được hiển thị công khai vì vậy hãy cẩn thận
                    những gì bạn chia sẻ.
                </p>
            </div>

            <div className="mt-6 flex gap-6 lg:flex-row flex-col-reverse">
                <div className="flex-grow space-y-6">
                    <Form.Input<UpdateProfileFormType>
                        fieldName="email"
                        label="Email"
                        register={register}
                        readOnly={true}
                        disabled={true}
                        errorMessage={errors.email?.message}
                    />
                    <Form.Input<UpdateProfileFormType>
                        fieldName="name"
                        label="Họ và tên"
                        register={register}
                        errorMessage={errors.name?.message}
                    />
                    <Form.Input<UpdateProfileFormType>
                        isTextArea={true}
                        fieldName="addressRequest.detail"
                        label="Địa chỉ"
                        register={register}
                        errorMessage={errors.addressRequest?.detail?.message}
                    />
                </div>

                <div className="flex-grow mt-0 lg:flex-shrink-0 lg:flex-grow-0">
                    <Form.Label label="Ảnh đại diện"/>

                    <div className="relative overflow-hidden rounded-full w-fit">
                        <Image
                            width={512}
                            height={512}
                            className="relative h-40 w-40 rounded-full object-cover"
                            src={previewImage || DefaultAvatar.src}
                            alt="Ảnh đại diện"
                        />
                        <Controller
                            name="previewFile"
                            control={control}
                            render={({field}) => (
                                <label
                                    htmlFor={inputId}
                                    className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                                >
                                    <span>
                                        {watch("imageUrl") ||
                                        watch("previewFile")
                                            ? "Thay đổi"
                                            : "Thêm"}
                                    </span>
                                    <span className="sr-only"> user photo</span>
                                    <input
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            if (!isImageFile(file)) {
                                                toast.error(
                                                    "Tệp tải lên phải có định dạng ảnh"
                                                );
                                                return;
                                            }
                                            if (!isValidFileSize(file, 1)) {
                                                toast.error(
                                                    "Kích thước ảnh đại diện không được vượt quá 1MB"
                                                );
                                                return;
                                            }

                                            field.onChange(file);
                                            if (previewImage) {
                                                URL.revokeObjectURL(
                                                    previewImage
                                                );
                                            }
                                        }}
                                        accept="image/*"
                                        type="file"
                                        id={inputId}
                                        className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                    />
                                </label>
                            )}
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <div>
                    <Form.Label label="Tỉnh / Thành phố"/>
                    <Controller
                        control={control}
                        name="addressRequest.provinceCode"
                        render={({field}) => (
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
                        {errors?.addressRequest?.provinceCode?.message}
                    </ErrorMessage>
                </div>
                <div>
                    <Form.Label label="Quận / Huyện"/>
                    <Controller
                        control={control}
                        name="addressRequest.districtCode"
                        render={({field}) => (
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
                    <Form.Label label="Phường / Xã"/>
                    <Controller
                        control={control}
                        name="addressRequest.wardCode"
                        render={({field}) => (
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
            </div>

            <div className="mt-6 grid sm:grid-cols-2 gap-6">
                <Form.Input<UpdateProfileFormType>
                    fieldName="code"
                    label="Mã số"
                    register={register}
                    readOnly={true}
                    disabled={true}
                />

                <Form.Input<UpdateProfileFormType>
                    fieldName="phone"
                    label="Số điện thoại"
                    register={register}
                    errorMessage={errors.phone?.message}
                />
            </div>
            <Form.Divider/>
            <div className="flex justify-end">
                <button
                    disabled={isSubmitting}
                    type="submit"
                    className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 
                    transition duration-150
                    disabled:opacity-50"
                >
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
            </div>

            {/*<pre>*/}
            {/*    <code>{JSON.stringify(watch(), null, 2)}</code>*/}
            {/*</pre>*/}
        </form>
    );
};

export default AdminProfileForm;
