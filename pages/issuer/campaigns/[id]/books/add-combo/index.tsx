import React, {Fragment, ReactElement, useMemo, useState} from 'react'
import {NextPageWithLayout} from "../../../../../_app";
import AdminLayout from "../../../../../../components/Layout/AdminLayout";
import {useRouter} from "next/router";
import FormPageLayout from "../../../../../../components/Layout/FormPageLayout";
import WelcomeBanner from "../../../../../../components/WelcomBanner";
import {FormikProvider, useFormik} from "formik";
import Form from "../../../../../../components/Form";
import * as Yup from "yup";
import SelectBox from "../../../../../../components/SelectBox";
import ErrorMessage from "../../../../../../components/Form/ErrorMessage";
import {getFormatsOfBook, getIntersectedFormatOfBooks} from "../../../../../../utils/helper";
import CreateButton from "../../../../../../components/Admin/CreateButton";
import {toast} from "react-hot-toast";
import SelectSellingBookComboModal
    from "../../../../../../components/SelectSellingBookCombo/SelectSellingBookComboModal";
import {IBook} from "../../../../../../types/Book/IBook";
import SelectSellingBookComboTable
    from "../../../../../../components/SelectSellingBookCombo/SelectSellingBookComboTable";
import {BookFormats, IBookFormat} from "../../../../../../constants/BookFormats";

const MAX_FILE_SIZE_IN_MB = 1;

export interface IBookComboItem {
    bookId: number,
    displayIndex: number,
    format: number,

    withPdf: boolean,
    withAudio: boolean,
    displayPdfIndex: number,
    displayAudioIndex: number,
}

