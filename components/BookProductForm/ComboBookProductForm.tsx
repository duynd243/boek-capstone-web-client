import React from 'react'
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { IoChevronBack } from 'react-icons/io5';
import Form from '../Form';
import Image from 'next/image';
import { IBookProduct } from '../../types/Book/IBookProduct';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { getBookProductsFormatOptions, isImageFile, isValidFileSize } from '../../utils/helper';
import { BookFormats, getBookFormatById, IBookFormat } from './../../constants/BookFormats';
import { Controller } from 'react-hook-form';
import SelectBox from './../SelectBox/index';
import ErrorMessage from './../Form/ErrorMessage';
import { IBook } from '../../types/Book/IBook';
import { toast } from 'react-hot-toast';
import { BookProductService } from '../../services/BookProductService';
import { useAuth } from '../../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import CreateButton from "../../components/Admin/CreateButton";

import TableWrapper from './../Admin/Table/TableWrapper';
import TableHeading from './../Admin/Table/TableHeading';
import TableHeader from './../Admin/Table/TableHeader';
import TableBody from './../Admin/Table/TableBody';
import TableData from './../Admin/Table/TableData';
import { IGenre } from '../../types/Genre/IGenre';
import { useQuery } from '@tanstack/react-query';
import { GenreService } from '../../services/GenreService';
import { useState } from 'react';
import { ImageUploadService } from '../../services/ImageUploadService';
import { CampaignService } from './../../services/CampaignService';
import { useMemo } from 'react';
import { Fragment } from 'react';
import SelectSellingBookComboModal from '../SelectSellingBookCombo/SelectSellingBookComboModal';
import ConfirmModal from './../Modal/ConfirmModal';
import { useContext } from 'react';
import { CampaignContext } from './../../context/CampaignContext';
import { useEffect } from 'react';
import { BookProductStatuses } from '../../constants/BookProductStatuses';
import { CampaignStatuses } from './../../constants/CampaignStatuses';
import useEditBookProduct from './useEditBookProduct';

type Props = {
  product: IBookProduct;
  action: 'create' | 'create-old' | 'update';
  editBasicInfoOnly?: boolean;
}

