import React, {useEffect, useId, useState} from "react";
import DefaultAvatar from "../assets/images/default-avatar.png";
import Image from "next/image";
import {isValidImageSrc} from "../utils/helper";

type Props = {
    defaultImageURL?: string;
    onChange: (file: File) => boolean;
};

const SelectProfilePicture: React.FC<Props> = ({
                                                   defaultImageURL,
                                                   onChange,
                                               }) => {
    const inputId = useId();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const initialPreviewURL =
        defaultImageURL && isValidImageSrc(defaultImageURL)
            ? defaultImageURL
            : DefaultAvatar.src;
    const objectURL = selectedFile && URL.createObjectURL(selectedFile);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (onChange(file)) {
            setSelectedFile(file);
        }
    };

    useEffect(() => {
        if (objectURL) {
            return () => {
                URL.revokeObjectURL(objectURL);
            };
        }
    }, [objectURL, selectedFile]);

    return (
        <div className="flex items-center">
            <div
                className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                aria-hidden="true"
            >
                <Image
                    width={100}
                    height={100}
                    className="h-full w-full rounded-full object-cover"
                    src={objectURL || initialPreviewURL}
                    alt=""
                />
            </div>
            <div className="ml-5 rounded-md shadow-sm">
                <div
                    className="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:bg-gray-50">
                    <label
                        htmlFor={inputId}
                        className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                    >
                        <span>
                            {selectedFile || defaultImageURL
                                ? "Thay đổi"
                                : "Tải lên"}
                        </span>
                    </label>
                    <input
                        onChange={handleFileChange}
                        id={inputId}
                        type="file"
                        accept="image/*"
                        className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                    />
                </div>
            </div>
        </div>
    );
};

export default SelectProfilePicture;
