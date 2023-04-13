import React, { Fragment, useCallback, useEffect, useState } from "react";
import { ICreateComboStore, useCreateComboStore } from "../../stores/CreateComboStore";
import { shallow } from "zustand/shallow";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import Form from "../Form";
import TableHeading from "../Admin/Table/TableHeading";
import TableHeader from "../Admin/Table/TableHeader";
import TableBody from "../Admin/Table/TableBody";
import TableData from "../Admin/Table/TableData";
import Image from "next/image";
import { getAvatarFromName, getIntersectedArray, isImageFile } from "../../utils/helper";
import TableWrapper from "../Admin/Table/TableWrapper";
import ErrorMessage from "../Form/ErrorMessage";
import ConfirmModal from "../Modal/ConfirmModal";
import { toast } from "react-hot-toast";
import CreateButton from "../Admin/CreateButton";
import Link from "next/link";
import { useForm } from "react-hook-form";
import SelectBookModal from "./../SelectBookSeries/SelectBookModal";
import { IoChevronBack } from "react-icons/io5";
import { BookService } from "./../../services/BookService";
import { useAuth } from "../../context/AuthContext";
import { IAuthor } from "./../../types/Author/IAuthor";
import { ImageUploadService } from "./../../services/ImageUploadService";
import { isValidFileSize } from "./../../utils/helper";
import { IBook } from "../../types/Book/IBook";
import { BOOK_IMAGE_UPLOAD_CONTAINER } from "../../constants/TailwindClasses";


type Props = {
    formMode: "create" | "edit";
};

interface IGenre {
    id: number;
    name: string;
    parentId?: number;
    displayIndex?: number;
    status?: boolean;
}

