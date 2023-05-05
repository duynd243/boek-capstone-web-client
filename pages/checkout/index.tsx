import { RadioGroup } from "@headlessui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { MdEmail } from "react-icons/md";
import { z } from "zod";
import OrderPlacementCard from "../../components/Customer/OrderPlacementCard";
import OrderPlacementDetail from "../../components/Customer/OrderPlacementDetail";
import Form from "../../components/Form";
import ErrorMessage from "../../components/Form/ErrorMessage";
import CustomerLayout from "../../components/Layout/CustomerLayout";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import TransitionModal from "../../components/Modal/TransitionModal";
import SelectBox from "../../components/SelectBox";
import { OrderPaymentMethods } from "../../constants/OrderPaymentMethods";
import { OrderTypes } from "../../constants/OrderTypes";
import { useAuth } from "../../context/AuthContext";
import useDebounce from "../../hooks/useDebounce";
import useSelectAddress from "../../hooks/useSelectAddress";
import { useUserProfile } from "../../hooks/useUserProfile";
import { OrderCalculationService } from "../../services/OrderCalculationService";
import { OrderService } from "../../services/OrderService";
import { VerificationService } from "../../services/VerificationService";
import { getOrderParams, useOrderStore } from "../../stores/OrderStore";
import { IDistrict } from "../../types/Address/IDistrict";
import { IProvince } from "../../types/Address/IProvince";
import { IWard } from "../../types/Address/IWard";
import { NextPageWithLayout } from "../_app";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import { useCartStore } from "../../stores/CartStore";

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

const PaymentMethods = [OrderPaymentMethods.ZaloPay, OrderPaymentMethods.Cash];

