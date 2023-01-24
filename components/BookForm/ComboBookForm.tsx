import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useCreateComboStore } from "../../stores/CreateComboStore";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import Form, { defaultInputClass } from "../Form";
import SelectBox from "../SelectBox";
import TableHeading from "../Admin/Table/TableHeading";
import TableHeader from "../Admin/Table/TableHeader";
import TableBody from "../Admin/Table/TableBody";
import { randomBooks } from "../../pages/admin/books";
import { faker } from "@faker-js/faker/locale/vi";
import { IBookResponse } from "../../old-types/response/IBookResponse";
import TableData from "../Admin/Table/TableData";
import Image from "next/image";
import { getAvatarFromName } from "../../utils/helper";
import TableWrapper from "../Admin/Table/TableWrapper";
import ErrorMessage from "../Form/ErrorMessage";
import ConfirmModal from "../Modal/ConfirmModal";
import { toast } from "react-hot-toast";
import CreateButton from "../Admin/CreateButton";
import TransitionModal from "../Modal/TransitionModal";
import { BsSearch } from "react-icons/bs";
import EmptyState, { EMPTY_STATE_TYPE } from "../EmptyState";
import Modal from "../Modal/Modal";
import Link from "next/link";
import { shallow } from "zustand/shallow";
import WelcomeBanner from "../WelcomBanner";

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

