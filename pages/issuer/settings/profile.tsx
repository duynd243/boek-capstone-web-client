import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Fragment, ReactElement, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import AdminProfileForm, {
    UpdateProfileFormType,
    UpdateProfileSchema,
} from "../../../components/AdminProfileForm";
import AdminLayout from "../../../components/Layout/AdminLayout";
import AdminSettingsLayout from "../../../components/Layout/AdminSettingsLayout";
import LoadingSpinnerWithOverlay from "../../../components/LoadingSpinnerWithOverlay";
import LoadingTopPage from "../../../components/LoadingTopPage";
import { Roles } from "../../../constants/Roles";
import { useAuth } from "../../../context/AuthContext";
import { ImageUploadService } from "../../../services/ImageUploadService";
import { UpdateUserParams, UserService } from "../../../services/UserService";
import { IUser } from "../../../types/User/IUser";

const AdminProfilePage = () => {
    const { loginUser, updateLoginUser } = useAuth();

    const userService = new UserService(loginUser?.accessToken);
    const imageService = new ImageUploadService(loginUser?.accessToken);
    const queryClient = useQueryClient();

    const getDefaultValue = (data: { id: string; description?: string | undefined; user: IUser; }) => {
        return {
            id: data?.user?.id || "",
            name: data?.user?.name || "",
            email: data?.user?.email || "",
            phone: data?.user?.phone || "",
            addressRequest: {
                detail: data?.user?.addressViewModel?.detail,
                provinceCode: data?.user?.addressViewModel?.provinceCode,
                districtCode: data?.user?.addressViewModel?.districtCode,
                wardCode: data?.user?.addressViewModel?.wardCode,
            },
            imageUrl: data?.user?.imageUrl || "",
            role: Roles.ISSUER.id,
            status: true,
            previewFile: undefined,
            code: data?.user?.code,
            description: data?.description,
        };
    };

    const {
        data: profile,
        isFetching,
        isLoading,
    } = useQuery(["profile"], userService.getLoggedInUser, {
        enabled: !!loginUser?.accessToken,
        onSuccess: (data: { id: string; description?: string | undefined; user: IUser; }) => {
            formMethods.reset(getDefaultValue(data));
            updateLoginUser(data);
        },
    });

    const formMethods = useForm<UpdateProfileFormType>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: getDefaultValue(profile as { id: string; description?: string | undefined; user: IUser; } ),
    });

    const updateProfileMutation = useMutation(
        (data:  {
            description?: string,
            user: UpdateUserParams,
        }) => {
            return userService.updateProfileByIssuer(data);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["profile"]);
                // reinitialize the form with the new data
                //formMethods.reset(defaultValues);
            },
        }
    );

    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file)
    );

    const onSubmit = async (data: UpdateProfileFormType) => {

        console.log(data);
        if (data.previewFile && data.previewFile instanceof File) {
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

        try {
            const payload = UpdateProfileSchema.parse(data);
            await toast.promise(updateProfileMutation.mutateAsync({
                description: payload.description,
                user: {
                    ...payload,
                }
            }), {
                loading: "Đang cập nhật",
                success: () => {
                    return "Cập nhật thành công";
                },
                error: (error) => {
                    return error?.message || "Cập nhật thất bại";
                },
            });
        } catch (error) {
            return;
        }
    };

    if (!loginUser || isLoading) {
        return <LoadingSpinnerWithOverlay />;
    }

    return (
        <AdminSettingsLayout>
            {isFetching && <LoadingTopPage />}
            <FormProvider {...formMethods}>
                <AdminProfileForm onSubmit={onSubmit} />
            </FormProvider>
        </AdminSettingsLayout>
    );
};

AdminProfilePage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default AdminProfilePage;