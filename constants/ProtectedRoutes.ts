import { Roles } from "./Roles";

export interface IProtectedRoute {
    path: string;
    allowedRoleIDs: number[] | "authenticated";
}

export const ProtectedRoutes: IProtectedRoute[] = [
    {
        path: "/admin",
        allowedRoleIDs: [Roles.SYSTEM.id],
    },
    {
        path: "/issuer",
        allowedRoleIDs: [Roles.ISSUER.id],
    },
    {
        path: "/profile",
        allowedRoleIDs: [Roles.CUSTOMER.id],
    },
    {
        path: "/orders",
        allowedRoleIDs: [Roles.CUSTOMER.id],
    },
    {
        path: "/protected",
        allowedRoleIDs: "authenticated",
    },
];