const CheckoutPage: NextPageWithLayout = () => {
    const { loginUser } = useAuth();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const refs = useRef([]);

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        index: number,
    ) => {
        const { value } = event.target;
        if (/^\d{0,1}$/.test(value)) {
            // allow only numeric characters and limit to 1 digit
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            if (value !== "") {
                if (index < refs.current.length - 1) {
                    refs.current[index + 1].focus();
                }
            } else {
                if (index > 0) {
                    refs.current[index - 1].focus();
                }
            }
        }
    };

    const handleKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
        index: number,
    ) => {
        if (event.key === "Backspace" && otp[index] === "") {
            if (index > 0) {
                refs.current[index - 1].focus();
            }
        }
    };

    const router = useRouter();
    const { customerProfile } = useUserProfile();
    const orderCalculationService = new OrderCalculationService();
    const verificationService = new VerificationService();
    const {removeItem} = useCartStore((state) => state);
    const { orderItems, orderType, setOrderItems } = useOrderStore(
        (state) => state,
    );

    const [guestOrderToken, setGuestOrderToken] = useState<string>();
    const [showOTPInputModal, setShowOTPInputModal] = useState<boolean>(false);
    const [showConfirmSendOTPModal, setShowConfirmSendOTPModal] =
        useState<boolean>(false);

    const orderService = new OrderService(loginUser?.accessToken);

    const sendOTPMutation = useMutation(
        (params: any) => {
            return verificationService.sendOTP(params);
        },
        {
            onSuccess: async (data) => {
                setShowOTPInputModal(true);
                console.log(document.cookie);
            },
        },
    );

    const verifyOTPMutation = useMutation(
        (params: any) => {
            return verificationService.verifyOTP(params);
        },
        {
            onSuccess: async (data) => {
                setGuestOrderToken(data);
                setShowOTPInputModal(false);
            },
        },
    );

    const createCashOrderByCustomerMutation = useMutation(
        (params: any) => {
            if (orderType === "delivery") {
                return orderService.createDeliveryOrderByCustomer(params);
            }
            return orderService.createPickupOrderByCustomer(params);
        },
        {
            onSuccess: async (data) => {
                orderItems.forEach((item) => {
                    removeItem(item.product.id);
                });
                await router.push(`/order-success/`);
            },
        },
    );

    const createCashOrderByGuestMutation = useMutation(
        (params: any) => {
            const guestOrderService = new OrderService(guestOrderToken);
            if (orderType === "delivery") {
                return guestOrderService.createDeliveryOrderByGuest(params);
            }
            return guestOrderService.createPickupOrderByGuest(params);
        },
        {
            onSuccess: async (data) => {
                orderItems.forEach((item) => {
                    removeItem(item.product.id);
                });
                await router.push(`/order-success/`);
            },
        },
    );

    const createZaloPayOrderMutation = useMutation(
        (params: any) => {
            if (loginUser) return orderService.createZaloPayOrder(params);
            else if (guestOrderToken) return new OrderService(guestOrderToken).createZaloPayOrder(params);
            return Promise.reject();
        },
        {
            onSuccess: async (data) => {
                const paymentUrl = data?.["order_url"];
                if (paymentUrl) {
                    await router.push(paymentUrl);
                }
            },
        },
    );

    const PickupSchema = z.object({
        customerName: z
            .string()
            .min(1, "Vui lòng nhập tên người nhận")
            .max(255, "Tên người nhận không được quá 255 ký tự"),
        customerPhone: z
            .string()
            .min(1, "Vui lòng nhập số điện thoại")
            .max(50, "Số điện thoại không được quá 50 ký tự"),
        customerEmail: z
            .string()
            .min(1, "Vui lòng nhập email")
            .email("Vui lòng nhập đúng định dạng email")
            .max(255, "Email không được quá 255 ký tự"),
        campaignId: z.number(),
        orderDetails: z.array(
            z.object({
                bookProductId: z.string(),
                quantity: z.number(),
                withPdf: z.boolean(),
                withAudio: z.boolean(),
            }),
        ),

        // allow only 1 payment method from array of payment methods id
        payment: z.number(),
    });
    const DeliverySchema = PickupSchema.extend({
        addressRequest: z.object({
            detail: z.string().min(1, "Vui lòng nhập địa chỉ chi tiết"),
            provinceCode: z.number({
                required_error: "Vui lòng chọn tỉnh/thành phố",
            }),
            districtCode: z.number({
                required_error: "Vui lòng chọn quận/huyện",
            }),
            wardCode: z.number({
                required_error: "Vui lòng chọn phường/xã",
            }),
        }),
    });
    //
    type FormType = Partial<z.infer<typeof DeliverySchema>>;
    const baseParams = getOrderParams(orderItems);
    const {
        register,
        watch,
        reset,
        resetField,
        setValue,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormType>({
        mode: "onBlur",

        resolver: zodResolver(
            orderType === "delivery" ? DeliverySchema : PickupSchema,
        ),
        defaultValues: {
            ...baseParams,
            addressRequest: {
                detail: loginUser
                    ? customerProfile?.user?.addressViewModel?.detail
                    : "",
                provinceCode: loginUser
                    ? customerProfile?.user?.addressViewModel?.provinceCode
                    : undefined,
                districtCode: loginUser
                    ? customerProfile?.user?.addressViewModel?.districtCode
                    : undefined,
                wardCode: loginUser
                    ? customerProfile?.user?.addressViewModel?.wardCode
                    : undefined,
            },
            payment: OrderPaymentMethods.ZaloPay.id,
        },
    });

    const {
        selectedProvinceCode,
        onProvinceChange,
        selectedDistrictCode,
        onDistrictChange,
        selectedWardCode,
        onWardChange,
        provinces,
        districts,
        wards,
        selectedProvince,
        selectedDistrict,
        selectedWard,
        provincesLoading,
        districtsLoading,
        wardsLoading,
    } = useSelectAddress({
        defaultProvinceCode: watch("addressRequest.provinceCode"),
        defaultDistrictCode: watch("addressRequest.districtCode"),
        defaultWardCode: watch("addressRequest.wardCode"),
    });

    useEffect(() => {
        if (
            watch("addressRequest.detail").trim() === "" &&
            customerProfile?.user?.addressViewModel?.detail
        ) {
            //resetField("addressRequest.detail");
        }
        if (loginUser !== null) {
            if (
                !selectedProvinceCode &&
                customerProfile?.user?.addressViewModel?.provinceCode
            ) {
                onProvinceChange(
                    customerProfile?.user?.addressViewModel?.provinceCode,
                );
            }
            if (
                !selectedDistrictCode &&
                customerProfile?.user?.addressViewModel?.districtCode
            ) {
                onDistrictChange(
                    customerProfile?.user?.addressViewModel?.districtCode,
                );
            }
            if (
                !selectedWardCode &&
                customerProfile?.user?.addressViewModel?.wardCode
            ) {
                onWardChange(customerProfile?.user?.addressViewModel?.wardCode);
            }
        }
    }, [
        customerProfile?.user?.addressViewModel?.detail,
        customerProfile?.user?.addressViewModel?.districtCode,
        customerProfile?.user?.addressViewModel?.provinceCode,
        customerProfile?.user?.addressViewModel?.wardCode,
        loginUser,
        onDistrictChange,
        onProvinceChange,
        onWardChange,
        selectedDistrictCode,
        selectedProvinceCode,
        selectedWardCode,
        watch,
    ]);

    const calcRequestParams = useMemo(() => {
        return {
            campaignId: watch("campaignId"),
            orderDetails: watch("orderDetails"),
            addressRequest: {
                detail: "",
                provinceCode: selectedProvinceCode,
                districtCode: selectedDistrictCode,
                wardCode: selectedWardCode,
            },
        };
    }, [selectedDistrictCode, selectedProvinceCode, selectedWardCode, watch]);

    const debouncedCalcRequestParams = useDebounce(calcRequestParams, 500);
    const isQueryEnabled = () => {
        if (orderType === "delivery") {
            return (
                !!selectedProvinceCode &&
                !!selectedDistrictCode &&
                !!selectedWardCode
            );
        } else if (orderType === "pickup") {
            return true;
        }
    };
    const {
        data: orderCalculation,
        isInitialLoading: isOrderCalculationLoading,
    } = useQuery(
        ["order_calculation", debouncedCalcRequestParams, orderType],
        () => {
            if (orderType === "delivery") {
                return orderCalculationService.getDeliveryCalculation(
                    debouncedCalcRequestParams,
                );
            } else if (orderType === "pickup") {
                return orderCalculationService.getPickupCalculation(
                    debouncedCalcRequestParams,
                );
            }
        },
        {
            enabled: isQueryEnabled(),
        },
    );

    useEffect(() => {
        setValue("addressRequest.provinceCode" as any, selectedProvinceCode);
    }, [selectedProvinceCode, setValue]);

    useEffect(() => {
        setValue("addressRequest.districtCode" as any, selectedDistrictCode);
    }, [selectedDistrictCode, setValue]);

    useEffect(() => {
        setValue("addressRequest.wardCode" as any, selectedWardCode);
    }, [selectedWardCode, setValue]);

    useEffect(() => {
        if (watch("customerName")?.trim() === "") {
            setValue("customerName", loginUser?.name);
        }
    }, [loginUser, setValue, watch]);

    useEffect(() => {
        if (watch("customerPhone")?.trim() === "") {
            setValue("customerPhone", loginUser?.phone);
        }
    }, [loginUser, setValue, watch]);

    useEffect(() => {
        if (watch("customerEmail")?.trim() === "") {
            setValue("customerEmail", loginUser?.email);
        }
    }, [loginUser, setValue, watch]);

    const onSubmit = async (data: FormType) => {
        if (!orderCalculation) return;
        if (loginUser) {
            try {
                if (data?.payment === OrderPaymentMethods.Cash.id) {
                    const params = {
                        ...data,
                        freight: orderCalculation?.freight || 0,
                    };
                    await toast.promise(
                        createCashOrderByCustomerMutation.mutateAsync(params),
                        {
                            loading: "Đang xử lý",
                            success: "Đặt hàng thành công",
                            error: (err) => {
                                return err.message || "Xảy ra lỗi khi đặt hàng";
                            },
                        },
                    );
                } else if (data?.payment === OrderPaymentMethods.ZaloPay.id) {
                    const params = {
                        ...data,
                        freight: orderCalculation?.freight || 0,
                        type:
                            orderType === "delivery"
                                ? OrderTypes.DELIVERY.id
                                : OrderTypes.PICKUP.id,
                        redirectUrl: `${window.location.origin}/order-success`,
                    };
                    await toast.promise(
                        createZaloPayOrderMutation.mutateAsync(
                            params,
                        ),
                        {
                            loading: "Đang xử lý",
                            success: "Bạn sẽ được chuyển đến trang thanh toán",
                            error: (err) => {
                                return err.message || "Xảy ra lỗi khi đặt hàng";
                            },
                        },
                    );
                }
            } catch (error) {
                console.log("error", error);
            }
        } else if (guestOrderToken) {
            try {
                if (data?.payment === OrderPaymentMethods.Cash.id) {
                    const params = {
                        ...data,
                        freight: orderCalculation?.freight || 0,
                    };
                    await toast.promise(
                        createCashOrderByGuestMutation.mutateAsync(params),
                        {
                            loading: "Đang xử lý",
                            success: "Đặt hàng thành công",
                            error: (err) => {
                                return err.message || "Xảy ra lỗi khi đặt hàng";
                            },
                        },
                    );
                } else if (data?.payment === OrderPaymentMethods.ZaloPay.id) {
                    const params = {
                        ...data,
                        freight: orderCalculation?.freight || 0,
                        type: orderType === "delivery" ? OrderTypes.DELIVERY.id : OrderTypes.PICKUP.id,
                        redirectUrl: `${window.location.origin}/order-success`,
                    };
                    await toast.promise(createZaloPayOrderMutation.mutateAsync(params), {
                        loading: "Đang xử lý",
                        success: "Bạn sẽ được chuyển đến trang thanh toán",
                        error: (err) => {
                            return err.message || "Xảy ra lỗi khi đặt hàng";
                        },
                    });
                }
            } catch (error) {
                console.log("error", error);
            }
        }
    };
    console.log("errors", errors);

    const onVerifyEmailButtonClick = () => {
        if (guestOrderToken) {
            toast("Email đã được xác thực");
            return;
        }

        if (!watch("customerEmail") || errors.customerEmail) {
            toast.error("Vui lòng nhập email hợp lệ để xác thực");
            return;
        }
        if (!watch("customerName") || errors.customerName) {
            toast.error("Vui lòng nhập tên hợp lệ để xác thực");
            return;
        }

        setShowConfirmSendOTPModal(true);
    };

    return (
        <Fragment>
            <main className="lg:min-h-full lg:overflow-hidden lg:flex lg:flex-row-reverse">
                <section
                    aria-labelledby="order-heading"
                    className="bg-gray-50 px-4 py-6 sm:px-6 lg:max-w-md w-full"
                >
                    <div className="max-w-lg mx-auto">
                        <div className="flex items-center justify-between">
                            <h2
                                id="order-heading"
                                className="text-lg font-medium text-gray-900"
                            >
                                Sản phẩm
                            </h2>
                        </div>
                        <div>
                            <ul
                                role="list"
                                className="divide-y divide-gray-200 border-b border-gray-200  overflow-y-auto max-h-96"
                            >
                                {orderItems.map((item) => {
                                    const calcItem =
                                        orderCalculation?.orderDetails?.find(
                                            (x) =>
                                                x?.bookProductId ===
                                                item?.product?.id,
                                        );
                                    const { product } = item;

                                    const salePrice =
                                        calcItem?.price ||
                                        product?.salePrice ||
                                        0;
                                    const discount =
                                        calcItem?.discount ||
                                        product?.discount ||
                                        0;
                                    const coverPrice =
                                        (salePrice * 100) / (100 - discount) ||
                                        0;
                                    const withPdf =
                                        calcItem?.withPdf ||
                                        item?.withPdf ||
                                        false;
                                    const withAudio =
                                        calcItem?.withAudio ||
                                        item?.withAudio ||
                                        false;
                                    const quantity =
                                        calcItem?.quantity ||
                                        item?.quantity ||
                                        0;
                                    const pdfPrice =
                                        product?.pdfExtraPrice || 0;
                                    const audioPrice =
                                        product?.audioExtraPrice || 0;

                                    const total =
                                        (salePrice + pdfPrice + audioPrice) *
                                        quantity;

                                    return (
                                        <li
                                            key={product?.id}
                                            className="flex py-6 space-x-4"
                                        >
                                            <Image
                                                width={500}
                                                height={500}
                                                src={product?.imageUrl || ""}
                                                alt=""
                                                className="flex-shrink-0 w-28 h-36 object-center object-cover bg-gray-200 rounded-sm shadow-sm"
                                            />
                                            <div className="flex flex-col justify-between space-y-3">
                                                <div className="text-sm font-medium">
                                                    <h3 className="text-gray-700 font-semibold">
                                                        {product?.title}
                                                    </h3>
                                                    <div className="text-gray-600 mt-2">
                                                        <span>
                                                            {new Intl.NumberFormat(
                                                                "vi-VN",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "VND",
                                                                },
                                                            ).format(salePrice)}
                                                        </span>
                                                        {discount > 0 ? (
                                                            <span className="text-gray-500 ml-2 text-xs line-through">
                                                                {new Intl.NumberFormat(
                                                                    "vi-VN",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "VND",
                                                                    },
                                                                ).format(
                                                                    coverPrice,
                                                                )}
                                                            </span>
                                                        ) : null}
                                                    </div>
                                                    <div
                                                        className={
                                                            "space-y-1 mt-3"
                                                        }
                                                    >
                                                        {withPdf ? (
                                                            <p className="text-gray-500">
                                                                PDF: +
                                                                {new Intl.NumberFormat(
                                                                    "vi-VN",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "VND",
                                                                    },
                                                                ).format(
                                                                    pdfPrice,
                                                                )}
                                                            </p>
                                                        ) : null}

                                                        {withAudio ? (
                                                            <p className="text-gray-500">
                                                                Audio: +
                                                                {new Intl.NumberFormat(
                                                                    "vi-VN",
                                                                    {
                                                                        style: "currency",
                                                                        currency:
                                                                            "VND",
                                                                    },
                                                                ).format(
                                                                    audioPrice,
                                                                )}
                                                            </p>
                                                        ) : null}
                                                        <p className="text-gray-500">
                                                            Số lượng: {quantity}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex">
                                                    <div className="text-lg text-indigo-600 hover:text-indigo-500">
                                                        {new Intl.NumberFormat(
                                                            "vi-VN",
                                                            {
                                                                style: "currency",
                                                                currency: "VND",
                                                            },
                                                        ).format(total)}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <dl className="text-sm font-medium text-gray-500 mt-10 space-y-6">
                                <div className="flex justify-between">
                                    <dt>Tạm tính</dt>
                                    <dd className="text-gray-900">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(
                                            orderCalculation?.subTotal || 0,
                                        )}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="flex flex-col gap-2">
                                        Phí vận chuyển
                                        {orderCalculation?.freight &&
                                        orderCalculation?.freight > 0 ? (
                                            <span
                                                className="rounded bg-gray-200 text-xs text-gray-600 py-0.5 px-2 w-fit uppercase">
                                                {orderCalculation?.freightName}
                                            </span>
                                        ) : null}
                                    </dt>
                                    <dd className="text-gray-900">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(
                                            orderCalculation?.freight || 0,
                                        )}
                                    </dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt>Giảm giá</dt>
                                    <dd className="text-gray-900">
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(
                                            orderCalculation?.discountTotal || 0,
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                        <p className="flex items-center justify-between text-sm font-medium text-gray-900 border-t border-gray-200 pt-6 mt-6">
                            <span className="text-base">Tổng tiền</span>
                            <span className="text-lg font-sembibold text-indigo-600">
                                {new Intl.NumberFormat("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }).format(orderCalculation?.total || 0)}
                            </span>
                        </p>
                        <p className="text-sm font-medium text-gray-500">
                            Đã bao gồm VAT nếu có
                        </p>
                    </div>
                </section>
                {/* Checkout form */}
                <section
                    className="flex-auto overflow-y-auto px-4 pt-12 pb-16 sm:px-6 sm:pt-16 lg:px-8 lg:pt-0 lg:pb-0">
                    <div className="max-w-lg mx-auto">
                        <Link href="/cart"
                              className="underline mb-4 underline-offset-2 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                            <IoIosArrowRoundBack />
                            Giỏ hàng
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-700 sm:text-4xl">
                            Xác nhận đơn hàng
                        </h1>
                        <form
                            className="mt-6"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <Form.GroupLabel label="Hình thức nhận hàng" />
                            <div className="mt-3">
                                <OrderPlacementCard orderType={orderType} />
                                <div className="px-3 mt-4">
                                    <OrderPlacementDetail
                                        orderType={orderType}
                                    />
                                </div>
                            </div>
                            <Form.Divider />
                            <Form.GroupLabel label="Thông tin người nhận" />
                            <div className="mt-3 space-y-4">
                                <div>
                                    <Form.Input<FormType>
                                        register={register}
                                        label={"Email"}
                                        fieldName={"customerEmail"}
                                        placeholder={"Nhập địa chỉ email"}
                                        readOnly={
                                            !!loginUser?.accessToken ||
                                            !!guestOrderToken
                                        }
                                        errorMessage={
                                            errors.customerEmail?.message
                                        }
                                        extraInputClassName={
                                            !loginUser?.accessToken
                                                ? "pr-36"
                                                : ""
                                        }
                                        renderTrail={
                                            !loginUser?.accessToken ? (
                                                guestOrderToken ? (
                                                    <div
                                                        className="text-green-500 text-sm font-medium bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md mr-1">
                                                        Đã xác thực
                                                    </div>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={
                                                            onVerifyEmailButtonClick
                                                        }
                                                        className="text-indigo-500 text-sm font-medium bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md mr-1"
                                                    >
                                                        Xác thực email
                                                    </button>
                                                )
                                            ) : null
                                        }
                                    />
                                </div>

                                <div className={"grid sm:grid-cols-2 gap-4"}>
                                    <div>
                                        <Form.Input<FormType>
                                            register={register}
                                            label={"Họ và tên"}
                                            placeholder={"Nhập họ và tên"}
                                            fieldName={"customerName"}
                                            readOnly={
                                                !!loginUser?.accessToken ||
                                                !!guestOrderToken
                                            }
                                            errorMessage={
                                                errors.customerName?.message
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Form.Input<FormType>
                                            register={register}
                                            label={"Số điện thoại"}
                                            placeholder={"Nhập số điện thoại"}
                                            fieldName={"customerPhone"}
                                            readOnly={!!loginUser?.accessToken}
                                            errorMessage={
                                                errors.customerPhone?.message
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            <Form.Divider />
                            <Form.GroupLabel label="Địa chỉ nhận hàng" />
                            {orderType === "delivery" ? (
                                <div className="mt-3 space-y-4">
                                    <Form.Input<FormType>
                                        register={register}
                                        fieldName={"addressRequest.detail"}
                                        label={"Địa chỉ chi tiết"}
                                        placeholder={
                                            "Toà nhà, số nhà, tên đường"
                                        }
                                        errorMessage={
                                            errors.addressRequest?.detail
                                                ?.message
                                        }
                                    />

                                    <div>
                                        <Form.Label label="Tỉnh / Thành phố" />
                                        <SelectBox<IProvince>
                                            value={selectedProvince || null}
                                            placeholder={
                                                provincesLoading
                                                    ? "Đang tải..."
                                                    : "Chọn tỉnh / thành phố"
                                            }
                                            onValueChange={(p) => {
                                                if (
                                                    p.code ===
                                                    watch(
                                                        "addressRequest.provinceCode",
                                                    )
                                                )
                                                    return;

                                                onProvinceChange(p.code);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={provinces}
                                            disabled={provincesLoading}
                                        />
                                        <ErrorMessage>
                                            {
                                                errors.addressRequest
                                                    ?.provinceCode?.message
                                            }
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <Form.Label label="Quận / Huyện" />
                                        <SelectBox<IDistrict>
                                            value={selectedDistrict || null}
                                            placeholder={
                                                districtsLoading
                                                    ? "Đang tải..."
                                                    : "Chọn quận / huyện"
                                            }
                                            onValueChange={(d) => {
                                                if (
                                                    d.code ===
                                                    watch(
                                                        "addressRequest.districtCode",
                                                    )
                                                )
                                                    return;
                                                onDistrictChange(d.code);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={districts}
                                            disabled={districtsLoading}
                                        />
                                        <ErrorMessage>
                                            {
                                                errors.addressRequest
                                                    ?.districtCode?.message
                                            }
                                        </ErrorMessage>
                                    </div>

                                    <div>
                                        <Form.Label label="Phường / Xã" />
                                        <SelectBox<IWard>
                                            value={selectedWard || null}
                                            placeholder={
                                                wardsLoading
                                                    ? "Đang tải..."
                                                    : "Chọn phường / xã"
                                            }
                                            onValueChange={(w) => {
                                                if (
                                                    w.code ===
                                                    watch(
                                                        "addressRequest.wardCode",
                                                    )
                                                )
                                                    return;
                                                onWardChange(w.code);
                                            }}
                                            displayKey="nameWithType"
                                            dataSource={wards}
                                            disabled={wardsLoading}
                                        />
                                        <ErrorMessage>
                                            {
                                                errors.addressRequest?.wardCode
                                                    ?.message
                                            }
                                        </ErrorMessage>
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-3">
                                    <p className="text-gray-500 text-sm">
                                        Địa chỉ nhận hàng sẽ được cập nhật sau
                                        khi đơn hàng được xác nhận và được gửi
                                        qua email của bạn.
                                    </p>
                                </div>
                            )}
                            <Form.Divider />
                            <Form.GroupLabel label="Phương thức thanh toán" />
                            <div className="mt-3 space-y-4">
                                <RadioGroup
                                    defaultChecked={true}
                                    className={
                                        "divide-y divide-gray-200 border border-gray-200 rounded-md"
                                    }
                                    value={watch("payment")}
                                    onChange={(v) => {
                                        setValue("payment", v);
                                    }}
                                >
                                    {PaymentMethods.map((p) => (
                                        <RadioGroup.Option
                                            key={p.id}
                                            value={p.id}
                                        >
                                            {({ checked, active }) => (
                                                <label className="relative p-4 flex cursor-pointer focus:outline-none">
                                                    <span
                                                        className={classNames(
                                                            checked
                                                                ? "bg-indigo-600 border-transparent"
                                                                : "bg-white border-gray-300",
                                                            active
                                                                ? "ring-2 ring-offset-2 ring-indigo-500"
                                                                : "",
                                                            "h-4 w-4 mt-0.5 cursor-pointer rounded-full border flex items-center justify-center",
                                                        )}
                                                        aria-hidden="true"
                                                    >
                                                        <span className="rounded-full bg-white w-1.5 h-1.5" />
                                                    </span>
                                                    <div className="ml-3 flex gap-2 items-center">
                                                        <Image
                                                            width={100}
                                                            height={100}
                                                            className="w-6 h-6"
                                                            src={p.logo.src}
                                                            alt={""}
                                                        />
                                                        <span
                                                            id="privacy-setting-0-label"
                                                            className="block text-sm font-medium"
                                                        >
                                                            {p.displayName}
                                                        </span>
                                                    </div>
                                                </label>
                                            )}
                                        </RadioGroup.Option>
                                    ))}
                                </RadioGroup>
                            </div>
                            <button
                                disabled={
                                    isOrderCalculationLoading || isSubmitting
                                }
                                type="submit"
                                className="w-full mt-6 bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                Đặt hàng
                            </button>
                        </form>
                    </div>
                </section>
            </main>
            <div className={"grid grid-cols-2 gap-3"}>
                <div>
                    {/*<pre>{JSON.stringify(watch(), null, 2)}</pre>*/}
                </div>
                <div>
                    <div>
                        isOrderCalculationLoading:{" "}
                        {isOrderCalculationLoading.toString()}
                    </div>
                    <pre>{JSON.stringify(orderCalculation, null, 2)}</pre>
                </div>
            </div>

            {!loginUser?.accessToken && (
                <ConfirmModal
                    color={"blue"}
                    isOpen={showConfirmSendOTPModal}
                    onClose={() => {
                        setOtp(["", "", "", "", "", ""]);
                        setShowConfirmSendOTPModal(false);
                    }}
                    onConfirm={async () => {
                        await toast.promise(
                            sendOTPMutation.mutateAsync({
                                to: watch("customerEmail"),
                                subject: "Boek - Xác thực địa chỉ email",
                                body: `Mã OTP của bạn là: `,
                            }),
                            {
                                loading: "Đang gửi mã OTP",
                                success:
                                    "Đã gửi mã OTP. Vui lòng kiểm tra email để xác thực (vui lòng kiểm tra hộp thư rác nếu không tìm thấy email)",
                                error: "Gửi mã OTP thất bại",
                            },
                            {
                                duration: 5000,
                            },
                        );
                        setShowConfirmSendOTPModal(false);
                    }}
                    title={"Xác nhận gửi mã OTP"}
                    content={`Bạn có chắc chắn muốn gửi mã xác thực OTP đến địa chỉ email ${watch(
                        "customerEmail",
                    )}?`}
                    confirmText={"Đồng ý"}
                />
            )}

            {!loginUser?.accessToken && (
                <TransitionModal
                    isOpen={showOTPInputModal}
                    onClose={() => setShowOTPInputModal(false)}
                >
                    <Fragment>
                        <div className={"p-8"}>
                            <div
                                className={
                                    "rounded-full bg-indigo-50 w-14 h-14 flex justify-center items-center mx-auto"
                                }
                            >
                                <MdEmail
                                    className={"text-indigo-500 text-4xl"}
                                />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900 text-center mt-4">
                                Xác thực địa chỉ email
                            </h1>
                            <p className="text-gray-500 text-center mt-4">
                                Vui lòng nhập mã OTP đã được gửi đến địa chỉ
                                email {watch("customerEmail")}
                            </p>
                            <div className="flex justify-center items-center mt-4">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={digit}
                                        onChange={(event) =>
                                            handleChange(event, index)
                                        }
                                        onKeyDown={(event) =>
                                            handleKeyDown(event, index)
                                        }
                                        maxLength={1}
                                        className="w-12 h-12 mx-2 rounded-lg border-gray-300 border-2 text-center text-2xl font-bold"
                                        ref={(el) => (refs.current[index] = el)}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-center items-center mt-4 p-4">
                            <button
                                onClick={async () => {
                                    if (
                                        !otp.join("").trim() ||
                                        otp.join("").trim().length !== 6
                                    ) {
                                        toast.error("Mã OTP không hợp lệ");
                                        return;
                                    }
                                    await toast.promise(
                                        verifyOTPMutation.mutateAsync({
                                            name: watch("customerName"),
                                            email: watch("customerEmail"),
                                            otp: Number(otp.join("")),
                                        }),
                                        {
                                            loading: "Đang xác thực mã OTP",
                                            success: "Xác thực thành công",
                                            error: (err) =>
                                                err?.message ||
                                                "Xác thực thất bại",
                                        },
                                        {
                                            duration: 5000,
                                        },
                                    );
                                }}
                                className="w-full mt-6 bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </Fragment>
                </TransitionModal>
            )}
        </Fragment>
    );
};

CheckoutPage.getLayout = (page) => {
    return <CustomerLayout>{page}</CustomerLayout>;
};

export default CheckoutPage;
