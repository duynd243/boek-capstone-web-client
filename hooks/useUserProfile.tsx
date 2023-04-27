import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "../services/UserService";
import { Roles } from "../constants/Roles";

export const useUserProfile = () => {
    const {loginUser} = useAuth();

     const {
        data: adminProfile,
    } = useQuery(["adminProfile"], new UserService(loginUser?.accessToken).getProfileByAdmin
        , {
            enabled: !!loginUser?.accessToken && loginUser?.role === Roles.SYSTEM.id,
        },
    );

    const {
        data: issuerProfile,
    } = useQuery(["issuerProfile"], new UserService(loginUser?.accessToken).getProfileByIssuer
        , {
            enabled: !!loginUser?.accessToken && loginUser?.role === Roles.ISSUER.id,
        },
    );

    const {
        data: customerProfile,
    } = useQuery(["customerProfile"], new UserService(loginUser?.accessToken).getProfileByCustomer
        , {
            enabled: !!loginUser?.accessToken && loginUser?.role === Roles.CUSTOMER.id,
        },
    );
    return {
        adminProfile,
        issuerProfile,
        customerProfile,
    };
}