const ComboBookForm: React.FC<Props> = ({ formMode }) => {
  const [formValues, setFormValues] = useCreateComboStore(
    (state) => [state.formValues, state.setFormValues],
    shallow
  );
  const { data: genres, isLoading: genresLoading } = useQuery(
    ["genres"],
    async () => {
      const res = await axios.get<IGenre[]>(
        "https://server.boek.live/api/genres/child-genres"
      );
      return res.data;
    }
  );
  const getSelectedGenre = useCallback(
    (id: number) => {
      return genres?.find((genre) => genre.id === id);
    },
    [genres]
  );

  const [selectedGenre, setSelectedGenre] = useState<IGenre | null>(() => {
    return getSelectedGenre(Number(formValues.genreId)) ?? null;
  });

  const [selectedBooks, setSelectedBooks] = useState<typeof randomBooks>(() => {
    return formValues.selectedBooks ?? [];
  });
  const [toDeleteBook, setToDeleteBook] = useState<
    (typeof randomBooks)[0] | null
  >(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showAddBookModal, setShowAddBookModal] = useState<boolean>(false);
  const [searchBookQuery, setSearchBookQuery] = useState<string>("");

  const searchBooks = useMemo(() => {
    return randomBooks.filter((book) =>
      book?.name?.toLowerCase().includes(searchBookQuery.toLowerCase())
    );
  }, [searchBookQuery]);

  const router = useRouter();
  const form = useFormik({
    initialValues: {
      ...formValues,
    },
    validationSchema: Yup.object({
      code: Yup.string().required("Mã combo không được để trống"),
      name: Yup.string().required("Tên combo không được để trống"),
      isbn10: Yup.string()
        .length(10, "ISBN10 phải có 10 ký tự")
        .matches(/^(97(8|9))?\d{9}(\d|X)$/, "ISBN10 không hợp lệ"),
      isbn13: Yup.string()
        .length(13, "ISBN13 phải có 13 ký tự")
        .matches(
          /^(97(8|9))?\d{9}(\d|X)$/,
          "ISBN13 không hợp lệ (bắt đầu bằng 978 hoặc 979)"
        ),
      releasedYear: Yup.number()
        .required("Năm phát hành không được để trống")
        .integer("Năm phát hành phải là số nguyên")
        .min(2000, ({ min }) => `Năm phát hành phải lớn hơn hoặc bằng ${min}`)
        .max(
          new Date().getFullYear(),
          ({ max }) => `Năm phát hành phải nhỏ hơn hoặc bằng ${max}`
        ),
      coverPrice: Yup.number()
        .required("Giá bìa không được để trống")
        .min(0, ({ min }) => `Giá bìa phải lớn hơn hoặc bằng ${min}`),
      genreId: Yup.number().required("Thể loại không được để trống"),
      description: Yup.string().required("Mô tả không được để trống"),
      selectedBooks: Yup.array().min(1, "Combo phải có ít nhất 1 sách"),
    }),
    onSubmit: (values) => {
      //router.push('/issuer/campaigns');
    },
  });

  const handleAddBook = useCallback(
    (book: (typeof randomBooks)[0]) => {
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
    [form, selectedBooks]
  );

  const handleDeleteBook = useCallback(
    (book: (typeof randomBooks)[0]) => {
      setToDeleteBook(null);
      setSelectedBooks((prev) => {
        const newState = prev.filter((b) => b.id !== book.id);
        form.setFieldValue("selectedBooks", newState);
        return newState;
      });
    },
    [form]
  );

  useEffect(() => {
    setFormValues(form.values);
  }, [form.values, setFormValues]);

  return (
    <Fragment>
      <div className="mx-auto max-w-6xl overflow-hidden rounded-md bg-white">
        <WelcomeBanner label="Tạo combo mới 📚" className="p-6 sm:p-10" />
        <form className="p-6 sm:p-10" onSubmit={form.handleSubmit}>
          <Form.GroupLabel
            label={"Thông tin chung"}
            description={"Thông tin chung về combo sách"}
          />
          <div className="mt-3 space-y-4">
            <Form.Input
              placeholder={"VD: CB0001"}
              formikForm={form}
              required={true}
              fieldName={"code"}
              label={"Mã combo"}
            />
            <Form.Input
              placeholder={"VD: Cuốn Theo Chiều Gió (Trọn Bộ 2 Tập)"}
              formikForm={form}
              required={true}
              fieldName={"name"}
              label={"Tên combo (sách chủ đề)"}
            />
            <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
              <Form.Input
                placeholder={"Nhập ISBN10"}
                uppercase={true}
                maxLength={10}
                formikForm={form}
                fieldName={"isbn10"}
                label={"ISBN10"}
              />
              <Form.Input
                placeholder={"Nhập ISBN13"}
                uppercase={true}
                maxLength={13}
                formikForm={form}
                fieldName={"isbn13"}
                label={"ISBN13"}
              />
            </div>
            <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
              <Form.Input
                placeholder={"Nhập năm phát hành"}
                required={true}
                inputType={"number"}
                formikForm={form}
                fieldName={"releasedYear"}
                label={"Năm phát hành"}
              />
              <Form.Input
                placeholder={"Nhập giá bìa"}
                required={true}
                inputType={"number"}
                formikForm={form}
                fieldName={"coverPrice"}
                label={"Giá bìa (đ)"}
              />
            </div>
            <Form.Label label={"Ảnh sản phẩm"} required={true} />
            <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
              <div className="space-y-1 text-center">
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
                <div className="flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Tải ảnh lên</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF tối đa 1MB
                </p>
              </div>
            </div>
          </div>
          <Form.Divider />
          <Form.GroupLabel
            label={"Thể loại"}
            description="Thể loại chung của combo sách"
          />
          <div className="mt-3">
            <Form.Label label={"Thể loại"} required={true} />
          </div>
          <SelectBox
            placeholder={genresLoading ? "Đang tải..." : "Chọn thể loại"}
            value={selectedGenre}
            onChange={(value) => {
              if (value) {
                setSelectedGenre(value);
                form.setFieldValue("genreId", value?.id);
              }
            }}
            dataSource={genres}
            displayKey={"name"}
          />
          {form.errors.genreId && form.touched.genreId && (
            <ErrorMessage>{form.errors.genreId}</ErrorMessage>
          )}
          <Form.Divider />
          <Form.GroupLabel label={"Mô tả"} description="Mô tả về combo sách" />
          <div className="mt-3">
            <Form.Input
              placeholder={"Nhập mô tả"}
              isTextArea={true}
              formikForm={form}
              required={true}
              fieldName={"description"}
              label={"Mô tả"}
            />
          </div>

          <Form.Divider />
          <Form.GroupLabel
            label={"Chọn sách"}
            description="Chọn những sách cùng thể loại cho combo"
          />
          <div className="mt-3">
            <div className="mb-4 flex justify-end gap-4">
              <CreateButton
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
                <TableHeader>Định dạng</TableHeader>
                <TableHeader>
                  <span className="sr-only">Edit</span>
                </TableHeader>
              </TableHeading>
              <TableBody>
                {selectedBooks.length > 0 ? (
                  selectedBooks.map((book, index) => {
                    faker.datatype.boolean();
                    faker.datatype.number({
                      min: 0,
                      max: randomBooks.length - 1,
                    });
                    const fakeBook: IBookResponse = {
                      id: index,
                      code: `B${faker.datatype.number({
                        min: 10000,
                        max: 99999,
                      })}`,

                      publisher: {
                        name: faker.company.name(),
                      },
                      isbn10: faker.datatype
                        .number({
                          min: 1000000000,
                          max: 9999999999,
                        })
                        .toString(),
                      isbn13: faker.datatype
                        .number({
                          min: 1000000000000,
                          max: 9999999999999,
                        })
                        .toString(),
                      releasedYear: faker.datatype.number({
                        min: 2010,
                        max: 2022,
                      }),
                    };
                    return (
                      <tr key={index}>
                        <TableData className="text-sm font-medium uppercase text-gray-500">
                          {fakeBook.code}
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
                            <div className="max-w-56 overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                              {book.name}
                            </div>
                          </div>
                        </TableData>
                        <TableData className="text-sm font-semibold text-emerald-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(faker.datatype.number())}
                        </TableData>
                        <TableData>
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <Image
                                width={100}
                                height={100}
                                className="h-10 w-10 rounded-full"
                                src={getAvatarFromName(
                                  fakeBook.publisher?.name
                                )}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm text-gray-900">
                                {fakeBook.publisher?.name}
                              </div>
                            </div>
                          </div>
                        </TableData>
                        <TableData
                          textAlignment="text-center"
                          className="text-sm text-gray-500"
                        >
                          <select className={defaultInputClass}>
                            <option value="1">Sách giấy</option>
                            <option value="2">Sách audio</option>
                            <option value="3">Sách điện tử</option>
                          </select>
                        </TableData>
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

          <button
            type={"submit"}
            className="mt-5 inline-flex items-center gap-2 rounded bg-slate-200 py-2 px-4 text-sm font-medium text-gray-800 hover:bg-slate-300"
          >
            <span>Tạo combo</span>
          </button>
        </form>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          if (toDeleteBook) {
            handleDeleteBook(toDeleteBook);
            toast.success("Xoá sách khỏi combo thành công");
          }
          setShowDeleteModal(false);
        }}
        title={`Xoá ${toDeleteBook?.name}`}
        content={"Bạn có chắc chắn muốn xoá sách này khỏi combo?"}
        confirmText={"Xoá"}
      />

      <TransitionModal
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
      </TransitionModal>
    </Fragment>
  );
};

export default ComboBookForm;
