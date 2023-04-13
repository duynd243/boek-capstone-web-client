import React, { useState } from "react";
import Form from "../Form";
import { RiDeleteBin7Fill } from "react-icons/ri";
import { z } from "zod";
import { Controller, useFormContext } from "react-hook-form";
import useAddress from "../../hooks/useAddress";
import SelectBox from "../SelectBox";
import { IProvince } from "../../types/Address/IProvince";
import { IDistrict } from "../../types/Address/IDistrict";
import { IWard } from "../../types/Address/IWard";
import ErrorMessage from "../Form/ErrorMessage";
import DateTimePickerModal from "../Modal/DateTimePickerModal";
import { format } from "date-fns";
import { RecurringOfflineCampaignSchema, ScheduleSchema } from "../CampaignForm/shared";

type Schedule = z.infer<typeof ScheduleSchema>

type Props = {
    parentIndex: number;
    index: number;
    registerKey: string;
    onRemove?: () => void;
}

const ScheduleCard: React.FC<Props> = ({
                                           parentIndex,
                                           index,
                                           registerKey
                                           , onRemove,
                                       }) => {

    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    type FormType = z.infer<typeof RecurringOfflineCampaignSchema>;
    const {
        watch,
        control,
        getValues,
        register,
        resetField,
        setError,
        formState: { errors },
    } = useFormContext<FormType>();

    const fieldNames = {
        addressRequest: {
            detail: `${registerKey}.addressRequest.detail` as `campaignOrganizations.${number}.schedules.${number}.addressRequest.detail`,
            provinceCode: `${registerKey}.addressRequest.provinceCode` as `campaignOrganizations.${number}.schedules.${number}.addressRequest.provinceCode`,
            districtCode: `${registerKey}.addressRequest.districtCode` as `campaignOrganizations.${number}.schedules.${number}.addressRequest.districtCode`,
            wardCode: `${registerKey}.addressRequest.wardCode` as `campaignOrganizations.${number}.schedules.${number}.addressRequest.wardCode`,
        },
        startDate: `${registerKey}.startDate` as `campaignOrganizations.${number}.schedules.${number}.startDate`,
        endDate: `${registerKey}.endDate` as `campaignOrganizations.${number}.schedules.${number}.endDate`,
    };

    const {
        provinces,
        districts,
        wards,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
    } = useAddress({
        defaultProvinceCode: getValues(fieldNames.addressRequest.provinceCode),
        defaultDistrictCode: getValues(fieldNames.addressRequest.districtCode),
        defaultWardCode: getValues(fieldNames.addressRequest.wardCode),
    });

    const errorsInSchedule = errors?.campaignOrganizations?.[parentIndex]?.schedules?.[index];

    console.log(errorsInSchedule?.startDate?.message);


    return (
        <div
            className="first:mt-8 relative space-y-4 border bg-white py-6 px-8 rounded-md"
        >
            <div className="absolute top-4 right-4">
                <button type={"button"}
                        onClick={() => {
                            onRemove?.();
                        }}
                        className={"text-gray-400 hover:text-gray-500"}>
                    <RiDeleteBin7Fill size={17} />
                </button>
            </div>

            <div
                className="text-lg font-semibold text-sky-600"
            >
                Lịch trình {index + 1}
            </div>
            <div className={"space-y-3"}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Form.Input<FormType>
                        required={true}
                        register={register}
                        fieldName={fieldNames.addressRequest.detail}
                        label="Địa chỉ"
                        placeholder="Nhập địa chỉ"
                        errorMessage={errors?.campaignOrganizations?.[parentIndex]?.schedules?.[index]?.addressRequest?.detail?.message}
                    />
                    <div>
                        <Form.Label label={"Tỉnh / Thành phố"} required={true} />
                        <Controller
                            control={control}
                            name={fieldNames.addressRequest.provinceCode}
                            render={({ field }) => {
                                return <SelectBox<IProvince>
                                    placeholder={"Chọn tỉnh / thành phố"}
                                    value={selectedProvince}
                                    onValueChange={(p) => {
                                        if (p.code === getValues(fieldNames.addressRequest.provinceCode))
                                            return;
                                        field.onChange(p.code);
                                        resetField(fieldNames.addressRequest.districtCode);
                                        resetField(fieldNames.addressRequest.wardCode);
                                        handleProvinceChange(p);
                                    }}
                                    dataSource={provinces}
                                    displayKey={"nameWithType"}
                                />;
                            }}
                        />
                        {errorsInSchedule?.addressRequest?.provinceCode && (
                            <ErrorMessage>
                                {errorsInSchedule?.addressRequest?.provinceCode.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div>
                        <Form.Label label={"Quận / Huyện"} required={true} />
                        <Controller
                            control={control}
                            name={fieldNames.addressRequest.districtCode}
                            render={({ field }) => {
                                return <SelectBox<IDistrict>
                                    placeholder={"Chọn quận / huyện"}
                                    value={selectedDistrict}
                                    onValueChange={(d) => {
                                        if (d.code === getValues(fieldNames.addressRequest.districtCode))
                                            return;
                                        field.onChange(d.code);
                                        resetField(fieldNames.addressRequest.wardCode);
                                        handleDistrictChange(d);
                                    }}
                                    dataSource={districts}
                                    displayKey={"nameWithType"}
                                />;
                            }}
                        />
                        {errorsInSchedule?.addressRequest?.districtCode && (
                            <ErrorMessage>
                                {errorsInSchedule?.addressRequest?.districtCode.message}
                            </ErrorMessage>
                        )}
                    </div>
                    <div>
                        <Form.Label label={"Phường / Xã"} required={true} />
                        <Controller
                            control={control}
                            name={fieldNames.addressRequest.wardCode}
                            render={({ field }) => {
                                return <SelectBox<IWard>
                                    placeholder={"Chọn phường / xã"}
                                    value={selectedWard}
                                    onValueChange={(w) => {
                                        if (w.code === getValues(fieldNames.addressRequest.wardCode)) return;
                                        field.onChange(w.code);
                                        handleWardChange(w);
                                    }}
                                    dataSource={wards}
                                    displayKey={"nameWithType"}
                                />;
                            }}
                        />
                        {errorsInSchedule?.addressRequest?.wardCode && (
                            <ErrorMessage>
                                {errorsInSchedule?.addressRequest?.wardCode.message}
                            </ErrorMessage>
                        )}
                    </div>
                </div>
                <div className={"grid sm:grid-cols-2 gap-4"}>
                    <div>
                        <Form.Label label={"Thời gian bắt đầu"} required={true} />
                        <Controller
                            control={control}
                            name={fieldNames.startDate}
                            render={({ field }) => {

                                return <DateTimePickerModal
                                    value={field.value}
                                    title={"Chọn thời gian bắt đầu"}
                                    isOpen={showStartDatePicker}
                                    onDismiss={() => setShowStartDatePicker(false)}
                                    onClose={(date) => {
                                        if (date) {
                                            // if (date.getFullYear() < 2025) {
                                            //     setError(fieldNames.startDate, {
                                            //         type: "manual",
                                            //         message: "Thời gian bắt đầu phải sau năm 2025"
                                            //     })
                                            // }
                                            field.onChange(date);
                                        }
                                        setShowStartDatePicker(false);
                                    }}
                                />;
                            }}
                        />
                        <Form.DateTimeInputField
                            id={fieldNames.startDate}
                            value={getValues(fieldNames.startDate)
                                ? format(getValues(fieldNames.startDate),
                                    "dd/MM/yyyy hh:mm a",
                                )
                                : ""
                            }
                            onClick={() => setShowStartDatePicker(true)}
                        />
                        {errorsInSchedule?.startDate && (
                            <ErrorMessage>{errorsInSchedule?.startDate.message}</ErrorMessage>
                        )}
                    </div>
                    <div>
                        <Form.Label label={"Thời gian kết thúc"} required={true} />
                        <Controller
                            control={control}
                            name={fieldNames.endDate}
                            render={({ field }) => {
                                return <DateTimePickerModal
                                    value={field.value}
                                    title={"Chọn thời gian kết thúc"}
                                    isOpen={showEndDatePicker}
                                    onDismiss={() => setShowEndDatePicker(false)}
                                    onClose={(date) => {
                                        if (date) {
                                            field.onChange(date);
                                        }
                                        setShowEndDatePicker(false);
                                    }}
                                />;
                            }}
                        />
                        <Form.DateTimeInputField
                            id={fieldNames.endDate}
                            value={getValues(fieldNames.endDate)
                                ? format(getValues(fieldNames.endDate),
                                    "dd/MM/yyyy hh:mm a",
                                )
                                : ""
                            }
                            onClick={() => setShowEndDatePicker(true)}
                        />
                        {errorsInSchedule?.endDate && (
                            <ErrorMessage>{errorsInSchedule?.endDate.message}</ErrorMessage>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default ScheduleCard;