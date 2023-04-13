import React from "react";
import LoginSignUpLayout from "../components/Layout/LoginSignUpLayout";
import SignUpForm from "../components/AuthForm/SignUpForm";
import { NextPageWithLayout } from "./_app";

const Signup: NextPageWithLayout = () => {
    return <SignUpForm />;
};
Signup.getLayout = (page) => <LoginSignUpLayout>{page}</LoginSignUpLayout>;
export default Signup;
