import React, { useCallback } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import TransitionModal from "./TransitionModal";
import Modal from "./Modal";
import {
  BsEmojiFrownFill,
  BsEmojiSmileFill,
  BsFillBriefcaseFill,
  BsShieldFillCheck,
} from "react-icons/bs";
import ToggleButton from "../ToggleButton";
import { ProfilePicture } from "../../pages/admin/settings";
import { IFakeCustomer } from "../../pages/admin/customers";

export enum CustomerModalMode {
  CREATE,
  UPDATE,
}

type Props = {
  maxWidth?: string;
  action: CustomerModalMode;
  isOpen: boolean;
  onClose: () => void;
  customer?: IFakeCustomer;
};

const fakeRoles = [
  {
    id: 1,
    name: "Quản trị viên",
    icon: BsShieldFillCheck,
  },
  {
    id: 2,
    name: "Nhân viên",
    icon: BsFillBriefcaseFill,
  },
];

const CustomerModal: React.FC<Props> = ({
  maxWidth,
  action,
  isOpen,
  onClose,
  customer,
}) => {
  // name?: string;
  // email?: string;
  // address?: string;
  // phone?: string;
  // status?: boolean;
  // imageUrl?: string;

  const createCustomerSchema = Yup.object({
    customerName: Yup.string()
      .trim()
      .required("Tên khách hàng không được để trống")
      .min(2, "Tên khách hàng phải có ít nhất 2 ký tự")
      .max(50, "Tên khách hàng không được vượt quá 50 ký tự"),
    customerEmail: Yup.string()
      .trim()
      .required("Email không được để trống")
      .email("Email không hợp lệ"),
    customerPhone: Yup.string()
      .trim()
      .required("Số điện thoại không được để trống")
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ"),
    customerAddress: Yup.string()
      .trim()
      .required("Địa chỉ không được để trống")
      .min(2, "Địa chỉ phải có ít nhất 2 ký tự")
      .max(250, "Địa chỉ không được vượt quá 50 ký tự"),
  });

  const updateCustomerSchema = createCustomerSchema.concat(
    Yup.object({
      customerStatus: Yup.boolean().required("Trạng thái không được để trống"),
    })
  );

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      customerName: action === CustomerModalMode.UPDATE ? customer?.name : "",
      customerEmail: action === CustomerModalMode.UPDATE ? customer?.email : "",
      customerPhone: action === CustomerModalMode.UPDATE ? customer?.phone : "",
      customerAddress:
        action === CustomerModalMode.UPDATE ? customer?.address : "",
      customerStatus:
        action === CustomerModalMode.UPDATE ? customer?.status : true,
    },
    validationSchema:
      action === CustomerModalMode.CREATE
        ? createCustomerSchema
        : updateCustomerSchema,
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
            action === CustomerModalMode.CREATE
              ? "Thêm khách hàng"
              : `Cập nhật ${customer?.name} (${customer?.code})`
          }
          onClose={handleOnClose}
          showCloseButton={true}
        />
        <div className="space-y-3 py-4 px-5">
          <Modal.FormLabel label="Ảnh đại diện" />
          <ProfilePicture />
          <Modal.FormInput
            placeholder="Nhập tên khách hàng"
            required={true}
            formikForm={form}
            fieldName="customerName"
            label="Tên khách hàng"
          />
          <Modal.FormInput
            placeholder="Nhập email"
            required={true}
            formikForm={form}
            fieldName="customerEmail"
            label="Địa chỉ email"
          />
          <Modal.FormInput
            placeholder="Nhập số điện thoại"
            required={true}
            formikForm={form}
            fieldName="customerPhone"
            label="Số điện thoại"
          />
          <Modal.FormInput
            isTextArea={true}
            placeholder="Nhập địa chỉ"
            required={true}
            formikForm={form}
            fieldName="customerAddress"
            label="Địa chỉ"
          />
          {action === CustomerModalMode.UPDATE && (
            <>
              <Modal.FormLabel
                fieldName="customerStatus"
                label="Trạng thái"
                required={true}
              />
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`${
                      form.values.customerStatus
                        ? "bg-green-500"
                        : "bg-rose-500"
                    } flex w-fit items-center gap-2 rounded px-2.5 py-1 text-sm text-white transition`}
                  >
                    {form.values.customerStatus ? (
                      <>
                        Hoạt động <BsEmojiSmileFill />
                      </>
                    ) : (
                      <>
                        Không hoạt động <BsEmojiFrownFill />
                      </>
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-700">
                    {form.values.customerStatus
                      ? "Khách hàng đang hoạt động"
                      : "Khách hàng sẽ bị vô hiệu hóa"}
                  </div>
                </div>
                <ToggleButton
                  isCheck={form.values.customerStatus || false}
                  onChange={(value) => {
                    form.setFieldValue("customerStatus", value);
                  }}
                />
              </div>
            </>
          )}
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
              // disabled={action === CustomerModalMode.CREATE ? createAuthorMutation.isLoading : updateAuthorMutation.isLoading}
              type="submit"
              className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
            >
              {action === CustomerModalMode.CREATE
                ? "Thêm khách hàng"
                : "Cập nhật"}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </TransitionModal>
  );
};

export default CustomerModal;
