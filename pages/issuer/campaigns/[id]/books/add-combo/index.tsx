import React, {Fragment, ReactElement, useState} from 'react'
import {NextPageWithLayout} from "../../../../../_app";
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import {useRouter} from "next/router";
import {fakeBookSeries, randomBooks} from "../../../../../admin/books";
import FormPageLayout from "../../../../../../components/Layout/FormPageLayout";
import WelcomeBanner from "../../../../../../components/WelcomBanner";
import {useFormik} from "formik";
import Form from "../../../../../../components/Form";
import Image from "next/image";
import * as Yup from "yup";
import SelectBox from "../../../../../../components/SelectBox";
import ErrorMessage from "../../../../../../components/Form/ErrorMessage";
import TableWrapper from "../../../../../../components/Admin/Table/TableWrapper";
import TableHeading from "../../../../../../components/Admin/Table/TableHeading";
import TableHeader from "../../../../../../components/Admin/Table/TableHeader";
import TableBody from "../../../../../../components/Admin/Table/TableBody";
import TableData from "../../../../../../components/Admin/Table/TableData";
import {faker} from "@faker-js/faker/locale/vi";
import {getAvatarFromName} from "../../../../../../utils/helper";
import CreateButton from "../../../../../../components/Admin/CreateButton";
import {BsSearch} from "react-icons/bs";
import EmptyState, {EMPTY_STATE_TYPE} from "../../../../../../components/EmptyState";
import Modal from "../../../../../../components/Modal/Modal";
import Link from "next/link";
import TransitionModal from "../../../../../../components/Modal/TransitionModal";
import {toast} from "react-hot-toast";

const fullFormats = [{
    id: 1,
    name: 'Sách giấy'
}, {
    id: 2,
    name: 'PDF'
}, {
    id: 3,
    name: 'Audio'
}];
const MAX_FILE_SIZE_IN_MB = 1;

function getFormatOptions(book: typeof fakeBookSeries[number] | undefined) {
    if (!book) {
        return [];
    }
    if (book?.fullPdfAndAudio) {
        return fullFormats;
    }
    if (book?.onlyPdf) {
        return fullFormats.filter(o => o.name !== 'Audio');
    }
    if (book?.onlyAudio) {
        return fullFormats.filter(o => o.name !== 'PDF');
    }
    return fullFormats.filter(o => o.name === 'Sách giấy');
}

