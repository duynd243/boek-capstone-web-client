import React from "react";
import LoginSignUpLayout from "../components/Layout/LoginSignUpLayout";
import LoginForm from "../components/AuthForm/LoginForm";
import { NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
    return <LoginForm />;
};

Login.getLayout = (page) => <LoginSignUpLayout childrenWrapperClass="mx-auto my-auto w-full max-w-md px-4 py-8">{page}</LoginSignUpLayout>;

export default Login;
