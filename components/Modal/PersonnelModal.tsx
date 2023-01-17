import React, { useCallback } from "react";
import { IFakePersonnel } from "../../pages/admin/personnels";
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
import { RadioGroup } from "@headlessui/react";
import ErrorMessage from "../Form/ErrorMessage";
import { ProfilePicture } from "../../pages/admin/settings";

export enum PersonnelModalMode {
  CREATE,
  UPDATE,
}

type Props = {
  maxWidth?: string;
  action: PersonnelModalMode;
  isOpen: boolean;
  onClose: () => void;
  personnel?: IFakePersonnel;
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

const PersonnelModal: React.FC<Props> = ({
  maxWidth,
  action,
  isOpen,
  onClose,
  personnel,
}) => {
  const createPersonnelSchema = Yup.object({
    personnelName: Yup.string()
      .trim()
      .required("Tên nhân sự không được để trống")
      .min(2, "Tên nhân sự phải có ít nhất 2 ký tự")
      .max(50, "Tên nhân sự không được vượt quá 50 ký tự"),
    personnelEmail: Yup.string()
      .trim()
      .required("Email không được để trống")
      .email("Email không hợp lệ"),
    personnelPhone: Yup.string()
      .trim()
      .required("Số điện thoại không được để trống")
      .matches(/^[0-9]+$/, "Số điện thoại không hợp lệ"),
    personnelAddress: Yup.string()
      .trim()
      .required("Địa chỉ không được để trống")
      .min(2, "Địa chỉ phải có ít nhất 2 ký tự")
      .max(250, "Địa chỉ không được vượt quá 50 ký tự"),
    personnelRole: Yup.string().trim().required("Vai trò không được để trống"),
  });

  const updatePersonnelSchema = createPersonnelSchema.concat(
    Yup.object({
      personnelStatus: Yup.boolean().required("Trạng thái không được để trống"),
    })
  );

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      personnelName:
        action === PersonnelModalMode.UPDATE ? personnel?.name : "",
      personnelEmail:
        action === PersonnelModalMode.UPDATE ? personnel?.email : "",
      personnelPhone:
        action === PersonnelModalMode.UPDATE ? personnel?.phone : "",
      personnelAddress:
        action === PersonnelModalMode.UPDATE ? personnel?.address : "",
      personnelStatus:
        action === PersonnelModalMode.UPDATE ? personnel?.status : true,
      personnelRole:
        action === PersonnelModalMode.UPDATE ? personnel?.role : "",
    },
    validationSchema:
      action === PersonnelModalMode.CREATE
        ? createPersonnelSchema
        : updatePersonnelSchema,
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
            action === PersonnelModalMode.CREATE
              ? "Thêm nhân sự"
              : `Cập nhật ${personnel?.name} (${personnel?.code})`
          }
          onClose={handleOnClose}
          showCloseButton={true}
        />
        <div className="space-y-3 py-4 px-5">
          <Modal.FormLabel label="Ảnh đại diện" />
          <ProfilePicture />
          <Modal.FormInput
            placeholder="Nhập tên nhân sự"
            required={true}
            formikForm={form}
            fieldName="personnelName"
            label="Tên nhân sự"
          />
          <Modal.FormInput
            placeholder="Nhập email"
            required={true}
            formikForm={form}
            fieldName="personnelEmail"
            label="Địa chỉ email"
          />
          <Modal.FormInput
            placeholder="Nhập số điện thoại"
            required={true}
            formikForm={form}
            fieldName="personnelPhone"
            label="Số điện thoại"
          />
          <Modal.FormInput
            isTextArea={true}
            placeholder="Nhập địa chỉ"
            required={true}
            formikForm={form}
            fieldName="personnelAddress"
            label="Địa chỉ"
          />
          {action === PersonnelModalMode.UPDATE && (
            <>
              <Modal.FormLabel
                fieldName="personnelStatus"
                label="Trạng thái"
                required={true}
              />
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`${
                      form.values.personnelStatus
                        ? "bg-green-500"
                        : "bg-rose-500"
                    } flex w-fit items-center gap-2 rounded px-2.5 py-1 text-sm text-white transition`}
                  >
                    {form.values.personnelStatus ? (
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
                    {form.values.personnelStatus
                      ? "Nhân sự đang hoạt động"
                      : "Nhân sự sẽ bị vô hiệu hóa"}
                  </div>
                </div>
                <ToggleButton
                  isCheck={form.values.personnelStatus || false}
                  onChange={(value) => {
                    form.setFieldValue("personnelStatus", value);
                  }}
                />
              </div>
            </>
          )}

          <Modal.FormLabel
            fieldName="personnelStatus"
            label="Vai trò"
            required={true}
          />
          <RadioGroup
            className="grid gap-2.5 sm:grid-cols-2"
            value={form.values.personnelRole}
            onChange={(value) => {
              form.setFieldValue("personnelRole", value);
            }}
          >
            {fakeRoles.map((role) => (
              <RadioGroup.Option key={role.id} value={role.id}>
                {({ checked }) => (
                  <div
                    className={`${
                      checked
                        ? "bg-gradient-to-l from-blue-500 to-blue-600 text-white"
                        : "border bg-white text-slate-600"
                    } relative flex cursor-pointer items-center gap-3 rounded-lg px-5 py-4 text-sm font-medium focus:outline-none`}
                  >
                    <role.icon className="h-5 w-5"></role.icon>
                    {role.name}
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </RadioGroup>
          {form.errors.personnelRole && form.touched.personnelRole && (
            <ErrorMessage>{form.errors.personnelRole}</ErrorMessage>
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
              // disabled={action === PersonnelModalMode.CREATE ? createAuthorMutation.isLoading : updateAuthorMutation.isLoading}
              type="submit"
              className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
            >
              {action === PersonnelModalMode.CREATE
                ? "Thêm nhân sự"
                : "Cập nhật"}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </TransitionModal>
  );
};

export default PersonnelModal;
