import React, { useCallback } from "react";
import { IFakeOrganization } from "../../pages/admin/organizations";
import * as Yup from "yup";
import { useFormik } from "formik";
import TransitionModal from "./TransitionModal";
import Modal from "./Modal";
import { ProfilePicture } from "../../pages/admin/settings";

export enum OrganizationModalMode {
  CREATE,
  UPDATE,
}

type Props = {
  maxWidth?: string;
  action: OrganizationModalMode;
  isOpen: boolean;
  onClose: () => void;
  organization?: IFakeOrganization;
};

const OrganizationModal: React.FC<Props> = ({
  maxWidth,
  action,
  isOpen,
  onClose,
  organization,
}) => {
  // name?: string;
  // address?: string;
  // phone?: string;
  // imageUrl?: string;
  const organizationSchema = Yup.object({
    organizationName: Yup.string()
      .trim()
      .required("Tên tổ chức không được để trống")
      .min(2, "Tên tổ chức phải có ít nhất 2 ký tự")
      .max(50, "Tên tổ chức không được vượt quá 50 ký tự"),
    organizationPhone: Yup.string()
      .trim()
      .required("Số điện thoại không được để trống")
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ"),
    organizationAddress: Yup.string()
      .trim()
      .required("Địa chỉ không được để trống")
      .min(2, "Địa chỉ phải có ít nhất 2 ký tự")
      .max(250, "Địa chỉ không được vượt quá 50 ký tự"),
  });

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      organizationName:
        action === OrganizationModalMode.UPDATE ? organization?.name : "",
      organizationPhone:
        action === OrganizationModalMode.UPDATE ? organization?.phone : "",
      organizationAddress:
        action === OrganizationModalMode.UPDATE ? organization?.address : "",
    },
    validationSchema: organizationSchema,
    onSubmit: async (values) => {},
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
            action === OrganizationModalMode.CREATE
              ? "Thêm tổ chức"
              : `Cập nhật ${organization?.name}`
          }
          onClose={handleOnClose}
          showCloseButton={true}
        />
        <div className="space-y-3 py-4 px-5">
          <Modal.FormLabel label="Ảnh đại diện" />
          <ProfilePicture />
          <Modal.FormInput
            placeholder="Nhập tên tổ chức"
            required={true}
            formikForm={form}
            fieldName="organizationName"
            label="Tên tổ chức"
          />

          <Modal.FormInput
            placeholder="Nhập số điện thoại"
            required={true}
            formikForm={form}
            fieldName="organizationPhone"
            label="Số điện thoại"
          />
          <Modal.FormInput
            isTextArea={true}
            placeholder="Nhập địa chỉ"
            required={true}
            formikForm={form}
            fieldName="organizationAddress"
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
              // disabled={action === OrganizationModalMode.CREATE ? createAuthorMutation.isLoading : updateAuthorMutation.isLoading}
              type="submit"
              className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
            >
              {action === OrganizationModalMode.CREATE
                ? "Thêm tổ chức"
                : "Cập nhật"}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </TransitionModal>
  );
};

export default OrganizationModal;
