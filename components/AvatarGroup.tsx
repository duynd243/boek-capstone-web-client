import Image from "next/image";
import React, {useMemo} from "react";
import DefaultAvatar from "../assets/images/default-avatar.png";
import {isValidImageSrc} from "../utils/helper";

type Props = {
    avatars: {
        src?: string;
        title?: string;
    }[];
    max?: number;
    size?: "sm" | "md" | "lg" | number;
    restTitle?: string;
};

const AvatarGroup: React.FC<Props> = ({
                                          avatars,
                                          max = 3,
                                          size = "sm",
                                          restTitle,
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
                <Image
                    key={index}
                    title={avatar.title}
                    width={1000}
                    height={1000}
                    className={`${sizeClasses} first:ml-0 -ml-2 group-hover:ml-0 rounded-full border border-slate-50 object-cover shadow-sm drop-shadow-sm transition-all duration-300`}
                    style={styles}
                    src={
                        avatar.src && isValidImageSrc(avatar.src)
                            ? avatar.src
                            : DefaultAvatar.src
                    }
                    alt={avatar.title || ""}
                />
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
