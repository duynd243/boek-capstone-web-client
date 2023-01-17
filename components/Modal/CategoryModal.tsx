import React, { useCallback } from "react";
import { bookCategories } from "../../pages/admin/categories";
import * as Yup from "yup";
import { useFormik } from "formik";
import TransitionModal from "./TransitionModal";
import Modal from "./Modal";
import { BsEmojiFrownFill, BsEmojiSmileFill } from "react-icons/bs";
import ToggleButton from "../ToggleButton";

export enum CategoryModalMode {
  CREATE,
  UPDATE,
}

type Props = {
  maxWidth?: string;
  action: CategoryModalMode;
  isOpen: boolean;
  onClose: () => void;
  category?: (typeof bookCategories)[0];
};

const CategoryModal: React.FC<Props> = ({
  maxWidth,
  action,
  isOpen,
  onClose,
  category,
}) => {
  const createCategorySchema = Yup.object({
    categoryName: Yup.string()
      .trim()
      .required("Tên thể loại không được để trống")
      .min(2, "Tên thể loại phải có ít nhất 2 ký tự")
      .max(50, "Tên thể loại không được vượt quá 50 ký tự"),
    categoryPercentage: Yup.number()
      .required("Mức chiết khấu không được để trống")
      .min(0, "Mức chiết khấu phải lớn hơn hoặc bằng 0")
      .max(100, "Mức chiết khấu phải nhỏ hơn hoặc bằng 100"),
  });

  const updateCategorySchema = createCategorySchema.concat(
    Yup.object({
      categoryStatus: Yup.boolean().required("Trạng thái không được để trống"),
    })
  );

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      categoryName: action === CategoryModalMode.UPDATE ? category?.name : "",
      categoryPercentage:
        action === CategoryModalMode.UPDATE ? category?.percentages : "",
      categoryStatus:
        action === CategoryModalMode.UPDATE ? category?.status : true,
    },
    validationSchema:
      action === CategoryModalMode.CREATE
        ? createCategorySchema
        : updateCategorySchema,
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
            action === CategoryModalMode.CREATE
              ? "Thêm thể loại"
              : `Cập nhật ${category?.name}`
          }
          onClose={handleOnClose}
          showCloseButton={true}
        />
        <div className="space-y-3 py-4 px-5">
          <Modal.FormInput
            placeholder="Nhập tên thể loại"
            required={true}
            formikForm={form}
            fieldName="categoryName"
            label="Tên thể loại"
          />

          <Modal.FormInput
            placeholder="Nhập mức chiết khấu"
            required={true}
            formikForm={form}
            fieldName="categoryPercentage"
            label="Mức chiết khấu (%)"
            inputType="number"
          />
          {action === CategoryModalMode.UPDATE && (
            <>
              <Modal.FormLabel
                fieldName="categoryStatus"
                label="Trạng thái"
                required={true}
              />
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`${
                      form.values.categoryStatus
                        ? "bg-green-500"
                        : "bg-rose-500"
                    } flex w-fit items-center gap-2 rounded px-2.5 py-1 text-sm text-white transition`}
                  >
                    {form.values.categoryStatus ? (
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
                    {form.values.categoryStatus
                      ? "Thể loại đang hoạt động"
                      : "Thể loại sẽ bị vô hiệu hóa"}
                  </div>
                </div>
                <ToggleButton
                  isCheck={form.values.categoryStatus || false}
                  onChange={(value) => {
                    form.setFieldValue("categoryStatus", value);
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
              // disabled={action === CategoryModalMode.CREATE ? createAuthorMutation.isLoading : updateAuthorMutation.isLoading}
              type="submit"
              className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
            >
              {action === CategoryModalMode.CREATE
                ? "Thêm thể loại"
                : "Cập nhật"}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </TransitionModal>
  );
};

export default CategoryModal;
