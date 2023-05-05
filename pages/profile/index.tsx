import React, { ReactElement, useRef, useState } from "react";
import { NextPageWithLayout } from "../_app";
import { useAuth } from "../../context/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "../../services/UserService";
import { AiOutlineCamera, AiOutlineInfo } from "react-icons/ai";
import { Tab } from "@headlessui/react";
import Form from "../../components/Form";
import { Controller, useForm } from "react-hook-form";
import useAddress from "../../hooks/useAddress";
import SelectBox from "../../components/SelectBox";
import { IProvince } from "../../types/Address/IProvince";
import { IDistrict } from "../../types/Address/IDistrict";
import { IWard } from "../../types/Address/IWard";
import TransitionModal from "../../components/Modal/TransitionModal";
import { LevelService } from "../../services/LevelService";
import { OrganizationService } from "../../services/OrganizationService";
import EmptyState, { EMPTY_STATE_TYPE } from "../../components/EmptyState";
import CustomerSettingsLayout from "../../components/Layout/CustomerSettingsLayout";
import CustomerLayout from "../../components/Layout/CustomerLayout";
import CoverImage from "../../assets/images/default-customer-cover.jpg";
import Image from "next/image";
import BioSection from "../../components/CustomerProfile/BioSection";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePickerModal from "../../components/Modal/DateTimePickerModal";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import ErrorMessage from "../../components/Form/ErrorMessage";
import FollowOrganizationModal from "../../components/Modal/FollowOrganizationModal";
import { getAvatarFromName, isImageFile, isValidFileSize, isValidImageSrc } from "../../utils/helper";
import { IOrganization } from "../../types/Organization/IOrganization";
import { GroupService } from "../../services/GroupService";
import FollowGroupModal from "../../components/Modal/FollowGroupModal";
import { BiUser } from "react-icons/bi";
import { Roles } from "../../constants/Roles";
import Chip from "../../components/Admin/Chip";
import DefaultAvatar from "../../assets/images/default-avatar.png";
import { ImageUploadService } from "../../services/ImageUploadService";

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
const CustomerProfilePage: NextPageWithLayout = () => {
    const { loginUser, user, logOut } = useAuth();

    const [showLevelModal, setShowLevelModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showOrgModal, setShowOrgModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);

    const userService = new UserService(loginUser?.accessToken);
    const queryClient = useQueryClient();

    const organizationService = new OrganizationService(loginUser?.accessToken);
    const groupService = new GroupService(loginUser?.accessToken);

    const unfollowOrganizationMutation = useMutation(
        (organizationId: number) =>
            organizationService.unfollowOrganization(organizationId),
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries([
                    "following_organizations",
                ]);
            },
        },
    );

    const unfollowGroupMutation = useMutation(
        (groupId: number) => groupService.unfollowGroup(groupId),
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(["following_groups"]);
            },
        },
    );

    const { data: otherOrganizations } = useQuery(
        ["other_organizations"],
        () =>
            organizationService.getOrganizations({
                size: 1000,
                status: true,
                withCustomers: true,
                withCampaigns: true,
            }),
        {
            select: (data) =>
                data?.data?.filter(
                    (org) =>
                        !(
                            followingOrganizations?.organizations?.map(
                                (o) => o?.organization?.id,
                            ) || []
                        ).includes(org?.id),
                ),
        },
    );

    const onUnfollowOrganization = async (organization: IOrganization) => {
        await toast.promise(
            unfollowOrganizationMutation.mutateAsync(organization?.id),
            {
                loading: `Đang bỏ theo dõi ${organization?.name}`,
                success: `Đã bỏ theo dõi ${organization?.name}`,
                error: (err) => err?.message || "Có lỗi xảy ra",
            },
        );
    };

    const onUnfollowGroup = async (group: IOrganization) => {
        await toast.promise(unfollowGroupMutation.mutateAsync(group?.id), {
            loading: `Đang bỏ theo dõi ${group?.name}`,
            success: `Đã bỏ theo dõi ${group?.name}`,
            error: (err) => err?.message || "Có lỗi xảy ra",
        });
    };

    const {
        data: followingOrganizations,
        isInitialLoading: isFollowingOrganizationsLoading,
    } = useQuery(["following_organizations", loginUser?.id], () =>
        organizationService.getFollowingOrganizationsByCustomer({
            withCustomers: true,
            withCampaigns: true,
        }),
    );

    const {
        data: followingGroups,
        isInitialLoading: isFollowingGroupsLoading,
    } = useQuery(["following_groups", loginUser?.id], () =>
        groupService.getFollowingGroupsByCustomer({
            withCustomers: true,
            withCampaigns: true,
        }),
    );

    const { data: profile, isInitialLoading: profileLoading } = useQuery(
        ["profile", loginUser?.id],
        () => userService.getProfileByCustomer(),
        {
            onSuccess: (profile) => {
                reset({
                    dob: profile?.dob ? new Date(profile?.dob) : undefined,
                    gender: profile?.gender,
                    user: {
                        id: profile?.user?.id,
                        name: profile?.user?.name,
                        phone: profile?.user?.phone,
                        imageUrl: profile?.user?.imageUrl,
                        email: profile?.user?.email,
                        addressRequest: {
                            detail: profile?.user?.addressViewModel?.detail,
                            provinceCode:
                            profile?.user?.addressViewModel?.provinceCode,
                            districtCode:
                            profile?.user?.addressViewModel?.districtCode,
                            wardCode: profile?.user?.addressViewModel?.wardCode,
                        },
                    },
                });
            },
        },
    );

    const levelService = new LevelService();

    const {
        data: allLevels,
        isLoading,
        isFetching,
    } = useQuery(
        ["levels"],
        () =>
            levelService.getAllLevels({
                withCustomers: false,
                status: true,
            }),
    );

    const otherLevels = allLevels?.filter((level) => level?.id !== profile?.level?.id)?.sort((a, b) => {
        if (a?.conditionalPoint && b?.conditionalPoint) {
            return a?.conditionalPoint - b?.conditionalPoint;
        }
        return 0;
    });

    const nextLevel = otherLevels?.find((level) => {
        if (level?.conditionalPoint !== undefined && profile?.point !== undefined) {
            return level?.conditionalPoint > profile?.point;
        }
    });

    const UpdateProfileSchema = z.object({
        dob: z.date().optional(),
        gender: z.boolean(),
        user: z.object({
            id: z.string(),
            name: z.string().min(1, "Tên không được để trống")
                .max(255, "Tên không được vượt quá 255 ký tự"),
            email: z.string().email("Email không hợp lệ"),
            phone: z
                .string()
                .min(10, "Số điện thoại phải có ít nhất 10 ký tự")
                .max(50, "Số điện thoại không được vượt quá 50 ký tự"),
            addressRequest: z.object({
                detail: z.string(),
                provinceCode: z.number(),
                districtCode: z.number(),
                wardCode: z.number(),
            }),
            imageUrl: z.string(),
        }),
    });

    type UpdateProfileSchemaType = Partial<z.infer<typeof UpdateProfileSchema>>;

    const {
        register,
        control,
        watch,
        setValue,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProfileSchemaType>({
        resolver: zodResolver(UpdateProfileSchema),
    });


    const {
        selectedProvince,
        selectedDistrict,
        selectedWard,
        provinces,
        districts,
        wards,
        provincesLoading,
        districtsLoading,
        wardsLoading,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
    } = useAddress({
        defaultProvinceCode: profile?.user?.addressViewModel?.provinceCode,
        defaultDistrictCode: profile?.user?.addressViewModel?.districtCode,
        defaultWardCode: profile?.user?.addressViewModel?.wardCode,
    });

    const updateProfileMutation = useMutation(
        (data: any) => userService.updateProfileByCustomer(data),
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["profile", loginUser?.id]);
            },
        },
    );

    const [previewImage, setPreviewImage] = useState<File | null>(null);
    const objectURL = previewImage && URL.createObjectURL(previewImage);
    const imgSrc = objectURL ? objectURL : (profile?.user?.imageUrl || DefaultAvatar.src);
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e?.target?.files?.[0];
        if (file) {
            if (!isValidFileSize(file, 1)) {
                toast.error("Ảnh không được quá 1MB");
                return;
            }
            if (!isImageFile(file)) {
                toast.error("Vui lòng chọn file ảnh");
                return;
            }
            setPreviewImage(file);
        }
    };

    const imageService = new ImageUploadService(loginUser?.accessToken);
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
    );

    const onSubmit = async (data: UpdateProfileSchemaType) => {
        if (previewImage) {
            try {
                await toast.promise(uploadImageMutation.mutateAsync(previewImage), {
                    loading: "Đang tải ảnh lên",
                    success: (res) => {
                        if (data?.user?.imageUrl)
                            data.user.imageUrl = res?.url;
                        return "Tải ảnh lên thành công";
                    },
                    error: "Tải ảnh lên thất bại",
                });
            } catch (error) {
                console.log(error);
                return;
            }
        }
        try {
            const payload = UpdateProfileSchema.parse(data);
            await toast.promise(
                updateProfileMutation.mutateAsync({
                    ...payload,
                    user: {
                        ...payload.user,
                        status: true,
                        role: Roles.CUSTOMER.id,
                    },
                }),
                {
                    loading: "Đang cập nhật thông tin",
                    success: "Cập nhật thông tin thành công",
                    error: (e) => e?.message || "Có lỗi xảy ra",
                },
            );
        } catch (e) {
            console.log(e);
        }
    };

    console.log(errors);
    return (
        <div className={`grow flex flex-col`}>
            {/* Profile background */}
            <div className="relative h-44 bg-slate-200">
                <Image
                    className="object-cover h-full w-full shadow-inner"
                    src={CoverImage.src}
                    width="979"
                    height="220"
                    alt=""
                />
                {/* Close button */}
                <button
                    className="md:hidden absolute top-4 left-4 sm:left-6 text-white opacity-80 hover:opacity-100"
                    onClick={() => {
                    }}
                    aria-controls="profile-sidebar"
                    aria-expanded={true}
                >
                    <span className="sr-only">Close sidebar</span>
                    <svg
                        className="w-6 h-6 fill-current"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="relative px-4 sm:px-6 pb-8">
                {/* Pre-header */}
                <div className="-mt-16 mb-6 sm:mb-3">
                    <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end">
                        {/* Avatar */}
                        <div className="inline-flex -ml-1 -mt-1 mb-4 sm:mb-0 relative group">
                            <input
                                id={`avatar-${loginUser?.id}`}
                                type="file"
                                className="hidden"
                                accept={"image/*"}
                                onChange={handleAvatarChange}
                            />
                            <Image
                                className="rounded-full w-32 h-32 border-4 border-white object-cover"
                                width="128"
                                height="128"
                                src={imgSrc}
                                alt="Avatar"
                            />

                            <label htmlFor={`avatar-${loginUser?.id}`}
                                   className="cursor-pointer absolute flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/30 inset-0 rounded-full border-4 border-white  transition duration-150 ease-in-out">
                                <AiOutlineCamera className="hidden group-hover:block text-white text-2xl" />
                                <span className="hidden group-hover:block text-xs text-white">
                                    Thay đổi
                                </span>
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 sm:mb-2">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="text-sm text-green-600 font-medium bg-green-100 rounded-sm px-3 py-1 border border-green-200">
                                    {profile?.level?.name}
                                </div>
                                <div
                                    className="text-sm text-amber-600 font-medium bg-amber-100 rounded-sm px-3 py-1 border border-amber-200">
                                    <span className={"font-normal"}>
                                        Điểm:{" "}
                                    </span>
                                    {profile?.point}
                                </div>
                                <button
                                    onClick={() => setShowLevelModal(true)}
                                    className="border bg-white rounded shadow-sm items-center justify-center"
                                >
                                    <AiOutlineInfo className="text-slate-600 text-lg m-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <header className="text-center sm:text-left mb-6">
                    {/* Name */}
                    <div className="inline-flex items-start mb-2">
                        <h1 className="text-2xl text-slate-800 font-bold">
                            {loginUser?.name}
                        </h1>
                        <svg
                            className="w-4 h-4 fill-current shrink-0 text-amber-500 ml-2"
                            viewBox="0 0 16 16"
                        >
                            <path
                                d="M13 6a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5A.75.75 0 0 1 13 6ZM6 16a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 1 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
                        </svg>
                    </div>
                    <BioSection profile={profile} isLoading={profileLoading} />
                </header>

                <Tab.Group>
                    {/* Tabs */}
                    <Tab.List as={"div"} className="relative mb-6">
                        <div
                            className="absolute bottom-0 w-full h-px bg-slate-200"
                            aria-hidden="true"
                        ></div>
                        <ul className="relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
                            <Tab
                                as={"div"}
                                className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8 focus:outline-none cursor-pointer"
                            >
                                <span
                                    className="block pb-3 ui-selected:text-indigo-500 text-slate-500 ui-selected:hover:text-slate-600 whitespace-nowrap ui-selected:border-b-2 ui-selected:border-indigo-500">
                                    Thông tin cá nhân
                                </span>
                            </Tab>

                            <Tab
                                as={"div"}
                                className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8 focus:outline-none cursor-pointer"
                            >
                                <span
                                    className="block pb-3 ui-selected:text-indigo-500 text-slate-500 ui-selected:hover:text-slate-600 whitespace-nowrap ui-selected:border-b-2 ui-selected:border-indigo-500">
                                    Tổ chức
                                </span>
                            </Tab>

                            <Tab
                                as={"div"}
                                className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8 focus:outline-none cursor-pointer"
                            >
                                <span
                                    className="block pb-3 ui-selected:text-indigo-500 text-slate-500 ui-selected:hover:text-slate-600 whitespace-nowrap ui-selected:border-b-2 ui-selected:border-indigo-500">
                                    Nhóm tham gia
                                </span>
                            </Tab>
                        </ul>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            <form
                                className="space-y-4"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Form.Input<UpdateProfileSchemaType>
                                        register={register}
                                        fieldName={"user.name"}
                                        label="Họ và tên"
                                        placeholder={"Nhập họ và tên"}
                                        errorMessage={
                                            errors?.user?.name?.message
                                        }
                                    />
                                    <Form.Input<UpdateProfileSchemaType>
                                        register={register}
                                        fieldName={"user.phone"}
                                        label="Số điện thoại"
                                        placeholder={"Nhập số điện thoại"}
                                        errorMessage={
                                            errors?.user?.phone?.message
                                        }
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <Form.Label label="Giới tính" />
                                        <Controller
                                            control={control}
                                            name="gender"
                                            render={({ field }) => (
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
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Form.Label label="Ngày sinh" />
                                        <Controller
                                            control={control}
                                            name="dob"
                                            render={({ field }) => {
                                                return (
                                                    <>
                                                        <DateTimePickerModal
                                                            showTime={false}
                                                            value={field.value}
                                                            title={"Ngày sinh"}
                                                            isOpen={
                                                                showDatePicker
                                                            }
                                                            onDismiss={() =>
                                                                setShowDatePicker(
                                                                    false,
                                                                )
                                                            }
                                                            onClose={(date) => {
                                                                if (date) {
                                                                    field.onChange(
                                                                        date,
                                                                    );
                                                                }
                                                                setShowDatePicker(
                                                                    false,
                                                                );
                                                            }}
                                                        />
                                                        <ErrorMessage>
                                                            {
                                                                errors?.dob
                                                                    ?.message
                                                            }
                                                        </ErrorMessage>

                                                        <Form.DateTimeInputField
                                                            value={
                                                                field.value
                                                                    ? format(
                                                                        field.value,
                                                                        "dd/MM/yyyy",
                                                                    )
                                                                    : ""
                                                            }
                                                            onClick={() =>
                                                                setShowDatePicker(
                                                                    true,
                                                                )
                                                            }
                                                        />
                                                    </>
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <Form.Input<UpdateProfileSchemaType>
                                    register={register}
                                    fieldName={"user.addressRequest.detail"}
                                    label="Địa chỉ"
                                    placeholder={"Nhập địa chỉ"}
                                    isTextArea={true}
                                />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <Form.Label label="Tỉnh / Thành phố" />
                                        <Controller
                                            control={control}
                                            name="user.addressRequest.provinceCode"
                                            render={({ field }) => (
                                                <SelectBox<IProvince>
                                                    value={selectedProvince}
                                                    placeholder={
                                                        provincesLoading
                                                            ? "Đang tải..."
                                                            : "Chọn tỉnh / thành phố"
                                                    }
                                                    onValueChange={(p) => {
                                                        if (
                                                            p.code ===
                                                            watch(
                                                                "user.addressRequest.provinceCode",
                                                            )
                                                        )
                                                            return;

                                                        field.onChange(p.code);
                                                        setValue(
                                                            "user.addressRequest.districtCode" as any,
                                                            undefined,
                                                        );
                                                        setValue(
                                                            "user.addressRequest.wardCode" as any,
                                                            undefined,
                                                        );
                                                        handleProvinceChange(p);
                                                    }}
                                                    displayKey="nameWithType"
                                                    dataSource={provinces}
                                                    disabled={provincesLoading}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Form.Label label="Quận / Huyện" />
                                        <Controller
                                            control={control}
                                            name="user.addressRequest.districtCode"
                                            render={({ field }) => (
                                                <SelectBox<IDistrict>
                                                    value={selectedDistrict}
                                                    placeholder={
                                                        districtsLoading
                                                            ? "Đang tải..."
                                                            : "Chọn quận / huyện"
                                                    }
                                                    onValueChange={(d) => {
                                                        if (
                                                            d.code ===
                                                            watch(
                                                                "user.addressRequest.districtCode",
                                                            )
                                                        )
                                                            return;
                                                        field.onChange(d.code);
                                                        setValue(
                                                            "user.addressRequest.wardCode" as any,
                                                            undefined,
                                                        );
                                                        handleDistrictChange(d);
                                                    }}
                                                    displayKey="nameWithType"
                                                    dataSource={districts}
                                                    disabled={districtsLoading}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Form.Label label="Phường / Xã" />
                                        <Controller
                                            control={control}
                                            name="user.addressRequest.wardCode"
                                            render={({ field }) => (
                                                <SelectBox<IWard>
                                                    value={selectedWard}
                                                    placeholder={
                                                        wardsLoading
                                                            ? "Đang tải..."
                                                            : "Chọn phường / xã"
                                                    }
                                                    onValueChange={(w) => {
                                                        if (
                                                            w.code ===
                                                            watch(
                                                                "user.addressRequest.wardCode",
                                                            )
                                                        )
                                                            return;
                                                        field.onChange(w.code);
                                                        handleWardChange(w);
                                                    }}
                                                    displayKey="nameWithType"
                                                    dataSource={wards}
                                                    disabled={wardsLoading}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
                    transition duration-150
                    disabled:opacity-50"
                                    >
                                        {isSubmitting
                                            ? "Đang lưu..."
                                            : "Lưu thay đổi"}
                                    </button>
                                </div>
                            </form>
                        </Tab.Panel>

                        <Tab.Panel>
                            <Tab.Group>
                                <Tab.List>
                                    <div className="py-3">
                                        <ul className="flex flex-wrap gap-2">
                                            <Tab
                                                as={"div"}
                                                className={"focus:outline-none"}
                                            >
                                                {({ selected }) => {
                                                    return (
                                                        <Chip active={selected}>
                                                            Tổ chức của bạn
                                                        </Chip>
                                                    );
                                                }}
                                            </Tab>
                                            <Tab
                                                as={"div"}
                                                className={"focus:outline-none"}
                                            >
                                                {({ selected }) => {
                                                    return (
                                                        <Chip active={selected}>
                                                            Các tổ chức khác
                                                        </Chip>
                                                    );
                                                }}
                                            </Tab>
                                        </ul>
                                    </div>
                                </Tab.List>
                                <Tab.Panels>
                                    <Tab.Panel>
                                        {isFollowingOrganizationsLoading && (
                                            <div>Loading...</div>
                                        )}
                                        {!isFollowingOrganizationsLoading &&
                                            followingOrganizations?.organizations &&
                                            followingOrganizations.organizations
                                                .length > 0 && (
                                                <div
                                                    className={
                                                        "grid grid-cols-1 gap-6 sm:grid-cols-3 mt-4"
                                                    }
                                                >
                                                    {followingOrganizations.organizations.map(
                                                        (o) => (
                                                            <div
                                                                key={
                                                                    o
                                                                        ?.organization
                                                                        ?.id
                                                                }
                                                                className={
                                                                    "flex flex-col items-center justify-center rounded border p-4"
                                                                }
                                                            >
                                                                <Image
                                                                    src={
                                                                        o
                                                                            ?.organization
                                                                            ?.imageUrl ||
                                                                        getAvatarFromName(
                                                                            o
                                                                                ?.organization
                                                                                ?.name,
                                                                        )
                                                                    }
                                                                    alt={""}
                                                                    width={100}
                                                                    height={100}
                                                                    className={
                                                                        "rounded-full w-20 h-20 object-cover"
                                                                    }
                                                                />
                                                                <span
                                                                    className={
                                                                        "mt-4 text-center font-medium"
                                                                    }
                                                                >
                                                                    {
                                                                        o
                                                                            ?.organization
                                                                            ?.name
                                                                    }
                                                                </span>
                                                                <div
                                                                    className={
                                                                        "flex items-center text-gray-500 gap-2 justify-center mt-4"
                                                                    }
                                                                >
                                                                    <BiUser />
                                                                    <span
                                                                        className={
                                                                            "text-gray-500 text-sm text-center"
                                                                        }
                                                                    >
                                                                        {
                                                                            o?.total
                                                                        }{" "}
                                                                        người
                                                                        thuộc tổ
                                                                        chức
                                                                    </span>
                                                                </div>

                                                                {/*Unfollow button*/}
                                                                {/*<button*/}
                                                                {/*    onClick={async () => {*/}
                                                                {/*        if (o?.organization) {*/}
                                                                {/*            await onUnfollowOrganization(o?.organization);*/}
                                                                {/*        }*/}
                                                                {/*    }}*/}
                                                                {/*    className="m-btn bg-red-50 text-red-500 mt-4">*/}
                                                                {/*    Bỏ theo dõi*/}
                                                                {/*</button>*/}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        {!isFollowingOrganizationsLoading &&
                                            followingOrganizations === null && (
                                                <div
                                                    className="flex flex-col items-center justify-center w-full h-full">
                                                    <EmptyState
                                                        status={
                                                            EMPTY_STATE_TYPE.NO_DATA
                                                        }
                                                        customMessage={
                                                            "Bạn chưa theo dõi tổ chức nào"
                                                        }
                                                    />
                                                </div>
                                            )}
                                    </Tab.Panel>
                                    <Tab.Panel>
                                        <div
                                            className={
                                                "grid grid-cols-1 gap-6 sm:grid-cols-3 mt-4"
                                            }
                                        >
                                            {otherOrganizations?.map((o) => (
                                                <div
                                                    key={o?.id}
                                                    className={
                                                        "flex flex-col items-center justify-center rounded border p-4"
                                                    }
                                                >
                                                    <Image
                                                        src={
                                                            o?.imageUrl ||
                                                            getAvatarFromName(
                                                                o?.name,
                                                            )
                                                        }
                                                        alt={""}
                                                        width={100}
                                                        height={100}
                                                        className={
                                                            "rounded-full w-20 h-20 object-cover"
                                                        }
                                                    />
                                                    <span
                                                        className={
                                                            "mt-4 text-center font-medium"
                                                        }
                                                    >
                                                        {o?.name}
                                                    </span>
                                                    <div
                                                        className={
                                                            "flex items-center text-gray-500 gap-2 justify-center mt-4"
                                                        }
                                                    >
                                                        <BiUser />
                                                        <span
                                                            className={
                                                                "text-gray-500 text-sm text-center"
                                                            }
                                                        >
                                                            {o?.customers
                                                                    ?.length ||
                                                                0}{" "}
                                                            người thuộc tổ chức
                                                        </span>
                                                    </div>

                                                    {/*Unfollow button*/}
                                                    {/*<button*/}
                                                    {/*    onClick={async () => {*/}
                                                    {/*        if (o?.organization) {*/}
                                                    {/*            await onUnfollowOrganization(o?.organization);*/}
                                                    {/*        }*/}
                                                    {/*    }}*/}
                                                    {/*    className="m-btn bg-red-50 text-red-500 mt-4">*/}
                                                    {/*    Bỏ theo dõi*/}
                                                    {/*</button>*/}
                                                </div>
                                            ))}
                                        </div>
                                    </Tab.Panel>
                                </Tab.Panels>
                            </Tab.Group>

                            {/*<div className={"flex justify-end"}>*/}
                            {/*    <button*/}
                            {/*        onClick={() => setShowOrgModal(true)}*/}
                            {/*        className="m-btn bg-indigo-500 text-white">*/}

                            {/*        Chọn tổ chức*/}
                            {/*    </button>*/}
                            {/*</div>*/}
                        </Tab.Panel>
                        <Tab.Panel>
                            <div className={"flex justify-end"}>
                                <button
                                    onClick={() => setShowGroupModal(true)}
                                    className="m-btn bg-indigo-500 text-white"
                                >
                                    Thêm mới
                                </button>
                            </div>
                            {isFollowingGroupsLoading && <div>Loading...</div>}
                            {!isFollowingGroupsLoading &&
                                followingGroups?.groups &&
                                followingGroups.groups.length > 0 && (
                                    <div
                                        className={
                                            "grid grid-cols-1 gap-6 sm:grid-cols-3"
                                        }
                                    >
                                        {followingGroups.groups.map((group) => (
                                            <div
                                                key={group?.group?.id}
                                                className={
                                                    "flex flex-col items-center justify-center rounded border p-4"
                                                }
                                            >
                                                <Image
                                                    src={getAvatarFromName(
                                                        group?.group?.name,
                                                    )}
                                                    alt={""}
                                                    width={100}
                                                    height={100}
                                                    className={
                                                        "rounded-full w-20 h-20 object-cover"
                                                    }
                                                />
                                                <span
                                                    className={
                                                        "mt-4 text-center font-medium"
                                                    }
                                                >
                                                    {group?.group?.name}
                                                </span>

                                                <div
                                                    className={
                                                        "flex items-center text-gray-500 gap-2 justify-center mt-4"
                                                    }
                                                >
                                                    <BiUser />
                                                    <span
                                                        className={
                                                            "text-gray-500 text-sm text-center"
                                                        }
                                                    >
                                                        {group?.total} người
                                                        tham gia nhóm
                                                    </span>
                                                </div>

                                                {/*Unfollow button*/}
                                                <button
                                                    onClick={async () => {
                                                        if (group) {
                                                            await onUnfollowGroup(
                                                                group?.group,
                                                            );
                                                        }
                                                    }}
                                                    className="m-btn bg-red-50 text-red-500 mt-4"
                                                >
                                                    Bỏ theo dõi
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                            {!isFollowingGroupsLoading &&
                                followingGroups === null && (
                                    <div className="flex flex-col items-center justify-center w-full h-full">
                                        <EmptyState
                                            status={EMPTY_STATE_TYPE.NO_DATA}
                                            customMessage={
                                                "Bạn chưa theo dõi nhóm nào"
                                            }
                                        />
                                    </div>
                                )}
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>

                <TransitionModal
                    isOpen={showLevelModal}
                    onClose={() => setShowLevelModal(false)}
                >
                    <div className="">
                        <div className={"flex flex-col items-center p-4"}>
                            <Image
                                src={getAvatarFromName(profile?.level?.name, 1)}
                                alt={""}
                                width={200}
                                height={200}
                                className={"rounded-full w-32 h-32 object-cover"}
                            />
                            <h3 className={"text-center text-2xl font-medium mt-4"}>
                                {profile?.level?.name}
                            </h3>
                            <div className={"text-center text-xl text-gray-500 mt-2"}>
                                Điểm: <span className={"font-medium"}>{profile?.point}</span>
                            </div>
                        </div>
                        <div className={"space-y-3 p-4"}>
                            {otherLevels?.map((level) => {
                                const isEarnedLevel = level?.conditionalPoint !== undefined && profile?.point !== undefined && profile?.point > level?.conditionalPoint;
                                const isNextLevel = level?.id === nextLevel?.id;
                                return (
                                    <div key={level?.id}
                                         className={"relative border p-4 rounded shadow-sm"}
                                    >
                                        <div className={"flex items-center gap-3"}>
                                            <Image src={getAvatarFromName(level?.name, 1)}
                                                   width={200}
                                                   height={200}
                                                   className={`rounded-full w-12 h-12 object-cover`}
                                                   alt={""} />
                                            <div>
                                                <h2 className={"text-lg font-medium"}>{level?.name}</h2>
                                                <div className={"text-sm text-gray-500"}>
                                                    Điểm: <span
                                                    className={"font-medium"}>{level?.conditionalPoint}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {isEarnedLevel && (
                                            <div
                                                className={"absolute top-0 right-0 bg-green-500 text-white px-2 py-1 rounded"}>
                                                Đã đạt
                                            </div>
                                        )}

                                        {isNextLevel && (
                                            <div
                                                className={"absolute top-0 right-0 bg-indigo-500 text-white px-2 py-1 rounded"}>
                                                Cần thêm {level?.conditionalPoint - profile?.point} điểm
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </TransitionModal>

                <FollowOrganizationModal
                    isOpen={showOrgModal}
                    onClose={() => setShowOrgModal(false)}
                    followedOrganizationIds={
                        followingOrganizations?.organizations?.map(
                            (o) => o?.organization?.id,
                        ) || []
                    }
                />
            </div>

            <FollowGroupModal
                isOpen={showGroupModal}
                onClose={() => setShowGroupModal(false)}
                followedGroupIds={
                    followingGroups?.groups?.map((g) => g?.group?.id) || []
                }
            />

            {/*<pre>{JSON.stringify(watch(), null, 2)}</pre>*/}
        </div>
    );
};

CustomerProfilePage.getLayout = function getLayout(page: ReactElement) {
    return (
        <CustomerLayout>
            <CustomerSettingsLayout>{page}</CustomerSettingsLayout>
        </CustomerLayout>
    );
};

export default CustomerProfilePage;
