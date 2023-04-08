import React from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import CustomerHomePage from "../components/CustomerHomePage";
import CustomerLayout from "../components/Layout/CustomerLayout";

const Index = () => {
    const router = useRouter();
    const { loginUser, logOut } = useAuth();

    return (
        <CustomerLayout>
            <CustomerHomePage />
        </CustomerLayout>
    )
        ;
};

export default Index;
