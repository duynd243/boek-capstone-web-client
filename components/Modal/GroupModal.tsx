import React, { useCallback } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import TransitionModal from "./TransitionModal";
import Modal from "./Modal";

export enum GroupModalMode {
  CREATE,
  UPDATE,
}

type Props = {
  maxWidth?: string;
  action: GroupModalMode;
  isOpen: boolean;
  onClose: () => void;
  group?: {
    code?: string;
    name?: string;
  };
};

const GroupModal: React.FC<Props> = ({
  maxWidth,
  action,
  isOpen,
  onClose,
  group,
}) => {
  const categorySchema = Yup.object({
    groupName: Yup.string()
      .trim()
      .required("Tên nhóm không được để trống")
      .min(2, "Tên nhóm phải có ít nhất 2 ký tự")
      .max(50, "Tên nhóm không được vượt quá 50 ký tự"),
  });

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      groupName: action === GroupModalMode.UPDATE ? group?.name : "",
    },
    validationSchema: categorySchema,
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
            action === GroupModalMode.CREATE
              ? "Thêm nhóm"
              : `Cập nhật ${group?.name}`
          }
          onClose={handleOnClose}
          showCloseButton={true}
        />
        <div className="space-y-3 py-4 px-5">
          <Modal.FormInput
            placeholder="Nhập tên nhóm"
            required={true}
            formikForm={form}
            fieldName="groupName"
            label="Tên nhóm"
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
              // disabled={action === GroupModalMode.CREATE ? createAuthorMutation.isLoading : updateAuthorMutation.isLoading}
              type="submit"
              className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
            >
              {action === GroupModalMode.CREATE ? "Thêm nhóm" : "Cập nhật"}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </TransitionModal>
  );
};

export default GroupModal;