const AddSellingBookComboPage: NextPageWithLayout = () => {
    const router = useRouter();
    const bookId = router.query['book-id'];
    const bookSeries = fakeBookSeries.find(b => b.id === Number(bookId));

    const [selectedBooks, setSelectedBooks] = useState<typeof randomBooks>([]);
    const [showAddBookModal, setShowAddBookModal] = useState(false);
    const [searchBookQuery, setSearchBookQuery] = useState('');
    const searchBooks = randomBooks.filter(b => b?.name?.toLowerCase().includes(searchBookQuery.toLowerCase()));

    const handleAddBook = (book: typeof randomBooks[number]) => {
        if (selectedBooks.find(b => b.id === book.id)) {
            return;
        }
        setSelectedBooks([...selectedBooks, book]);
        setShowAddBookModal(false);
    }


    const availableFormats = getFormatOptions(bookSeries);
    const [selectedFormat, setSelectedFormat] = useState<typeof fullFormats[number] | null>(availableFormats?.length === 1 ? availableFormats[0] : null);

    const availableBonuses = availableFormats.filter((format) => format.id !== selectedFormat?.id && format.name !== 'Sách giấy');
    console.log(availableFormats);


    const [selectedBonus, setSelectedBonus] = useState<number[]>([]);

    const handleAddBonus = (bonusId: number) => {
        if (selectedBonus.includes(bonusId)) {
            setSelectedBonus(selectedBonus.filter(b => b !== bonusId));
        } else {
            setSelectedBonus([...selectedBonus, bonusId]);
        }
    }

    const handleRemoveBonus = (bonusId: number) => {
        setSelectedBonus(selectedBonus.filter(b => b !== bonusId));
    }


    const form = useFormik(
        {
            initialValues: {
                name: '',
                price: '',
                saleQuantity: '',
                description: '',
                previewImage: null,
                format: '',
                bookProductItems: []
            },
            validationSchema: Yup.object({
                name: Yup.string().required('Tên combo không được để trống'),
                description: Yup.string().trim().required("Mô tả không được để trống"),
                price: Yup.number()
                    .required('Giá bán không được để trống')
                    .integer('Giá bán phải là số nguyên')
                    .min(0, ({min}) => `Giá bán tối thiểu là ${min}`)
                ,
                saleQuantity: Yup.number()
                    .required('Số lượng bán không được để trống')
                    .min(1, ({min}) => `Số lượng bán tối thiểu là ${min}`)
                    .integer('Số lượng bán phải là số nguyên'),
                previewImage: Yup.mixed().required("Ảnh sản phẩm là bắt buộc"),
                format: Yup.number()
                    .required('Định dạng không được để trống'),
                bookProductItems: Yup.array().min(1, 'Bạn phải chọn ít nhất 1 sản phẩm')
            }),
            onSubmit: (values) => {

            }
        }
    )


    const onImageChange = (file: File): boolean => {
        // check file type
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng tải lên tệp hình ảnh");
            return false;
        }
        // check file size
        if (file.size > 1024 * 1024 * MAX_FILE_SIZE_IN_MB) {
            toast.error(`Vui lòng tải lên tệp nhỏ hơn ${MAX_FILE_SIZE_IN_MB}MB`);
            return false;
        }
        form.setFieldValue("previewImage", file);
        return true;
    };

    const onImageRemove = () => {
        form.setFieldValue("previewImage", null);
    };


    return (

        <Fragment>


            <FormPageLayout>
                <WelcomeBanner label={'Thêm sách combo cho sự kiện Tri ân thầy cô 📚'} className="p-6 sm:p-10"/>
                <div>
                    <form className="p-6 sm:p-10" onSubmit={form.handleSubmit}>
                        <Form.GroupLabel
                            label={"Thông tin chung"}
                            description={"Thông tin cơ bản về sách"}
                        />


                        <div className="mt-4 space-y-4">
                            <Form.Input
                                required={true}
                                placeholder={"VD: Combo sách giáo khoa 6"}
                                formikForm={form}
                                fieldName={"name"}
                                label={"Tên combo"}
                            />
                            <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
                                <Form.Input
                                    required={true}
                                    inputType={'number'}
                                    placeholder={"VD: 10,000"}
                                    formikForm={form}
                                    fieldName={"price"}
                                    label={"Giá bán (đ)"}
                                />
                                <Form.Input
                                    inputType={'number'}
                                    placeholder={"Nhập số lượng sách sẽ được bán"}
                                    formikForm={form}
                                    required={true}
                                    fieldName={"saleQuantity"}
                                    label={"Số lượng"}
                                />
                            </div>
                            <Form.Label label={"Ảnh sản phẩm"} required={true}/>
                            <Form.ImageUploadPanel
                                label={`PNG, JPG, GIF tối đa ${MAX_FILE_SIZE_IN_MB}MB`}
                                onChange={onImageChange}
                                onRemove={onImageRemove}
                            />
                            {form.errors.previewImage && form.touched.previewImage && (
                                <ErrorMessage>{form.errors.previewImage}</ErrorMessage>
                            )}
                            <Form.Input
                                isTextArea={true}
                                placeholder={"Nhập mô tả cho combo sách"}
                                formikForm={form}
                                required={true}
                                fieldName={"description"}
                                label={"Mô tả"}
                            />
                        </div>
                        <Form.Divider/>
                        <Form.GroupLabel
                            label={"Định dạng"}
                            description={"Định dạng sách sẽ bán và tặng kèm"}
                        />
                        <div className="mt-3 space-y-4">
                            <div>
                                <Form.Label required={true} label={"Định dạng sách"}/>
                                <SelectBox
                                    placeholder={"Chọn định dạng"}
                                    value={selectedFormat}
                                    onChange={(value) => {
                                        if (value) {
                                            setSelectedFormat(value);
                                            form.setFieldValue("format", value?.id);
                                        }
                                    }}
                                    dataSource={availableFormats}
                                    displayKey={"name"}
                                />
                                {form.values.bookProductItems.length === 0 &&
                                    <div className="mt-1 text-gray-500 text-sm">Danh sách định dạng chỉ khả dụng khi bạn
                                        thêm ít nhất 01 sách vào combo.</div>}
                                {form.errors.format && form.touched.format && (
                                    <ErrorMessage>{form.errors.format}</ErrorMessage>
                                )}
                            </div>
                            <div>
                                <Form.Label label={"Tặng kèm"}/>
                                <div className="grid sm:grid-cols-2">
                                    {selectedFormat ? (availableBonuses?.length > 0 ? availableBonuses.map((format) => (
                                        <div key={format.id} className="relative flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id={`bonus-${format.id}`}
                                                    name="bonus"
                                                    type="checkbox"
                                                    value={format.id}
                                                    onChange={(event => {
                                                        if (event.target.checked) {
                                                            handleAddBonus(format.id);
                                                        } else {
                                                            handleRemoveBonus(format.id);
                                                        }
                                                    })
                                                    }
                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor={`bonus-${format.id}`}
                                                    className="text-sm font-medium text-gray-600"
                                                >
                                                    Tất cả sách {format.name} trong series
                                                </label>
                                            </div>
                                        </div>
                                    )) : <div className="text-gray-500 text-sm">Không tìm thấy tặng kèm khả
                                        dụng.</div>) : (
                                        <div className="text-gray-500 text-sm">Bạn cần chọn định dạng để xem được các
                                            mục
                                            tặng kèm khả dụng.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <Form.Divider/>
                        <Form.GroupLabel
                            label={"Chọn sách combo"}
                            description={"Chọn sách combo để bán"}
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
                                    <TableHeader>Giá bìa</TableHeader>
                                    <TableHeader>Nhà xuất bản</TableHeader>
                                    <TableHeader>Tặng kèm</TableHeader>
                                </TableHeading>
                                <TableBody>
                                    {selectedBooks.length > 0 ? (
                                        selectedBooks.map((book, index) => {
                                            return (
                                                <tr key={index}>
                                                    <TableData className="text-sm font-medium uppercase text-gray-500">
                                                        {book?.code}
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
                                                        }).format(faker.datatype.number())}
                                                    </TableData>
                                                    <TableData>
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0">
                                                                <Image
                                                                    width={100}
                                                                    height={100}
                                                                    className="h-10 w-10 rounded-full"
                                                                    src={getAvatarFromName('Nhã Nam')}
                                                                    alt=""
                                                                />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm text-gray-900">
                                                                    Nhã Nam
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableData>
                                                    <TableData
                                                        textAlignment="text-center"
                                                        className="text-sm text-gray-500"
                                                    >
                                                        <div className='space-y-4'>
                                                            {availableBonuses?.map((format) => (
                                                                <div
                                                                    className="relative flex items-center gap-2"
                                                                    key={format.id}>
                                                                    <input
                                                                        id={`bonus-${format.id}-b${book.id}`}
                                                                        name={`bonus-${index}`}
                                                                        type="checkbox"
                                                                        value={format.id}
                                                                        checked={selectedBonus.includes(format.id)}
                                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                    />
                                                                    <label
                                                                        htmlFor={`bonus-${format.id}-b${book.id}`}
                                                                        className="text-sm font-medium text-gray-600"
                                                                    >
                                                                        {format.name} - <span
                                                                        className="text-emerald-600 font-medium">
                                                                    {new Intl.NumberFormat("vi-VN", {
                                                                        style: "currency",
                                                                        currency: "VND",
                                                                    }).format(faker.datatype.number())}</span>

                                                                    </label>
                                                                </div>
                                                            ))}
                                                        </div>
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

                        </div>
                        <Form.Divider/>
                        <div className='flex justify-end gap-4'>
                            <button className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                                Hủy
                            </button>
                            <button type="submit" className="m-btn text-white bg-indigo-600 hover:bg-indigo-700">
                                Thêm vào hội sách
                            </button>
                        </div>
                    </form>
                </div>
            </FormPageLayout>
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
                        <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"/>
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
                                                <div
                                                    className="mb-1 w-fit rounded bg-blue-500 py-1 px-2 text-xs text-white">
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
    )
}

AddSellingBookComboPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AddSellingBookComboPage