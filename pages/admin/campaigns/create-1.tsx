import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import React, { ReactElement } from "react";
import CampaignForm, { CampaignFormAction } from "../../../components/CampaignForm";
import WelcomeBanner from "../../../components/WelcomBanner";
import FormPageLayout from "../../../components/Layout/FormPageLayout";
import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { CampaignFormats } from "../../../constants/CampaignFormats";
import { CampaignPrivacies } from "../../../constants/CampaignPrivacies";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/router";
import { ImageUploadService } from "../../../services/ImageUploadService";
import { CampaignService } from "../../../services/CampaignService";
import { IGroup } from "../../../types/Group/IGroup";
import { IOrganization } from "../../../types/Organization/IOrganization";
import { getRequestDateTime } from "../../../utils/helper";

const CreateCampaignPage: NextPageWithLayout = () => {

    const { loginUser } = useAuth();
    const router = useRouter();

    // Services
    const imageUploadService = new ImageUploadService(loginUser?.accessToken);
    const campaignService = new CampaignService(loginUser?.accessToken);

    // Upload image mutation
    const uploadImageMutation = useMutation((file: File) => imageUploadService.uploadImage(file));

    // Create campaign mutation
    const createCampaignMutation = useMutation((data: any) => campaignService.createCampaign(data));
    const createOnlineCampaignMutation = useMutation((data: any) => campaignService.createOnlineCampaign(data));
    const createOfflineCampaignMutation = useMutation((data: any) => campaignService.createOfflineCampaign(data));

    const form = useFormik({
        initialValues: {
            name: "",
            previewImage: null,
            description: "",
            format: "",
            address: "",
            startOnlineDate: undefined,
            endOnlineDate: undefined,
            startOfflineDate: undefined,
            endOfflineDate: undefined,
            privacy: "",
            organizations: [],
            groups: [],
            campaignCommissions: [],
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required("Tên hội sách không được để trống"),
            description: Yup.string().trim().required("Mô tả không được để trống"),
            previewImage: Yup.mixed().required("Ảnh bìa là bắt buộc"),
            format: Yup.number().required("Hình thức tổ chức là bắt buộc"),
            address: Yup.string().when("format", {
                is: (val: number) =>
                    val === CampaignFormats.OFFLINE.id,
                then: Yup.string().required(
                    "Địa chỉ là bắt buộc với hình thức tổ chức bạn đang chọn",
                ),
            }),
            organizations: Yup.array().of(
                Yup.object().shape({
                    id: Yup.number().required(),
                }),
            ).min(1, "Bạn phải chọn ít nhất một tổ chức"),
            campaignCommissions: Yup.array().of(
                Yup.object().shape({
                    genreId: Yup.number().required(),
                    commission: Yup.number().required("Chiết khấu là bắt buộc")
                        .positive("Chiết khấu phải là số dương")
                        .max(100, "Chiết khấu không được vượt quá 100%")
                        .integer("Chiết khấu phải là số nguyên"),
                }),
            ).min(1, "Bạn phải thêm ít nhất một thể loại và chiết khấu"),
            groups: Yup.array().of(
                Yup.object().shape({
                    id: Yup.number().required(),
                }),
            ),
            startOnlineDate: Yup.date().when("format", {
                is: (val: number) =>
                    val === CampaignFormats.ONLINE.id,
                then: Yup.date()
                    .required(
                        "Thời gian bắt đầu (trực tuyến) là bắt buộc với hình thức tổ chức bạn đang chọn",
                    )
                    .min(new Date(), "Thời gian bắt đầu (trực tuyến) phải sau hôm nay"),
            }),
            endOnlineDate: Yup.date().when("format", {
                is: (val: number) =>
                    val === CampaignFormats.ONLINE.id,
                then: Yup.date()
                    .required(
                        "Thời gian kết thúc (trực tuyến) là bắt buộc với hình thức tổ chức bạn đang chọn",
                    )
                    .test({
                        name: "isAfterStartOnlineDate",
                        params: {},
                        message:
                            "Thời gian kết thúc (trực tuyến) phải sau thời gian bắt đầu (trực tuyến)",
                        test: (value, context) => {
                            if (!value) return false;
                            return value > context.parent.startOnlineDate;
                        },
                    }),
            }),
            startOfflineDate: Yup.date().when("format", {
                is: (val: number) =>
                    val === CampaignFormats.OFFLINE.id,
                then: Yup.date()
                    .required(
                        "Thời gian bắt đầu (trực tiếp) là bắt buộc với hình thức tổ chức bạn đang chọn",
                    )
                    .min(new Date(), "Thời gian bắt đầu (trực tiếp) phải sau hôm nay"),
            }),
            endOfflineDate: Yup.date().when("format", {
                is: (val: number) =>
                    val === CampaignFormats.OFFLINE.id,
                then: Yup.date()
                    .required(
                        "Thời gian kết thúc (trực tiếp) là bắt buộc với hình thức tổ chức bạn đang chọn",
                    )
                    .test({
                        name: "isAfterStartOfflineDate",
                        params: {},
                        message:
                            "Thời gian kết thúc (trực tiếp) phải sau thời gian bắt đầu (trực tiếp)",
                        test: (value, context) => {
                            if (!value) return false;
                            return value > context.parent.startOfflineDate;
                        },
                    }),
            }),
            privacy: Yup.number()
                .required("Quyền riêng tư là bắt buộc")
                .when("organizations", {
                    is: (val: number[]) => val.length === 0,
                    then: Yup.number().oneOf(
                        [CampaignPrivacies.PUBLIC.id],
                        "Quyền riêng tư này chỉ hợp lệ khi có ít nhất một tổ chức được chọn",
                    ),
                }),

        }),
        onSubmit: async (values) => {
            let imageUrl = "";
            const image = values.previewImage;
            if (image) {
                await toast.promise(uploadImageMutation.mutateAsync(image, {
                    onSuccess: (data) => {
                        imageUrl = data.url;
                    },
                }), {
                    loading: "Đang tải ảnh lên",
                    success: "Tải ảnh lên thành công",
                    error: "Tải ảnh lên thất bại",
                });
            }
            if (!imageUrl) return;
            let payload = {
                ...values,
                groups: values.groups.map((group: IGroup) => group?.id),
                organizations: values.organizations.map((org: IOrganization) => org?.id),
                imageUrl,
                startOnlineDate: getRequestDateTime(new Date(values?.startOnlineDate || 0)),
                endOnlineDate: getRequestDateTime(new Date(values?.endOnlineDate || 0)),
                startOfflineDate: getRequestDateTime(new Date(values?.startOfflineDate || 0)),
                endOfflineDate: getRequestDateTime(new Date(values?.endOfflineDate || 0)),
            };

            async function createCampaignWithToast(promise: Promise<any>) {
                await toast.promise(promise, {
                    loading: "Đang tạo hội sách",
                    success: (data) => {
                        if (data?.id) {
                            router.push(`/admin/campaigns/${data.id}`);
                        }
                        return "Tạo hội sách thành công";
                    },
                    error: (error) => {
                        return error?.message || "Tạo hội sách thất bại";
                    },
                });
            }

            if (Number(payload.format) === CampaignFormats.ONLINE.id) {
                await createCampaignWithToast(createOnlineCampaignMutation.mutateAsync(payload));
            } else if (Number(payload.format) === CampaignFormats.OFFLINE.id) {
                await createCampaignWithToast(createOfflineCampaignMutation.mutateAsync(payload));
            }
        },
    });
    return (
        <FormPageLayout>
            <WelcomeBanner label="Tạo hội sách 🏪" className="p-6 sm:p-10" />
            <FormikProvider value={form}>
                <CampaignForm formikForm={form} action={CampaignFormAction.CREATE} />
            </FormikProvider>
        </FormPageLayout>
    );
};

CreateCampaignPage.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default CreateCampaignPage;
