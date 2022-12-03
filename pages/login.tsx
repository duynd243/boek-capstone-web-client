import React from "react";
import { NextPage } from "next";
import LoginSignUpLayout from "../components/Layout/LoginSignUpLayout";
import LoginForm from "../components/AuthForm/LoginForm";

const Login: NextPage = () => {
  return (
    <LoginSignUpLayout>
      <LoginForm />
    </LoginSignUpLayout>
  );
};

export default Login;