const AddSellingBookComboPage: NextPageWithLayout = () => {
    const router = useRouter();

    const [showAddBookModal, setShowAddBookModal] = useState(false);


    const form = useFormik(
        {
            initialValues: {
                name: '',
                price: '',
                saleQuantity: '',
                description: '',
                previewImage: null,
                selectedFormat: null,
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
                selectedFormat: Yup.mixed().required("Định dạng combo là bắt buộc"),
                bookProductItems: Yup.array().min(1, 'Bạn phải chọn ít nhất 1 sản phẩm')
            }),
            onSubmit: (values) => {

            }
        }
    )


    const commonFormats = useMemo(
        () => getIntersectedFormatOfBooks(form.values.bookProductItems),
        [form.values.bookProductItems]
    );

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
    const notifyCommonFormatsChange = (newCommonFormats: IBookFormat[]) => {
        if (newCommonFormats.length !== commonFormats.length
            && form.values.selectedFormat
        ) {
            form.setFieldValue('selectedFormat', null);
            toast('Thay đổi sách đã làm thay đổi danh sách tuỳ chọn cho định dạng của combo. Vui lòng chọn lại định dạng.');
        }
    }

    const handleAddBook = (book: IBook) => {
        const item = {
            ...book,
            bookId: book?.id,
            displayIndex: 0,
            format: undefined,
            availableFormats: getFormatsOfBook(book),
            withPdf: false,
            withAudio: false,
            displayPdfIndex: 1,
            displayAudioIndex: 2,
        }
        const newCommonFormats = getIntersectedFormatOfBooks([...form.values.bookProductItems, item]);
        notifyCommonFormatsChange(newCommonFormats);
        form.setFieldValue('bookProductItems', [...form.values.bookProductItems, item]);
        setShowAddBookModal(false);
    }


    const onBonusChange = (check: boolean, bookId: number, formatId: number) => {
        const newBookProductItems = form.values.bookProductItems.map((item: IBook & IBookComboItem) => {
            if (item?.bookId === bookId) {
                if (formatId === BookFormats.PDF.id) {
                    return {
                        ...item,
                        withPdf: check,
                    }
                } else if (formatId === BookFormats.AUDIO.id) {
                    return {
                        ...item,
                        withAudio: check,
                    }
                }
            }
            return item;
        });
        form.setFieldValue('bookProductItems', newBookProductItems);
    }

    const clearAllBonuses = () => {
        const newBookProductItems = form.values.bookProductItems.map((item: IBook & IBookComboItem) => {
            return {
                ...item,
                withPdf: false,
                withAudio: false,
            }
        });
        form.setFieldValue('bookProductItems', newBookProductItems);
    }

    const availableFormatBonuses: IBookFormat[] = useMemo(() => {
        return commonFormats
            .filter(format => format.id !== (form.values.selectedFormat as unknown as IBookFormat)?.id
                && format.id !== BookFormats.PAPER.id
            )
    }, [commonFormats, form.values.selectedFormat]);

    const areAllAudioBonusesSelected = useMemo(() => {
        return form.values.bookProductItems.every((item: IBook & IBookComboItem) => item.withAudio);
    }, [form.values.bookProductItems]);

    const areAllPdfBonusesSelected = useMemo(() => {
        return form.values.bookProductItems.every((item: IBook & IBookComboItem) => item.withPdf);
    }, [form.values.bookProductItems]);


    const toggleAllBonuses = (formatId: number, check: boolean) => {
        const newBookProductItems = form.values.bookProductItems.map((item: IBook & IBookComboItem) => {
            if (formatId === BookFormats.PDF.id) {
                return {
                    ...item,
                    withPdf: check,
                }
            } else if (formatId === BookFormats.AUDIO.id) {
                return {
                    ...item,
                    withAudio: check,
                }
            }
            return item;
        });
        form.setFieldValue('bookProductItems', newBookProductItems);
    }

    const handleRemoveBook = (book: (IBook & IBookComboItem)) => {
        const newBookProductItems = form.values.bookProductItems.filter((item: IBook & IBookComboItem) => item.bookId !== book.bookId);
        const newCommonFormats = getIntersectedFormatOfBooks(newBookProductItems);
        notifyCommonFormatsChange(newCommonFormats);
        form.setFieldValue('bookProductItems', newBookProductItems);

    }


    return (

        <Fragment>
            <FormPageLayout>
                <WelcomeBanner label={'Thêm sách combo cho sự kiện Tri ân thầy cô 📚'} className="p-6 sm:p-10"/>
                <div>
                    <FormikProvider value={form}>
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
                                        value={form.values.selectedFormat}
                                        onChange={(value) => {
                                            form.setFieldValue("selectedFormat", value);
                                            if (value && value.id !== (form.values.selectedFormat as unknown as IBookFormat)?.id) {
                                                clearAllBonuses();
                                            }
                                        }}
                                        dataSource={commonFormats}
                                        displayKey={"displayName"}
                                    />
                                    {form.values.bookProductItems.length === 0 &&
                                        <div className="mt-1 text-gray-500 text-sm">Danh sách định dạng chỉ khả dụng khi
                                            bạn
                                            thêm ít nhất 01 sách vào combo.</div>}
                                    {form.errors.selectedFormat && form.touched.selectedFormat && (
                                        <ErrorMessage>{form.errors.selectedFormat}</ErrorMessage>
                                    )}
                                </div>
                                <div>
                                    <Form.Label label={"Tặng kèm"}/>
                                    <div className="grid sm:grid-cols-2">
                                        {form.values.selectedFormat ? (availableFormatBonuses?.length > 0 ? availableFormatBonuses.map((format) => (
                                                <div key={format.id} className="relative flex items-start">
                                                    <div className="flex h-5 items-center">
                                                        <input
                                                            id={`bonus-${format.id}`}
                                                            name="bonus"
                                                            type="checkbox"
                                                            checked={format.id === BookFormats.PDF.id && areAllPdfBonusesSelected
                                                                || format.id === BookFormats.AUDIO.id && areAllAudioBonusesSelected
                                                            }
                                                            value={format.id}
                                                            onChange={(e) => {
                                                                toggleAllBonuses(format.id, e.target.checked);
                                                            }
                                                            }
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        />
                                                    </div>
                                                    <div className="ml-3 text-sm">
                                                        <label
                                                            htmlFor={`bonus-${format.id}`}
                                                            className="text-sm font-medium text-gray-600"
                                                        >
                                                            Tất cả sách {format?.displayName} trong series
                                                        </label>
                                                    </div>
                                                </div>
                                            )) :
                                            <div className="text-gray-500 text-sm">Không tìm thấy tặng kèm hàng loạt khả
                                                dụng.</div>) : (
                                            <div className="text-gray-500 text-sm">Bạn cần chọn định dạng để xem được
                                                các mục tặng kèm khả dụng.</div>
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
                                <SelectSellingBookComboTable
                                    selectedFormat={form.values.selectedFormat}
                                    selectedBooks={form.values.bookProductItems}
                                    onBonusChange={onBonusChange}
                                    handleRemoveBook={handleRemoveBook}/>

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
                    </FormikProvider>
                </div>
            </FormPageLayout>
            <SelectSellingBookComboModal
                isOpen={showAddBookModal}
                onClose={() => setShowAddBookModal(false)}
                selectedBooks={form.values.bookProductItems}
                onItemSelect={handleAddBook}/>
        </Fragment>
    )
}

AddSellingBookComboPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AddSellingBookComboPage