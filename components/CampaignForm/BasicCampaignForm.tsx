import {useMutation} from "@tanstack/react-query";
import Link from "next/link";
import {useRouter} from "next/router";
import React, {Fragment, useContext} from "react";
import {Controller, useForm,} from "react-hook-form";
import {toast} from "react-hot-toast";
import {z} from "zod";
import {useAuth} from "../../context/AuthContext";
import {CampaignContext} from "../../context/CampaignContext";
import {CampaignService} from "../../services/CampaignService";
import {ImageUploadService} from "../../services/ImageUploadService";
import {isImageFile, isValidFileSize,} from "../../utils/helper";
import Form from "../Form";
import ErrorMessage from "../Form/ErrorMessage";
import {MAX_FILE_SIZE_IN_MB, message,} from "./shared";
import {zodResolver} from "@hookform/resolvers/zod";


const BasicCampaignForm: React.FC = () => {
    const {loginUser} = useAuth();

    const campaign = useContext(CampaignContext);

    const imageService = new ImageUploadService(loginUser?.accessToken);
    const campaignService = new CampaignService(loginUser?.accessToken);
    const router = useRouter();

    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file)
    );


    const BasicCampaignFormSchema = z.object({
        id: z.number(),
        name: z.string(),
        description: z.string(),
        imageUrl: z.string(),
        previewFile: z.any().optional(),
    })

    type BasicCampaignFormType = Partial<z.infer<typeof BasicCampaignFormSchema>>;


    const {
        register,
        reset,
        getValues,
        resetField,
        setError,
        setValue,
        control,
        handleSubmit,
        watch,
        formState: {errors, isSubmitting},
    } = useForm<BasicCampaignFormType>({
        resolver: zodResolver(BasicCampaignFormSchema),
        defaultValues: {
            id: campaign?.id,
            name: campaign?.name,
            description: campaign?.description,
            imageUrl: campaign?.imageUrl,
        }
    });


    const onSubmit = async (data: BasicCampaignFormType) => {
        console.log('here')
        if (data.previewFile) {
            try {
                await toast.promise(
                    uploadImageMutation.mutateAsync(data.previewFile),
                    {
                        loading: "Đang tải ảnh lên",
                        success: (res) => {
                            data.imageUrl = res?.url;
                            return "Tải ảnh lên thành công";
                        },
                        error: (error) => {
                            return "Tải ảnh lên thất bại";
                        },
                    }
                );
            } catch (error) {
                return;
            }
        }
        // if (action === 'CREATE') {
        //     try {
        //         const payload = FinalSchema.parse(data);
        //         await toast.promise(
        //             createOfflineCampaignMutation.mutateAsync(payload),
        //             {
        //                 loading: "Đang tạo hội sách",
        //                 success: (res) => {
        //                     return "Tạo hội sách thành công";
        //                 },
        //                 error: (error) => {
        //                     return error?.message || "Tạo hội sách thất bại";
        //                 },
        //             }
        //         );
        //     } catch (error) {
        //         return;
        //     }
        // }
        //
        // if (action === 'UPDATE') {
        //     try {
        //         const payload = FinalSchema.parse(data);
        //         await toast.promise(
        //             updateOfflineCampaignMutation.mutateAsync({
        //                 id: campaign?.id,
        //                 ...payload,
        //             }),
        //             {
        //                 loading: "Đang cập nhật hội sách",
        //                 success: (res) => {
        //                     return "Cập nhật hội sách thành công";
        //                 },
        //                 error: (error) => {
        //                     return error?.message || "Cập nhật hội sách thất bại";
        //                 },
        //             }
        //         );
        //     } catch (error) {
        //         return;
        //     }
        // }
    };

    console.log("errors", errors);

    // const selectedOrganizations: IOrganization[] =
    //     watch("campaignOrganizations")?.map((co) => {
    //         return {
    //             id: co.organizationId,
    //             name: co.organizationName,
    //             imageUrl: co.organizationImageUrl,
    //             address: co.organizationAddress,
    //             phone: co.organizationPhone,
    //         };
    //     }) || [];

    return (
        <Fragment>
            <form className="p-6 sm:p-10" onSubmit={handleSubmit(onSubmit)}>
                <Form.GroupLabel
                    label={"Thông tin chung"}
                    description={"Thông tin cơ bản về hội sách"}
                />
                <div className="mt-3 space-y-4">
                    <Form.Input<BasicCampaignFormType>
                        placeholder={
                            "VD: Hội sách xuyên Việt - Lan tỏa tri thức"
                        }
                        register={register}
                        fieldName={"name"}
                        label="Tên hội sách"
                        required={true}
                        errorMessage={errors.name?.message}
                    />
                    <Form.Input<BasicCampaignFormType>
                        rows={4}
                        isTextArea={true}
                        placeholder={"Mô tả ngắn về hội sách"}
                        register={register}
                        required={true}
                        fieldName={"description"}
                        label={"Mô tả"}
                        errorMessage={errors.description?.message}
                    />
                    <Form.Label label={"Ảnh bìa"} required={true}/>
                    <div>
                        <Controller
                            rules={{
                                required: true,
                            }}
                            control={control}
                            name={"previewFile"}
                            render={({field, fieldState}) => (
                                <Form.ImageUploadPanel
                                    defaultImageURL={watch("imageUrl")}
                                    label={`PNG, JPG, GIF tối đa ${MAX_FILE_SIZE_IN_MB}MB`}
                                    onChange={(file) => {
                                        if (!isImageFile(file)) {
                                            toast.error(
                                                message.NOT_IMAGE_TYPE
                                            );
                                            return false;
                                        }
                                        if (
                                            !isValidFileSize(
                                                file,
                                                MAX_FILE_SIZE_IN_MB
                                            )
                                        ) {
                                            toast.error(
                                                message.INVALID_IMAGE_SIZE
                                            );
                                            return false;
                                        }
                                        field.onChange(file);
                                        return true;
                                    }}
                                    onRemove={() => {
                                        field.onChange(undefined);
                                    }}
                                />
                            )}
                        />

                        {errors.previewFile && (
                            <ErrorMessage>
                                {
                                    errors.previewFile
                                        ?.message as React.ReactNode
                                }
                            </ErrorMessage>
                        )}
                    </div>
                </div>

                <Form.Divider/>
                <div className="flex justify-end gap-4">
                    <Link
                        href={"/admin/campaigns"}
                        className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                    >
                        Huỷ
                    </Link>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="m-btn text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {isSubmitting ? "Đang lưu..." : "Lưu"}
                    </button>
                </div>
                {/*<pre>{JSON.stringify(watch(), null, 2)}</pre>*/}
            </form>
        </Fragment>
    );
};

export default BasicCampaignForm;
