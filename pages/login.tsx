import React from "react";
import LoginSignUpLayout from "../components/Layout/LoginSignUpLayout";
import LoginForm from "../components/AuthForm/LoginForm";
import { NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
    return <LoginForm />;
};

Login.getLayout = (page) => <LoginSignUpLayout>{page}</LoginSignUpLayout>;

export default Login;
