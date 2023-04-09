import { useAuth } from "../../../../context/AuthContext";
import { NextPageWithLayout } from "../../../_app";
import { useRouter } from 'next/router';
import { BookService } from './../../../../services/BookService';
import AdminLayout from './../../../../components/Layout/AdminLayout';
import { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Fragment } from 'react';
import Link from "next/link";
import { IoChevronBack } from 'react-icons/io5';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import Image from "next/image";
import CreateButton from "../../../../components/Admin/CreateButton";
import ErrorMessage from './../../../../components/Form/ErrorMessage';
import { useEffect } from 'react';
import { IAuthor } from './../../../../types/Author/IAuthor';
import { useMutation } from '@tanstack/react-query';
import FormPageLayout from './../../../../components/Layout/FormPageLayout';
import WelcomeBanner from './../../../../components/WelcomBanner/index';
import { useForm } from 'react-hook-form';
import { z } from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import Form from "../../../../components/Form";
import BookForm from './../../../../components/BookForm/BookForm';



const BookDetails: NextPageWithLayout = () => {
    const { loginUser } = useAuth();
    const router = useRouter();
    const bookService = new BookService(loginUser?.accessToken);

    const bookId = router.query.id as string;
    const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
    const { data: book, isLoading } = useQuery(
        ["issuer_book", bookId],
        () => bookService.getBookById$Issuer(Number(bookId), {withCampaigns: true, withAllowChangingGenre: true}),
        {
            staleTime: Infinity,
            cacheTime: Infinity,
            retry: false,
            enabled: !!bookId
        }
    );
    // const { data: book, isLoading } = useQuery(
    //     ["issuer_book", bookId],
    //     () => bookService.updateBookByIssuer(Number(bookId)),
    //     {
    //         staleTime: Infinity,
    //         cacheTime: Infinity,
    //         retry: false,
    //         enabled: !!bookId
    //     }
    // );

    const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // check file type
            if (!file.type.startsWith("image/")) {
                toast.error("Vui lòng tải lên tệp hình ảnh");
                return;
            }
            // check file size
            if (file.size > 1024 * 1024 * 1) {
                toast.error("Kích thước tệp tối đa là 1MB");
                return;
            }
            setCoverPhoto(file);
        }
    };
    const [bookName, setBookName] = useState<string>("");

    useEffect(() => {
        if (book && book.name) {
            setBookName(book.name);
        }
    }, [book]);
    const updateBookMutation = useMutation(
        (values: any) => bookService.updateBookByIssuer(values)
    );
    const form = useFormik({
        initialValues: {
            code: "",
            isbn10: "",
            isbn13: "",
            name: "",
            translator: "",
            coverPrice: 0,
            description: "",
            language: "",
            size: "",
            pdfExtraPrice: 0,
            pdfTrialUrl: "",
            audioExtraPrice: 0,
            audioTrialUrl: "",
            unitInStock: 0,
            releasedYear: new Date().getFullYear(),
            page: 1,
            bookInCombo: true,
            authors: [],
            publisherId: undefined,
            genreId: undefined,
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Mã sách không được để trống"),
        }),
        onSubmit: async (values) => {
            let payload = {
                ...values,
                authors: values.authors.map((a: IAuthor) => a.id),
                imageUrl: "",
            };

            console.log(payload);
            // console.log(JSON.stringify(payload, null, 2));

            async function updateBookWithToast(promise: Promise<any>) {
                await toast.promise(promise, {
                    loading: "Đang cập nhập sách lẻ",
                    success: (data) => {
                        if (data?.id) {
                            router.push(`/issuer/books`);

                        }
                        return "cập nhập sách lẻ thành công"
                    },
                    error: (error) => {
                        return error?.message || "Cập nhập sách lẻ thất bại";
                    },
                })
            }
            // await updateBookWithToast(updateBookMutation.mutateAsync(payload));
        },
    });


    return (
        // <div >
        //     {book && (
        //         <Fragment>
        //             <div className="mb-6">
        //                 <Link
        //                     className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
        //                     href="/issuer/books"
        //                 >
        //                     <IoChevronBack size={"17"} />
        //                     <span>Quay lại</span>
        //                 </Link>
        //             </div>
        //             <form
        //                 onSubmit={router.back}
        //                 className="mx-auto max-w-6xl space-y-8 divide-y divide-gray-200 bg-white p-10"
        //             >
        //                 <div className="mb-4 sm:mb-0">
        //                     <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
        //                         ✨ Chỉnh sửa và Chi tiết - {book.name}
        //                     </h1>
        //                 </div>
        //                 <div className="space-y-8 divide-y divide-gray-200">
        //                     <div>
        //                         <div>
        //                             <h3 className="text-lg font-bold leading-6 text-gray-900">
        //                                 Thông tin chung
        //                             </h3>
        //                             <p className="mt-1 text-sm text-gray-500">
        //                                 Thông tin cơ bản về sách
        //                             </p>
        //                         </div>

        //                         <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        //                             <div className="sm:col-span-6">
        //                                 <label
        //                                     htmlFor="name"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Tên sách<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         // value={book.name}
        //                                         // onChange={form.handleChange}
        //                                         value={bookName}
        //                                         onChange={(e) => setBookName(e.target.value)}
        //                                         type="text"
        //                                         name="name"
        //                                         id="name"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.name && form.touched.name && (
        //                                     <div className={"input-error"}>{form.errors.name}</div>
        //                                 )}
        //                             </div>

        //                             <div className="sm:col-span-6">
        //                                 <label
        //                                     htmlFor="code"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Mã sách<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="VD: TB001"
        //                                         value={book.code}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="code"
        //                                         id="code"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.code && form.touched.code && (
        //                                     <div className={"input-error"}>{form.errors.code}</div>
        //                                 )}
        //                             </div>

        //                             <div className="sm:col-span-6">
        //                                 <label
        //                                     htmlFor="description"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Mô tả<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <textarea
        //                                         value={book.description}
        //                                         onChange={form.handleChange}
        //                                         id="description"
        //                                         name="description"
        //                                         rows={3}
        //                                         className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.description && form.touched.description && (
        //                                     <div className={"input-error"}>{form.errors.description}</div>
        //                                 )}
        //                             </div>

        //                              <div className="sm:col-span-6">
        //                                 <label
        //                                     htmlFor="cover-photo"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Ảnh bìa<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
        //                                     <div className="space-y-1 text-center">
        //                                         {coverPhoto ? (
        //                                             <Image
        //                                                 className={
        //                                                     "mb-4 w-52 rounded-md object-cover object-center"
        //                                                 }
        //                                                 width={500}
        //                                                 height={500}
        //                                                 src={URL.createObjectURL(coverPhoto)}
        //                                                 alt={""}
        //                                             />
        //                                         ) : (
        //                                             <svg
        //                                                 className="mx-auto h-12 w-12 text-gray-400"
        //                                                 stroke="currentColor"
        //                                                 fill="none"
        //                                                 viewBox="0 0 48 48"
        //                                                 aria-hidden="true"
        //                                             >
        //                                                 <path
        //                                                     d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
        //                                                     strokeWidth={2}
        //                                                     strokeLinecap="round"
        //                                                     strokeLinejoin="round"
        //                                                 />
        //                                             </svg>
        //                                         )}
        //                                         <div className="flex justify-center text-sm text-gray-600">
        //                                             <label
        //                                                 htmlFor="file-upload"
        //                                                 className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
        //                                             >
        //                                                 <span>
        //                                                     {coverPhoto ? "Chọn ảnh khác" : "Tải ảnh lên"}
        //                                                 </span>
        //                                                 <input
        //                                                     onChange={(e) => handleCoverPhotoChange(e)}
        //                                                     id="file-upload"
        //                                                     name="file-upload"
        //                                                     type="file"
        //                                                     className="sr-only"
        //                                                 />
        //                                             </label>
        //                                         </div>
        //                                         <p className="text-xs text-gray-500">
        //                                             PNG, JPG, GIF tối đa 1MB
        //                                         </p>
        //                                     </div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <div className="pt-8">
        //                         <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="isbn10"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     ISBN10
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="VD: 0545010225​"
        //                                         value={book.isbn10}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="isbn10"
        //                                         id="isbn10"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.isbn10 && form.touched.isbn10 && (
        //                                     <div className={"input-error"}>{form.errors.isbn10}</div>
        //                                 )}
        //                             </div>

        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="isbn13"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     ISBN13
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="VD: 9781260013870​"
        //                                         value={book.isbn13}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="isbn13"
        //                                         id="isbn13"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.isbn13 && form.touched.isbn13 && (
        //                                     <div className={"input-error"}>{form.errors.isbn13}</div>
        //                                 )}
        //                             </div>
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="coverPrice"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Giá bìa<span className="text-rose-500">*</span>
        //                                 </label>

        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="10,000​"
        //                                         value={book.coverPrice}
        //                                         // value={new Intl.NumberFormat("vi-VN", {
        //                                         //   style: "currency",
        //                                         //   currency: "VND",
        //                                         // }).format(form.values.price)}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="coverPrice"
        //                                         id="coverPrice"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.coverPrice && form.touched.coverPrice && (
        //                                     <div className={"input-error"}>{form.errors.coverPrice}</div>
        //                                 )}
        //                             </div>

        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="size"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Kích thước<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="VD: 25cm x 25cm"
        //                                         value={book.size}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="size"
        //                                         id="size"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.size && form.touched.size && (
        //                                     <div className={"input-error"}>{form.errors.size}</div>
        //                                 )}
        //                             </div>
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="language"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Ngôn ngữ<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <select
        //                                         onChange={form.handleChange}
        //                                         value={book.language}
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                         name="language"
        //                                         id="language"
        //                                     >
        //                                         {/* {languages?.map((language, index) => (
        //                                             <option value={language} key={index}>
        //                                                 {language}
        //                                             </option>
        //                                         ))} */}
        //                                     </select>
        //                                 </div>
        //                             </div>
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="releasedYear"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Năm xuất bản<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         value={book.releasedYear}
        //                                         onChange={form.handleChange}
        //                                         type="number"
        //                                         name="releasedYear"
        //                                         id="releasedYear"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.releasedYear && form.touched.releasedYear && (
        //                                     <div className={"input-error"}>
        //                                         {form.errors.releasedYear}
        //                                     </div>
        //                                 )}
        //                             </div>

        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="page"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Số trang<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         value={book.page}
        //                                         onChange={form.handleChange}
        //                                         type="number"
        //                                         name="page"
        //                                         id="page"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.page && form.touched.page && (
        //                                     <div className={"input-error"}>{form.errors.page}</div>
        //                                 )}
        //                             </div>

        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="publisher"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Nhà xuất bản<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <select
        //                                         onChange={form.handleChange}
        //                                         // value={form.values.publisherId}
        //                                         value={book.publisherId}
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                         name="publisherId"
        //                                         id="publisherId"
        //                                     >
        //                                         {/* {publishers?.data?.map((publisher) => (
        //                                             <option value={Number(publisher?.id)} key={publisher?.id}>
        //                                                 {publisher?.name}
        //                                             </option>
        //                                         ))} */}
        //                                     </select>
        //                                 </div>
        //                             </div>
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="genreId"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Thể loại<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 {/* <div className="mt-1">
        //                                     <select
        //                                         onChange={form.handleChange}
        //                                         value={form.values.genreId}
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                         name="genreId"
        //                                         id="genreId"
        //                                     >
        //                                         {genres?.map((genre) => (
        //                                             <option value={genre?.id} key={genre?.id}>
        //                                                 {genre?.name}
        //                                             </option>
        //                                         ))}
        //                                     </select>
        //                                 </div> */}
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <div className="pt-8">
        //                         <h3 className="text-lg font-bold leading-6 text-gray-900">
        //                             Tác giả và dịch giả
        //                         </h3>
        //                         <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        //                             <div className="sm:col-span-6">
        //                                 <label
        //                                     htmlFor="translator"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Dịch giả<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="VD: Nguyễn Văn A, Nguyễn Văn B"
        //                                         value={form.values.translator}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="translator"
        //                                         id="translator"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.translator && form.touched.translator && (
        //                                     <div className={"input-error"}>{form.errors.translator}</div>
        //                                 )}
        //                             </div>
        //                         </div>
        //                         <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        //                             <div className="sm:col-span-6">
        //                                 <label
        //                                     htmlFor="author"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Tác giả<span className="text-rose-500">*</span>
        //                                 </label>
        //                                 <div>
        //                                     <div className="flex justify-end mb-4 gap-4">
        //                                         <CreateButton
        //                                             className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        //                                             // onClick={() => setShowAuthorSelectModal(true)}
        //                                             label="Thêm tác giả"
        //                                         />
        //                                     </div>
        //                                     {/* <SelectAuthorTable
        //                                         selectedAuthors={form.values.authors}
        //                                         handleRemoveAuthor={handleRemoveAuthor}
        //                                     /> */}
        //                                     {form.errors.authors && form.touched.authors && (
        //                                         <ErrorMessage>{form.errors.authors}</ErrorMessage>
        //                                     )}
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                     <div className="pt-8">
        //                         <h3 className="text-lg font-bold leading-6 text-gray-900">
        //                             Định dạng
        //                         </h3>
        //                         <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="size"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Link PDF Trial
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="VD: https://tiki.vn/tu-sach-nghe-thuat-lanh-dao"
        //                                         value={form.values.pdfTrialUrl}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="pdfTrialUrl"
        //                                         id="pdfTrialUrl"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {/* {form.errors.size && form.touched.size && (
        //                    <div className={"input-error"}>{form.errors.size}</div>
        //                  )} */}
        //                             </div>
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="price"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Giá kèm PDF
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="10,000​"
        //                                         value={form.values.pdfExtraPrice}
        //                                         // value={form.values.price && getFormattedPrice(form.values.price)}
        //                                         // value={new Intl.NumberFormat("vi-VN", {
        //                                         //   style: "currency",
        //                                         //   currency: "VND",
        //                                         // }).format(form.values.price)}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="pdfExtraPrice"
        //                                         id="pdfExtraPrice"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.pdfExtraPrice && form.touched.pdfExtraPrice && (
        //                                     <div className={"input-error"}>{form.errors.pdfExtraPrice}</div>
        //                                 )}
        //                             </div>
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="size"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Link Audio Trial
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="VD: https://tiki.vn/tu-sach-nghe-thuat-lanh-dao"
        //                                         value={form.values.audioTrialUrl}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="audioTrialUrl"
        //                                         id="audioTrialUrl"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {/* {form.errors.size && form.touched.size && (
        //                    <div className={"input-error"}>{form.errors.size}</div>
        //                  )} */}
        //                             </div>
        //                             <div className="sm:col-span-3">
        //                                 <label
        //                                     htmlFor="price"
        //                                     className="block text-sm font-medium text-gray-700"
        //                                 >
        //                                     Giá kèm Audio
        //                                 </label>
        //                                 <div className="mt-1">
        //                                     <input
        //                                         placeholder="10,000​"
        //                                         value={form.values.audioExtraPrice}
        //                                         onChange={form.handleChange}
        //                                         type="text"
        //                                         name="audioExtraPrice"
        //                                         id="audioExtraPrice"
        //                                         className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        //                                     />
        //                                 </div>
        //                                 {form.errors.audioExtraPrice && form.touched.audioExtraPrice && (
        //                                     <div className={"input-error"}>{form.errors.audioExtraPrice}</div>
        //                                 )}
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>

        //                 <div className="pt-5">
        //                     {/* <div className="flex justify-end"> */}
        //                     <button
        //                         type="submit"
        //                         className='bg-slate-200 hover:bg-slate-300 text-gray-800 text-sm font-medium py-2 px-4 rounded inline-flex gap-2 items-center mt-5'>

        //                         Cập nhập sách lẻ
        //                     </button>
        //                     {/* </div> */}
        //                 </div>
        //             </form>
        //             {/* <AuthorModal
        //                 action={AuthorModalMode.CREATE}
        //                 onClose={() => setShowCreateModal(false)}
        //                 isOpen={showCreateModal}
        //                 author={selectedAuthor as IAuthor}
        //             /> */}

        //             {/* <AuthorModal
        //                  action={AuthorModalMode.UPDATE}
        //                  author={selectedAuthor as { id?: number; name?: string }}
        //                  onClose={() => setShowUpdateModal(false)}
        //                  isOpen={showUpdateModal}
        //              /> */}
        //             {/* <SelectAuthorModal
        //                 isOpen={showauthorselectModal}
        //                 onClose={() => setShowAuthorSelectModal(false)}
        //                 onItemSelect={(author) => {
        //                     console.log(author);

        //                     handleAddAuthor(author);
        //                     setShowAuthorSelectModal(false);
        //                 }
        //                 }
        //                 selectedAuthors={form.values.authors}
        //             /> */}
        //         </Fragment>

        //     )}
        // </div>

        <FormPageLayout>
            <WelcomeBanner label={`Chỉnh sửa sách ${book?.name} 📚`} className="p-6 sm:p-10" />
            {book && <BookForm book={book} />}
        </FormPageLayout>
    );
};

BookDetails.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default BookDetails;
