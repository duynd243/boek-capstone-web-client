import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/router";
import { IProtectedRoute } from "../constants/ProtectedRoutes";
import { findRole } from "../constants/Roles";

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

  return <Fragment>{!isLoading && children}</Fragment>;
};

export default ProtectedRouteWrapper;
