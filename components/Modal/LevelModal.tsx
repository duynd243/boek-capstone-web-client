import React, { useCallback } from "react";
import TransitionModal from "./TransitionModal";
import Modal from "./Modal";
import ToggleButton from "../ToggleButton";
import { ILevel } from "../../types/Level/ILevel";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { CreateLevelParams, LevelService, UpdateLevelParams } from "../../services/LevelService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

export enum LevelModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    action: LevelModalMode;
    isOpen: boolean;
    onClose: () => void;
    level?: ILevel;
    afterLeave?: () => void;
};

const LevelModal: React.FC<Props> = ({
                                         maxWidth,
                                         action,
                                         isOpen,
                                         onClose,
                                         level,
                                         afterLeave,
                                     }) => {
    const { loginUser } = useAuth();
    const levelService = new LevelService(loginUser?.accessToken);
    const queryClient = useQueryClient();

    const CreateLevelSchema = z.object({
        name: z
            .string()
            .min(2, { message: "Tên cấp độ phải có ít nhất 2 ký tự" })
            .max(50, { message: "Tên cấp độ không được vượt quá 50 ký tự" }),
        conditionalPoint: z.coerce
            .number()
            .int("Điểm yêu cầu phải là số nguyên")
            .min(0, { message: "Điểm yêu cầu phải lớn hơn hoặc bằng 0" }),
    });

    const UpdateLevelSchema = CreateLevelSchema.extend({
        status: z.boolean(),
    });

    type FormType = Partial<z.infer<typeof CreateLevelSchema>> & {
        status?: boolean;
    };

    const defaultValues: FormType = {
        name: action === LevelModalMode.UPDATE ? level?.name : "",
        conditionalPoint:
            action === LevelModalMode.UPDATE
                ? level?.conditionalPoint
                : undefined,
        status: LevelModalMode.UPDATE ? level?.status : true,
    };

    const {
        register,
        control,
        watch,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormType>({
        resolver: zodResolver(
            action === LevelModalMode.CREATE
                ? CreateLevelSchema
                : UpdateLevelSchema,
        ),
        defaultValues,
    });

    const handleOnClose = useCallback(() => {
        onClose();
        if (action === LevelModalMode.CREATE) {
            reset();
        }
    }, [onClose, action, reset]);

    const commonMutationOptions = {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["levels"]);
            handleOnClose();
        },
    };

    const createLevelMutation = useMutation(
        (level: CreateLevelParams) => levelService.createLevel(level),
        commonMutationOptions,
    );

    const updateLevelMutation = useMutation(
        (level: UpdateLevelParams) => levelService.updateLevel(level),
        commonMutationOptions,
    );

    const onSubmit = async (values: FormType) => {
        switch (action) {
            case LevelModalMode.CREATE:
                try {
                    const data = CreateLevelSchema.parse(values);
                    await toast.promise(createLevelMutation.mutateAsync(data), {
                        loading: "Đang thêm cấp độ",
                        success: "Thêm cấp độ thành công",
                        error: (err) => err?.message || "Thêm cấp độ thất bại",
                    });
                } catch (error) {
                    console.log(error);
                    return;
                }
                break;
            case LevelModalMode.UPDATE:
                if (!level) return;
                try {
                    const data = UpdateLevelSchema.parse(values);
                    await toast.promise(
                        updateLevelMutation.mutateAsync({
                            ...data,
                            id: level.id,
                        }),
                        {
                            loading: "Đang cập nhật cấp độ",
                            success: "Cập nhật cấp độ thành công",
                            error: (err) =>
                                err?.message || "Cập nhật cấp độ thất bại",
                        },
                    );
                } catch (error) {
                    console.log(error);
                    return;
                }
                break;
        }
    };

    return (
        <TransitionModal
            maxWidth={maxWidth}
            isOpen={isOpen}
            onClose={handleOnClose}
            closeOnOverlayClick={false}
            afterLeave={afterLeave}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                {isSubmitting && <Modal.Backdrop />}
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
                    <Modal.FormInput<FormType>
                        placeholder="Nhập tên cấp độ"
                        required={true}
                        register={register}
                        fieldName="name"
                        label="Tên cấp độ"
                        errorMessage={errors.name?.message}
                    />

                    <Modal.FormInput<FormType>
                        placeholder="Nhập điểm yêu cầu"
                        required={true}
                        register={register}
                        fieldName="conditionalPoint"
                        label="Điểm yêu cầu"
                        inputType={"number"}
                        errorMessage={errors.conditionalPoint?.message}
                    />
                    {action === LevelModalMode.UPDATE && (
                        <>
                            <Modal.FormLabel
                                fieldName="status"
                                label="Trạng thái"
                                required={true}
                            />
                            <div className="flex items-center justify-between">
                                <Modal.StatusSwitch
                                    enabled={watch("status") || false}
                                    enabledText="Cấp độ đang hoạt động"
                                    disabledText="Cấp độ sẽ bị vô hiệu hóa"
                                />
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <ToggleButton
                                            isCheck={watch("status") || false}
                                            onChange={(value) =>
                                                field.onChange(value)
                                            }
                                        />
                                    )}
                                />
                            </div>
                        </>
                    )}
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <Modal.SecondaryButton
                            disabled={isSubmitting}
                            type="button"
                            onClick={handleOnClose}
                        >
                            Huỷ
                        </Modal.SecondaryButton>

                        <Modal.PrimaryButton
                            disabled={
                                isSubmitting ||
                                (!isDirty && action === LevelModalMode.UPDATE)
                            }
                            type="submit"
                        >
                            {action === LevelModalMode.CREATE
                                ? isSubmitting
                                    ? "Đang thêm..."
                                    : "Thêm"
                                : isSubmitting
                                    ? "Đang lưu..."
                                    : "Cập nhật"}
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default LevelModal;
