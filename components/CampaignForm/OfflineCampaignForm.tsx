import React, {Fragment, useState} from 'react'
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, FormProvider, useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import useOfflineCampaignForm from "./hooks/useOfflineCampaignForm";
import useAddress from "../../hooks/useAddress";
import {MAX_FILE_SIZE_IN_MB, message} from "./hooks";
import Form, {defaultInputClass} from "../Form";
import {getAvatarFromName, isImageFile, isValidFileSize} from "../../utils/helper";
import {toast} from "react-hot-toast";
import ErrorMessage from "../Form/ErrorMessage";
import DateTimePickerModal from "../Modal/DateTimePickerModal";
import SelectBox from "../SelectBox";
import {IProvince} from "../../types/Address/IProvince";
import {IDistrict} from "../../types/Address/IDistrict";
import {IWard} from "../../types/Address/IWard";
import CreateButton from "../Admin/CreateButton";
import CampaignOrganizationCard from "../CampaignSchedule/CampaignOrganizationCard";
import SelectOrganizationsTable from "../SelectOrganizations/SelectOrganizationsTable";
import {format} from "date-fns";
import Link from "next/link";
import SelectOrganizationsModal from "../SelectOrganizations/SelectOrganizationsModal";
import {IOrganization} from "../../types/Organization/IOrganization";
import {Transition} from "@headlessui/react";
import SelectCommissionsModal from "../SelectCommissions/SelectCommissionsModal";
import TableHeading from "../Admin/Table/TableHeading";
import TableHeader from "../Admin/Table/TableHeader";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import Image from "next/image";
import TableWrapper from "../Admin/Table/TableWrapper";

type Props = {
    action: 'CREATE' | 'UPDATE'
}

