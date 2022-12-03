import {
  ADMIN_SIDEBAR_MENUS,
  ISidebarMenuGroup,
  ISSUER_SIDEBAR_MENUS,
} from "./SidebarMenus";

export interface IRole {
  id: number;
  name: string;
  displayName: string;
  defaultRoute: string;
  sidebarMenuGroups?: ISidebarMenuGroup[];
}

export class Roles {
  static readonly SYSTEM: IRole = {
    id: 0,
    name: "system",
    displayName: "Hệ thống",
    defaultRoute: "/admin",
    sidebarMenuGroups: ADMIN_SIDEBAR_MENUS,
  };
  static readonly ISSUER: IRole = {
    id: 2,
    name: "issuer",
    displayName: "Nhà phát hành",
    defaultRoute: "/issuer",
    sidebarMenuGroups: ISSUER_SIDEBAR_MENUS,
  };
  static readonly CUSTOMER: IRole = {
    id: 3,
    name: "customer",
    displayName: "Khách hàng",
    defaultRoute: "/",
  };
}

export const findRole = (id?: number): IRole | undefined => {
  return Object.values(Roles).find((role) => role.id === id);
};
