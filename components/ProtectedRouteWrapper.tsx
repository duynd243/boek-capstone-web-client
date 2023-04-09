import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { IProtectedRoute } from "../constants/ProtectedRoutes";
import { findRole } from "../constants/Roles";

import { createSignalRContext } from "react-signalr";

export const SignalRContext = createSignalRContext();
type Props = {
    routeData: IProtectedRoute;
    children: React.ReactNode;
};

const ProtectedRouteWrapper: React.FC<Props> = ({ children, routeData }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { loginUser } = useAuth();
    const router = useRouter();

    useEffect(() => {
        (async () => {
            if (!loginUser) {
                await router.push("/");
            } else if (
                routeData.allowedRoleIDs !== "authenticated" &&
                !routeData.allowedRoleIDs.includes(loginUser?.role)
            ) {
                const role = findRole(loginUser?.role);
                await router.push(role ? role.defaultRoute : "/");
            } else setIsLoading(false);
        })();
    }, [loginUser, routeData.allowedRoleIDs, router]);

    return <SignalRContext.Provider
        connectEnabled={!!loginUser?.accessToken}
        accessTokenFactory={() => loginUser?.accessToken ?? ""}
        dependencies={[loginUser]}
        url={"https://server.boek.live/notificationHub"}
    >{!isLoading && children}</SignalRContext.Provider>;
};

export default ProtectedRouteWrapper;
