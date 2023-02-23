import React, {Fragment} from "react";
import TableHeading from "../Admin/Table/TableHeading";
import TableHeader from "../Admin/Table/TableHeader";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import Image from "next/image";
import {getAvatarFromName} from "../../utils/helper";
import TableWrapper from "../Admin/Table/TableWrapper";
import {FormikValues} from "formik/dist/types";
import {FieldArray, getIn} from "formik";
import {defaultInputClass} from "../Form";
import useOfflineCampaignForm from "../CampaignForm/hooks/useOfflineCampaignForm";
import {z} from "zod";
import {useFieldArray, UseFieldArrayReturn, useFormContext} from "react-hook-form";
import {BaseCampaignSchema} from "../CampaignForm/hooks";

type fType = z.infer<typeof BaseCampaignSchema>;

type Props = {
    fieldArray:  UseFieldArrayReturn<fType>;
};

const SelectCommissionsTable: React.FC<Props> = ({fieldArray}) => {

    // const {ContinuousOfflineCampaignSchema} = useOfflineCampaignForm({});
    // type FormType = z.infer<typeof ContinuousOfflineCampaignSchema>;
    const {control, register, formState: {errors}} = useFormContext<fType>();

    const {fields, append, remove} = fieldArray;
    //     control,
    //     name: 'campaignCommissions',
    // });

    return (
        <TableWrapper>
            <TableHeading>
                <TableHeader>Thể loại</TableHeader>
                <TableHeader>Chiết khấu (%)</TableHeader>
                <TableHeader>
                    <span className="sr-only">Actions</span>
                </TableHeader>
            </TableHeading>


            <TableBody>
                {fields?.length > 0 ? fields?.map((commission, index) => {
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
                                        onClick={() => remove(index)}
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
    )
        ;
};

export default SelectCommissionsTable;
