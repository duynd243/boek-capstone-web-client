import React, {Fragment, ReactElement, useState} from "react";
import {NextPageWithLayout} from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import WelcomeBanner from "../../../components/WelcomBanner";
import {FormikProvider, useFormik} from "formik";
import Form from "../../../components/Form";
import {toast} from "react-hot-toast";
import * as Yup from "yup";
import ErrorMessage from "../../../components/Form/ErrorMessage";
import {RadioGroup} from "@headlessui/react";
import CampaignFormatCard from "../../../components/CampaignFormatCard";
import CreateButton from "../../../components/Admin/CreateButton";
import {IOrganization} from "../../../types/Organization/IOrganization";
import {format} from "date-fns";
import FormPageLayout from "../../../components/Layout/FormPageLayout";
import {CampaignFormats} from "../../../constants/CampaignFormats";
import DateTimePickerModal from "../../../components/Modal/DateTimePickerModal";
import SelectOrganizationsTable from "../../../components/SelectOrganizations/SelectOrganizationsTable";
import SelectOrganizationsModal from "../../../components/SelectOrganizations/SelectOrganizationsModal";
import {CampaignPrivacies} from "../../../constants/CampaignPrivacies";
import {IGroup} from "../../../types/Group/IGroup";
import SelectGroupsTable from "../../../components/SelectGroups/SelectGroupsTable";
import SelectGroupsModal from "../../../components/SelectGroups/SelectGroupsModal";
import SelectCommissionsModal from "../../../components/SelectCommissions/SelectCommissionsModal";
import {IGenre} from "../../../types/Genre/IGenre";
import SelectCommissionsTable from "../../../components/SelectCommissions/SelectCommissionsTable";
import {ImageUploadService} from "../../../services/ImageUploadService";
import {useAuth} from "../../../context/AuthContext";
import {useMutation} from "@tanstack/react-query";
import {CampaignService} from "../../../services/CampaignService";
import {getRequestDateTime} from "../../../utils/helper";
import {useRouter} from "next/router";

const MAX_FILE_SIZE_IN_MB = 1;

export interface IRequestCommission {
    genreId: number,
    genreName: string,
    commission: number,
}

