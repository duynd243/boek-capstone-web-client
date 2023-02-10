import { FormikValues } from "formik/dist/types";
import Image from "next/image";
import React, { useMemo, useState } from "react";
import { BsCalendarWeek } from "react-icons/bs";
import ErrorMessage from "./ErrorMessage";

type LabelProps = {
    fieldName?: string;
    label: string;
    required?: boolean;
};

const Label = (props: LabelProps) => {
    return (
        <label
            className="mb-1 block text-sm font-medium text-gray-600"
            htmlFor={props.fieldName}
        >
            {props.label} {props.required && <span className="text-rose-500">*</span>}
        </label>
    );
};

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

export const defaultInputClass =
    "block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50";

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
        value: formikForm.values[fieldName] || "",
        onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => {
            formikForm.setFieldValue(
                fieldName,
                uppercase ? e.target.value.toUpperCase() : e.target.value
            );
        },
        placeholder: placeholder,
        className: defaultInputClass,
        ...rest,
    };
    return (
        <div>
            <Label fieldName={fieldName} label={label} required={required}/>
            {isTextArea ? (
                <textarea {...commonProps} />
            ) : (
                <input {...commonProps} type={inputType}/>
            )}
            {formikForm.errors[fieldName] && formikForm.touched[fieldName] && (
                <ErrorMessage>{formikForm.errors[fieldName]}</ErrorMessage>
            )}
        </div>
    );
};
type GroupLabelProps = {
    label: string;
    description?: string;
};
const GroupLabel: React.FC<GroupLabelProps> = ({label, description}) => {
    return (
        <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">{label}</h3>
            {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
        </div>
    );
};

type ImageUploadPanelProps = {
    defaultImageURL?: string;
    onChange?: (file: File) => boolean;
    onRemove?: () => void;
    label?: string;
};

const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({
                                                               label,
                                                               onChange,
                                                               onRemove,
                                                               defaultImageURL
                                                           }) => {
    const [file, setFile] = useState<File | null>(defaultImageURL ? new File([], "") : null);

    const previewURL = useMemo(() => {
        if (file && file.name && file.size) {
            return URL.createObjectURL(file);
        } else if (defaultImageURL) {
            return defaultImageURL;
        } else {
            return null;
        }
    }, [defaultImageURL, file]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onChange?.(file)) {
            setFile(file);
        }
    };
    const handleRemoveFile = () => {
        URL.revokeObjectURL(previewURL!);
        setFile(null);
        onRemove?.();
    };

    return (
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
                {previewURL ? (
                    <Image
                        className={"mx-auto mb-4 rounded-md object-cover object-center"}
                        width={500}
                        height={500}
                        src={previewURL}
                        alt={""}
                    />
                ) : (
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                    >
                        <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </svg>
                )}
                {file && (
                    <div className="mb-2 text-sm text-slate-600">{file?.name}</div>
                )}
                <div className="flex flex-col justify-center gap-1 text-sm text-gray-600">
                    <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                        <span>{(file || previewURL) ? "Chọn ảnh khác" : "Tải ảnh lên"}</span>
                        <input
                            onChange={handleFileChange}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                        />
                    </label>
                    {file && (
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="font-medium text-rose-500"
                        >
                            Xoá
                        </button>
                    )}
                </div>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
};

type DateTimeInputFieldProps = {
    value: string;
    onClick?: () => void;
    id: string;
} & React.InputHTMLAttributes<HTMLInputElement>;
const DateTimeInputField: React.FC<DateTimeInputFieldProps> = ({
    placeholder,
                                                                   id,
                                                                   onClick,
                                                                   value,
                                                                   ...rest
                                                               }) => {
    return (
        <div className="relative">
            <input
                {...rest}
                id={id}
                readOnly={true}
                onClick={onClick}
                value={value}
                placeholder={placeholder || "dd/mm/yyyy hh:mm"}
                className={defaultInputClass}
                type="text"
            />
            <label htmlFor={id} className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400">
                <BsCalendarWeek/>
            </label>
        </div>
    );
};

const Form = {
    Divider: () => <hr className="my-8 border-t border-gray-200"/>,
    GroupLabel,
    Label,
    Input,
    ImageUploadPanel,
    DateTimeInputField,
};

export default Form;