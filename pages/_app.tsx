import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { AppProps } from "next/app";
import "../styles/global.scss";
import { Toaster } from "react-hot-toast";
import { initFirebaseApp } from "../services/initFirebase";
import { Fragment, ReactElement, ReactNode, useEffect, useState } from "react";
import { NextPage } from "next";
import { AuthContextProvider } from "../context/AuthContext";
import ProtectedRouteWrapper from "../components/ProtectedRouteWrapper";
import { useRouter } from "next/router";
import { IProtectedRoute, ProtectedRoutes } from "../constants/ProtectedRoutes";

const queryClient = new QueryClient();

initFirebaseApp();
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type CustomAppProps = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: CustomAppProps) {
  const [isProtectedRoute, setIsProtectedRoute] = useState<
    IProtectedRoute | undefined
  >(undefined);
  const getLayout = Component.getLayout ?? ((page) => page);
  const router = useRouter();

  useEffect(() => {
    setIsProtectedRoute(
      ProtectedRoutes.find((route) => router.pathname.startsWith(route.path))
    );
  }, [router.pathname]);

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
      <Toaster position="bottom-right" />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