const OfflineCampaignForm: React.FC<Props> = ({action}) => {


    const {
        ContinuousOfflineCampaignSchema,
        NonContinuousOfflineCampaignSchema,
    } = useOfflineCampaignForm({
        action
    });
    const {
        provinces, districts, wards,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        selectedProvince,
        selectedDistrict,
        selectedWard,
    } = useAddress();


    const FormSchema = z.discriminatedUnion('isContinuous', [
        NonContinuousOfflineCampaignSchema,
        ContinuousOfflineCampaignSchema,
    ])
        .refine((data) => data.startDate < data.endDate, {
            path: ["endDate"], // Set the path of this error on the startDate and endDate campaignOrganizationFields.
            message: message.NOT_AFTER,
        })


    // .refine((data) => {
    //         // startDate of each campaignOrganization must be in between startDate and endDate of the campaign
    //         // set the path of this error on the startDate and endDate fields of correct array item
    //         const campaignOrganizations = data.campaignOrganizations;
    //         for (let i = 0; i < campaignOrganizations.length; i++) {
    //             const campaignOrganization = campaignOrganizations[i];
    //             const schedules = campaignOrganization.schedules;
    //             for (let j = 0; j < schedules.length; j++) {
    //                 const schedule = schedules[j];
    //                 if (schedule.startDate < data.startDate || schedule.startDate > data.endDate) {
    //                     return false;
    //                 }
    //             }
    //         }
    //     }
    //     , {
    //         path: ["campaignOrganizations"],
    //     }
    // );
    type FormType = z.infer<typeof FormSchema>

    const formMethods =
        useForm<FormType>({
            resolver: zodResolver(FormSchema),
            shouldFocusError: false,
        });

    const {
        register,
        resetField,
        getValues,
        setError,
        setValue,
        control,
        handleSubmit,
        watch,
        formState: {errors, isSubmitting}
    } = formMethods;

    const {fields: campaignOrganizationFields, append: appendOrganization, remove: removeOrganization} = useFieldArray({
        control,
        name: "campaignOrganizations",
        shouldUnregister: true,
    });

    const campaignCommissionFields = useFieldArray({
        control,
        name: "campaignCommissions",
        shouldUnregister: true,
    });

    const {fields: commissionFields, append: appendCommission, remove: removeCommission} = campaignCommissionFields;

    const onSubmit = async (data: FormType) => {
        alert(JSON.stringify(data));
        console.log(data);
    }


    console.log(errors);

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [showSelectOrgModal, setShowSelectOrgModal] = useState(false);
    const [showCommissionModal, setShowCommissionModal] = useState(false);

    const selectedOrganizations: IOrganization[] = watch('campaignOrganizations')?.map(co => {
        return {
            id: co.organizationId,
            name: co.organizationName,
            imageUrl: co.organizationImageUrl,
            address: co.organizationAddress,
            phone: co.organizationPhone,
        }
    }) || [];


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
                            placeholder={"VD: Hội sách xuyên Việt - Lan tỏa tri thức"}
                            register={register}
                            fieldName={'name'}
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
                        <Form.Label label={"Ảnh bìa"} required={true}/>
                        <div>
                            <Controller
                                control={control}
                                name={'previewFile'}
                                render={({field}) => (
                                    <Form.ImageUploadPanel
                                        label={`PNG, JPG, GIF tối đa ${MAX_FILE_SIZE_IN_MB}MB`}
                                        onChange={(file) => {
                                            if (!isImageFile(file)) {
                                                toast.error(message.NOT_IMAGE_TYPE);
                                                return false;
                                            }
                                            if (!isValidFileSize(file, MAX_FILE_SIZE_IN_MB)) {
                                                toast.error(message.INVALID_IMAGE_SIZE);
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
                                <ErrorMessage>{errors.previewFile?.message as React.ReactNode}</ErrorMessage>
                            )}
                        </div>
                    </div>
                    <Form.Divider/>
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
                                    name='startDate'
                                    render={({field}) => {
                                        return <DateTimePickerModal
                                            value={field.value}
                                            title={"Chọn thời gian bắt đầu"}
                                            isOpen={showStartDatePicker}
                                            onDismiss={() => setShowStartDatePicker(false)}
                                            onClose={(date) => {
                                                if (date) {
                                                    field.onChange(date);
                                                }
                                                setShowStartDatePicker(false);
                                            }}
                                        />
                                    }}
                                />
                                <Form.DateTimeInputField
                                    id={"startDate"}
                                    value={watch('startDate')
                                        ? format(watch('startDate'),
                                            "dd/MM/yyyy hh:mm a"
                                        )
                                        : ""
                                    }
                                    onClick={() => setShowStartDatePicker(true)}
                                />
                                {errors.startDate && (
                                    <ErrorMessage>{errors.startDate.message}</ErrorMessage>
                                )}
                            </div>
                            <div>
                                <Form.Label
                                    label={"Thời gian kết thúc"}
                                    required={true}
                                />
                                <Controller
                                    control={control}
                                    name='endDate'
                                    render={({field}) => {
                                        console.log(field)
                                        return <DateTimePickerModal
                                            value={field.value}
                                            title={"Chọn thời gian kết thúc"}
                                            isOpen={showEndDatePicker}
                                            onDismiss={() => setShowEndDatePicker(false)}
                                            onClose={(date) => {
                                                if (date) {
                                                    field.onChange(date);
                                                    console.log(watch('endDate'))
                                                }
                                                setShowEndDatePicker(false);
                                            }}
                                        />
                                    }}
                                />
                                <Form.DateTimeInputField
                                    id={"endDate"}
                                    value={watch('endDate')
                                        ? format(watch('endDate'),
                                            "dd/MM/yyyy hh:mm a"
                                        )
                                        : ""
                                    }
                                    onClick={() => setShowEndDatePicker(true)}
                                />
                                {errors.endDate && (
                                    <ErrorMessage>{errors?.endDate.message}</ErrorMessage>
                                )}
                            </div>
                        </div>

                        <Form.Input<FormType>
                            rows={4}
                            isTextArea={true}
                            placeholder={"VD: 82 Lê Thánh Tôn"}
                            register={register}
                            required={true}
                            fieldName={"addressRequest.detail"}
                            label={"Địa điểm tổ chức"}

                            errorMessage={errors.addressRequest?.detail?.message}
                        />
                        <div className='grid gap-y-4 gap-x-4 sm:grid-cols-3'>
                            <div>
                                <Form.Label label={"Tỉnh / Thành phố"} required={true}/>
                                <Controller
                                    control={control}
                                    name='addressRequest.provinceCode'
                                    render={({field}) => {
                                        return <SelectBox<IProvince>
                                            placeholder={'Chọn tỉnh / thành phố'}
                                            value={selectedProvince}
                                            onValueChange={(p) => {
                                                if (p.code === watch('addressRequest.provinceCode')) return;
                                                field.onChange(p.code);
                                                resetField('addressRequest.districtCode');
                                                resetField('addressRequest.wardCode');
                                                handleProvinceChange(p);
                                            }}
                                            dataSource={provinces}
                                            displayKey={'nameWithType'}
                                        />
                                    }}
                                />
                                {errors.addressRequest?.provinceCode && (
                                    <ErrorMessage>{errors.addressRequest?.provinceCode.message}</ErrorMessage>
                                )}
                            </div>
                            <div>
                                <Form.Label label={"Quận / Huyện"} required={true}/>
                                <Controller
                                    control={control}
                                    name='addressRequest.districtCode'
                                    render={({field}) => {
                                        return <SelectBox<IDistrict>
                                            placeholder={'Chọn quận / huyện'}
                                            value={selectedDistrict}
                                            onValueChange={(d) => {
                                                if (d.code === watch('addressRequest.districtCode')) return;
                                                field.onChange(d.code);
                                                resetField('addressRequest.wardCode');
                                                handleDistrictChange(d);
                                            }}
                                            dataSource={districts}
                                            displayKey={'nameWithType'}
                                        />
                                    }}
                                />
                                {errors.addressRequest?.districtCode && (
                                    <ErrorMessage>{errors.addressRequest?.districtCode.message}</ErrorMessage>
                                )}
                            </div>
                            <div>
                                <Form.Label label={"Phường / Xã"} required={true}/>
                                <Controller
                                    control={control}
                                    name='addressRequest.wardCode'
                                    render={({field}) => {
                                        return <SelectBox<IWard>
                                            placeholder={'Chọn phường / xã'}
                                            value={selectedWard}
                                            onValueChange={(w) => {
                                                if (w.code === watch('addressRequest.wardCode')) return;
                                                field.onChange(w.code)
                                                handleWardChange(w)
                                            }}
                                            dataSource={wards}
                                            displayKey={'nameWithType'}
                                        />
                                    }}
                                />
                                {errors.addressRequest?.wardCode && (
                                    <ErrorMessage>{errors.addressRequest?.wardCode.message}</ErrorMessage>
                                )}
                            </div>
                        </div>
                    </div>


                    <Form.Divider/>
                    <Form.GroupLabel
                        label={"Các tổ chức và chuỗi hội sách"}
                        description={"Thông tin về các tổ chức và chuỗi hội sách"}
                    />
                    <div className='my-3 space-y-4'>
                        <label className="flex items-center w-fit">
                            <input type={'checkbox'}
                                   className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" {...register('isContinuous')}
                            />
                            <span className="ml-2">Tổ chức chuỗi hội sách</span>
                        </label>

                        <div>
                            <div className="mb-4 flex justify-end gap-4">
                                <SelectOrganizationsModal
                                    isOpen={showSelectOrgModal}
                                    onClose={
                                        () => setShowSelectOrgModal(false)
                                    }
                                    selectedOrganizations={selectedOrganizations}
                                    onItemSelect={(o) => {
                                        appendOrganization({
                                            organizationId: o.id,
                                            organizationName: o.name,
                                            organizationImageUrl: o.imageUrl,
                                            organizationAddress: o.address,
                                            schedules: []
                                        })
                                        setShowSelectOrgModal(false);
                                    }}/>
                                <CreateButton
                                    label={"Thêm tổ chức"}
                                    onClick={() => {
                                        setShowSelectOrgModal(true);
                                    }}
                                />
                            </div>
                            {!watch('isContinuous') && <SelectOrganizationsTable
                                selectedOrganizations={selectedOrganizations}
                                handleRemoveOrganization={(org) => {
                                    const index = campaignOrganizationFields.findIndex((o) => o.organizationId === org.id);
                                    if (index >= 0) {
                                        removeOrganization(index);
                                    }
                                }}
                            />}
                        </div>
                        {watch('isContinuous') && campaignOrganizationFields.length > 0 && campaignOrganizationFields.map((field, index) => {
                            return (
                                <Transition
                                    appear
                                    show={true}
                                    enter={'transform-gpu duration-700 ease-in-out'}
                                    enterFrom={'opacity-0 scale-50'}
                                    enterTo={'opacity-100 scale-100'}
                                    leave={'transition-gpu duration-700 ease-in-out'}
                                    leaveFrom={'opacity-100 scale-100'}
                                    leaveTo={'opacity-0 scale-0'}
                                    key={field.id}>
                                    <CampaignOrganizationCard
                                        onRemove={() => removeOrganization(index)}
                                        key={field.id}
                                        index={index}
                                        campaignOrganization={{
                                            organizationId: field.organizationId,
                                            organizationName: field?.organizationName,
                                            organizationImageUrl: field.organizationImageUrl,
                                            organizationAddress: field.organizationAddress,
                                            organizationPhone: field.organizationPhone,
                                            schedules: field.schedules || []
                                        }}
                                    />
                                </Transition>
                            )
                        })}
                    </div>

                    <Form.Divider/>
                    <Form.GroupLabel label='Thể loại và chiết khấu'
                                     description='Thể loại sách và chiết khấu mà hội sách này áp dụng'/>
                    <div className='mt-3'><Form.Label label={"Thể loại"} required={true}/>
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
                            selectedCommissions={watch('campaignCommissions')}
                            onItemSelect={(commission) => {
                                appendCommission(commission);
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
                                {commissionFields?.length > 0 ? commissionFields?.map((commission, index) => {
                                    return (
                                        <Fragment key={commission.id}>
                                            <tr>
                                                <TableData>
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <Image
                                                                width={100}
                                                                height={100}
                                                                className="h-10 w-10 rounded-full object-cover"
                                                                src={getAvatarFromName(commission?.genreName)}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {commission?.genreName}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableData>
                                                <TableData className='max-w-[100px]'>
                                                    <input
                                                        type={'number'}
                                                        {...register(`campaignCommissions.[${index}].minimalCommission` as `campaignCommissions.${number}.minimalCommission`)}
                                                        className={defaultInputClass}/>
                                                </TableData>
                                                <TableData className="text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => removeCommission(index)}
                                                        className="text-rose-600 hover:text-rose-800"
                                                    >
                                                        Xoá
                                                    </button>
                                                </TableData>
                                            </tr>
                                            {errors?.campaignCommissions?.[index]?.minimalCommission &&
                                                <tr>
                                                    <td colSpan={3}
                                                        className='text-rose-500 bg-rose-50 p-2 text-center py-2 px-3 text-sm font-medium transition duration-150 ease-in-out'>
                                                        {errors?.campaignCommissions?.[index]?.minimalCommission?.message}
                                                    </td>
                                                </tr>
                                            }
                                        </Fragment>
                                    )

                                }) : <tr>
                                    <TableData
                                        colSpan={3}
                                        textAlignment={"text-center"}
                                        className="text-sm font-medium uppercase leading-10 text-gray-500 "
                                    >
                                        Chưa có thể loại nào được chọn
                                    </TableData>
                                </tr>}
                            </TableBody>

                        </TableWrapper>
                        {errors.campaignCommissions?.message
                            && (
                                <ErrorMessage>{
                                    errors.campaignCommissions?.message
                                }</ErrorMessage>
                            )}
                    </div>
                    <Form.Divider/>
                    <div className='flex justify-end gap-4'>
                        <Link
                            href={'/admin/campaigns'}
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                            Huỷ
                        </Link>
                        <button type="submit"
                                disabled={isSubmitting}
                                className="m-btn text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                            {isSubmitting ?
                                (action === 'UPDATE' ? 'Đang cập nhật' : 'Đang tạo...') :
                                (action === 'UPDATE' ? 'Cập nhật' : 'Tạo hội sách')}
                        </button>
                    </div>
                    <pre>{JSON.stringify(watch(), null, 2)}</pre>
                </form>
            </FormProvider>
        </Fragment>
    )
}

export default OfflineCampaignForm