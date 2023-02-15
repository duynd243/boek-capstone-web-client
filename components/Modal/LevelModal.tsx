import React, { useCallback } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import TransitionModal from "./TransitionModal";
import Modal from "./Modal";
import { BsEmojiFrownFill, BsEmojiSmileFill } from "react-icons/bs";
import ToggleButton from "../ToggleButton";
import { customerLevels } from "../../pages/admin/customers";

export enum LevelModalMode {
  CREATE,
  UPDATE,
}

type Props = {
  maxWidth?: string;
  action: LevelModalMode;
  isOpen: boolean;
  onClose: () => void;
  level?: (typeof customerLevels)[0];
};

const LevelModal: React.FC<Props> = ({
  maxWidth,
  action,
  isOpen,
  onClose,
  level,
}) => {
  const createLevelSchema = Yup.object({
    levelName: Yup.string()
      .trim()
      .required("Tên cấp độ không được để trống")
      .min(2, "Tên cấp độ phải có ít nhất 2 ký tự")
      .max(50, "Tên cấp độ không được vượt quá 50 ký tự"),
    levelRequiredPoint: Yup.number()
      .required("Điểm yêu cầu không được để trống")
      .integer("Điểm yêu cầu phải là số nguyên")
      .min(0, "Điểm yêu cầu phải lớn hơn hoặc bằng 0"),
  });

  const updateLevelSchema = createLevelSchema.concat(
    Yup.object({
      levelStatus: Yup.boolean().required("Trạng thái không được để trống"),
    })
  );

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      levelName: action === LevelModalMode.UPDATE ? level?.name : "",
      levelRequiredPoint:
        action === LevelModalMode.UPDATE ? level?.requiredPoint : "",
      levelStatus: true,
    },
    validationSchema:
      action === LevelModalMode.CREATE ? createLevelSchema : updateLevelSchema,
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
            action === LevelModalMode.CREATE
              ? "Thêm cấp độ"
              : `Cập nhật cấp độ ${level?.name}`
          }
          onClose={handleOnClose}
          showCloseButton={true}
        />
        <div className="space-y-3 py-4 px-5">
          <Modal.FormInputOld
            placeholder="Nhập tên cấp độ"
            required={true}
            formikForm={form}
            fieldName="levelName"
            label="Tên cấp độ"
          />

          <Modal.FormInputOld
            placeholder="Nhập điểm yêu cầu"
            required={true}
            formikForm={form}
            fieldName="levelRequiredPoint"
            label="Điểm yêu cầu"
            inputType="number"
          />
          {action === LevelModalMode.UPDATE && (
            <>
              <Modal.FormLabel
                fieldName="levelStatus"
                label="Trạng thái"
                required={true}
              />
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className={`${
                      form.values.levelStatus ? "bg-green-500" : "bg-rose-500"
                    } flex w-fit items-center gap-2 rounded px-2.5 py-1 text-sm text-white transition`}
                  >
                    {form.values.levelStatus ? (
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
                    {form.values.levelStatus
                      ? "Cấp độ đang hoạt động"
                      : "Cấp độ sẽ bị vô hiệu hóa"}
                  </div>
                </div>
                <ToggleButton
                  isCheck={form.values.levelStatus || false}
                  onChange={(value) => {
                    form.setFieldValue("levelStatus", value);
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
              // disabled={action === LevelModalMode.CREATE ? createAuthorMutation.isLoading : updateAuthorMutation.isLoading}
              type="submit"
              className="m-btn bg-indigo-500 text-white hover:bg-indigo-600 disabled:bg-indigo-500"
            >
              {action === LevelModalMode.CREATE ? "Thêm cấp độ" : "Cập nhật"}
            </button>
          </div>
        </Modal.Footer>
      </form>
    </TransitionModal>
  );
};

export default LevelModal;
