import {Roles} from "./Roles";

export interface IProtectedRoute {
    path: string;
    allowedRoleIDs: number[] | "authenticated";
}

export const ProtectedRoutes: IProtectedRoute[] = [
    {
        path: "/admin2",
        allowedRoleIDs: [Roles.SYSTEM.id],
    },
    {
        path: "/issuer2",
        allowedRoleIDs: [Roles.ISSUER.id],
    },
    {
        path: "/protected",
        allowedRoleIDs: "authenticated",
    },
];
