import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ReactElement } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import AdminProfileForm, { UpdateProfileFormType, UpdateProfileSchema } from "../../../components/AdminProfileForm";
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

    const getDefaultValue = (data: IUser | undefined) => {
        return {
            id: data?.id || "",
            name: data?.name || "",
            email: data?.email || "",
            phone: data?.phone || "",
            addressRequest: {
                detail: data?.addressViewModel?.detail,
                provinceCode: data?.addressViewModel?.provinceCode,
                districtCode: data?.addressViewModel?.districtCode,
                wardCode: data?.addressViewModel?.wardCode,
            },
            imageUrl: data?.imageUrl || "",
            role: Roles.SYSTEM.id,
            status: true,
            previewFile: undefined,
            code: data?.code,
        };
    };

    const {
        data: profile,
        isFetching,
        isLoading,
    } = useQuery(["profile"], userService.getLoggedInUser, {
        enabled: !!loginUser?.accessToken,
        onSuccess: (data) => {
            formMethods.reset(getDefaultValue(data));
            updateLoginUser(data);
        },
    });

    const formMethods = useForm<UpdateProfileFormType>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: getDefaultValue(profile),
    });

    const updateProfileMutation = useMutation(
        (data: UpdateUserParams) => {
            return userService.updateUserByAdmin(data);
        },
        {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["profile"]);
                // reinitialize the form with the new data
                //formMethods.reset(defaultValues);
            },
        },
    );

    const uploadImageMutation = useMutation((file: File) =>
        imageService.uploadImage(file),
    );

    const onSubmit = async (data: UpdateProfileFormType) => {

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
                    },
                );
            } catch (error) {
                return;
            }
        }

        try {
            const payload = UpdateProfileSchema.parse(data);
            await toast.promise(updateProfileMutation.mutateAsync(payload), {
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
