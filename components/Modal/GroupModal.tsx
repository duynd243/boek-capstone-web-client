import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import {
    CreateGroupParams,
    GroupService,
    UpdateGroupParams,
} from "../../services/GroupService";
import { IGroup } from "../../types/Group/IGroup";
import ToggleButton from "../ToggleButton";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";

export enum GroupModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    action: GroupModalMode;
    isOpen: boolean;
    onClose: () => void;
    afterLeave?: () => void;
    group?: IGroup;
};

const GroupModal: React.FC<Props> = ({
    maxWidth,
    action,
    isOpen,
    onClose,
    afterLeave,
    group,
}) => {
    const BaseGroupSchema = z.object({
        name: z
            .string()
            .min(2, "Tên nhóm phải có ít nhất 2 ký tự")
            .max(50, "Tên nhóm không được vượt quá 50 ký tự"),
        description: z
            .string()
            .min(2, "Mô tả phải có ít nhất 2 ký tự")
            .max(50, "Mô tả không được vượt quá 50 ký tự"),
    });

    const UpdateGroupSchema = BaseGroupSchema.extend({
        id: z.number().int().positive(),
        status: z.boolean(),
    });

    type FormType = Partial<z.infer<typeof UpdateGroupSchema>>;

    const defaultValues: FormType = {
        id: group?.id,
        name: group?.name,
        description: group?.description,
        status: group?.status,
    };
    const {
        register,
        control,
        watch,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<FormType>({
        resolver: zodResolver(
            action === GroupModalMode.CREATE
                ? BaseGroupSchema
                : UpdateGroupSchema
        ),
        defaultValues,
    });

    const { loginUser } = useAuth();
    const groupService = new GroupService(loginUser?.accessToken);
    const queryClient = useQueryClient();

    const commonMutationOptions = {
        onSuccess: async () => {
            await queryClient.invalidateQueries(["groups"]);
            handleOnClose();
        },
    };

    const createGroupMutation = useMutation((data: CreateGroupParams) => {
        return groupService.createGroup(data);
    }, commonMutationOptions);

    const updateGroupMutation = useMutation((data: UpdateGroupParams) => {
        return groupService.updateGroup(data);
    }, commonMutationOptions);

    const onSubmit = async (data: FormType) => {
        switch (action) {
            case GroupModalMode.CREATE:
                try {
                    const createPayload = BaseGroupSchema.parse(data);
                    await toast.promise(
                        createGroupMutation.mutateAsync(createPayload),
                        {
                            loading: "Đang thêm nhóm",
                            success: "Thêm nhóm thành công",
                            error: (error) =>
                                error?.message || "Thêm nhóm thất bại",
                        }
                    );
                } catch (error) {
                    return;
                }
                break;
            case GroupModalMode.UPDATE:
                try {
                    const updatePayload = UpdateGroupSchema.parse(data);
                    await toast.promise(
                        updateGroupMutation.mutateAsync(updatePayload),
                        {
                            loading: "Đang cập nhật nhóm",
                            success: "Cập nhật nhóm thành công",
                            error: (error) =>
                                error?.message || "Cập nhật nhóm thất bại",
                        }
                    );
                } catch (error) {
                    return;
                }
                break;
        }
    };

    const handleOnClose = useCallback(() => {
        reset();
        onClose();
    }, [reset, onClose]);
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
                        action === GroupModalMode.CREATE
                            ? "Thêm nhóm"
                            : `Cập nhật nhóm ${group?.name}`
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="space-y-3 py-4 px-5">
                    <Modal.FormInput<FormType>
                        placeholder="Nhập tên nhóm"
                        required={true}
                        register={register}
                        fieldName="name"
                        label="Tên nhóm"
                        errorMessage={errors.name?.message}
                    />
                    <Modal.FormInput<FormType>
                        isTextArea={true}
                        placeholder="Nhập mô tả"
                        required={true}
                        register={register}
                        fieldName="description"
                        label="Mô tả"
                        errorMessage={errors.description?.message}
                    />

                    {action === GroupModalMode.UPDATE && (
                        <>
                            <Modal.FormLabel
                                fieldName="status"
                                label="Trạng thái"
                                required={true}
                            />
                            <div className="flex items-center justify-between">
                                <Modal.StatusSwitch
                                    enabled={watch("status") || false}
                                    enabledText="Nhóm đang hoạt động"
                                    disabledText="Nhóm sẽ bị vô hiệu hóa"
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
                            onClick={handleOnClose}
                            type="button"
                        >
                            Huỷ
                        </Modal.SecondaryButton>

                        <Modal.PrimaryButton
                            disabled={
                                isSubmitting ||
                                (!isDirty && action === GroupModalMode.UPDATE)
                            }
                            type="submit"
                        >
                            <Modal.SubmitTextWithLoading
                                isLoading={isSubmitting}
                                text={
                                    action === GroupModalMode.CREATE
                                        ? "Thêm nhóm"
                                        : "Cập nhật"
                                }
                                loadingText={
                                    action === GroupModalMode.CREATE
                                        ? "Đang thêm"
                                        : "Đang cập nhật"
                                }
                            />
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default GroupModal;
