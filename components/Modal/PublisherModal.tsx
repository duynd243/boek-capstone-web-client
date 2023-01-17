import React, { memo, useCallback } from "react";
import { IPublisher } from "../../old-types/user/IPublisher";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";

export enum PublisherModalMode {
  CREATE,
  UPDATE,
}

type Props = {
  maxWidth?: string;
  action: PublisherModalMode;
  isOpen: boolean;
  onClose: () => void;
  publisher?: IPublisher;
};

const PublisherModal: React.FC<Props> = ({
  maxWidth,
  action,
  isOpen,
  onClose,
  publisher,
}) => {
  const publisherSchema = Yup.object({
    publisherName: Yup.string()
      .trim()
      .required("Tên nhà xuất bản không được để trống")
      .min(2, "Tên nhà xuất bản phải có ít nhất 2 ký tự")
      .max(50, "Tên nhà xuất bản không được vượt quá 50 ký tự"),
    publisherEmail: Yup.string()
      .trim()
      .required("Email không được để trống")
      .email("Email không hợp lệ"),
    publisherPhone: Yup.string()
      .trim()
      .required("Số điện thoại không được để trống")
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ"),
    publisherAddress: Yup.string()
      .trim()
      .required("Địa chỉ không được để trống")
      .min(2, "Địa chỉ phải có ít nhất 2 ký tự")
      .max(250, "Địa chỉ không được vượt quá 50 ký tự"),
  });

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      publisherName:
        action === PublisherModalMode.UPDATE ? publisher?.name : "",
      publisherEmail:
        action === PublisherModalMode.UPDATE ? publisher?.email : "",
      publisherPhone:
        action === PublisherModalMode.UPDATE ? publisher?.phoneNumber : "",
      publisherAddress:
        action === PublisherModalMode.UPDATE ? publisher?.address : "",
    },
    validationSchema: publisherSchema,
    onSubmit: async (values) => {
      if (!form.dirty && action === PublisherModalMode.UPDATE) {
        toast.error("Chưa có thay đổi nào");
        return;
      }
      // const payload = {
      //     id: author?.id,
      //     name: values.authorName,
      // };
      //
      // switch (action) {
      //     case PublisherModalMode.CREATE:
      //         await toast.promise(createAuthorMutation.mutateAsync(payload), {
      //             loading: "Đang thêm tác giả",
      //             success: () => "Thêm tác giả thành công",
      //             error: (error) => error?.message,
      //         });
      //         break;
      //     case PublisherModalMode.UPDATE:
      //         await toast.promise(updateAuthorMutation.mutateAsync(payload), {
      //             loading: "Đang cập nhật tác giả",
      //             success: () => "Cập nhật tác giả thành công",
      //             error: (error) => error?.message,
      //         });
      //         break;
      // }
    },
  });

  const handleOnClose = useCallback(() => {
    form.resetForm();
    onClose();
  }, [form, onClose]);
  return (
    <TransitionModal
      maxWidth={maxWidth}
      isOpen={isOpen}
      onClose={handleOnClose}
      closeOnOverlayClick={false}
    >
      <form onSubmit={form.handleSubmit}>
        <Modal.Header
          title={
            action === PublisherModalMode.CREATE
              ? "Thêm nhà xuất bản"
              : `Cập nhật ${publisher?.name} (${publisher?.code})`
          }
          onClose={handleOnClose}
          showCloseButton={true}
        />
        <div className="space-y-3 py-4 px-5">
          <Modal.FormInput
            placeholder="Nhập tên nhà xuất bản"
            required={true}
            formikForm={form}
            fieldName="publisherName"
            label="Tên nhà xuất bản"
          />
          <Modal.FormInput
            placeholder="Nhập email"
            required={true}
            formikForm={form}
            fieldName="publisherEmail"
            label="Địa chỉ email"
          />
          <Modal.FormInput
            placeholder="Nhập số điện thoại"
            required={true}
            formikForm={form}
            fieldName="publisherPhone"
            label="Số điện thoại"
          />
          <Modal.FormInput
            isTextArea={true}
            placeholder="Nhập địa chỉ"
            required={true}
            formikForm={form}
            fieldName="publisherAddress"
            label="Địa chỉ"
          />
        </div>
        <Modal.Footer>
          <div className="flex flex-wrap justify-end space-x-2">
            <button
              //disabled={updateAuthorMutation.isLoading}
              onClick={handleOnClose}
              type="button"
              className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
            >
              Huỷ
            </button>

            <button
              // disabled={action === PublisherModalMode.CREATE ? createAuthorMutation.isLoading : updateAuthorMutation.isLoading}
              type="submit"
              className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
            >
              {action === PublisherModalMode.CREATE ? "Thêm NXB" : "Cập nhật"}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </TransitionModal>
  );
};

export default memo(PublisherModal);
