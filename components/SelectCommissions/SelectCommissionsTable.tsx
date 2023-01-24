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
import {IRequestCommission} from "../../pages/admin/campaigns/create";
import {defaultInputClass} from "../Form";

type Props = {
    formikForm: FormikValues,
    field: string;
};

const SelectCommissionsTable: React.FC<Props> = ({
                                                     formikForm,
                                                     field,
                                                 }) => {
    return (
        <TableWrapper>
            <TableHeading>
                <TableHeader>Thể loại</TableHeader>
                <TableHeader>Chiết khấu (%)</TableHeader>
                <TableHeader>
                    <span className="sr-only">Actions</span>
                </TableHeader>
            </TableHeading>


            <FieldArray name={field} render={commissions =>
                <TableBody>
                    {formikForm.values[field]?.length > 0 ? formikForm.values[field]?.map((commission: IRequestCommission, index: number) => {
                        const fieldName = `${field}[${index}].commission`;
                        const error = getIn(formikForm.errors, fieldName);
                        const touched = getIn(formikForm.touched, fieldName);
                        return (
                            <Fragment key={commission.genreId}>
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
                                            onChange={formikForm.handleChange}
                                            value={formikForm.values[field][index].commission}
                                            name={fieldName}
                                            type={'number'}
                                            className={defaultInputClass}/>
                                    </TableData>
                                    <TableData className="text-right text-sm font-medium">
                                        <button
                                            onClick={() => commissions.remove(index)}
                                            className="text-rose-600 hover:text-rose-800"
                                        >
                                            Xoá
                                        </button>
                                    </TableData>
                                </tr>
                                {error && touched &&
                                    <tr>
                                        <td colSpan={3}
                                            className='text-rose-500 bg-rose-50 p-2 text-center py-2 px-3 text-sm font-medium transition duration-150 ease-in-out'>
                                            {error}</td>
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
            }
            />

        </TableWrapper>
    )
        ;
};

export default SelectCommissionsTable;
