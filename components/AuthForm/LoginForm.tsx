import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { inputClass } from "../Layout/LoginSignUpLayout";
import SocialLoginButton, {
    ActionTypes,
    AuthProviders,
} from "./SocialLoginButton";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

type Props = {};

const LoginForm: React.FC<Props> = () => {
    const { handleGoogleSignIn } = useAuth();

    return (
        <>
            <h1 className="mb-6 text-3xl font-bold text-slate-800">
                Chào bạn trở lại với Boek ✨
            </h1>
            {/* Form */}
            <form className="text-[#475569]">
                {/* <div>
                    <div>
                        <label className="mb-1 block text-sm font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            value={form.values.email}
                            onChange={form.handleChange}
                            id="email"
                            className={inputClass}
                            type="email"
                        />
                    </div>
                    <div className="mt-4">
                        <label
                            className="mb-1 block text-sm font-medium"
                            htmlFor="password"
                        >
                            Mật khẩu
                        </label>
                        <input
                            value={form.values.password}
                            onChange={form.handleChange}
                            id="password"
                            className={inputClass}
                            type="password"
                            autoComplete="on"
                        />
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-2">
                    <div className="mr-1">
                        <a className="text-sm underline hover:no-underline">
                            Quên mật khẩu?
                        </a>
                    </div>
                    <button
                        type="submit"
                        className="transform cursor-pointer rounded-md bg-indigo-600 px-5 py-2.5 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-indigo-500 focus:bg-indigo-500 focus:outline-none"
                    >
                        Đăng nhập
                    </button>
                </div>
                <div className="my-5 text-center text-xs font-medium uppercase text-gray-500">
                    Hoặc đăng nhập với
                </div> */}

                <div className="my-5 text-xs font-medium uppercase text-gray-500">
                    Chọn hình thức đăng nhập
                </div>
                <SocialLoginButton
                    onClick={handleGoogleSignIn}
                    provider={AuthProviders.GOOGLE}
                    actionType={ActionTypes.LOGIN}
                />
                {/* <SocialLoginButton
                    wrapperClasses={"mt-4"}
                    provider={AuthProviders.FACEBOOK}
                    actionType={ActionTypes.LOGIN}
                /> */}
            </form>
            {/* Footer */}
            <div className="mt-6 border-t-[1px] border-slate-200 pt-5">
                <div className="text-sm text-gray-500">
                    Nếu tài khoản được đăng nhập lần đầu, bạn sẽ được chuyển
                    hướng đến trang đăng ký để hoàn tất quá trình đăng ký.
                    {/* <Link
                        className={"font-medium text-indigo-500 hover:text-indigo-600"}
                        href="/signup"
                    >
                        Đăng ký ngay
                    </Link> */}
                </div>
            </div>
        </>
    );
};

export default LoginForm;
