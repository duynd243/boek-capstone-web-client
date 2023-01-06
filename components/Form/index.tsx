import React from 'react'
import {FormikValues} from "formik/dist/types";
import ErrorMessage from "./ErrorMessage";

type LabelProps = {
    fieldName?: string;
    label: string;
    required?: boolean;
}

const Label = (props: LabelProps) => {
    return (
        <label className="mb-1 block text-gray-600 text-sm font-medium" htmlFor={props.fieldName}>
            {props.label} {props.required && <span className="text-rose-500">*</span>}
        </label>
    )
}

type InputProps = {
    uppercase?: boolean;
    formikForm: FormikValues;
    fieldName: string;
    label: string;
    required?: boolean;
    placeholder?: string;
    isTextArea?: boolean;
    inputType?: React.HTMLInputTypeAttribute;
} & React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const defaultInputClass = "block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500";

const Input: React.FC<InputProps> = ({
                                         uppercase = false,
                                         inputType = "text",
                                         formikForm,
                                         isTextArea,
                                         label,
                                         required,
                                         fieldName,
                                         placeholder,
                                         ...rest
                                     }) => {
    const commonProps = {
        id: fieldName,
        name: fieldName,
        value: formikForm.values[fieldName],
        onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            formikForm.setFieldValue(fieldName, uppercase ? e.target.value.toUpperCase() : e.target.value);
        },
        placeholder: placeholder,
        className:
        defaultInputClass,
        ...rest,
    };
    return (
        <div>
            <Label fieldName={fieldName} label={label} required={required}/>
            {isTextArea ? (
                <textarea {...commonProps} rows={3}/>
            ) : (
                <input {...commonProps} type={inputType}/>
            )}
            {formikForm.errors[fieldName] && formikForm.touched[fieldName] && (
                <ErrorMessage>
                   {formikForm.errors[fieldName]}
                </ErrorMessage>
            )}
        </div>
    )
}
type GroupLabelProps = {
    label: string;
    description?: string;
}
const GroupLabel: React.FC<GroupLabelProps> = ({label, description}) => {
    return (
        <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">{label}</h3>
            {description && (<p className="mt-1 text-sm text-gray-500">{description}</p>)}
        </div>
    )
}
const Form = {
    Divider: () => <hr className="my-8 border-t border-gray-200"/>,
    GroupLabel,
    Label,
    Input,
}
export default Form