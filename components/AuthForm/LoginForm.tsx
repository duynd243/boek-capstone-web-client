import React from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { inputClass } from "../Layout/LoginSignUpLayout";
import SocialLoginButton, {
  ActionTypes,
  AuthProviders,
} from "./SocialLoginButton";
import Link from "next/link";
import TransitionModal from "../TransitionModal";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";

type Props = {};

const LoginForm: React.FC<Props> = () => {
  const { handleGoogleSignIn } = useAuth();

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const form = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("Email is required")
        .email("Email is invalid"),
      password: Yup.string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters"),
    }),
    onSubmit: (values) => {
      console.log(values);
      //handleEmailPasswordSignIn(values.email, values.password);
    },
  });
  return (
    <>
      <TransitionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="relative mx-auto w-full max-w-lg rounded-md bg-white p-4 shadow-lg drop-shadow-2xl">
          <div className="mt-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <div className="mt-2 text-center">
              <h4 className="text-lg font-medium text-gray-800">
                Successfully accepted!
              </h4>
              <p className="mt-2 text-[15px] leading-relaxed text-gray-500">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Nunc
                eget lorem dolor sed viverra ipsum nunc. Consequat id porta nibh
                venenatis.
              </p>
            </div>
          </div>
          <div className="mt-3 items-center gap-2 sm:flex">
            <button
              onClick={() =>
                Swal.fire({
                  title: "Are you sure",
                  showConfirmButton: true,
                })
              }
              className="mt-2 w-full flex-1 rounded-md bg-indigo-600 p-2.5 text-white outline-none ring-indigo-600 ring-offset-2 focus:ring-2"
            >
              Dashboard
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-2 w-full flex-1 rounded-md border p-2.5 text-gray-800 outline-none ring-indigo-600 ring-offset-2 focus:ring-2"
            >
              Undo
            </button>
          </div>
        </div>
      </TransitionModal>
      <h1 className="mb-6 text-3xl font-bold text-slate-800">
        Chào bạn trở lại! ✨
      </h1>
      {/* Form */}
      <form onSubmit={form.handleSubmit} className="text-[#475569]">
        <div>
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
        </div>
        <SocialLoginButton
          onClick={handleGoogleSignIn}
          provider={AuthProviders.GOOGLE}
          actionType={ActionTypes.LOGIN}
        />
        <SocialLoginButton
          wrapperClasses={"mt-4"}
          provider={AuthProviders.FACEBOOK}
          actionType={ActionTypes.LOGIN}
        />
      </form>
      {/* Footer */}
      <div className="mt-6 border-t-[1px] border-slate-200 pt-5">
        <div className="text-sm">
          Bạn chưa có tài khoản?{" "}
          <Link
            className={"font-medium text-indigo-500 hover:text-indigo-600"}
            href="/signup"
          >
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
