import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import "../styles/global.scss";
import { Toaster, ToasterProps } from "react-hot-toast";
import { initFirebaseApp } from "../old-services/initFirebase";
import { Fragment, ReactElement, ReactNode, useMemo } from "react";
import { NextPage } from "next";
import { AuthContextProvider, useAuth } from "../context/AuthContext";
import ProtectedRouteWrapper from "../components/ProtectedRouteWrapper";
import { useRouter } from "next/router";
import { ProtectedRoutes } from "../constants/ProtectedRoutes";
import "react-day-picker/dist/style.css";

const queryClient = new QueryClient();

initFirebaseApp();
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type CustomAppProps = AppProps & {
    Component: NextPageWithLayout;
};

const toasterConfig: ToasterProps = {
    position: "top-right",
    toastOptions: {
        className: "custom-toast",
    },
    gutter: 12,
};

export default function App({ Component, pageProps }: CustomAppProps) {
    const getLayout = Component.getLayout ?? ((page) => page);


    const router = useRouter();

    const isProtectedRoute = useMemo(
        () =>
            ProtectedRoutes.find((route) => router.pathname.startsWith(route.path)),
        [router.pathname],
    );


    const component = getLayout(<Component {...pageProps} />);
    return (
        <QueryClientProvider client={queryClient}>

            <AuthContextProvider>
                    {isProtectedRoute ? (
                        <ProtectedRouteWrapper routeData={isProtectedRoute}>
                            {component}
                        </ProtectedRouteWrapper>
                    ) : (
                        <Fragment>{component}</Fragment>
                    )}
            </AuthContextProvider>
            <Toaster {...toasterConfig} />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
