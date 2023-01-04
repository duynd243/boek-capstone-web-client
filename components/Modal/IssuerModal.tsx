import React, { memo, useCallback } from "react";
import { IFakeIssuer } from "../../pages/admin/issuers";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Switch } from "@headlessui/react";
import ToggleButton from "../ToggleButton";
import { BsEmojiFrownFill, BsEmojiSmileFill } from "react-icons/bs";
import { ProfilePicture } from "../../pages/admin/settings";

export enum IssuerModalMode {
  CREATE,
  UPDATE,
}

type Props = {
  maxWidth?: string;
  action: IssuerModalMode;
  isOpen: boolean;
  onClose: () => void;
  issuer?: IFakeIssuer;
};

const IssuerModal: React.FC<Props> = ({
  maxWidth,
  action,
  isOpen,
  onClose,
  issuer,
}) => {
  const createIssuerSchema = Yup.object({
    issuerName: Yup.string()
      .trim()
      .required("Tên nhà phát hành không được để trống")
      .min(2, "Tên nhà phát hành phải có ít nhất 2 ký tự")
      .max(50, "Tên nhà phát hành không được vượt quá 50 ký tự"),
    issuerEmail: Yup.string()
      .trim()
      .required("Email không được để trống")
      .email("Email không hợp lệ"),
    issuerPhone: Yup.string()
      .trim()
      .required("Số điện thoại không được để trống")
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ"),
    issuerAddress: Yup.string()
      .trim()
      .required("Địa chỉ không được để trống")
      .min(2, "Địa chỉ phải có ít nhất 2 ký tự")
      .max(250, "Địa chỉ không được vượt quá 50 ký tự"),
    issuerTaxCode: Yup.string()
      .trim()
      .min(2, "Mã số thuế phải có ít nhất 2 ký tự")
      .max(10, "Mã số thuế không được vượt quá 10 ký tự"),
  });

  const updateIssuerSchema = createIssuerSchema.concat(
    Yup.object({
      issuerStatus: Yup.boolean().required("Trạng thái không được để trống"),
    })
  );

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      issuerName: action === IssuerModalMode.UPDATE ? issuer?.name : "",
      issuerEmail: action === IssuerModalMode.UPDATE ? issuer?.email : "",
      issuerPhone: action === IssuerModalMode.UPDATE ? issuer?.phone : "",
      issuerAddress: action === IssuerModalMode.UPDATE ? issuer?.address : "",
      issuerTaxCode: action === IssuerModalMode.UPDATE ? issuer?.taxCode : "",
      issuerStatus: action === IssuerModalMode.UPDATE ? issuer?.status : true,
    },
    validationSchema:
      action === IssuerModalMode.CREATE
        ? createIssuerSchema
        : updateIssuerSchema,
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
            action === IssuerModalMode.CREATE
              ? "Thêm nhà phát hành"
              : `Cập nhật ${issuer?.name} (${issuer?.code})`
          }
          onClose={handleOnClose}
          showCloseButton={true}
        />
        <div className="space-y-3 py-4 px-5">
          <Modal.FormLabel label="Ảnh đại diện" />
          <ProfilePicture />
          <Modal.FormInput
            placeholder="Nhập tên nhà phát hành"
            required={true}
            formikForm={form}
            fieldName="issuerName"
            label="Tên nhà phát hành"
          />
          <Modal.FormInput
            placeholder="Nhập email"
            required={true}
            formikForm={form}
            fieldName="issuerEmail"
            label="Địa chỉ email"
          />
          <Modal.FormInput
            placeholder="Nhập mã số thuế"
            required={false}
            formikForm={form}
            fieldName="issuerTaxCode"
            label="Mã số thuế"
          />
          <Modal.FormInput
            placeholder="Nhập số điện thoại"
            required={true}
            formikForm={form}
            fieldName="issuerPhone"
            label="Số điện thoại"
          />
          <Modal.FormInput
            isTextArea={true}
            placeholder="Nhập địa chỉ"
            required={true}
            formikForm={form}
            fieldName="issuerAddress"
            label="Địa chỉ"
          />
          {action === IssuerModalMode.UPDATE && (
            <>
              <Modal.FormLabel
                fieldName="issuerStatus"
                label="Trạng thái"
                required={true}
              />
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`${
                      form.values.issuerStatus ? "bg-green-500" : "bg-rose-500"
                    } flex w-fit items-center gap-2 rounded px-2.5 py-1 text-sm text-white transition`}
                  >
                    {form.values.issuerStatus ? (
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
                    {form.values.issuerStatus
                      ? "Nhà phát hành đang hoạt động"
                      : "Nhà phát hành sẽ bị vô hiệu hóa"}
                  </div>
                </div>
                <ToggleButton
                  isCheck={form.values.issuerStatus || false}
                  onChange={(value) => {
                    form.setFieldValue("issuerStatus", value);
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
              // disabled={action === IssuerModalMode.CREATE ? createAuthorMutation.isLoading : updateAuthorMutation.isLoading}
              type="submit"
              className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
            >
              {action === IssuerModalMode.CREATE ? "Thêm NPH" : "Cập nhật"}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </TransitionModal>
  );
};

export default memo(IssuerModal);
