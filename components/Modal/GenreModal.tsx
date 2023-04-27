import React, { memo } from "react";
import TransitionModal from "./TransitionModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import Modal from "./Modal";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IGenre } from "../../types/Genre/IGenre";
import { toast } from "react-hot-toast";
import { GenreService } from "../../services/GenreService";
import ToggleButton from "../ToggleButton";

export enum GenreModalMode {
    CREATE,
    UPDATE,
}

type Props = {
    maxWidth?: string;
    action: GenreModalMode;
    isOpen: boolean;
    onClose: () => void;
    afterLeave?: () => void;
    genre?: IGenre;
    parentId?: number;
    title?: string;
};

const GenreModal: React.FC<Props> = ({
                                         title,
                                         maxWidth,
                                         action,
                                         isOpen,
                                         onClose,
                                         afterLeave,
                                         genre,
                                         parentId,
                                     }) => {
    const { loginUser } = useAuth();
    const queryClient = useQueryClient();
    const genreService = new GenreService(loginUser?.accessToken);

    const commonMutationOptions = {
        onSuccess: async () => {
            handleOnClose();
            await queryClient.invalidateQueries(["genres"]);
            await queryClient.invalidateQueries(["child-genres"]);
        },
    };

    const updateGenreMutation = useMutation(
        (payload: any) => genreService.updateGenre(payload),
        commonMutationOptions,
    );

    const createGenreMutation = useMutation(
        (payload: any) => genreService.createGenre(payload),
        commonMutationOptions,
    );

    const CreateGenreSchema = z.object({
        parentId: z.literal(parentId),
        name: z.string().min(1
            , "Tên thể loại không được để trống").max(50, "Tên thể loại không được quá 50 ký tự"),
    });
    const UpdateGenreSchema = z.object({
        id: z.number(),
        parentId: z.literal(parentId),
        name: z.string(),
        displayIndex: z.number(),
        status: z.boolean(),
    });


    type FormType = Partial<z.infer<typeof UpdateGenreSchema>>;

    const defaultValues: FormType = {
        id: genre?.id,
        name: genre?.name,
        parentId: parentId,
        status: GenreModalMode.UPDATE ? genre?.status : true,
        displayIndex: genre?.displayIndex,
    };

    const {
        register,
        control,
        watch,
        setError,
        handleSubmit,
        reset,
        formState: { errors, isDirty, isSubmitting },
    } = useForm<FormType>({
        resolver: zodResolver(
            action === GenreModalMode.UPDATE
                ? UpdateGenreSchema
                : CreateGenreSchema,
        ),
        defaultValues,
    });

    console.log(errors);
    const onSubmit = async (data: FormType) => {

        switch (action) {
            case GenreModalMode.CREATE:
                try {
                    const payload = CreateGenreSchema.parse(data);
                    await toast.promise(
                        createGenreMutation.mutateAsync(payload),
                        {
                            loading: "Đang thêm thể loại",
                            success: () => "Thêm thể loại thành công",
                            error: (error) =>
                                error?.message || "Thêm thể loại thất bại",
                        },
                    );
                } catch (error) {
                    return;
                }
                break;
            case GenreModalMode.UPDATE:
                try {
                    const payload = UpdateGenreSchema.parse(data);
                    await toast.promise(
                        updateGenreMutation.mutateAsync(payload),
                        {
                            loading: "Đang cập nhật thể loại",
                            success: () => "Cập nhật thể loại thành công",
                            error: (error) => error?.message,
                        },
                    );
                } catch (error) {
                    return;
                }
                break;
        }
    };
    const handleOnClose = () => {
        reset();
        onClose();
    };

    console.log(errors);

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
                        title || (action === GenreModalMode.CREATE
                            ? "Thêm thể loại"
                            : `Cập nhật thể loại ${genre?.name}`)
                    }
                    onClose={handleOnClose}
                    showCloseButton={true}
                />
                <div className="space-y-3 py-4 px-5">
                    <Modal.FormInput<FormType>
                        placeholder={"Nhập tên thể loại"}
                        register={register}
                        required={true}
                        fieldName={"name"}
                        label={"Tên thể loại"}
                        errorMessage={errors.name?.message}
                    />

                    {action === GenreModalMode.UPDATE && (
                        <>
                            <Modal.FormLabel
                                fieldName="status"
                                label="Trạng thái"
                                required={true}
                            />
                            <div className="flex items-center justify-between">
                                <Modal.StatusSwitch
                                    enabled={watch("status") || false}
                                    enabledText="Thể loại đang hoạt động"
                                    disabledText="Thể loại sẽ bị vô hiệu hóa"
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
                                (!isDirty && action === GenreModalMode.UPDATE)
                            }
                            type="submit"
                        >
                            <Modal.SubmitTextWithLoading
                                isLoading={isSubmitting}
                                text={
                                    action === GenreModalMode.CREATE
                                        ? "Thêm"
                                        : "Cập nhật"
                                }
                                loadingText={
                                    action === GenreModalMode.CREATE
                                        ? "Đang thêm"
                                        : "Đang cập nhật"
                                }
                            />
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
                <pre>{JSON.stringify(watch(), null, 2)}</pre>
            </form>
        </TransitionModal>
    );
};
export default memo(GenreModal);