const ComboBookProductForm = ({ product, action, editBasicInfoOnly = false }: Props) => {
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toDeleteBook, setToDeleteBook] = useState<Partial<IBook> & { bookId?: number } | null>(null);

  const { loginUser } = useAuth();
  const queryClient = useQueryClient();

  const { editBasicInfoMutation } = useEditBookProduct();

  const router = useRouter();
  const bookProductService = new BookProductService(loginUser?.accessToken);
  const genreService = new GenreService();
  const imageService = new ImageUploadService(loginUser?.accessToken);
  const uploadImageMutation = useMutation((file: File) =>
    imageService.uploadImage(file)
  );


  // const bookOdd = randomBooks.find(b => b.id === Number(bookId));
  const issuerCampaignService = new CampaignService(
    loginUser?.accessToken
  );


  const campaignIdForOldCombo = router.query['id'];


  const campaign = useContext(CampaignContext);


  function getMinimalCommission(genreId: number) {
    return campaign?.campaignCommissions?.find(c => c.genreId === genreId)?.minimalCommission || 0;
  }



  const parentGenresOfCampaign = useMemo(() => campaign?.campaignCommissions?.map(c => c.genre) || [], [campaign]);


  // const { data: childGenres } = useQuery(
  //   ["child-genres", product?.campaignId],
  //   () => genreService.getChildGenres({
  //     status: true
  //   }), {
  //   select: (data) => {
  //     return data?.filter(g => {
  //       return parentGenresOfCampaign?.findIndex(p => p?.id === g.parentId) !== -1
  //     })
  //   }
  // },
  // );

  const UpdateComboBookProductSchema = z.object({
    id: z.string(),
    campaignId: z.number(),
    genreId: z.number(),
    title: z.string(),
    description: z.string(),
    imageUrl: z.string(),
    format: z.number(),
    status: z.number(),
    salePrice: z.coerce.number().min(1),
    saleQuantity: z.coerce.number().min(1),
    commission: z.coerce.number().min(0).max(100),
    previewFile: z.instanceof(File).optional(),
    bookProductItems: z.array(
      z.object({
        bookId: z.number(),
        // format: z.number(),
        displayIndex: z.number(),
        withPdf: z.boolean().default(false),
        displayPdfIndex: z.number(),
        withAudio: z.boolean().default(false),
        displayAudioIndex: z.number(),
        coverPrice: z.number().optional(),
        name: z.string().optional(),
        pdfExtraPrice: z.coerce.number().optional(),
        audioExtraPrice: z.coerce.number().optional(),

        code: z.string().optional(),
        imageUrl: z.string().optional()
      })
    )
  })

  type FormType = Partial<z.infer<typeof UpdateComboBookProductSchema>>;




  const defaultValues: FormType = {
    id: product?.id,
    campaignId: campaign?.id,
    title: product?.title,
    saleQuantity: product?.saleQuantity || 0,
    salePrice: product?.salePrice || 0,
    commission: action === 'update' ? product?.commission : action === 'create-old' ? getMinimalCommission(product?.genreId) : 0,
    format: action === 'update' ? product?.format : undefined,
    status: product?.status,
    description: product?.description,
    genreId: product?.genreId,
    imageUrl: product?.imageUrl,
    bookProductItems: product?.bookProductItems?.map(i => {
      return {
        "bookId": i?.bookId,
        "format": i?.format,
        "displayIndex": i?.displayIndex,
        "withPdf": i?.withPdf,
        "displayPdfIndex": i?.displayPdfIndex || 1,
        "withAudio": i?.withAudio,
        "displayAudioIndex": i?.displayAudioIndex || 2,
        book: {
          "bookId": i?.bookId,
          name: i?.book?.name,
          pdfExtraPrice: i?.pdfExtraPrice,
          audioExtraPrice: i?.audioExtraPrice,
          code: i?.book?.code,
          imageUrl: i?.book?.imageUrl,
          coverPrice: i?.book?.coverPrice
        }
      }
    }) || []
  };

  const { register, reset, watch, control, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormType>({
    resolver: zodResolver(UpdateComboBookProductSchema),
    defaultValues,
  });


  useEffect(() => {
    if (campaign?.id) {
      reset(v => ({
        ...v,
        campaignId: campaign?.id
      }))

      if (action === 'create-old' && product?.genreId) {
        setValue('commission', getMinimalCommission(product?.genreId))
      }
    }
  }, [campaign?.id])





  const updateComboBookMutation = useMutation((data: any) => {
    return bookProductService.updateComboBookProductByIssuer(data)
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['issuer_product']);
      await router.push(`/issuer/products`);
    }
  });

  const createComboBookFromOldComboMutation = useMutation((data: any) => {
    return bookProductService.createComboBookProductByIssuer(data)
  }, {
    onSuccess: async () => {
      await queryClient.invalidateQueries(['issuer_product']);
      await router.push(`/issuer/products`);
    }
  });


  const handleDeleteBook = (book: Partial<IBook> & { bookId?: number }) => {
    const currentBookProductItems = [...watch("bookProductItems") || []];
    const newBookProductItems = currentBookProductItems.filter(i => i.bookId !== book?.bookId);
    setValue("bookProductItems", newBookProductItems);
    setToDeleteBook(null)
  }

  const handleAddBookItem = (i: IBook) => {
    const currentBookProductItems = [...watch("bookProductItems") || []];
    const newBookProductItem = {
      "bookId": i?.id,
      "displayIndex": currentBookProductItems?.length + 1 || 0,
      "withPdf": false,
      "displayPdfIndex": 1,
      "withAudio": false,
      "displayAudioIndex": 2,
      book: {
        "bookId": i?.id,
        name: i?.name,
        pdfExtraPrice: i?.pdfExtraPrice,
        audioExtraPrice: i?.audioExtraPrice,
        code: i?.code,
        imageUrl: i?.imageUrl,
        coverPrice: i?.coverPrice
      }
    };
    setValue("bookProductItems", [...currentBookProductItems, newBookProductItem]);
    setShowAddBookModal(false)
  }





  const onSubmit = async (data: FormType) => {

    if (data.previewFile) {
      try {
        await toast.promise(uploadImageMutation.mutateAsync(data.previewFile), {
          loading: "Đang tải ảnh lên",
          success: (res) => {
            data.imageUrl = res?.url;
            return "Tải ảnh lên thành công";
          },
          error: "Tải ảnh lên thất bại",
        });
      } catch (error) {
        console.log(error);
        return;
      }
    }
    if (editBasicInfoOnly) {
      try {
        const payload = {
          id: data.id,
          saleQuantity: data.saleQuantity,
          status: 3
        };

        // payload.commission = 10;
        await toast.promise(editBasicInfoMutation.mutateAsync({
          ...payload,
        }), {
          loading: "Đang cập nhập sách",
          success: () => {
            return "Cập nhập sách thành công";
          },
          error: (err) => err?.message || "Cập nhập sách thất bại",
        });
        console.log(payload)
      } catch (error) {
        console.log(error);
        return;
      }
    }
    // alert(JSON.stringify(data));
    else if (action === 'update') {
      try {
        const payload = UpdateComboBookProductSchema.parse(data);

        // payload.commission = 10;

        console.log(JSON.stringify(payload));
        await toast.promise(updateComboBookMutation.mutateAsync({
          ...payload,
          bookProductItems: payload.bookProductItems.map((i) => {
            return {
              ...i,
              format: payload.format,
              // displayIndex: index,
              // displayPdfIndex: index,
              // displayAudioIndex: index,
            }
          })
        }), {
          loading: "Đang cập nhập sách",
          success: () => {
            return "Cập nhập sách thành công";
          },
          error: (err) => err?.message || "Cập nhập sách thất bại",
        });
        console.log(payload)
      } catch (error) {
        console.log(error);
        return;
      }
    }

    else if (action === 'create-old') {
      try {
        const payload = UpdateComboBookProductSchema.parse(data);

        // payload.commission = 10;

        console.log(JSON.stringify(payload));
        await toast.promise(createComboBookFromOldComboMutation.mutateAsync({
          ...payload,
          bookProductItems: payload.bookProductItems.map((i) => {
            return {
              ...i,
              format: payload.format,
              // displayIndex: index,
              // displayPdfIndex: index,
              // displayAudioIndex: index,
            }
          })
        }), {
          loading: "Đang thêm sách",
          success: () => {
            return "Thêm sách thành công";
          },
          error: (err) => err?.message || "Thêm sách thất bại",
        });
        console.log(payload)
      } catch (error) {
        console.log(error);
        return;
      }
    }
  }


  const availableFormats = getBookProductsFormatOptions({
    ...product?.book,
    fullPdfAndAudio: true,
  } as (IBook | undefined), campaign?.format);
  const selectedFormat = getBookFormatById(watch('format'));

  const availableBonuses = availableFormats.filter((format) => format.id !== selectedFormat?.id && format.id !== BookFormats.PAPER.id);
  console.log(errors);

  const clearAllBonuses = () => {
    const currentBookProductItems = [...watch("bookProductItems") || []];

    setValue("bookProductItems", currentBookProductItems.map(i => {
      return {
        ...i,
        withAudio: false,
        withPdf: false,
      }
    }));
  }

  const clearAllSelectedBooks = () => {
    if (watch("bookProductItems") !== undefined && watch("bookProductItems")?.length > 0) {
      toast("Tất cả sách đã chọn sẽ bị xóa khi bạn chọn lại thể loại sách");
    }
    setValue("bookProductItems", []);

  }
  const selectedgenreId = parentGenresOfCampaign?.find(g => g?.id === watch('genreId'));
  const selectedBookItems = watch("bookProductItems") || [];



  return (

    <Fragment>
      <div>
        <form className="p-6 sm:p-10" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <button
              type="button"
              className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
              onClick={() => router.back()}
            >
              <IoChevronBack size={"17"} />
              <span>Quay lại</span>
            </button>
          </div>
          <Form.GroupLabel
            label={"Thông tin chung"}
            description={"Thông tin cơ bản về combo"}
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
                <Controller
                  control={control}
                  name="previewFile"
                  render={({ field }) => (
                    <Form.ImageUploadPanel
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

                        field.onChange(file)
                        return true;
                      }}
                      defaultImageURL={product?.imageUrl} />
                  )}
                />
              </div>
              <div className="sm:col-span-4">
                <Form.Input<FormType>
                  placeholder={
                    "VD: Combo Sách giáo khoa 6, 7, 8"
                  }
                  register={register}
                  fieldName={"title"}
                  label="Tên combo"
                  required={true}
                  disabled={editBasicInfoOnly}
                  errorMessage={errors.title?.message}
                />
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-2">
                    <Form.Input<FormType>
                      register={register}
                      required={true}
                      disabled={editBasicInfoOnly}
                      inputType={'number'}
                      placeholder={"Giá bán"}
                      fieldName={"salePrice"}
                      label={"Giá bán (đ) "}
                      errorMessage={errors?.salePrice?.message}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Form.Input<FormType>
                      register={register}
                      required={true}
                      inputType={'number'}
                      disabled={editBasicInfoOnly}
                      placeholder={"Chiết khấu"}
                      fieldName={"commission"}
                      label={"Chiết khấu (%)"}
                      errorMessage={errors?.commission?.message}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Form.Input<FormType>
                      register={register}
                      required={true}
                      inputType={'number'}
                      placeholder={"Số lượng"}
                      fieldName={"saleQuantity"}
                      label={"Số lượng"}
                      errorMessage={errors?.saleQuantity?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Form.Divider />
          <Form.GroupLabel
            label={"Định dạng"}
            description={"Định dạng sách sẽ bán và tặng kèm"}
          />
          <div className="mt-3 space-y-4">
            <div>
              <Form.Label required={true} label={"Định dạng combo"} />
              <Controller
                control={control}
                name="format"
                render={({ field }) => (
                  <SelectBox<IBookFormat>
                    placeholder={"Chọn định dạng"}
                    value={selectedFormat || null}
                    disabled={editBasicInfoOnly}
                    onValueChange={(value) => {
                      if (value) {
                        field.onChange(value.id);
                        clearAllBonuses()
                      }
                    }}
                    dataSource={availableFormats}
                    displayKey={"displayName"}
                  />
                )}

              />
              <ErrorMessage>{errors.format?.message}</ErrorMessage>
            </div>
            <div>
              <Form.Label label={"Tặng kèm"} />
              <div className="grid sm:grid-cols-2">
                {/* {form.values.selectedFormat ? (availableFormatBonuses?.length > 0 ? availableFormatBonuses.map((format) => (
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
                                    )} */}
              </div>
            </div>
          </div>

          <Form.Divider />
          <Form.GroupLabel
            label={"Thể loại"}
            description={"Thể loại chung cho các sách được chọn vào combo"}
          />
          <div className='mt-3 '>
            <Form.Label required={true} label={"Thể loại combo"} />
            <Controller
              control={control}
              name="genreId"
              render={({ field }) => (
                <SelectBox<IGenre>
                  disabled={action === 'create-old' || editBasicInfoOnly}
                  placeholder={"Chọn thể loại"}
                  value={selectedgenreId || null}
                  onValueChange={(value) => {
                    if (value) {
                      field.onChange(value.id);
                      clearAllSelectedBooks();
                      clearAllBonuses();
                      // clear all selected books
                    }
                  }}
                  dataSource={parentGenresOfCampaign as IGenre[]}
                  displayKey={"name"}
                />
              )}

            />
            <ErrorMessage>{errors.format?.message}</ErrorMessage>
          </div>

          <Form.Divider />
          <Form.GroupLabel
            label={"Chọn sách combo"}
            description={"Chọn sách combo để bán"}
          />
          <div className="mt-3">
            <div className="mb-4 flex justify-end gap-4">
              <CreateButton
                disabled={!watch("genreId") || editBasicInfoOnly}
                label={"Thêm sách"}
                onClick={() => {
                  setShowAddBookModal(true);
                }}
              />
            </div>
            <div className="mt-3">
              <TableWrapper>
                <TableHeading>
                  <TableHeader>Mã sách</TableHeader>
                  <TableHeader>Tên sách</TableHeader>
                  <TableHeader>Giá bìa</TableHeader>
                  {/* <TableHeader>Nhà xuất bản</TableHeader> */}
                  <TableHeader>Tặng kèm</TableHeader>
                </TableHeading>
                <TableBody>
                  {selectedBookItems.length > 0 ? (
                    selectedBookItems?.map((book, index) => {
                      return (
                        <tr key={index}>
                          <TableData className="text-sm font-medium uppercase text-gray-500">
                            {book?.book?.code}
                          </TableData>
                          <TableData className="max-w-72">
                            <div className="flex items-center gap-4">
                              <Image
                                width={500}
                                height={500}
                                className="h-20 w-16 object-cover"
                                src={book?.book?.imageUrl || ""}
                                alt=""
                              />
                              <div
                                className="max-w-56 overflow-hidden text-ellipsis text-sm font-medium text-gray-900">
                                {book?.book?.name}
                              </div>
                            </div>
                          </TableData>
                          <TableData className="text-sm font-semibold text-emerald-600">
                            {book?.book?.coverPrice} ₫
                          </TableData>
                          {/* <TableData>
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 flex-shrink-0">
                                                            <Image
                                                                width={100}
                                                                height={100}
                                                                className="h-10 w-10 rounded-full"
                                                                src={book?.book?.publisher?.imageUrl || getAvatarFromName(book?.book?.publisher?.name)}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm text-gray-900">
                                                                {book?.book?.publisher?.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </TableData> */}
                          <TableData
                            textAlignment="text-center"
                            className="text-sm text-gray-500"
                          >

                            {watch("format") &&
                              <>

                                {availableBonuses?.length > 0 ? availableBonuses?.map((format) => {
                                  const registerName = format.id === BookFormats.PDF.id ?
                                    `bookProductItems.${index}.withPdf` as const :
                                    `bookProductItems.${index}.withAudio` as const;
                                  const extraPrice = format.id === BookFormats.PDF.id ?
                                    book?.book?.pdfExtraPrice : book?.book?.audioExtraPrice

                                  return (
                                    <div
                                      key={format.id}
                                      className="relative flex items-center gap-2">
                                      <input
                                        id={`bonus-${format.id}-b${book.id}`}
                                        type="checkbox"
                                        {...register(registerName)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <label
                                        htmlFor={`bonus-${format.id}-b${book.id}`}
                                        className="text-sm font-medium text-gray-600"
                                      >
                                        {format.displayName} - <span
                                          className="text-emerald-600 font-medium">
                                          {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                          }).format(extraPrice)}</span>

                                      </label>
                                    </div>
                                  )
                                })
                                  : <div className="text-gray-500 text-sm">-</div>}
                              </>
                            }

                            {!watch("format") && <div>Bạn cần chọn định dạng để xem được các mục tặng kèm khả dụng.</div>}

                          </TableData>
                          <TableData>
                            <button
                              disabled={editBasicInfoOnly}
                              type='button'
                              onClick={() => {
                                setToDeleteBook(book?.book);
                                setShowDeleteModal(true);
                              }}
                              className="text-rose-600 hover:text-rose-800 disabled:opacity-50"
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

            </div>
            {/* <SelectSellingBookComboTable
                                selectedFormat={form.values.selectedFormat}
                                selectedBooks={form.values.bookProductItems}
                                onBonusChange={onBonusChange}
                                handleRemoveBook={handleRemoveBook} /> */}

          </div>
          <Form.Divider />
          <Form.GroupLabel label="Mô tả" />
          <Form.Input<FormType>
            isTextArea={true}
            required={true}
            label="Mô tả"
            disabled={editBasicInfoOnly}
            register={register}
            fieldName="description"
            errorMessage={errors.description?.message}
          />
          <div className='flex justify-end gap-4'>
            <button className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
              Hủy
            </button>
            <button type="submit" className="m-btn text-white bg-indigo-600 hover:bg-indigo-700">
              {action === 'update' ? 'Cập nhập combo' : 'Thêm vào hội sách'}
            </button>
          </div>
          <pre>{JSON.stringify(watch(), null, 2)}</pre>
        </form>
      </div>
      <SelectSellingBookComboModal
        isOpen={showAddBookModal}
        onClose={() => setShowAddBookModal(false)}
        genreId={watch('genreId')}
        selectedBooks={selectedBookItems}
        onItemSelect={(b) => {
          handleAddBookItem(b)
        }} />

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
    </Fragment>
  )
}

export default ComboBookProductForm