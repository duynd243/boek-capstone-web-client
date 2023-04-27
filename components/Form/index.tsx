import Image from "next/image";
import React, { useEffect, useId, useState } from "react";
import { Path, UseFormRegister } from "react-hook-form";
import { BsCalendarWeek } from "react-icons/bs";
import ErrorMessage from "./ErrorMessage";

type LabelProps = {
    fieldName?: string;
    label: string;
    required?: boolean;
    textAlignment?: "text-left" | "text-center" | "text-right";
};

const Label = (props: LabelProps) => {
    return (
        <label
            className={`mb-1 block text-sm font-medium text-gray-600 ${props.textAlignment || "text-left"}`}
            htmlFor={props.fieldName}
        >
            {props.label}
            {props.required && <span className="text-rose-500"> *</span>}
        </label>
    );
};

type InputProps<T extends Record<string, any>> = {
    register: UseFormRegister<T>;
    uppercase?: boolean;
    fieldName: Path<T>;
    label: string;
    required?: boolean;
    placeholder?: string;
    isTextArea?: boolean;
    extraInputClassName?: string;
    inputType?: React.HTMLInputTypeAttribute;
    errorMessage?: string;
    renderTrail?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement> &
    React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const defaultInputClass =
    "block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:opacity-50";

const Input = <T extends Record<string, any>>({
                                                  register,
                                                  uppercase = false,
                                                  inputType = "text",
                                                  isTextArea,
                                                  label,
                                                  required,
                                                  fieldName,
                                                  placeholder,
                                                  errorMessage,
                                                  renderTrail,
                                                  extraInputClassName = "",
                                                  ...rest
                                              }: InputProps<T>) => {
    const commonProps = {
        id: fieldName,
        placeholder: placeholder,
        className: `${defaultInputClass} ${extraInputClassName}`,
        ...register(fieldName),
        ...rest,
    };

    return (
        <div>
            <Label fieldName={fieldName} label={label} required={required} />
            <div className="relative">
                {isTextArea ? (
                    <textarea rows={7} {...commonProps} />
                ) : (
                    <input {...commonProps} type={inputType} />
                )}
                <div className="absolute inset-y-0 right-0 flex items-center">{renderTrail}</div>
            </div>
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
        </div>
    );
};
type GroupLabelProps = {
    label: string;
    description?: string;
    required?: boolean;
};
const GroupLabel: React.FC<GroupLabelProps> = ({
                                                   label,
                                                   description,
                                                   required,
                                               }) => {
    return (
        <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
                {label}
                {required && <span className="text-rose-500"> *</span>}
            </h3>
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
    imageClassName?: string;
};

const ImageUploadPanel: React.FC<ImageUploadPanelProps> = ({
                                                               label,
                                                               onChange,
                                                               onRemove,
                                                               defaultImageURL,
                                                               imageClassName,
                                                           }) => {

    const inputId = useId();
    const [file, setFile] = useState<File | null>(null);

    const objectURL = file && URL.createObjectURL(file);
    const imgSrc = objectURL ? objectURL : defaultImageURL;
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (onChange?.(file)) {
            setFile(file);
        }
    };

    useEffect(() => {
        if (objectURL) {
            return () => {
                URL.revokeObjectURL(objectURL);
            };
        }
    }, [objectURL, file]);
    const handleRemoveFile = () => {
        setFile(null);
        onRemove?.();
    };

    return (
        <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
            <div className="space-y-1 text-center">
                {imgSrc ? (
                    <Image
                        className={
                            imageClassName || "mx-auto mb-4 rounded-md object-cover object-center"
                        }
                        width={800}
                        height={800}
                        src={imgSrc}
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
                    <div className="mb-2 text-sm text-slate-600">
                        {file?.name}
                    </div>
                )}
                <div className="flex flex-col justify-center gap-1 text-sm text-gray-600">
                    <label
                        htmlFor={inputId}
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                        <span>{imgSrc ? "Chọn ảnh khác" : "Tải ảnh lên"}</span>
                        <input
                            onChange={handleFileChange}
                            id={inputId}
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                        />
                    </label>
                    {file && (
                        <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="font-medium text-rose-500"
                        >
                            {defaultImageURL
                                ? "Khôi phục ảnh mặc định"
                                : "Xóa ảnh"}
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
} & React.InputHTMLAttributes<HTMLInputElement>;
const DateTimeInputField: React.FC<DateTimeInputFieldProps> = ({
                                                                   placeholder,
                                                                   onClick,
                                                                   value,
                                                                   ...rest
                                                               }) => {
    const id = useId();
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
            <label
                htmlFor={id}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400"
            >
                <BsCalendarWeek />
            </label>
        </div>
    );
};

const Form = {
    Divider: () => <hr className="my-8 border-t border-gray-200" />,
    GroupLabel,
    Label,
    Input,
    ImageUploadPanel,
    DateTimeInputField,
};

export default Form;
