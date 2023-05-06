import React, { Fragment, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import LoginSignUpLayout from "../../components/Layout/LoginSignUpLayout";
import { NextPageWithLayout } from "../_app";
import Form from "../../components/Form";
import { Controller, useForm } from "react-hook-form";
import SelectBox from "../../components/SelectBox";
import { IProvince } from "../../types/Address/IProvince";
import ErrorMessage from "../../components/Form/ErrorMessage";
import { IDistrict } from "../../types/Address/IDistrict";
import { IWard } from "../../types/Address/IWard";
import useAddress from "../../hooks/useAddress";
import { z } from "zod";
import Image from "next/image";
import { BsSearch } from "react-icons/bs";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IoPeople } from "react-icons/io5";
import { AiFillShop } from "react-icons/ai";
import { GroupService } from "../../services/GroupService";
import { getAvatarFromName, getFormattedTime } from "../../utils/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePickerModal from "../../components/Modal/DateTimePickerModal";
import { UserService } from "../../services/UserService";
import { toast } from "react-hot-toast";

const FormSteps = {
    PERSONAL_INFO: {
        id: 1,
        title: "Thông tin cá nhân 📝",
    },
    ADDRESS: {
        id: 2,
        title: "Thông tin địa chỉ 🏠",
    },
    GROUP: {
        id: 3,
        title: "Chọn nhóm đề tài 📚",
    },
};

