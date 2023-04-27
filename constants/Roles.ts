import {
    ADMIN_SETTINGS_MENUS,
    ADMIN_SIDEBAR_MENUS,
    CUSTOMER_SETTINGS_MENUS,
    ISidebarMenu,
    ISidebarMenuGroup,
    ISSUER_SETTINGS_MENUS,
    ISSUER_SIDEBAR_MENUS,
} from "./SidebarMenus";

export interface IRole {
    id: number;
    name: string;
    displayName: string;
    defaultRoute: string;
    baseUrl: string;
    sidebarMenuGroups?: ISidebarMenuGroup[];
    settingsMenus?: ISidebarMenu[];
}

export const Roles = {
    SYSTEM: {
        id: 1,
        name: "admin",
        displayName: "Quản trị viên",
        defaultRoute: "/admin/dashboard",
        baseUrl: "/admin",
        sidebarMenuGroups: ADMIN_SIDEBAR_MENUS,
        settingsMenus: ADMIN_SETTINGS_MENUS,
    },
    ISSUER: {
        id: 2,
        name: "issuer",
        displayName: "Nhà phát hành",
        defaultRoute: "/issuer/dashboard",
        baseUrl: "/issuer",
        sidebarMenuGroups: ISSUER_SIDEBAR_MENUS,
        settingsMenus: ISSUER_SETTINGS_MENUS,
    },
    STAFF: {
        id: 3,
        name: "staff",
        displayName: "Nhân viên",
        defaultRoute: "/",
        baseUrl: "/",
    },
    CUSTOMER: {
        id: 4,
        name: "customer",
        displayName: "Khách hàng",
        defaultRoute: "/",
        baseUrl: "/",
        settingsMenus: CUSTOMER_SETTINGS_MENUS,
    },
} satisfies Record<string, IRole>;

export const findRole = (id?: number): IRole | undefined => {
    return Object.values(Roles).find((role) => role.id === id);
};