const SeriesBookForm: React.FC<Props> = ({ formMode }) => {
    const { loginUser } = useAuth();
    const [formValues, setFormValues] = useCreateComboStore(
        (state: ICreateComboStore) => [state.formValues, state.setFormValues],
        shallow,
    );
    const { data: genres, isLoading: genresLoading } = useQuery(
        ["genres"],
        async () => {
            const res = await axios.get<IGenre[]>(
                "https://server.boek.live/api/genres/child-genres",
            );
            return res.data;
        },
    );
    const getSelectedGenre = useCallback(
        (id: number) => {
            return genres?.find((genre) => genre.id === id);
        },
        [genres],
    );

    const [selectedGenre, setSelectedGenre] = useState<IGenre | null>(() => {
        return getSelectedGenre(Number(formValues.genreId)) ?? null;
    });

    const [selectedBooks, setSelectedBooks] = useState<IBook[]>(() => {
        return formValues.selectedBooks ?? [];
    });
    const [toDeleteBook, setToDeleteBook] = useState<
        IBook | null
    >();
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
    const [searchBookQuery, setSearchBookQuery] = useState<string>("");
    const bookService = new BookService(loginUser?.accessToken);

    const imageService = new ImageUploadService(loginUser?.accessToken);
    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
    );


    const router = useRouter();

    const createBookSeriesMutation = useMutation(
        (values: any) => bookService.createBookSeriesByIssuer(values),
    );
    const form = useFormik({
        initialValues: {
            ...formValues,
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Mã series không được để trống"),
            name: Yup.string().required("Tên series không được để trống"),
            // isbn10: Yup.string()
            //   .length(10, "ISBN10 phải có 10 ký tự")
            //   .matches(/^(97(8|9))?\d{9}(\d|X)$/, "ISBN10 không hợp lệ"),
            // isbn13: Yup.string()
            //   .length(13, "ISBN13 phải có 13 ký tự")
            //   .matches(
            //     /^(97(8|9))?\d{9}(\d|X)$/,
            //     "ISBN13 không hợp lệ (bắt đầu bằng 978 hoặc 979)"
            //   ),
            releasedYear: Yup.number()
                .required("Năm phát hành không được để trống")
                .integer("Năm phát hành phải là số nguyên")
                .min(2000, ({ min }) => `Năm phát hành phải lớn hơn hoặc bằng ${min}`)
                .max(
                    new Date().getFullYear(),
                    ({ max }) => `Năm phát hành phải nhỏ hơn hoặc bằng ${max}`,
                ),
            coverPrice: Yup.number()
                .required("Giá bìa không được để trống")
                .min(0, ({ min }) => `Giá bìa phải lớn hơn hoặc bằng ${min}`),
            genreId: Yup.number().required("Thể loại không được để trống"),
            description: Yup.string().required("Mô tả không được để trống"),
            selectedBooks: Yup.array().min(1, "Series phải có ít nhất 1 sách"),
            previewFile: Yup.mixed(),
        }),
        onSubmit: async (values) => {
            // if (coverPhoto === null) {
            //   toast.error("Vui lòng chọn ảnh bìa");
            //   return;
            // }

            // if (!selectedAuthorId) {
            //   toast.error("Vui lòng chọn tác giả");
            //   return;
            // }
            // if (!selectedPublisherId) {
            //   toast.error("Vui lòng chọn nhà xuất bản");
            //   return;
            // }
            // if (!selectedCategoryId) {
            //   toast.error("Vui lòng chọn thể loại");
            //   return;
            // }


            let payload = {
                ...values,
                authors: values.authors.map((a: IAuthor) => a.id),
                imageUrl: "",
                createBookItems: values.selectedBooks.map((b: IBook, index) => {
                    return {
                        bookId: b.id,
                        displayIndex: index,
                    };
                }),

            };


            if (!values.previewFile) {
                return;
            }
            try {
                await toast.promise(uploadImageMutation.mutateAsync(values.previewFile), {
                    loading: "Đang tải ảnh lên",
                    success: (data) => {
                        payload.imageUrl = data?.url || "";
                        return "Tải ảnh lên thành công";
                    }
                    ,
                    error: (err) => err?.message || "Tải ảnh lên thất bại",
                });
            } catch (err) {
                console.log(err);
                return;
            }

            async function createBookWithToast(promise: Promise<any>) {
                await toast.promise(promise, {
                    loading: "Đang tạo sách series",
                    success: (data) => {
                        if (data?.id) {
                            router.push(`/issuer/books`);

                        }
                        return "Tạo sách series thành công";
                    },
                    error: (error) => {
                        return error?.message || "Tạo sách series thất bại";
                    },
                });
            }

            try {
                await createBookWithToast(createBookSeriesMutation.mutateAsync(payload));
            } catch (err) {
                console.log(err);
            }
        },
    });
    console.log(form.errors);

    const handleAddBook = useCallback(
        (book: IBook) => {
            if (selectedBooks.length > 0) {
                const currentAuthorIds = selectedBooks.filter((b) => b?.bookAuthors)
                    .map((b) => b?.bookAuthors)
                    .flat()
                    .map((a) => a?.authorId) || [];

                const newBookAuthorIds = book?.bookAuthors?.map((a) => a?.authorId) || [];

                const intersection = getIntersectedArray(currentAuthorIds, newBookAuthorIds);
                if (intersection.length === 0) {
                    toast.error("Sách không có tác giả chung với các sách khác trong series");
                    return;
                }
            }
            if (selectedBooks.find((b) => b.id === book.id)) {
                toast.error("Sách đã tồn tại trong danh sách");
                return;
            }
            setSelectedBooks((prev) => {
                const newBooks = [...prev, book];
                form.setFieldValue("selectedBooks", newBooks);
                return newBooks;
            });
            toast.success("Thêm sách thành công");
            setShowAddBookModal(false);
        },
        [form, selectedBooks],
    );

    const handleDeleteBook = useCallback(
        (book: IBook) => {
            setToDeleteBook(null);
            setSelectedBooks((prev) => {
                const newState = prev.filter((b) => b.id !== book.id);
                form.setFieldValue("selectedBooks", newState);
                return newState;
            });
        },
        [form],
    );

    const { register } = useForm();

    useEffect(() => {
        setFormValues(form.values);
    }, [form.values, setFormValues]);


    console.log(form.values.genreId);

    return (
        <Fragment>
            <div className="mb-6">
                <Link
                    className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                    href="/issuer/books"
                >
                    <IoChevronBack size={"17"} />
                    <span>Quay lại</span>
                </Link>
            </div>
            <div className="mx-auto max-w-6xl border bg-white p-10">
                <h1 className="mb-6 text-2xl font-bold text-slate-800 md:text-3xl">
                    {formMode === "create" ? "Thêm" : "Sửa"} sách series ✨
                </h1>

                <form onSubmit={form.handleSubmit}>
                    <Form.GroupLabel
                        label={"Thông tin chung"}
                        description={"Thông tin chung về series sách"}
                    />

                    <div className="mt-3 space-y-4">
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="cover-photo"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Ảnh bìa<span className="text-rose-500">*</span>
                                </label>
                                <Form.ImageUploadPanel
                                    imageClassName={BOOK_IMAGE_UPLOAD_CONTAINER}
                                    onChange={(file) => {
                                        if (!isImageFile(file)) {
                                            toast.error("Vui lòng tải lên tệp hình ảnh");
                                            return false;
                                        }
                                        // check file size
                                        if (!isValidFileSize(file, 1)) {
                                            toast.error("Kích thước tệp tối đa là 1MB");
                                            return false;
                                        }

                                        form.setFieldValue("previewFile", file);
                                        return true;
                                    }} />
                            </div>

                            <div className="sm:col-span-4">
                                <Form.Input
                                    placeholder={"Nhập tên series"}
                                    register={register}
                                    value={form.values.name}
                                    onChange={form.handleChange}
                                    required={true}
                                    fieldName={"name"}
                                    label={"Tên series"}
                                />
                                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                                    <div className="sm:col-span-2">
                                        <Form.Input
                                            placeholder={"VD: S0001"}
                                            register={register}
                                            value={form.values.code}
                                            onChange={form.handleChange}
                                            required={true}
                                            fieldName={"code"}
                                            label={"Mã series"}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Form.Input
                                            placeholder={"Nhập ISBN10"}
                                            uppercase={true}
                                            maxLength={10}
                                            register={register}
                                            value={form.values.isbn10}
                                            onChange={form.handleChange}
                                            fieldName={"isbn10"}
                                            label={"ISBN10"}
                                        />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <Form.Input
                                            placeholder={"Nhập ISBN13"}
                                            uppercase={true}
                                            maxLength={13}
                                            value={form.values.isbn13}
                                            onChange={form.handleChange}
                                            register={register}
                                            fieldName={"isbn13"}
                                            label={"ISBN13"}
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <Form.Input
                                            placeholder={"Nhập năm phát hành"}
                                            required={true}
                                            inputType={"number"}
                                            register={register}
                                            value={form.values.releasedYear}
                                            onChange={form.handleChange}
                                            fieldName={"releasedYear"}
                                            label={"Năm phát hành"}
                                        />
                                    </div>
                                    <div className="sm:col-span-3">
                                        <Form.Input
                                            placeholder={"Nhập giá bìa"}
                                            required={true}
                                            inputType={"number"}
                                            register={register}
                                            value={form.values.coverPrice}
                                            onChange={form.handleChange}
                                            fieldName={"coverPrice"}
                                            label={"Giá bìa (đ)"}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Form.Divider />
                    <Form.GroupLabel
                        label={"Thể loại"}
                        description="Thể loại chung của series sách"
                    />
                    <div className="mt-3">
                        <Form.Label label={"Thể loại"} required={true} />
                    </div>
                    <div className="mt-1">
                        <select
                            onChange={(e) => {
                                form.handleChange(e);
                                form.setFieldValue("selectedBooks", []);
                                setSelectedBooks([]);
                            }}
                            value={form.values.genreId}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            name="genreId"
                            id="genreId"
                        >
                            {genres?.map((genre) => (
                                <option value={genre?.id} key={genre?.id}>
                                    {genre?.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {form.errors.genreId && form.touched.genreId && (
                        <ErrorMessage>{form.errors.genreId}</ErrorMessage>
                    )}
                    <Form.Divider />
                    <Form.GroupLabel
                        label={"Chọn sách"}
                        description="Chọn những sách cùng thể loại cho series"
                    />
                    <div className="mt-3">
                        <div className="mb-4 flex justify-end gap-4">
                            <CreateButton
                                disabled={!form.values.genreId}
                                label={"Thêm sách"}
                                onClick={() => {
                                    setShowAddBookModal(true);
                                }}
                            />
                        </div>
                        <TableWrapper>
                            <TableHeading>
                                <TableHeader>Mã sách</TableHeader>
                                <TableHeader>Tên sách</TableHeader>
                                <TableHeader>Giá sách</TableHeader>
                                <TableHeader>Nhà xuất bản</TableHeader>
                                {/* <TableHeader>Định dạng</TableHeader> */}
                                <TableHeader>
                                    <span className="sr-only">Edit</span>
                                </TableHeader>
                            </TableHeading>
                            <TableBody>
                                {selectedBooks.length > 0 ? (
                                    selectedBooks.map((book, index) => {
                                        return (
                                            <tr key={index}>
                                                <TableData className="text-sm font-medium uppercase text-gray-500">
                                                    {book.code}
                                                </TableData>
                                                <TableData className="max-w-72">
                                                    <div className="flex items-center gap-4">
                                                        <Image
                                                            width={500}
                                                            height={500}
                                                            className="h-20 w-16 object-cover"
                                                            src={book.imageUrl || ""}
                                                            alt=""
                                                        />
                                                        <div
                                                            className="max-w-56 overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                                                            {book.name}
                                                        </div>
                                                    </div>
                                                </TableData>
                                                <TableData className="text-sm font-semibold text-emerald-600">
                                                    {new Intl.NumberFormat("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    }).format(book?.coverPrice || 0)}
                                                </TableData>
                                                <TableData>
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <Image
                                                                width={100}
                                                                height={100}
                                                                className="h-10 w-10 rounded-full"
                                                                src={getAvatarFromName(
                                                                    book.publisher?.name,
                                                                )}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm text-gray-900">
                                                                {book.publisher?.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableData>
                                                {/* <TableData
                          textAlignment="text-center"
                          className="text-sm text-gray-500"
                        >
                          <select className={defaultInputClass}>
                            <option value="1">Sách giấy</option>
                            <option value="2">Sách audio</option>
                            <option value="3">Sách điện tử</option>
                          </select>
                        </TableData> */}
                                                <TableData className="text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => {
                                                            setToDeleteBook(book);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-rose-600 hover:text-rose-800"
                                                    >
                                                        Xoá
                                                    </button>
                                                </TableData>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <TableData
                                            colSpan={6}
                                            textAlignment={"text-center"}
                                            className="text-sm font-medium uppercase leading-10 text-gray-500 "
                                        >
                                            Chưa có sách nào được chọn
                                        </TableData>
                                    </tr>
                                )}
                            </TableBody>
                        </TableWrapper>

                        {form.errors.selectedBooks && form.touched.selectedBooks && (
                            <ErrorMessage>{form.errors.selectedBooks}</ErrorMessage>
                        )}
                    </div>
                    <Form.Divider />
                    <Form.GroupLabel label={"Mô tả"} description="Mô tả về series sách" />
                    <div className="mt-3">
                        <Form.Input
                            placeholder={"Nhập mô tả"}
                            isTextArea={true}
                            register={register}
                            value={form.values.description}
                            onChange={form.handleChange}
                            required={true}
                            fieldName={"description"}
                            label={"Mô tả"}
                        />
                    </div>

                    <Form.Divider />
                    <button
                        type={"submit"}
                        className="mt-5 inline-flex items-center gap-2 rounded bg-slate-200 py-2 px-4 text-sm font-medium text-gray-800 hover:bg-slate-300"
                    >
                        <span>Tạo series</span>
                    </button>
                </form>
            </div>

            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={() => {
                    if (toDeleteBook) {
                        handleDeleteBook(toDeleteBook);
                        toast.success("Xoá sách khỏi series thành công");
                    }
                    setShowDeleteModal(false);
                }}
                title={`Xoá ${toDeleteBook?.name}`}
                content={"Bạn có chắc chắn muốn xoá sách này khỏi series?"}
                confirmText={"Xoá"}
            />

            {form.values.genreId && <SelectBookModal
                key={form.values.genreId}
                onItemSelect={b => handleAddBook(b)}
                onClose={() => setShowAddBookModal(false)}
                isOpen={showAddBookModal}
                genreId={Number(form.values.genreId)}
            />}

            {/* <TransitionModal
        maxWidth={"max-w-3xl"}
        isOpen={showAddBookModal}
        closeOnOverlayClick={true}
        onClose={() => {
          setShowAddBookModal(false);
          setSearchBookQuery("");
        }}
      >
        <div className="overflow-hidden rounded-xl">
          <div>
            <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm sách"
              className="h-12 w-full border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
              value={searchBookQuery}
              onChange={(e) => setSearchBookQuery(e.target.value)}
            />
          </div>
          <div className="h-96 overflow-y-auto">
            {searchBooks.length > 0 ? (
              searchBooks.map((book, index) => {
                return (
                  <div
                    onClick={() => {
                      handleAddBook(book);
                    }}
                    key={index}
                    className="flex justify-between border-b border-gray-300 p-4"
                  >
                    <div className="flex gap-4">
                      <Image
                        width={500}
                        height={500}
                        className="h-20 w-16 object-cover"
                        src={book.imageUrl || ""}
                        alt=""
                      />
                      <div>
                        <div className="mb-1 w-fit rounded bg-blue-500 py-1 px-2 text-xs text-white">
                          {`B${faker.datatype.number({
                            min: 10000,
                            max: 99999,
                          })}`}
                        </div>
                        <div className="mb-1 text-sm font-medium text-gray-900">
                          {book.name}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          NXB: {faker.company.name()}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-emerald-600">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(faker.datatype.number())}
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyState
                status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                keyword={searchBookQuery}
              />
            )}
          </div>

          <Modal.Footer>
            <div className="flex flex-wrap justify-end space-x-2">
              <button
                onClick={() => {
                  setShowAddBookModal(false);
                }}
                className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
              >
                Đóng
              </button>
              <Link
                href="/issuer/books/create"
                className="m-btn bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Tạo sách mới
              </Link>
            </div>
          </Modal.Footer>
        </div>
      </TransitionModal> */}
        </Fragment>
    );
};

export default SeriesBookForm;
