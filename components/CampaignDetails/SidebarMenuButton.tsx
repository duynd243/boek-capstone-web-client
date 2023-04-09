import { forwardRef } from "react";

interface Props {
}

export type Ref = HTMLButtonElement;

export const SidebarMenuButton = forwardRef<Ref, Props>((props, ref) => (
    <button ref={ref} className="rounded-full text-slate-400 hover:text-slate-500">
        <span className="sr-only">Menu</span>
        <svg
            className="h-8 w-8 fill-current"
            viewBox="0 0 32 32"
        >
            <circle cx="16" cy="16" r="2" />
            <circle cx="10" cy="16" r="2" />
            <circle cx="22" cy="16" r="2" />
        </svg>
    </button>
));

SidebarMenuButton.displayName = "SidebarMenuButton";