import React, { useMemo } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import Image from "next/image";
import { isValidImageSrc } from "../utils/helper";
import DefaultAvatar from "../assets/images/default-avatar.png";


type Props = {
    avatars: {
        src?: string;
        title?: string;
    }[];
    max?: number;
    size?: "sm" | "md" | "lg" | number;
    restTitle?: string;
    hoverElements?: React.ReactNode[];
};

const AvatarGroup: React.FC<Props> = ({
                                          avatars,
                                          max = 3,
                                          size = "sm",
                                          restTitle,
                                          hoverElements,
                                      }) => {
    let sizeClasses = "";
    let restTextSizeClass = "";
    switch (size) {
        case "md":
            sizeClasses = "h-8 w-8";
            restTextSizeClass = "text-xs";
            break;
        case "lg":
            sizeClasses = "h-10 w-10";
            restTextSizeClass = "text-sm";
            break;
        case "sm":
            sizeClasses = "h-6 w-6";
            restTextSizeClass = "text-xs";
            break;
    }

    const styles: React.CSSProperties =
        typeof size === "number"
            ? {
                width: `${size}px`,
                height: `${size}px`,
                fontSize: `${size / 2}px`,
            }
            : {};

    const rest = useMemo(() => avatars.length - max, [avatars, max]);

    return (
        <div className="flex items-center group">
            {avatars.slice(0, max).map((avatar, index) => (

                <HoverCard.Root key={index}>
                    <HoverCard.Trigger asChild>
                        <Image
                            title={
                                hoverElements && hoverElements[index] ? "" : avatar.title || ""
                            }
                            width={500}
                            height={500}
                            className={`${sizeClasses} first:ml-0 -ml-2 group-hover:ml-0 rounded-full border border-slate-50 object-cover shadow-sm drop-shadow-sm transition-all duration-300`}
                            style={styles}
                            src={
                                avatar.src && isValidImageSrc(avatar.src)
                                    ? avatar.src
                                    : DefaultAvatar.src
                            }
                            alt={avatar.title || ""}
                        />
                    </HoverCard.Trigger>
                    <HoverCard.Portal>
                        <HoverCard.Content
                            className={"radix-side-top:animate-slide-up radix-side-bottom:animate-slide-down rounded-lg p-4 pt-0 md:w-full animate-fade-in"}
                            align="center"
                            sideOffset={4}>
                            <HoverCard.Arrow className="fill-current text-gray-50" />
                            {hoverElements && hoverElements[index]}
                        </HoverCard.Content>
                    </HoverCard.Portal>
                </HoverCard.Root>
            ))}
            {rest > 0 && (
                <div
                    title={`${restTitle ? rest + " " + restTitle : ""}`}
                    style={styles}
                    className={`flex ${sizeClasses} ${restTextSizeClass} group-hover:ml-0 -ml-2 items-center justify-center rounded-full border border-slate-50 bg-slate-200 font-medium text-gray-500 z-10`}
                >
                    +{rest}
                </div>
            )}
        </div>
    );
};

export default AvatarGroup;
