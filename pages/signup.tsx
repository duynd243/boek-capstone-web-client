import React from "react";
import { NextPage } from "next";
import LoginSignUpLayout from "../components/Layout/LoginSignUpLayout";
import SignUpForm from "../components/AuthForm/SignUpForm";

const Signup: NextPage = () => {
  return (
    <LoginSignUpLayout>
      <SignUpForm />
    </LoginSignUpLayout>
  );
};

export default Signup;
