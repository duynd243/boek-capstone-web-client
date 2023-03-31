import React, {Fragment, useState} from 'react'
import {useAuth} from "../../context/AuthContext";
import LoginSignUpLayout from "../../components/Layout/LoginSignUpLayout";
import {NextPageWithLayout} from "../_app";
import Form from "../../components/Form";
import {Controller, useForm} from "react-hook-form";
import SelectBox from "../../components/SelectBox";
import {IProvince} from "../../types/Address/IProvince";
import ErrorMessage from "../../components/Form/ErrorMessage";
import {IDistrict} from "../../types/Address/IDistrict";
import {IWard} from "../../types/Address/IWard";
import useAddress from "../../hooks/useAddress";
import {z} from "zod";
import Image from "next/image";
import {BsSearch} from "react-icons/bs";
import {useQuery} from "@tanstack/react-query";
import {OrganizationService} from "../../services/OrganizationService";
import {IoPeople} from "react-icons/io5";
import {AiFillShop} from "react-icons/ai";
import {GroupService} from "../../services/GroupService";
import {getAvatarFromName} from "../../utils/helper";

const formSteps = [
    {
        title: "Thông tin cá nhân 📝",
    }, {
        title: "Thông tin địa chỉ 🏠",
    }, {
        title: "Tổ chức mà bạn thuộc về 🏢",
    }, {
        title: "Chọn nhóm đề tài 📚",
    }
]