const StepNumber = ({
                        stepNumber,
                        isActive,
                    }: {
    stepNumber: number;
    isActive: boolean;
}) => {
    return (
        <li>
            <button
                className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                    isActive
                        ? "bg-indigo-500 text-white"
                        : "bg-slate-100 text-slate-500"
                }`}
            >
                {stepNumber}
            </button>
        </li>
    );
};

const genderOptions = {
    MALE: {
        label: "Nam",
        value: true,
    },
    FEMALE: {
        label: "Nữ",
        value: false,
    },
} satisfies Record<string, { label: string; value: boolean }>;

const CompleteProfilePage: NextPageWithLayout = () => {
    const { user, cancelCreateUser } = useAuth();
    const groupService = new GroupService();
    const userService = new UserService();

    const createUserMutation = useMutation((data: any) => userService.createUser(data), {
        onSuccess: async () => {
            await cancelCreateUser();
        },
    });

    const { data: groupData } = useQuery(["groups"], () =>
        groupService.getGroups({
            name: "",
            size: 1000,
            withCustomers: true,
            withCampaigns: true,
        }),
    );

    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
    const [stepIndex, setStepIndex] = useState<number>(0);
    const currentStep = useMemo(
        () => Object.values(FormSteps)[stepIndex],
        [stepIndex],
    );

    const [groupIds, setGroupIds] = useState<number[]>([]);

    const {
        provinces,
        districts,
        wards,
        provincesLoading,
        districtsLoading,
        wardsLoading,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        selectedProvince,
        selectedDistrict,
        selectedWard,
    } = useAddress({});

    const FormSchema = z.object({
        //idToken: z.string(),
        name: z.string().min(1).max(100),
        gender: z.boolean(),
        address: z.object({
            detail: z.string().min(1).max(100),
            provinceCode: z.number({ required_error: "Vui lòng chọn Tỉnh/Thành phố" }),
            districtCode: z.number({ required_error: "Vui lòng chọn Quận/Huyện" }),
            wardCode: z.number({ required_error: "Vui lòng chọn Phường/Xã" }),
        }),
        dob: z.string(),
        phone: z.string(),
        groupIds: z.array(z.number()),
    });

    type FormType = Partial<z.infer<typeof FormSchema>>;

    const {
        register,
        control,
        watch,
        setValue,
        handleSubmit,
        formState: { errors, isValid, isSubmitting },
    } = useForm<FormType>({
        defaultValues: {
            name: user?.displayName || "",
            phone: user?.phoneNumber || "",
            gender: true,
        },
        resolver: zodResolver(FormSchema),
    });

    useEffect(() => {
        setValue("groupIds", groupIds);
    }, [setValue, groupIds]);


    const onSubmit = async (data: FormType) => {
        const idToken = await user?.getIdToken();
        if (!idToken) return;
        await toast.promise(createUserMutation.mutateAsync({
            ...data,
            idToken,
        }), {
            loading: "Đang tạo tài khoản...",
            success: "Tạo tài khoản thành công!",
            error: (err) => err?.message || "Tạo tài khoản thất bại!",
        });
    };

    return (
        <Fragment>
            <div className="mb-8 mt-14">
                <h1 className="text-2xl text-slate-800 font-bold mb-6">
                    {currentStep.title}
                </h1>
                <div className="max-w-md mx-auto w-full">
                    <div className="relative">
                        <div
                            className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200"
                            aria-hidden="true"
                        ></div>
                        <ul className="relative flex justify-between w-full">
                            {Object.values(FormSteps).map((s, i) => (
                                <StepNumber
                                    key={i}
                                    stepNumber={i + 1}
                                    isActive={i === stepIndex}
                                />
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                {currentStep.id === FormSteps.PERSONAL_INFO.id && (
                    <div className="space-y-4">
                        <Form.Input<FormType>
                            required={true}
                            register={register}
                            fieldName={"name"}
                            placeholder={"Nhập họ và tên"}
                            label={"Họ và tên"}
                            errorMessage={errors.name?.message}
                        />
                        <Form.Input<FormType>
                            required={true}
                            register={register}
                            fieldName={"phone"}
                            placeholder={"Nhập số điện thoại"}
                            label={"Số điện thoại"}
                            errorMessage={errors.phone?.message}
                        />
                        <div>
                            <Form.Label label="Sinh nhật" required={true} />
                            <Form.DateTimeInputField
                                placeholder="dd/mm/yyyy"
                                value={getFormattedTime(
                                    watch("dob"),
                                    "dd-MM-yyyy",
                                )}
                                onClick={() => setShowDatePicker(true)}
                            />
                        </div>

                        <div>
                            <Form.Label label={"Giới tính"} required={true} />
                            <Controller
                                control={control}
                                name="gender"
                                render={({ field }) => {
                                    return (
                                        <SelectBox<{
                                            label: string;
                                            value: boolean;
                                        }>
                                            value={
                                                watch("gender")
                                                    ? genderOptions.MALE
                                                    : genderOptions.FEMALE
                                            }
                                            placeholder="Giới tính"
                                            onValueChange={(g) => {
                                                field.onChange(g.value);
                                            }}
                                            displayKey="label"
                                            dataSource={Object.values(
                                                genderOptions,
                                            )}
                                            searchable={false}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </div>
                )}

                {currentStep.id === FormSteps.ADDRESS.id && (
                    <div className="space-y-4">
                        <Form.Input<FormType>
                            required={true}
                            register={register}
                            fieldName={"address.detail"}
                            placeholder={"Nhập địa chỉ"}
                            label={"Địa chỉ"}
                        />
                        {/*Tỉnh*/}
                        <div>
                            <Form.Label
                                label={"Tỉnh / Thành phố"}
                                required={true}
                            />
                            <Controller
                                control={control}
                                name="address.provinceCode"
                                render={({ field }) => {
                                    return (
                                        <SelectBox<IProvince>
                                            value={selectedProvince}
                                            disabled={provincesLoading}
                                            placeholder={
                                                provincesLoading
                                                    ? "Đang tải..."
                                                    : "Chọn tỉnh / thành phố"
                                            }
                                            onValueChange={(p) => {
                                                if (
                                                    p.code ===
                                                    watch(
                                                        "address.provinceCode",
                                                    )
                                                )
                                                    return;

                                                field.onChange(p.code);
                                                setValue(
                                                    "address.districtCode" as any,
                                                    undefined,
                                                );
                                                setValue(
                                                    "address.wardCode" as any,
                                                    undefined,
                                                );
                                                handleProvinceChange(p);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={provinces}
                                        />
                                    );
                                }}
                            />
                            {errors.address?.provinceCode && (
                                <ErrorMessage>
                                    {errors.address?.provinceCode.message}
                                </ErrorMessage>
                            )}
                        </div>
                        {/*Quận huyện*/}
                        <div>
                            <Form.Label
                                label={"Quận / Huyện"}
                                required={true}
                            />
                            <Controller
                                control={control}

                                name="address.districtCode"
                                render={({ field }) => {
                                    return (
                                        <SelectBox<IDistrict>
                                            value={selectedDistrict}
                                            disabled={districtsLoading}
                                            placeholder={
                                                districtsLoading
                                                    ? "Đang tải..."
                                                    : "Chọn quận / huyện"
                                            }
                                            onValueChange={(d) => {
                                                if (
                                                    d.code ===
                                                    watch(
                                                        "address.districtCode",
                                                    )
                                                )
                                                    return;
                                                field.onChange(d.code);
                                                setValue(
                                                    "address.wardCode" as any,
                                                    undefined,
                                                );
                                                handleDistrictChange(d);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={districts}
                                        />
                                    );
                                }}
                            />
                            {errors.address?.districtCode && (
                                <ErrorMessage>
                                    {errors.address?.districtCode.message}
                                </ErrorMessage>
                            )}
                        </div>
                        {/*Phường xã*/}
                        <div>
                            <Form.Label label={"Phường / Xã"} required={true} />
                            <Controller
                                control={control}
                                name="address.wardCode"
                                render={({ field }) => {
                                    return (
                                        <SelectBox<IWard>
                                            disabled={wardsLoading}
                                            value={selectedWard}
                                            placeholder={
                                                wardsLoading
                                                    ? "Đang tải..."
                                                    : "Chọn phường / xã"
                                            }
                                            onValueChange={(w) => {
                                                if (
                                                    w.code ===
                                                    watch("address.wardCode")
                                                )
                                                    return;
                                                field.onChange(w.code);
                                                handleWardChange(w);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={wards}
                                        />
                                    );
                                }}
                            />
                            {errors.address?.wardCode && (
                                <ErrorMessage>
                                    {errors.address?.wardCode.message}
                                </ErrorMessage>
                            )}
                        </div>
                    </div>
                )}

                {currentStep.id === FormSteps.GROUP.id && (
                    <div className="relative rounded overflow-hidden bg-white shadow">
                        <div className="overflow-hidden">
                            <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                className="h-12 w-full bg-gray-100 border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                            />
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {groupData?.data?.map((group, i) => {
                                const isSelected = groupIds.includes(group?.id);
                                return <div
                                    key={group?.id}
                                    className="flex bg-white border-b py-4 px-6"
                                >
                                    <Image
                                        src={getAvatarFromName(group?.name, 1)}
                                        alt=""
                                        className="rounded-full w-10 h-10 object-cover"
                                        width={200}
                                        height={200}
                                    />
                                    <div className="ml-4 space-y-1.5 flex-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            {group?.name}
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <AiFillShop />
                                                <span className="ml-1">
                                                    {group?.campaigns?.length}{" "}
                                                    hội sách
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <IoPeople />
                                                <span className="ml-1">
                                                    {group?.customers?.length}{" "}
                                                    người chọn nhóm
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <input
                                        checked={isSelected}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setGroupIds((current) =>
                                                    current.concat(group?.id),
                                                );
                                            } else {
                                                setGroupIds((current) =>
                                                    current.filter(
                                                        (id) => id !== group?.id,
                                                    ));
                                            }
                                        }}
                                        type="checkbox"
                                        className="self-center rounded-full w-4 h-4 border border-slate-200 bg-gray-100"
                                    />
                                </div>;
                            })}
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between mt-8">
                    <button
                        type="button"
                        disabled={stepIndex === 0}
                        onClick={() => {
                            if (stepIndex > 0) {
                                setStepIndex((current) => current - 1);
                            }
                        }}
                        className="text-sm text-slate-600"
                    >
                        &lt;- Quay lại
                    </button>
                    {currentStep.id !== FormSteps.GROUP.id ? (
                        <button
                            type={"button"}
                            onClick={() => {
                                setStepIndex(stepIndex + 1);
                            }}
                            className="m-btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto disabled:opacity-50"
                        >
                            {"Tiếp theo ->"}
                        </button>
                    ) : null}


                    {currentStep.id === FormSteps.GROUP.id ? <button
                            disabled={isSubmitting}
                            type={"submit"}
                            className="m-btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto disabled:opacity-50"
                        >
                            {"Đăng ký"}
                        </button>
                        : null}
                </div>
            </form>

            <div className="mt-6 border-t-[1px] border-slate-200 pt-5">
                <button
                    type="button"
                    className={
                        "text-sm font-medium text-slate-500 hover:text-slate-600"
                    }
                    onClick={cancelCreateUser}
                >
                    Huỷ bỏ đăng ký và quay lại
                </button>
            </div>
            {/*<pre>{JSON.stringify(watch(), null, 2)}</pre>*/}

            <DateTimePickerModal

                title="Chọn ngày sinh"
                showTime={false}
                defaultMonth={new Date(2001, 0, 1)}
                isOpen={showDatePicker}
                onDismiss={() => setShowDatePicker(false)}
                onClose={(date) => {
                    setValue("dob", date?.toISOString());
                    setShowDatePicker(false);
                }}
            />
        </Fragment>
    );
};

CompleteProfilePage.getLayout = (page) => (
    <LoginSignUpLayout childrenWrapperClass="mx-auto my-auto w-full max-w-lg px-4 py-8">
        {page}
    </LoginSignUpLayout>
);

export default CompleteProfilePage;
