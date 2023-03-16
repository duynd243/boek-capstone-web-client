import React, {ReactElement, useState} from 'react'
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

const AddSellingBookSeriesPage: NextPageWithLayout = () => {
    const router = useRouter();
    const bookId = router.query['book-id'];
    // const bookSeries = fakeBookSeries.find(b => b.id === Number(bookId));

    const [selectedBooks, setSelectedBooks] = useState<typeof randomBooks>(randomBooks);


    //const availableFormats = getFormatOptions(bookSeries);
    //const [selectedFormat, setSelectedFormat] = useState<typeof fullFormats[number] | null>(availableFormats?.length === 1 ? availableFormats[0] : null);

    // const availableBonuses = availableFormats.filter((format) => format.id !== selectedFormat?.id && format.name !== 'Sách giấy');
    // console.log(availableFormats);


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
                discount: 0,
                saleQuantity: '',
                format: '',
                bookProductItems: []
            },
            validationSchema: Yup.object({
                discount: Yup.number()
                    .min(0, ({min}) => `Phần trăm giảm giá tối thiểu là ${min}`)
                    .max(100, ({max}) => `Phần trăm giảm giá tối đa là ${max}`)
                    .integer('Phần trăm giảm giá phải là số nguyên'),
                saleQuantity: Yup.number()
                    .required('Số lượng bán không được để trống')
                    .min(1, ({min}) => `Số lượng bán tối thiểu là ${min}`)
                    .integer('Số lượng bán phải là số nguyên'),
                format: Yup.number()
                    .required('Định dạng không được để trống'),
                bookProductItems: Yup.array().min(1, 'Bạn phải chọn ít nhất 1 sản phẩm')
            }),
            onSubmit: (values) => {

            }
        }
    )


    return (
        <FormPageLayout>
            <WelcomeBanner label={'Thêm sách series cho sự kiện Tri ân thầy cô 📚'} className="p-6 sm:p-10"/>
            <div>
                <form className="p-6 sm:p-10" onSubmit={form.handleSubmit}>
                    <Form.GroupLabel
                        label={"Thông tin chung"}
                        description={"Thông tin cơ bản về sách"}
                    />
                    <div className='mt-3 space-y-4 md:space-y-0 md:flex gap-6'>
                        <Image
                            width={1000}
                            height={1000}
                            className={'rounded-md w-64 h-72 object-cover max-w-full shadow-md'}
                            src={faker.image.imageUrl() || ''} alt={''}/>
                        <div>
                            <div
                                className='mb-2 bg-blue-500 text-sm font-medium text-white py-2 px-3 w-fit rounded'>S81239
                            </div>
                            <h1 className="mb-2 text-2xl font-medium text-slate-800">{'bookSeries?.name'}</h1>
                            <div className="text-gray-500">NXB: {'ABC'}</div>


                            {/* Price */}
                            <div className="text-emerald-600 font-medium text-xl mt-3">{
                                new Intl.NumberFormat('vi-VN', {
                                    style: 'currency',
                                    currency: 'VND'
                                }).format(145500)
                            }</div>

                            {/* Description */}
                            <div className="mt-3 text-sm text-gray-500">
                                {'bookSeries?.description'}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 space-y-4">
                        <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
                            <Form.Input
                                inputType={'number'}
                                placeholder={"Giảm giá"}

                                fieldName={"discount"}
                                label={"Giảm giá (%)"}
                            />
                            <Form.Input
                                inputType={'number'}
                                placeholder={"Nhập số lượng sách sẽ được bán"}

                                required={true}
                                fieldName={"saleQuantity"}
                                label={"Số lượng"}
                            />
                        </div>
                    </div>
                    <Form.Divider/>
                    <Form.GroupLabel
                        label={"Định dạng"}
                        description={"Định dạng sách sẽ bán và tặng kèm"}
                    />
                    <div className="mt-3 space-y-4">
                        <div>
                            <Form.Label required={true} label={"Định dạng sách"}/>
                            {/*<SelectBox*/}
                            {/*    placeholder={"Chọn định dạng"}*/}
                            {/*    value={selectedFormat}*/}
                            {/*    onChange={(value) => {*/}
                            {/*        if (value) {*/}
                            {/*            setSelectedFormat(value);*/}
                            {/*            form.setFieldValue("format", value?.id);*/}
                            {/*        }*/}
                            {/*    }}*/}
                            {/*    dataSource={availableFormats}*/}
                            {/*    displayKey={"name"}*/}
                            {/*/>*/}
                            {form.errors.format && form.touched.format && (
                                <ErrorMessage>{form.errors.format}</ErrorMessage>
                            )}
                        </div>
                        <div>
                            <Form.Label label={"Tặng kèm"}/>
                            <div className="grid sm:grid-cols-2">
                                {/*{selectedFormat ? (availableBonuses?.length > 0 ? availableBonuses.map((format) => (*/}
                                {/*    <div key={format.id} className="relative flex items-start">*/}
                                {/*        <div className="flex h-5 items-center">*/}
                                {/*            <input*/}
                                {/*                id={`bonus-${format.id}`}*/}
                                {/*                name="bonus"*/}
                                {/*                type="checkbox"*/}
                                {/*                value={format.id}*/}
                                {/*                onChange={(event => {*/}
                                {/*                    if (event.target.checked) {*/}
                                {/*                        handleAddBonus(format.id);*/}
                                {/*                    } else {*/}
                                {/*                        handleRemoveBonus(format.id);*/}
                                {/*                    }*/}
                                {/*                })*/}
                                {/*                }*/}
                                {/*                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"*/}
                                {/*            />*/}
                                {/*        </div>*/}
                                {/*        <div className="ml-3 text-sm">*/}
                                {/*            <label*/}
                                {/*                htmlFor={`bonus-${format.id}`}*/}
                                {/*                className="text-sm font-medium text-gray-600"*/}
                                {/*            >*/}
                                {/*                Tất cả sách {format.name} trong series*/}
                                {/*            </label>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*)) : <div className="text-gray-500 text-sm">Không tìm thấy tặng kèm khả dụng.</div>) : (*/}
                                {/*    <div className="text-gray-500 text-sm">Bạn cần chọn định dạng để xem được các mục*/}
                                {/*        tặng kèm khả dụng.</div>*/}
                                {/*)}*/}
                            </div>
                        </div>
                    </div>

                    <Form.Divider/>
                    <Form.GroupLabel
                        label={"Chọn sách series"}
                        description={"Chọn sách series để bán"}
                    />
                    <div className="mt-3">
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
                                                                src={getAvatarFromName(
                                                                    bookSeries?.publisher
                                                                )}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm text-gray-900">
                                                                {bookSeries?.publisher}
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
                            Thêm sách
                        </button>
                    </div>
                </form>
            </div>
        </FormPageLayout>
    )
}

AddSellingBookSeriesPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default AddSellingBookSeriesPage