const StepNumber = ({step, isActive}: { step: number, isActive: boolean }) => {
    return <li>
        <button
            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${isActive ? "bg-indigo-500 text-white" : "bg-slate-100 text-slate-500"}`}
        >
            {step}
        </button>
    </li>
}

const genderOptions = {
    MALE: {
        label: "Nam",
        value: true
    },
    FEMALE: {
        label: "Nữ",
        value: false
    }
} satisfies Record<string, { label: string, value: boolean }>

const CompleteProfilePage: NextPageWithLayout = () => {
    const {user, cancelCreateUser} = useAuth();
    const orgService = new OrganizationService();
    const groupService = new GroupService();
    const {
        data: orgData,
        isLoading,
        isFetching,
    } = useQuery(
        ["organizations"],
        () =>
            orgService.getOrganizations({
                name: '',
                size: 1000,
                withCustomers: true,
                withCampaigns: true,
            }),
    );

    const {
        data: groupData,
    } = useQuery(
        ["groups"],
        () =>
            groupService.getGroups({
                name: '',
                size: 1000,
                withCustomers: true,
                withCampaigns: true,
            }),
    );

    const [step, setStep] = useState(1);

    const {
        provinces,
        districts,
        wards,
        provincesLoading,
        districtsLoading,
        wardsLoading,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        selectedProvince,
        selectedDistrict,
        selectedWard,
    } = useAddress({});


    const FormSchema = z.object({
        idToken: z.string(),
        name: z.string(),
        gender: z.boolean(),
        address: z.object({
            detail: z.string(),
            provinceCode: z.number(),
            districtCode: z.number(),
            wardCode: z.number()
        }),
        dob: z.string(),
        phone: z.string(),
        organizationIds: z.array(z.number()),
        groupIds: z.array(z.number())
    })

    type FormType = Partial<z.infer<typeof FormSchema>>;


    const {register, control, watch, setValue, handleSubmit, formState: {errors, isValid}} = useForm<FormType>({
        defaultValues: {
            name: user?.displayName || "",
            phone: user?.phoneNumber || "",
            gender: true,
        }
    });

    return (
        <Fragment>
            <div className="mb-8 mt-14">
                <h1 className="text-2xl text-slate-800 font-bold mb-6">
                    {formSteps[step - 1].title}
                </h1>
                <div className="max-w-md mx-auto w-full">
                    <div className="relative">
                        <div className="absolute left-0 top-1/2 -mt-px w-full h-0.5 bg-slate-200"
                             aria-hidden="true"></div>
                        <ul className="relative flex justify-between w-full">
                            {formSteps.map((s, i) => (
                                <StepNumber key={i} step={i + 1} isActive={i + 1 <= step}/>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <form>
                {step === 1 &&
                    <div className='space-y-4'>
                        <Form.Input<FormType>
                            required={true}
                            register={register}
                            fieldName={'name'}
                            placeholder={'Nhập họ và tên'}
                            label={'Họ và tên'}/>
                        <Form.Input<FormType>
                            required={true}
                            register={register}
                            fieldName={'phone'}
                            placeholder={'Nhập số điện thoại'}
                            label={'Số điện thoại'}/>
                        <div>
                            <Form.Label
                                label='Sinh nhật'
                                required={true}
                            />
                            <Form.DateTimeInputField placeholder='dd/mm/yyyy' value={''}/>
                        </div>

                        <div>
                            <Form.Label
                                label={"Giới tính"}
                                required={true}
                            />
                            <Controller
                                control={control}
                                name="gender"
                                render={({field}) => {
                                    return (
                                        <SelectBox<{
                                            label: string;
                                            value: boolean;
                                        }>
                                            value={watch('gender') ? genderOptions.MALE : genderOptions.FEMALE}
                                            placeholder="Giới tính"
                                            onValueChange={(g) => {
                                                field.onChange(g.value);
                                            }}
                                            displayKey="label"
                                            dataSource={Object.values(genderOptions)}
                                            searchable={false}
                                        />
                                    );
                                }}
                            />

                        </div>
                    </div>
                }

                {step === 2 &&
                    <div className='space-y-4'>
                        <Form.Input<FormType>
                            required={true}
                            register={register}
                            fieldName={'address.detail'}
                            placeholder={'Nhập địa chỉ'}
                            label={'Địa chỉ'}/>
                        {/*Tỉnh*/}
                        <div>
                            <Form.Label
                                label={"Tỉnh / Thành phố"}
                                required={true}
                            />
                            <Controller
                                control={control}
                                name="address.provinceCode"
                                render={({field}) => {
                                    return (
                                        <SelectBox<IProvince>
                                            value={selectedProvince}
                                            disabled={provincesLoading}
                                            placeholder={provincesLoading ? "Đang tải..." : "Chọn tỉnh / thành phố"}
                                            onValueChange={(p) => {
                                                if (
                                                    p.code ===
                                                    watch(
                                                        "address.provinceCode"
                                                    )
                                                )
                                                    return;

                                                field.onChange(p.code);
                                                setValue(
                                                    "address.districtCode" as any,
                                                    undefined
                                                );
                                                setValue(
                                                    "address.wardCode" as any,
                                                    undefined
                                                );
                                                handleProvinceChange(p);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={provinces}
                                        />
                                    );
                                }}
                            />
                            {errors.address?.provinceCode && (
                                <ErrorMessage>
                                    {
                                        errors.address?.provinceCode
                                            .message
                                    }
                                </ErrorMessage>
                            )}
                        </div>
                        {/*Quận huyện*/}
                        <div>
                            <Form.Label
                                label={"Quận / Huyện"}
                                required={true}
                            />
                            <Controller
                                control={control}
                                disabled={districtsLoading}
                                name="address.districtCode"
                                render={({field}) => {
                                    return (
                                        <SelectBox<IDistrict>
                                            value={selectedDistrict}
                                            placeholder={districtsLoading ? "Đang tải..." : "Chọn quận / huyện"}
                                            onValueChange={(d) => {
                                                if (
                                                    d.code ===
                                                    watch(
                                                        "address.districtCode"
                                                    )
                                                )
                                                    return;
                                                field.onChange(d.code);
                                                setValue(
                                                    "address.wardCode" as any,
                                                    undefined
                                                );
                                                handleDistrictChange(d);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={districts}
                                        />
                                    );
                                }}
                            />
                            {errors.address?.districtCode && (
                                <ErrorMessage>
                                    {
                                        errors.address?.districtCode
                                            .message
                                    }
                                </ErrorMessage>
                            )}
                        </div>
                        {/*Phường xã*/}
                        <div>
                            <Form.Label
                                label={"Phường / Xã"}
                                required={true}
                            />
                            <Controller
                                control={control}
                                name="address.wardCode"
                                render={({field}) => {
                                    return (
                                        <SelectBox<IWard>
                                            disabled={wardsLoading}
                                            value={selectedWard}
                                            placeholder={wardsLoading ? "Đang tải..." : "Chọn phường / xã"}
                                            onValueChange={(w) => {
                                                if (
                                                    w.code ===
                                                    watch(
                                                        "address.wardCode"
                                                    )
                                                )
                                                    return;
                                                field.onChange(w.code);
                                                handleWardChange(w);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={wards}
                                        />
                                    );
                                }}
                            />
                            {errors.address?.wardCode && (
                                <ErrorMessage>
                                    {
                                        errors.address?.wardCode
                                            .message
                                    }
                                </ErrorMessage>
                            )}
                        </div>
                    </div>
                }
                {step === 3 &&
                    <div className="relative rounded overflow-hidden bg-white shadow">
                        <div className='overflow-hidden'>
                            <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                className="h-12 w-full bg-gray-100 border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"

                            />
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {orgData?.data?.map((org, i) => (
                                <div key={org?.id} className='flex hover:bg-gray-50 bg-white border-b py-4 px-6'>
                                    <Image src={org?.imageUrl || ''}
                                           alt=''
                                           className='rounded-full w-10 h-10 object-cover'
                                           width={200}
                                           height={200}/>
                                    <div className="ml-4 space-y-1.5 flex-1">
                                        <div className="text-sm font-medium text-gray-900">{org?.name}</div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex items-center text-sm text-gray-600'>
                                                <AiFillShop/>
                                                <span className="ml-1">{org?.campaigns?.length} hội sách</span>
                                            </div>
                                            <div className='flex items-center text-sm text-gray-600'>
                                                <IoPeople/>
                                                <span className="ml-1">{org?.customers?.length} khách hàng thuộc về tổ chức</span>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="checkbox"
                                           className="self-center rounded-full w-4 h-4 border border-slate-200 bg-gray-100"/>
                                </div>
                            ))}
                        </div>
                    </div>
                }

                {step === 4 &&
                    <div className="relative rounded overflow-hidden bg-white shadow">
                        <div className='overflow-hidden'>
                            <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"/>
                            <input
                                type="text"
                                placeholder="Tìm kiếm"
                                className="h-12 w-full bg-gray-100 border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"

                            />
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                            {groupData?.data?.map((group, i) => (
                                <div key={group?.id} className='flex bg-white border-b py-4 px-6'>
                                    <Image src={getAvatarFromName(group?.name, 1)}
                                           alt=''
                                           className='rounded-full w-10 h-10 object-cover'
                                           width={200}
                                           height={200}/>
                                    <div className="ml-4 space-y-1.5 flex-1">
                                        <div className="text-sm font-medium text-gray-900">{group?.name}</div>
                                        <div className='flex flex-col gap-2'>
                                            <div className='flex items-center text-sm text-gray-600'>
                                                <AiFillShop/>
                                                <span className="ml-1">{group?.campaigns?.length} hội sách</span>
                                            </div>
                                            <div className='flex items-center text-sm text-gray-600'>
                                                <IoPeople/>
                                                <span className="ml-1">{group?.customers?.length} người chọn nhóm</span>
                                            </div>
                                        </div>
                                    </div>
                                    <input type="checkbox"
                                           className="self-center rounded-full w-4 h-4 border border-slate-200 bg-gray-100"/>
                                </div>
                            ))}
                        </div>
                    </div>
                }


                <div className="flex items-center justify-between mt-8">
                    <button type='button'
                            disabled={step === 1}
                            onClick={() => {
                                if (step > 1) {
                                    setStep(step - 1)
                                }
                            }}
                            className="text-sm text-slate-600">&lt;- Quay lại
                    </button>
                    <button type='button' onClick={() => {
                        if (step < formSteps.length && isValid) {
                            setStep(step + 1)
                        }
                    }} className="m-btn bg-indigo-500 hover:bg-indigo-600 text-white ml-auto">
                        {step === formSteps.length ? 'Tạo tài khoản' : 'Tiếp theo ->'}
                    </button>
                </div>

            </form>

            <div className="mt-6 border-t-[1px] border-slate-200 pt-5">
                <button
                    className={"text-sm font-medium text-slate-500 hover:text-slate-600"}
                    onClick={cancelCreateUser}
                >
                    Huỷ bỏ và quay lại
                </button>
            </div>
            <pre>{JSON.stringify(watch(), null, 2)}</pre>
        </Fragment>
    )
}

CompleteProfilePage.getLayout = (page) =>
    <LoginSignUpLayout
        childrenWrapperClass='mx-auto w-full max-w-lg px-4 py-8'>{page}</LoginSignUpLayout>
;

export default CompleteProfilePage