import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { CampaignService } from "../../services/CampaignService";
import { ImageUploadService } from "../../services/ImageUploadService";
import { IGroup } from "../../types/Group/IGroup";
import { ILevel } from "../../types/Level/ILevel";
import { getAvatarFromName, isImageFile, isValidFileSize } from "../../utils/helper";
import CreateButton from "../Admin/CreateButton";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import TableHeader from "../Admin/Table/TableHeader";
import TableHeading from "../Admin/Table/TableHeading";
import TableWrapper from "../Admin/Table/TableWrapper";
import Form, { defaultInputClass } from "../Form";
import ErrorMessage from "../Form/ErrorMessage";
import DateTimePickerModal from "../Modal/DateTimePickerModal";
import SelectCommissionsModal from "../SelectCommissions/SelectCommissionsModal";
import SelectGroupsModal from "../SelectGroups/SelectGroupsModal";
import SelectGroupsTable from "../SelectGroups/SelectGroupsTable";
import SelectLevelsModal from "../SelectLevels/SelectLevelsModal";
import SelectLevelsTable from "../SelectLevels/SelectLevelsTable";
import { MAX_FILE_SIZE_IN_MB, message, OnlineCampaignSchema } from "./shared";

type Props = {
    action: "CREATE" | "UPDATE";
};