const CreateCampaign: NextPageWithLayout = () => {

    const {loginUser} = useAuth();
    const router = useRouter();

    // Services
    const imageUploadService = new ImageUploadService(loginUser?.accessToken);
    const campaignService = new CampaignService(loginUser?.accessToken);


    const campaignPrivacies = Object.values(CampaignPrivacies);

    // Date picker states
    const [showStartOnlinePicker, setShowStartOnlinePicker] = useState(false);
    const [showEndOnlinePicker, setShowEndOnlinePicker] = useState(false);
    const [showStartOfflinePicker, setShowStartOfflinePicker] = useState(false);
    const [showEndOfflinePicker, setShowEndOfflinePicker] = useState(false);

    // Modal states
    const [showSelectOrgModal, setShowSelectOrgModal] = useState(false);
    const [showSelectGroupModal, setShowSelectGroupModal] = useState(false);
    const [showCommissionModal, setShowCommissionModal] = useState(false);


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
                    val === CampaignFormats.OFFLINE.id || val === CampaignFormats.BOTH.id,
                then: Yup.string().required(
                    "Địa chỉ là bắt buộc với hình thức tổ chức bạn đang chọn"
                ),
            }),
            organizations: Yup.array().of(
                Yup.object().shape({
                    id: Yup.number().required(),
                })
            ).min(1, "Bạn phải chọn ít nhất một tổ chức"),
            groups: Yup.array().of(
                Yup.object().shape({
                    id: Yup.number().required(),
                })
            ),
            startOnlineDate: Yup.date().when("format", {
                is: (val: number) =>
                    val === CampaignFormats.ONLINE.id || val === CampaignFormats.BOTH.id,
                then: Yup.date()
                    .required(
                        "Thời gian bắt đầu (trực tuyến) là bắt buộc với hình thức tổ chức bạn đang chọn"
                    )
                    .min(new Date(), "Thời gian bắt đầu (trực tuyến) phải sau hôm nay"),
            }),
            endOnlineDate: Yup.date().when("format", {
                is: (val: number) =>
                    val === CampaignFormats.ONLINE.id || val === CampaignFormats.BOTH.id,
                then: Yup.date()
                    .required(
                        "Thời gian kết thúc (trực tuyến) là bắt buộc với hình thức tổ chức bạn đang chọn"
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
                    val === CampaignFormats.OFFLINE.id || val === CampaignFormats.BOTH.id,
                then: Yup.date()
                    .required(
                        "Thời gian bắt đầu (trực tiếp) là bắt buộc với hình thức tổ chức bạn đang chọn"
                    )
                    .min(new Date(), "Thời gian bắt đầu (trực tiếp) phải sau hôm nay"),
            }),
            endOfflineDate: Yup.date().when("format", {
                is: (val: number) =>
                    val === CampaignFormats.OFFLINE.id || val === CampaignFormats.BOTH.id,
                then: Yup.date()
                    .required(
                        "Thời gian kết thúc (trực tiếp) là bắt buộc với hình thức tổ chức bạn đang chọn"
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
                        "Quyền riêng tư này chỉ hợp lệ khi có ít nhất một tổ chức được chọn"
                    ),
                }),
            campaignCommissions: Yup.array().of(
                Yup.object().shape({
                    genreId: Yup.number(),
                    commission: Yup.number().required("Chiết khấu là bắt buộc")
                        .positive("Chiết khấu phải là số dương")
                        .max(100, "Chiết khấu không được vượt quá 100%")
                        .integer("Chiết khấu phải là số nguyên"),
                })
            ),
        }),
        onSubmit: async (values) => {
            let imageUrl = "";
            const image = values.previewImage;
            if (image) {
                await toast.promise(uploadImageMutation.mutateAsync(image, {
                    onSuccess: (data) => {
                        imageUrl = data.url;
                    }
                }), {
                    loading: "Đang tải ảnh lên",
                    success: "Tải ảnh lên thành công",
                    error: "Tải ảnh lên thất bại",
                })
            }
            if (!imageUrl) return;
            let payload = {
                ...values,
                groups: values.groups.map((group: IGroup) => group?.id),
                organizations: values.organizations.map((org: IOrganization) => org?.id),
                imageUrl,
                startOnlineDate: isOnlineRequired ? getRequestDateTime(new Date(values?.startOnlineDate || 0)) : undefined,
                endOnlineDate: isOnlineRequired ? getRequestDateTime(new Date(values?.endOnlineDate || 0)) : undefined,
                startOfflineDate: isOfflineRequired ? getRequestDateTime(new Date(values?.startOfflineDate || 0)) : undefined,
                endOfflineDate: isOfflineRequired ? getRequestDateTime(new Date(values?.endOfflineDate || 0)) : undefined,
            }

            async function createCampaignWithToast(promise: Promise<any>) {
                await toast.promise(promise, {
                    loading: "Đang tạo hội sách",
                    success: (data) => {
                        if (data?.id) {
                            router.push(`/admin/campaigns/${data.id}`);
                        }
                        return "Tạo hội sách thành công"
                    },
                    error: (error) => {
                        return error?.message || "Tạo hội sách thất bại";
                    },
                })
            }

            if (Number(payload.format) === CampaignFormats.BOTH.id) {
                await createCampaignWithToast(createCampaignMutation.mutateAsync(payload));
            } else if (Number(payload.format) === CampaignFormats.ONLINE.id) {
                await createCampaignWithToast(createOnlineCampaignMutation.mutateAsync(payload));
            } else if (Number(payload.format) === CampaignFormats.OFFLINE.id) {
                await createCampaignWithToast(createOfflineCampaignMutation.mutateAsync(payload));
            }
        },
    });

    // Image callbacks
    const onImageChange = (file: File): boolean => {
        // check file type
        if (!file.type.startsWith("image/")) {
            toast.error("Vui lòng tải lên tệp hình ảnh");
            return false;
        }
        // check file size
        if (file.size > 1024 * 1024 * MAX_FILE_SIZE_IN_MB) {
            toast.error(`Vui lòng tải lên tệp nhỏ hơn ${MAX_FILE_SIZE_IN_MB}MB`);
            return false;
        }
        form.setFieldValue("previewImage", file);
        return true;
    };

    const onImageRemove = () => {
        form.setFieldValue("previewImage", null);
    };

    // Commission callbacks
    const handleAddCommission = (genre: IGenre) => {
        const newCommission = {
            genreId: genre?.id,
            genreName: genre?.name,
            commission: 0,
        }
        form.setFieldValue('campaignCommissions', [...form.values.campaignCommissions, newCommission]);
        setShowCommissionModal(false);
    }

    // Organization callbacks

    const handleAddOrg = (org: IOrganization) => {
        form.setFieldValue(
            "organizations",
            [...form.values.organizations, org]
        );
        setShowSelectOrgModal(false);
    };

    const handleRemoveOrg = (org: IOrganization) => {
        form.setFieldValue(
            "organizations",
            form.values.organizations.filter((o: IOrganization) => o?.id !== org?.id)
        );
    };


    // Group callbacks
    const handleAddGroup = (group: IGroup) => {
        form.setFieldValue(
            "groups",
            [...form.values.groups, group]
        );
        setShowSelectGroupModal(false);
    };

    const handleRemoveGroup = (group: IGroup) => {
        form.setFieldValue(
            "groups",
            form.values.groups.filter((g: IGroup) => g?.id !== group?.id)
        );
    };

    const chosenFormatId = Number(form.values.format);
    const isOnlineRequired =
        chosenFormatId === CampaignFormats.ONLINE.id ||
        chosenFormatId === CampaignFormats.BOTH.id;
    const isOfflineRequired =
        chosenFormatId === CampaignFormats.OFFLINE.id ||
        chosenFormatId === CampaignFormats.BOTH.id;

    return (
        <Fragment>
            <FormPageLayout>
                <WelcomeBanner label="Tạo hội sách 🏪" className="p-6 sm:p-10"/>
                <FormikProvider value={form}>
                    <form className="p-6 sm:p-10" onSubmit={form.handleSubmit}>
                        {/*Thông tin chung*/}
                        <Form.GroupLabel
                            label={"Thông tin chung"}
                            description={"Thông tin cơ bản về hội sách"}
                        />
                        <div className="mt-3 space-y-4">
                            <Form.Input
                                placeholder={"VD: Hội sách xuyên Việt - Lan tỏa tri thức"}
                                formikForm={form}
                                required={true}
                                fieldName={"name"}
                                label={"Tên hội sách"}
                            />
                            <Form.Input
                                rows={4}
                                isTextArea={true}
                                placeholder={"Mô tả ngắn về hội sách"}
                                formikForm={form}
                                required={true}
                                fieldName={"description"}
                                label={"Mô tả"}
                            />
                            <Form.Label label={"Ảnh bìa"} required={true}/>
                            <Form.ImageUploadPanel
                                label={`PNG, JPG, GIF tối đa ${MAX_FILE_SIZE_IN_MB}MB`}
                                onChange={onImageChange}
                                onRemove={onImageRemove}
                            />
                            {form.errors.previewImage && form.touched.previewImage && (
                                <ErrorMessage>{form.errors.previewImage}</ErrorMessage>
                            )}

                            <Form.Label label={"Hình thức tổ chức"} required={true}/>
                            <RadioGroup
                                className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
                                onChange={(value: number) => {
                                    if (value === 1) {
                                        form.setFieldValue("address", "");
                                    }
                                    form.setFieldValue("format", value);
                                }}
                            >
                                {Object.values(CampaignFormats).map((format) => (
                                    <RadioGroup.Option key={format.id} value={format.id}>
                                        {({checked}) => (
                                            <CampaignFormatCard
                                                id={format.id}
                                                icon={format.icon}
                                                iconBackground={format.iconBackground}
                                                name={format.name}
                                                description={format.description}
                                                checked={checked}
                                            />
                                        )}
                                    </RadioGroup.Option>
                                ))}
                            </RadioGroup>

                            {form.errors.format && form.touched.format && (
                                <ErrorMessage>{form.errors.format}</ErrorMessage>
                            )}
                        </div>
                        <Form.Divider/>
                        <Form.GroupLabel
                            label={"Thời gian và địa điểm"}
                            description={"Thời gian và địa điểm tổ chức hội sách"}
                        />
                        <div className="mt-3 space-y-4">
                            <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <Form.Label
                                        label={"Thời gian bắt đầu (trực tuyến)"}
                                        required={isOnlineRequired}
                                    />
                                    <Form.DateTimeInputField
                                        disabled={!isOnlineRequired}
                                        value={
                                            form.values.startOnlineDate
                                                ? format(
                                                    Number(form.values.startOnlineDate),
                                                    "dd/MM/yyyy hh:mm a"
                                                )
                                                : ""
                                        }
                                        onClick={() => {
                                            setShowStartOnlinePicker(true);
                                        }}
                                    />
                                    {form.errors.startOnlineDate &&
                                        form.touched.startOnlineDate && (
                                            <ErrorMessage>{form.errors.startOnlineDate}</ErrorMessage>
                                        )}
                                </div>
                                <div>
                                    <Form.Label
                                        label={"Thời gian kết thúc (trực tuyến)"}
                                        required={isOnlineRequired}
                                    />
                                    <Form.DateTimeInputField
                                        disabled={!isOnlineRequired}
                                        value={
                                            form.values.endOnlineDate
                                                ? format(
                                                    Number(form.values.endOnlineDate),
                                                    "dd/MM/yyyy hh:mm a"
                                                )
                                                : ""
                                        }
                                        onClick={() => {
                                            setShowEndOnlinePicker(true);
                                        }}
                                    />
                                    {form.errors.endOnlineDate && form.touched.endOnlineDate && (
                                        <ErrorMessage>{form.errors.endOnlineDate}</ErrorMessage>
                                    )}
                                </div>
                            </div>
                            <div className="grid gap-y-4 gap-x-4 sm:grid-cols-2">
                                <div>
                                    <Form.Label
                                        label={"Thời gian bắt đầu (trực tiếp)"}
                                        required={isOfflineRequired}
                                    />
                                    <Form.DateTimeInputField
                                        disabled={!isOfflineRequired}
                                        value={
                                            form.values.startOfflineDate
                                                ? format(
                                                    Number(form.values.startOfflineDate),
                                                    "dd/MM/yyyy hh:mm a"
                                                )
                                                : ""
                                        }
                                        onClick={() => {
                                            setShowStartOfflinePicker(true);
                                        }}
                                    />
                                    {form.errors.startOfflineDate &&
                                        form.touched.startOfflineDate && (
                                            <ErrorMessage>{form.errors.startOfflineDate}</ErrorMessage>
                                        )}
                                </div>
                                <div>
                                    <Form.Label
                                        label={"Thời gian kết thúc (trực tiếp)"}
                                        required={isOfflineRequired}
                                    />
                                    <Form.DateTimeInputField
                                        disabled={!isOfflineRequired}
                                        value={
                                            form.values.endOfflineDate
                                                ? format(
                                                    Number(form.values.endOfflineDate),
                                                    "dd/MM/yyyy hh:mm a"
                                                )
                                                : ""
                                        }
                                        onClick={() => {
                                            setShowEndOfflinePicker(true);
                                        }}
                                    />
                                    {form.errors.endOfflineDate && form.touched.endOfflineDate && (
                                        <ErrorMessage>{form.errors.endOfflineDate}</ErrorMessage>
                                    )}
                                </div>
                            </div>
                            <Form.Input
                                disabled={!isOfflineRequired}
                                isTextArea={true}
                                placeholder={"VD: 123 Nguyễn Văn Cừ, Quận 5, TP Hồ Chí Minh"}
                                formikForm={form}
                                required={true}
                                fieldName={"address"}
                                label={"Địa chỉ"}
                            />
                        </div>
                        <Form.Divider/>
                        <Form.GroupLabel
                            label={"Đối tượng của hội sách"}
                            description={"Các đối tượng mà hội sách này nhắm đến"}
                        />

                        <div className="mt-3 space-y-4">
                            <div>
                                <Form.Label label={"Tổ chức"} required={true}/>
                                <div className="mb-4 flex justify-end gap-4">
                                    <CreateButton
                                        label={"Thêm tổ chức"}
                                        onClick={() => {
                                            setShowSelectOrgModal(true);
                                        }}
                                    />
                                </div>
                                <SelectOrganizationsTable
                                    selectedOrganizations={form.values.organizations}
                                    handleRemoveOrganization={handleRemoveOrg}
                                />
                                {form.errors.organizations && form.touched.organizations && (
                                    <ErrorMessage>{form.errors.organizations}</ErrorMessage>
                                )}
                            </div>

                            <div>
                                <Form.Label label={"Nhóm"}/>
                                <div className="mb-4 flex justify-end gap-4">
                                    <CreateButton
                                        label={"Thêm nhóm"}
                                        onClick={() => {
                                            setShowSelectGroupModal(true);
                                        }}
                                    />
                                </div>
                                <SelectGroupsTable
                                    selectedGroups={form.values.groups}
                                    handleRemoveGroup={handleRemoveGroup}
                                />
                                {form.errors.groups && form.touched.groups && (
                                    <ErrorMessage>{form.errors.groups}</ErrorMessage>
                                )}
                            </div>
                            <div>
                                <Form.Label label={"Quyền riêng tư"} required={true}/>
                                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                                    {campaignPrivacies.map((privacy) => (
                                        <div key={privacy.id} className="relative flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    id={`privacy-${privacy.id}`}
                                                    name="privacy"
                                                    type="radio"
                                                    value={privacy.id}
                                                    onChange={form.handleChange}
                                                    checked={Number(form.values.privacy) === privacy.id}
                                                    className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label
                                                    htmlFor={`privacy-${privacy.id}`}
                                                    className="text-sm font-medium text-gray-600"
                                                >
                                                    {privacy.displayName}
                                                </label>
                                                <p className="text-gray-500">{privacy.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {form.errors.privacy && form.touched.privacy && (
                                    <ErrorMessage>{form.errors.privacy}</ErrorMessage>
                                )}
                            </div>
                        </div>

                        <Form.Divider/>
                        <Form.GroupLabel label='Thể loại và chiết khấu'
                                         description='Thể loại sách và chiết khấu mà hội sách này áp dụng'/>
                        <div className="mb-4 flex justify-end gap-4">
                            <CreateButton
                                label={"Thêm"}
                                onClick={() => {
                                    setShowCommissionModal(true);
                                }}
                            />
                        </div>
                        <SelectCommissionsTable formikForm={form} field={'campaignCommissions'}/>
                        <Form.Divider/>
                        <div className='flex justify-end gap-4'>
                            <button className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200">
                                Hủy
                            </button>
                            <button type="submit"
                                    disabled={form.isSubmitting}
                                    className="m-btn text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
                                {form.isSubmitting ? 'Đang tạo...' : 'Tạo hội sách'}
                            </button>
                        </div>
                    </form>
                </FormikProvider>
            </FormPageLayout>

            <SelectOrganizationsModal
                isOpen={showSelectOrgModal}
                onClose={() => setShowSelectOrgModal(false)}
                selectedOrganizations={form.values.organizations}
                onItemSelect={handleAddOrg}
            />

            <SelectGroupsModal
                isOpen={showSelectGroupModal}
                onClose={() => setShowSelectGroupModal(false)}
                selectedGroups={form.values.groups}
                onItemSelect={handleAddGroup}
            />


            <SelectCommissionsModal
                isOpen={showCommissionModal}
                onClose={() => setShowCommissionModal(false)}
                selectedCommissions={form.values.campaignCommissions}
                onItemSelect={handleAddCommission}/>

            <DateTimePickerModal
                onDismiss={() => setShowStartOnlinePicker(false)}
                title="Chọn thời gian bắt đầu"
                value={form.values.startOnlineDate}
                isOpen={showStartOnlinePicker}
                onClose={(value) => {
                    form.setFieldValue("startOnlineDate", value);
                    setShowStartOnlinePicker(false);
                }}
            />

            <DateTimePickerModal
                onDismiss={() => setShowEndOnlinePicker(false)}
                title="Chọn thời gian kết thúc"
                value={form.values.endOnlineDate}
                isOpen={showEndOnlinePicker}
                onClose={(value) => {
                    form.setFieldValue("endOnlineDate", value);
                    setShowEndOnlinePicker(false);
                }}
            />

            <DateTimePickerModal
                onDismiss={() => setShowStartOfflinePicker(false)}
                title="Chọn thời gian bắt đầu"
                value={form.values.startOfflineDate}
                isOpen={showStartOfflinePicker}
                onClose={(value) => {
                    form.setFieldValue("startOfflineDate", value);
                    setShowStartOfflinePicker(false);
                }}
            />

            <DateTimePickerModal
                onDismiss={() => setShowEndOfflinePicker(false)}
                title="Chọn thời gian kết thúc"
                value={form.values.endOfflineDate}
                isOpen={showEndOfflinePicker}
                onClose={(value) => {
                    form.setFieldValue("endOfflineDate", value);
                    setShowEndOfflinePicker(false);
                }}
            />
        </Fragment>
    );
};

CreateCampaign.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default CreateCampaign;