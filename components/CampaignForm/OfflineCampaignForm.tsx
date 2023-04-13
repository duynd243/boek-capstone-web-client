import { Transition } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment, useContext, useEffect, useState } from "react";
import { Controller, FormProvider, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";
import useAddress from "../../hooks/useAddress";
import { CampaignService } from "../../services/CampaignService";
import { ImageUploadService } from "../../services/ImageUploadService";
import { IDistrict } from "../../types/Address/IDistrict";
import { IProvince } from "../../types/Address/IProvince";
import { IWard } from "../../types/Address/IWard";
import { getAvatarFromName, isImageFile, isValidFileSize } from "../../utils/helper";
import CreateButton from "../Admin/CreateButton";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import TableHeader from "../Admin/Table/TableHeader";
import TableHeading from "../Admin/Table/TableHeading";
import TableWrapper from "../Admin/Table/TableWrapper";
import CampaignOrganizationCard from "../CampaignSchedule/CampaignOrganizationCard";
import Form, { defaultInputClass } from "../Form";
import ErrorMessage from "../Form/ErrorMessage";
import DateTimePickerModal from "../Modal/DateTimePickerModal";
import SelectBox from "../SelectBox";
import SelectCommissionsModal from "../SelectCommissions/SelectCommissionsModal";
import SelectOrganizationsModal from "../SelectOrganizations/SelectOrganizationsModal";
import SelectOrganizationsTable from "../SelectOrganizations/SelectOrganizationsTable";
import {
    MAX_FILE_SIZE_IN_MB,
    message,
    NonRecurringOfflineCampaignSchema,
    RecurringOfflineCampaignSchema,
} from "./shared";

type Props = {
    action: "CREATE" | "UPDATE";
};

export const OfflineCampaignFormSchema = z.discriminatedUnion("isRecurring", [
    RecurringOfflineCampaignSchema,
    NonRecurringOfflineCampaignSchema,
]);

export type OfflineCampaignFormType = Partial<
    z.infer<typeof OfflineCampaignFormSchema>
>;

const OfflineCampaignForm: React.FC<Props> = ({ action }) => {
    const { loginUser } = useAuth();

    const campaign = useContext(CampaignContext);

    const imageService = new ImageUploadService(loginUser?.accessToken);
    const campaignService = new CampaignService(loginUser?.accessToken);
    const router = useRouter();

    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
    );

    const createOfflineCampaignMutation = useMutation(
        (data: any) => campaignService.createOfflineCampaign(data),
        {
            onSuccess: async (data) => {
                await router.push({
                    pathname: "/admin/campaigns/[id]",
                    query: { id: data.id },
                });
            },
        },
    );

    const updateOfflineCampaignMutation = useMutation(
        (data: any) => campaignService.updateOfflineCampaign(data),
        {
            onSuccess: async (data) => {
                await router.push({
                    pathname: "/admin/campaigns/[id]",
                    query: { id: data.id },
                });
            },
        },
    );

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showSelectOrgModal, setShowSelectOrgModal] = useState(false);
    const [showCommissionModal, setShowCommissionModal] = useState(false);

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
        defaultProvinceCode: campaign?.addressViewModel?.provinceCode,
        defaultDistrictCode: campaign?.addressViewModel?.districtCode,
        defaultWardCode: campaign?.addressViewModel?.wardCode,
    });

    const PreviewFileSchema = z.object({
        previewFile:
            action === "UPDATE"
                ? z.any().optional()
                : z
                    .any()
                    .refine(
                        (file) => file instanceof File && isImageFile(file),
                        {
                            message: "Ảnh bìa không được để trống",
                        },
                    ),
    });

    const FinalSchema = OfflineCampaignFormSchema.and(PreviewFileSchema);

    const formMethods = useForm<OfflineCampaignFormType>({
        resolver: zodResolver(
            FinalSchema.refine(
                (data) => {
                    return data.startDate < data.endDate;
                },
                {
                    message: "Thời gian kết thúc phải sau thời gian bắt đầu",
                    path: ["endDate"],
                },
            ),
            //     .refine(
            //     (data) => {
            //         // at least two schedules
            //         if (data.isRecurring) {
            //             return (
            //                 data.campaignOrganizations.flatMap(
            //                     (cO) => cO.schedules
            //                 ).length >= 2
            //             );
            //         }
            //     },
            //     {
            //         message:
            //             "Tổng số lịch trình từ các tổ chức đã chọn phải có ít nhất từ 2 lịch trình",
            //         path: ["campaignOrganizations"],
            //     }
            // )
        ),
        shouldFocusError: false,
    });

    const {
        register,
        reset,
        getValues,
        resetField,
        setError,
        setValue,
        control,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = formMethods;

    useEffect(() => {
        if (action === "UPDATE") {
            reset({
                name: campaign?.name || "",
                description: campaign?.description || "",
                startDate: campaign?.startDate
                    ? new Date(campaign.startDate)
                    : undefined,
                endDate: campaign?.endDate
                    ? new Date(campaign.endDate)
                    : undefined,
                imageUrl: campaign?.imageUrl || "",
                addressRequest: {
                    detail: campaign?.addressViewModel?.detail || "",
                    provinceCode: campaign?.addressViewModel?.provinceCode,
                    districtCode: campaign?.addressViewModel?.districtCode,
                    wardCode: campaign?.addressViewModel?.wardCode,
                },
                campaignCommissions:
                    campaign?.campaignCommissions?.map((cc) => {
                        return {
                            genreId: cc?.genreId || 0,
                            genreName: cc?.genre?.name || "",
                            minimalCommission: cc?.minimalCommission || 0,
                        };
                    }) || [],
                campaignOrganizations:
                    campaign?.campaignOrganizations?.map((co) => {
                        return {
                            organizationId: co?.organizationId,
                            organizationName: co?.organization?.name,
                            organizationAddress: co?.organization?.address,
                            organizationImageUrl: co?.organization?.imageUrl || "",
                            schedules: co?.schedules?.map((s) => {
                                return {
                                    addressRequest: {
                                        detail: s?.addressViewModel?.detail || "",
                                        provinceCode: s?.addressViewModel?.provinceCode,
                                        districtCode: s?.addressViewModel?.districtCode,
                                        wardCode: s?.addressViewModel?.wardCode,
                                    },
                                    startDate: s?.startDate ? new Date(s?.startDate) : undefined,
                                    endDate: s?.endDate ? new Date(s?.endDate) : undefined,
                                };
                            }),
                        };
                    }) || [],
            });
        }
    }, [action, campaign, reset]);

    const {
        fields: campaignOrganizationFields,
        append: appendOrganization,
        remove: removeOrganization,
    } = useFieldArray({
        control,
        name: "campaignOrganizations",
        shouldUnregister: true,
    });

    const campaignCommissionFields = useFieldArray({
        control,
        name: "campaignCommissions",
        shouldUnregister: true,
    });

    const {
        fields: commissionFields,
        append: appendCommission,
        remove: removeCommission,
    } = campaignCommissionFields;

    const selectedOrganizations =
        watch("campaignOrganizations")?.map((org) => {
            return {
                id: org.organizationId,
                name: org.organizationName,
                address: org.organizationAddress,
                imageUrl: org.organizationImageUrl,
                schedules: org.schedules,
            };
        }) || [];

    const selectedCommissions = watch("campaignCommissions") || [];

    const onSubmit = async (data: OfflineCampaignFormType) => {
        console.log("here");
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
        if (action === "CREATE") {
            try {
                const payload = FinalSchema.parse(data);
                await toast.promise(
                    createOfflineCampaignMutation.mutateAsync(payload),
                    {
                        loading: "Đang tạo hội sách",
                        success: (res) => {
                            return "Tạo hội sách thành công";
                        },
                        error: (error) => {
                            return error?.message || "Tạo hội sách thất bại";
                        },
                    },
                );
            } catch (error) {
                return;
            }
        }

        if (action === "UPDATE") {
            try {
                const payload = FinalSchema.parse(data);
                await toast.promise(
                    updateOfflineCampaignMutation.mutateAsync({
                        id: campaign?.id,
                        ...payload,
                    }),
                    {
                        loading: "Đang cập nhật hội sách",
                        success: (res) => {
                            return "Cập nhật hội sách thành công";
                        },
                        error: (error) => {
                            return error?.message || "Cập nhật hội sách thất bại";
                        },
                    },
                );
            } catch (error) {
                return;
            }
        }
    };

    console.log("errors", errors);

    // const selectedOrganizations: IOrganization[] =
    //     watch("campaignOrganizations")?.map((co) => {
    //         return {
    //             id: co.organizationId,
    //             name: co.organizationName,
    //             imageUrl: co.organizationImageUrl,
    //             address: co.organizationAddress,
    //             phone: co.organizationPhone,
    //         };
    //     }) || [];

    return (
        <Fragment>
            <FormProvider {...formMethods}>
                <form className="p-6 sm:p-10" onSubmit={handleSubmit(onSubmit)}>
                    <Form.GroupLabel
                        label={"Thông tin chung"}
                        description={"Thông tin cơ bản về hội sách"}
                    />
                    <div className="mt-3 space-y-4">
                        <Form.Input<OfflineCampaignFormType>
                            placeholder={
                                "VD: Hội sách xuyên Việt - Lan tỏa tri thức"
                            }
                            register={register}
                            fieldName={"name"}
                            label="Tên hội sách"
                            required={true}
                            errorMessage={errors.name?.message}
                        />
                        <Form.Input<OfflineCampaignFormType>
                            rows={4}
                            isTextArea={true}
                            placeholder={"Mô tả ngắn về hội sách"}
                            register={register}
                            required={true}
                            fieldName={"description"}
                            label={"Mô tả"}
                            errorMessage={errors.description?.message}
                        />
                        <Form.Label label={"Ảnh bìa"} required={true} />
                        <div>
                            <Controller
                                rules={{
                                    required: true,
                                }}
                                control={control}
                                name={"previewFile"}
                                render={({ field, fieldState }) => (
                                    <Form.ImageUploadPanel
                                        defaultImageURL={watch("imageUrl")}
                                        label={`PNG, JPG, GIF tối đa ${MAX_FILE_SIZE_IN_MB}MB`}
                                        onChange={(file) => {
                                            if (!isImageFile(file)) {
                                                toast.error(
                                                    message.NOT_IMAGE_TYPE,
                                                );
                                                return false;
                                            }
                                            if (
                                                !isValidFileSize(
                                                    file,
                                                    MAX_FILE_SIZE_IN_MB,
                                                )
                                            ) {
                                                toast.error(
                                                    message.INVALID_IMAGE_SIZE,
                                                );
                                                return false;
                                            }
                                            field.onChange(file);
                                            return true;
                                        }}
                                        onRemove={() => {
                                            field.onChange(undefined);
                                        }}
                                    />
                                )}
                            />

                            {errors.previewFile && (
                                <ErrorMessage>
                                    {
                                        errors.previewFile
                                            ?.message as React.ReactNode
                                    }
                                </ErrorMessage>
                            )}
                        </div>
                    </div>
                    <Form.Divider />
                    <Form.GroupLabel
                        label={"Thời gian và địa điểm"}
                        description={"Thời gian và địa điểm tổ chức hội sách"}
                    />
                    <div className="mt-3 space-y-4">
                        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
                            <div>
                                <Form.Label
                                    label={"Thời gian bắt đầu"}
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name="startDate"
                                    render={({ field }) => {
                                        return (
                                            <>
                                                <DateTimePickerModal
                                                    value={field.value}
                                                    title={
                                                        "Chọn thời gian bắt đầu"
                                                    }
                                                    isOpen={showStartDatePicker}
                                                    onDismiss={() =>
                                                        setShowStartDatePicker(
                                                            false,
                                                        )
                                                    }
                                                    onClose={(date) => {
                                                        if (date) {
                                                            field.onChange(
                                                                date,
                                                            );
                                                        }
                                                        setShowStartDatePicker(
                                                            false,
                                                        );
                                                    }}
                                                />

                                                <Form.DateTimeInputField
                                                    id={"startDate"}
                                                    value={
                                                        field.value
                                                            ? format(
                                                                field.value,
                                                                "dd/MM/yyyy hh:mm a",
                                                            )
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setShowStartDatePicker(
                                                            true,
                                                        )
                                                    }
                                                />
                                            </>
                                        );
                                    }}
                                />

                                {errors.startDate && (
                                    <ErrorMessage>
                                        {errors.startDate.message}
                                    </ErrorMessage>
                                )}
                            </div>
                            <div>
                                <Form.Label
                                    label={"Thời gian kết thúc"}
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name="endDate"
                                    render={({ field }) => {
                                        console.log(field);
                                        return (
                                            <>
                                                <DateTimePickerModal
                                                    value={field.value}
                                                    title={
                                                        "Chọn thời gian kết thúc"
                                                    }
                                                    isOpen={showEndDatePicker}
                                                    onDismiss={() =>
                                                        setShowEndDatePicker(
                                                            false,
                                                        )
                                                    }
                                                    onClose={(date) => {
                                                        if (date) {
                                                            field.onChange(
                                                                date,
                                                            );
                                                            console.log(
                                                                watch("endDate"),
                                                            );
                                                        }
                                                        setShowEndDatePicker(
                                                            false,
                                                        );
                                                    }}
                                                />
                                                <Form.DateTimeInputField
                                                    id={"endDate"}
                                                    value={
                                                        field.value
                                                            ? format(
                                                                field.value,
                                                                "dd/MM/yyyy hh:mm a",
                                                            )
                                                            : ""
                                                    }
                                                    onClick={() =>
                                                        setShowEndDatePicker(
                                                            true,
                                                        )
                                                    }
                                                />
                                            </>
                                        );
                                    }}
                                />

                                {errors.endDate && (
                                    <ErrorMessage>
                                        {errors?.endDate.message}
                                    </ErrorMessage>
                                )}
                            </div>
                        </div>

                        <Form.Input<OfflineCampaignFormType>
                            rows={4}
                            isTextArea={true}
                            placeholder={"VD: 82 Lê Thánh Tôn"}
                            register={register}
                            required={true}
                            fieldName={"addressRequest.detail"}
                            label={"Địa điểm tổ chức"}
                            errorMessage={
                                errors.addressRequest?.detail?.message
                            }
                        />
                        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-3">
                            <div>
                                <Form.Label
                                    label={"Tỉnh / Thành phố"}
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name="addressRequest.provinceCode"
                                    render={({ field }) => {
                                        return (
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
                                        );
                                    }}
                                />
                                {errors.addressRequest?.provinceCode && (
                                    <ErrorMessage>
                                        {
                                            errors.addressRequest?.provinceCode
                                                .message
                                        }
                                    </ErrorMessage>
                                )}
                            </div>
                            <div>
                                <Form.Label
                                    label={"Quận / Huyện"}
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name="addressRequest.districtCode"
                                    render={({ field }) => {
                                        return (
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
                                        );
                                    }}
                                />
                                {errors.addressRequest?.districtCode && (
                                    <ErrorMessage>
                                        {
                                            errors.addressRequest?.districtCode
                                                .message
                                        }
                                    </ErrorMessage>
                                )}
                            </div>
                            <div>
                                <Form.Label
                                    label={"Phường / Xã"}
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name="addressRequest.wardCode"
                                    render={({ field }) => {
                                        return (
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
                                        );
                                    }}
                                />
                                {errors.addressRequest?.wardCode && (
                                    <ErrorMessage>
                                        {
                                            errors.addressRequest?.wardCode
                                                .message
                                        }
                                    </ErrorMessage>
                                )}
                            </div>
                        </div>
                    </div>

                    <Form.Divider />
                    <Form.GroupLabel
                        label={"Các tổ chức và chuỗi hội sách"}
                        description={
                            "Thông tin về các tổ chức và chuỗi hội sách"
                        }
                    />
                    <div className="my-3 space-y-4">
                        <label className="flex items-center w-fit">
                            <input
                                type={"checkbox"}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                {...register("isRecurring")}
                            />
                            <span className="ml-2">Tổ chức chuỗi hội sách</span>
                        </label>

                        <div>
                            <div className="mb-4 flex justify-end gap-4">
                                <SelectOrganizationsModal
                                    isOpen={showSelectOrgModal}
                                    onClose={() => setShowSelectOrgModal(false)}
                                    selectedOrganizations={
                                        watch("campaignOrganizations")?.map(
                                            (o) => {
                                                return {
                                                    id: o.organizationId,
                                                };
                                            },
                                        ) || []
                                    }
                                    onItemSelect={(o) => {
                                        const index = watch(
                                            "campaignOrganizations",
                                        )?.findIndex(
                                            (c) => c.organizationId === o.id,
                                        );
                                        if (index !== -1) return;
                                        appendOrganization({
                                            organizationId: o.id,
                                            organizationName: o?.name,
                                            organizationAddress: o?.address,
                                            organizationImageUrl: o?.imageUrl,
                                            schedules: [],
                                        });
                                        setShowSelectOrgModal(false);
                                    }}
                                />
                                <CreateButton
                                    label={"Thêm tổ chức"}
                                    onClick={() => {
                                        setShowSelectOrgModal(true);
                                    }}
                                />
                            </div>
                            {!watch("isRecurring") && (
                                <>
                                    <SelectOrganizationsTable
                                        selectedOrganizations={
                                            selectedOrganizations
                                        }
                                        handleRemoveOrganization={(org) => {
                                            const index = watch(
                                                "campaignOrganizations",
                                            )?.findIndex(
                                                (c) =>
                                                    c.organizationId === org.id,
                                            );
                                            if (index === -1) return;
                                            removeOrganization(index);
                                        }}
                                    />
                                </>
                            )}
                        </div>
                        {watch("isRecurring") &&
                            selectedOrganizations.length > 0 &&
                            selectedOrganizations.map((org, index) => {
                                return (
                                    <Transition
                                        appear
                                        show={true}
                                        enter={
                                            "transform-gpu duration-700 ease-in-out"
                                        }
                                        enterFrom={"opacity-0 scale-50"}
                                        enterTo={"opacity-100 scale-100"}
                                        leave={
                                            "transition-gpu duration-700 ease-in-out"
                                        }
                                        leaveFrom={"opacity-100 scale-100"}
                                        leaveTo={"opacity-0 scale-0"}
                                        key={org?.id}
                                    >
                                        <CampaignOrganizationCard
                                            key={org?.id}
                                            onRemove={() => {
                                                const index = watch(
                                                    "campaignOrganizations",
                                                )?.findIndex(
                                                    (c) =>
                                                        c.organizationId ===
                                                        org.id,
                                                );
                                                if (index === -1) return;
                                                removeOrganization(index);
                                            }}
                                            index={index}
                                            campaignOrganization={{
                                                organizationId: org.id,
                                                organizationName: org?.name,
                                                organizationAddress:
                                                org?.address,
                                                organizationImageUrl:
                                                org?.imageUrl,
                                                schedules: org?.schedules || [],
                                            }}
                                        />
                                    </Transition>
                                );
                            })}

                        <ErrorMessage>
                            {errors?.campaignOrganizations?.message}
                        </ErrorMessage>
                    </div>

                    <Form.Divider />
                    <Form.GroupLabel
                        required={true}
                        label="Thể loại và chiết khấu"
                        description="Thể loại sách và chiết khấu mà hội sách này áp dụng"
                    />
                    <div className="mt-3">
                        <div className="mb-4 flex justify-end gap-4">
                            <CreateButton
                                label={"Thêm"}
                                onClick={() => {
                                    setShowCommissionModal(true);
                                }}
                            />
                        </div>
                        <SelectCommissionsModal
                            isOpen={showCommissionModal}
                            onClose={() => setShowCommissionModal(false)}
                            selectedGenres={
                                watch("campaignCommissions")?.map((c) => {
                                    return {
                                        id: c.genreId,
                                    };
                                }) || []
                            }
                            onItemSelect={(genre) => {
                                appendCommission({
                                    genreId: genre.id,
                                    genreName: genre?.name,
                                    minimalCommission: 0,
                                });
                                setShowCommissionModal(false);
                            }}
                        />
                        <TableWrapper>
                            <TableHeading>
                                <TableHeader>Thể loại</TableHeader>
                                <TableHeader>Chiết khấu (%)</TableHeader>
                                <TableHeader>
                                    <span className="sr-only">Actions</span>
                                </TableHeader>
                            </TableHeading>

                            <TableBody>
                                {selectedCommissions && selectedCommissions?.length > 0 ? (
                                    selectedCommissions?.map(
                                        (commission, index) => {
                                            return (
                                                <Fragment key={commission.genreId}>
                                                    <tr>
                                                        <TableData>
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    <Image
                                                                        width={
                                                                            100
                                                                        }
                                                                        height={
                                                                            100
                                                                        }
                                                                        className="h-10 w-10 rounded-full object-cover"
                                                                        src={getAvatarFromName(
                                                                            commission?.genreName,
                                                                        )}
                                                                        alt=""
                                                                    />
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {
                                                                            commission?.genreName
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </TableData>
                                                        <TableData className="max-w-[100px]">
                                                            <input
                                                                type={"number"}
                                                                {...register(
                                                                    `campaignCommissions.[${index}].minimalCommission` as `campaignCommissions.${number}.minimalCommission`,
                                                                )}
                                                                className={
                                                                    defaultInputClass
                                                                }
                                                            />
                                                        </TableData>
                                                        <TableData className="text-right text-sm font-medium">
                                                            <button
                                                                onClick={() =>
                                                                    removeCommission(
                                                                        index,
                                                                    )
                                                                }
                                                                className="text-rose-600 hover:text-rose-800"
                                                            >
                                                                Xoá
                                                            </button>
                                                        </TableData>
                                                    </tr>
                                                    {errors
                                                        ?.campaignCommissions?.[
                                                        index
                                                        ]?.minimalCommission && (
                                                        <tr>
                                                            <td
                                                                colSpan={3}
                                                                className="text-rose-500 bg-rose-50 p-2 text-center py-2 px-3 text-sm font-medium transition duration-150 ease-in-out"
                                                            >
                                                                {
                                                                    errors
                                                                        ?.campaignCommissions?.[
                                                                        index
                                                                        ]
                                                                        ?.minimalCommission
                                                                        ?.message
                                                                }
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Fragment>
                                            );
                                        },
                                    )
                                ) : (
                                    <tr>
                                        <TableData
                                            colSpan={3}
                                            textAlignment={"text-center"}
                                            className="text-sm font-medium uppercase leading-10 text-gray-500 "
                                        >
                                            Chưa có thể loại nào được chọn
                                        </TableData>
                                    </tr>
                                )}
                            </TableBody>
                        </TableWrapper>
                        {errors.campaignCommissions?.message && (
                            <ErrorMessage>
                                {errors.campaignCommissions?.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <Form.Divider />
                    <div className="flex justify-end gap-4">
                        <Link
                            href={"/admin/campaigns"}
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Huỷ
                        </Link>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="m-btn text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isSubmitting
                                ? action === "UPDATE"
                                    ? "Đang cập nhật"
                                    : "Đang tạo..."
                                : action === "UPDATE"
                                    ? "Cập nhật"
                                    : "Tạo hội sách"}
                        </button>
                    </div>
                    {/*<pre>{JSON.stringify(watch(), null, 2)}</pre>*/}
                </form>
            </FormProvider>
        </Fragment>
    );
};

export default OfflineCampaignForm;