const OnlineCampaignForm: React.FC<Props> = ({ action }) => {
    const { loginUser } = useAuth();
    const imageService = new ImageUploadService(loginUser?.accessToken);
    const campaignService = new CampaignService(loginUser?.accessToken);
    const router = useRouter();
    const queryClient = useQueryClient();
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
    );

    const createOnlineCampaignMutation = useMutation(
        (data: any) => campaignService.createOnlineCampaign(data),
        {
            onSuccess: (data) => {
                router.push({
                    pathname: "/admin/campaigns/[id]",
                    query: { id: data.id },
                });
            },
        },
    );

    const updateOnlineCampaignMutation = useMutation(
        (data: any) => campaignService.updateOnlineCampaign(data),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(["admin_campaign", [data.id]]);
                router.push({
                    pathname: "/admin/campaigns/[id]",
                    query: { id: data.id },
                });
            },
        },
    );
    const campaign = useContext(CampaignContext);
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

    const FormSchema = OnlineCampaignSchema.and(PreviewFileSchema).refine(
        (data) => {
            return data.startDate < data.endDate;
        },
        {
            message: "Thời gian kết thúc phải sau thời gian bắt đầu",
            path: ["endDate"],
        },
    );
    type FormType = Partial<z.infer<typeof FormSchema>>;

    // const defaultValues: FormType;

    const formMethods = useForm<FormType>({
        resolver: zodResolver(FormSchema),
        shouldFocusError: false,
    });

    const {
        register,
        resetField,
        reset,
        getValues,
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
                campaignGroups:
                    campaign?.campaignGroups?.map((cg) => {
                        return {
                            groupId: cg?.groupId || 0,
                            groupName: cg?.group?.name || "",
                            groupDescription: cg?.group?.description || "",
                        };
                    }) || [],

                campaignCommissions:
                    campaign?.campaignCommissions?.map((cc) => {
                        return {
                            genreId: cc?.genreId || 0,
                            genreName: cc?.genre?.name || "",
                            minimalCommission: cc?.minimalCommission || 0,
                        };
                    }) || [],

                campaignLevels:
                    campaign?.campaignLevels?.map((cl) => {
                        return {
                            levelId: cl?.levelId || 0,
                            levelName: cl?.level?.name || "",
                            levelRequiredPoint:
                                cl?.level?.conditionalPoint || 0,
                        };
                    }) || [],
            });
        }
    }, [action, campaign, reset]);


    const {
        fields: campaignGroupFields,
        append: appendGroup,
        remove: removeGroup,
    } = useFieldArray({
        control,
        name: "campaignGroups",
        shouldUnregister: true,
    });

    const {
        fields: campaignLevelFields,
        append: appendLevel,
        remove: removeLevel,
    } = useFieldArray({
        control,
        name: "campaignLevels",
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
        if (action === "CREATE") {
            try {
                const payload = FormSchema.parse(data);
                await toast.promise(
                    createOnlineCampaignMutation.mutateAsync({
                        ...payload,
                        groups: data?.campaignGroups?.map((cG) => cG.groupId),
                        levels: data?.campaignLevels?.map((cL) => cL.levelId),
                    }),
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
                const payload = FormSchema.parse(data);
                await toast.promise(
                    updateOnlineCampaignMutation.mutateAsync({
                        id: campaign?.id,
                        ...payload,
                        groups: data?.campaignGroups?.map((cG) => cG.groupId),
                        levels: data?.campaignLevels?.map((cL) => cL.levelId),
                    }),
                    {
                        loading: "Đang cập nhật hội sách",
                        success: (res) => {
                            return "Cập nhật hội sách thành công";
                        },
                        error: (error) => {
                            return (
                                error?.message || "Cập nhật hội sách thất bại"
                            );
                        },
                    },
                );
            } catch (error) {
                return;
            }
        }
    };

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showSelectGroupModal, setShowSelectGroupModal] = useState(false);
    const [showSelectLevelModal, setShowSelectLevelModal] = useState(false);
    const [showCommissionModal, setShowCommissionModal] = useState(false);

    const selectedGroups: IGroup[] =
        watch("campaignGroups")?.map((group) => {
            return {
                id: group.groupId,
                name: group.groupName,
                description: group.groupDescription,
                status: true,
            };
        }) || [];

    const selectedLevels: ILevel[] =
        watch("campaignLevels")?.map((level) => {
            return {
                id: level.levelId,
                conditionalPoint: level.levelRequiredPoint,
                name: level.levelName,
            };
        }) || [];

    const selectedCommissions = watch("campaignCommissions") || [];

    return (
        <Fragment>
            <FormProvider {...formMethods}>
                <form className="p-6 sm:p-10" onSubmit={handleSubmit(onSubmit)}>
                    <Form.GroupLabel
                        label={"Thông tin chung"}
                        description={"Thông tin cơ bản về hội sách"}
                    />
                    <div className="mt-3 space-y-4">
                        <Form.Input<FormType>
                            placeholder={
                                "VD: Hội sách xuyên Việt - Lan tỏa tri thức"
                            }
                            register={register}
                            fieldName={"name"}
                            label="Tên hội sách"
                            required={true}
                            errorMessage={errors.name?.message}
                        />
                        <Form.Input<FormType>
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
                                control={control}
                                name={"previewFile"}
                                render={({ field }) => (
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
                        label={"Thời gian"}
                        description={"Thời gian tổ chức hội sách"}
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
                    </div>

                    <Form.Divider />
                    <Form.GroupLabel
                        label={"Nhóm đề tài"}
                        description={"Các nhóm đề tài của hội sách này"}
                        required={true}
                    />
                    <div className="my-3 space-y-4">
                        <div>
                            <div className="mb-4 flex justify-end gap-4">
                                <SelectGroupsModal
                                    isOpen={showSelectGroupModal}
                                    onClose={() =>
                                        setShowSelectGroupModal(false)
                                    }
                                    selectedGroups={selectedGroups}
                                    onItemSelect={(g) => {
                                        appendGroup({
                                            groupId: g.id,
                                            groupName: g.name,
                                            groupDescription: g.description,
                                        });
                                        setShowSelectGroupModal(false);
                                    }}
                                />
                                <CreateButton
                                    label={"Thêm nhóm"}
                                    onClick={() => {
                                        setShowSelectGroupModal(true);
                                    }}
                                />
                            </div>
                            <SelectGroupsTable
                                selectedGroups={selectedGroups}
                                handleRemoveGroup={(group) => {
                                    const index = (
                                        watch("campaignGroups") || []
                                    ).findIndex((g) => g.groupId === group.id);
                                    if (index >= 0) {
                                        removeGroup(index);
                                    }
                                }}
                            />
                            <ErrorMessage>
                                {errors.campaignGroups?.message}
                            </ErrorMessage>
                        </div>
                    </div>

                    <Form.Divider />
                    <Form.GroupLabel
                        label={"Cấp độ khách hàng yêu cầu"}
                        description={"Giới hạn cấp độ khách hàng tham gia"}
                    />
                    <div className="my-3 space-y-4">
                        <div>
                            <div className="mb-4 flex justify-end gap-4">
                                <SelectLevelsModal
                                    isOpen={showSelectLevelModal}
                                    onClose={() =>
                                        setShowSelectLevelModal(false)
                                    }
                                    selectedLevels={selectedLevels}
                                    onItemSelect={(level) => {
                                        appendLevel({
                                            levelId: level.id,
                                            levelRequiredPoint:
                                                level.conditionalPoint || 0,
                                            levelName: level.name || "",
                                        });
                                        setShowSelectLevelModal(false);
                                    }}
                                />
                                <CreateButton
                                    label={"Thêm cấp độ"}
                                    onClick={() => {
                                        setShowSelectLevelModal(true);
                                    }}
                                />
                            </div>
                            <SelectLevelsTable
                                selectedLevels={selectedLevels}
                                handleRemoveLevel={(level) => {
                                    const index = (
                                        watch("campaignLevels") || []
                                    ).findIndex((l) => l.levelId === level.id);
                                    if (index >= 0) {
                                        removeLevel(index);
                                    }
                                }}
                            />
                        </div>
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
                                {selectedCommissions?.length > 0 ? (
                                    selectedCommissions?.map(
                                        (commission, index) => {
                                            return (
                                                <Fragment
                                                    key={commission.genreId}
                                                >
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

export default OnlineCampaignForm;
