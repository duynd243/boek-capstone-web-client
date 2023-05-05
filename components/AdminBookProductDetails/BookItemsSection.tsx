import React, { Fragment, useContext } from "react";
import Form from "../Form";
import Image from "next/image";
import { BookProductContext } from "../../context/BookProductContext";
import { BookTypes } from "../../constants/BookTypes";
import { BsFillFileEarmarkPdfFill } from "react-icons/bs";
import { MdAudioFile } from "react-icons/md";

type Props = {}

const BookItemsSection: React.FC<Props> = ({}) => {
    const product = useContext(BookProductContext);
    const typeName = (product?.type === BookTypes.Combo.id ? "Combo" : "Series").toLowerCase();
    return (
        <Fragment>
            <Form.GroupLabel
                label={`Sách trong ${typeName}`}
                description={`Danh sách các sách trong ${typeName}`}
            />
            <div className="mt-3 grid sm:grid-cols-2 gap-6">
                {product?.bookProductItems?.map((bi) => (
                    <div
                        //href={`/admin/books/${bi?.book?.id}`}
                        key={bi?.book?.id}
                        className="w-full flex bg-gray-50 shadow-sm overflow-hidden border rounded">
                        {/* Image */}
                        <Image
                            src={bi?.book?.imageUrl ||
                                ""
                            }
                            alt={""} width={500} height={500}
                            className={"w-40 object-cover"}
                        />
                        {/* Content */}
                        <div className="p-3 flex flex-col justify-between flex-1 min-w-0">
                            <div>
                                <div className="text-lg font-medium text-slate-800">{bi?.book?.name}</div>
                                <ul className="text-sm mt-4 space-y-1.5">
                                    <li className="flex items-center gap-2 text-slate-500">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0"
                                             viewBox="0 0 512 512" className="fill-gray-600" height="1em" width="1em"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M479.66 268.7l-32-151.81C441.48 83.77 417.68 64 384 64H128c-16.8 0-31 4.69-42.1 13.94s-18.37 22.31-21.58 38.89l-32 151.87A16.65 16.65 0 0032 272v112a64 64 0 0064 64h320a64 64 0 0064-64V272a16.65 16.65 0 00-.34-3.3zm-384-145.4v-.28c3.55-18.43 13.81-27 32.29-27H384c18.61 0 28.87 8.55 32.27 26.91 0 .13.05.26.07.39l26.93 127.88a4 4 0 01-3.92 4.82H320a15.92 15.92 0 00-16 15.82 48 48 0 11-96 0A15.92 15.92 0 00192 256H72.65a4 4 0 01-3.92-4.82z"></path>
                                        </svg>
                                        <div>Xuất bản: {bi?.book?.publisher?.name}</div>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-500">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0"
                                             viewBox="0 0 512 512" className="fill-gray-600" height="1em" width="1em"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M332.64 64.58C313.18 43.57 286 32 256 32c-30.16 0-57.43 11.5-76.8 32.38-19.58 21.11-29.12 49.8-26.88 80.78C156.76 206.28 203.27 256 256 256s99.16-49.71 103.67-110.82c2.27-30.7-7.33-59.33-27.03-80.6zM432 480H80a31 31 0 01-24.2-11.13c-6.5-7.77-9.12-18.38-7.18-29.11C57.06 392.94 83.4 353.61 124.8 326c36.78-24.51 83.37-38 131.2-38s94.42 13.5 131.2 38c41.4 27.6 67.74 66.93 76.18 113.75 1.94 10.73-.68 21.34-7.18 29.11A31 31 0 01432 480z"></path>
                                        </svg>
                                        <div>Tác
                                            giả: {bi?.book?.bookAuthors?.map(({ author }) => author?.name).join(", ")}</div>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-500">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0"
                                             viewBox="0 0 512 512" className="fill-gray-600" height="1em" width="1em"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M480 128a64 64 0 00-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 48v16H96a64 64 0 00-64 64v12a4 4 0 004 4h440a4 4 0 004-4zM32 416a64 64 0 0064 64h320a64 64 0 0064-64V179a3 3 0 00-3-3H35a3 3 0 00-3 3zm344-208a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24zm-80-80a24 24 0 11-24 24 24 24 0 0124-24zm0 80a24 24 0 11-24 24 24 24 0 0124-24z"></path>
                                        </svg>
                                        <div>Năm phát hành: {bi?.book?.releasedYear}</div>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-500">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0"
                                             viewBox="0 0 512 512" className="fill-gray-600" height="1em" width="1em"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M478.33 433.6l-90-218a22 22 0 00-40.67 0l-90 218a22 22 0 1040.67 16.79L316.66 406h102.67l18.33 44.39A22 22 0 00458 464a22 22 0 0020.32-30.4zM334.83 362L368 281.65 401.17 362zm-66.99-19.08a22 22 0 00-4.89-30.7c-.2-.15-15-11.13-36.49-34.73 39.65-53.68 62.11-114.75 71.27-143.49H330a22 22 0 000-44H214V70a22 22 0 00-44 0v20H54a22 22 0 000 44h197.25c-9.52 26.95-27.05 69.5-53.79 108.36-31.41-41.68-43.08-68.65-43.17-68.87a22 22 0 00-40.58 17c.58 1.38 14.55 34.23 52.86 83.93.92 1.19 1.83 2.35 2.74 3.51-39.24 44.35-77.74 71.86-93.85 80.74a22 22 0 1021.07 38.63c2.16-1.18 48.6-26.89 101.63-85.59 22.52 24.08 38 35.44 38.93 36.1a22 22 0 0030.75-4.9z"></path>
                                        </svg>
                                        <div>Ngôn ngữ: {bi?.book?.language}</div>
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-500">
                                        <svg stroke="currentColor" fill="currentColor" stroke-width="0"
                                             viewBox="0 0 512 512" className="fill-gray-600" height="1em" width="1em"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M428 224H288a48 48 0 01-48-48V36a4 4 0 00-4-4h-92a64 64 0 00-64 64v320a64 64 0 0064 64h224a64 64 0 0064-64V228a4 4 0 00-4-4zm-92 160H176a16 16 0 010-32h160a16 16 0 010 32zm0-80H176a16 16 0 010-32h160a16 16 0 010 32z"></path>
                                            <path
                                                d="M419.22 188.59L275.41 44.78a2 2 0 00-3.41 1.41V176a16 16 0 0016 16h129.81a2 2 0 001.41-3.41z"></path>
                                        </svg>
                                        <div>Số trang: {bi?.book?.page}</div>
                                    </li>
                                </ul>
                            </div>
                            {/*Price on right*/}
                            {(bi?.withAudio || bi?.withPdf) &&
                                <div className="flex justify-end gap-2 items-center mt-2">
                                    {/*<div className="text-emerald-600 font-medium text-lg">*/}
                                    {/*    {new Intl.NumberFormat("vi-VN", {*/}
                                    {/*            style: "currency",*/}
                                    {/*            currency: "VND",*/}
                                    {/*        },*/}
                                    {/*    ).format(bi?.book?.coverPrice || 0)}*/}
                                    {/*</div>*/}
                                    {bi?.withPdf && (
                                        <div
                                            className="text-xs bg-sky-600 text-white flex items-center gap-2 px-3 py-2 rounded-sm">
                                            <div className="flex gap-1 items-center">
                                                <BsFillFileEarmarkPdfFill />Sách PDF
                                            </div>
                                            <div className="font-medium">
                                                {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    },
                                                ).format(bi?.book?.pdfExtraPrice || 0)}
                                            </div>
                                        </div>
                                    )}
                                    {bi?.withAudio && (
                                        <div
                                            className="text-xs bg-indigo-600 text-white flex items-center gap-2 px-3 py-2 rounded-sm">
                                            <div className="flex gap-1 items-center">
                                                <MdAudioFile />Sách Audio
                                            </div>
                                            <div className="font-medium">
                                                {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    },
                                                ).format(bi?.book?.audioExtraPrice || 0)}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            }
                        </div>
                    </div>
                ))}
            </div>
        </Fragment>
    );
};

export default BookItemsSection;