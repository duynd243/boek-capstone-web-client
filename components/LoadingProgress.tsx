import React from "react";

type Props = {
    label?: string;
};

const LoadingProgress: React.FC<Props> = ({ label = "Đang tải..." }) => {
    return (
        <div className="flex h-screen w-screen flex-col items-center justify-center">
            {/*<svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"*/}
            {/*     className='mb-4 bg-transparent block'*/}
            {/*     width="140px" height="140px" viewBox="0 0 100 100"*/}
            {/*     preserveAspectRatio="xMidYMid">*/}
            {/*    <path d="M20 25L80 25L80 75L20 75Z" fill="#ffffff" stroke="#1a1a9a" strokeWidth={3}></path>*/}
            {/*    <path d="M50 25L80 25L80 75L50 75" fill="#ffffff" stroke="#1a1a9a" strokeWidth={3}*/}
            {/*          strokeLinejoin="round" strokeLinecap="round">*/}
            {/*        <animate attributeName="d" dur="1s" repeatCount="indefinite" begin="0s" keyTimes="0;0.5;0.501;1"*/}
            {/*                 values="M50 25L80 25L80 75L50 75;M50 25L50 20L50 80L50 75;M50 25L80 25L80 75L50 75;M50 25L80 25L80 75L50 75"></animate>*/}
            {/*        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" begin="0s"*/}
            {/*                 keyTimes="0;0.5;0.5001;1" values="1;1;0;0"></animate>*/}
            {/*    </path>*/}
            {/*    <path d="M50 25L80 25L80 75L50 75" fill="#ffffff" stroke="#1a1a9a" strokeWidth={3}*/}
            {/*          strokeLinejoin="round" strokeLinecap="round">*/}
            {/*        <animate attributeName="d" dur="1s" repeatCount="indefinite" begin="-0.166s"*/}
            {/*                 keyTimes="0;0.5;0.501;1"*/}
            {/*                 values="M50 25L80 25L80 75L50 75;M50 25L50 20L50 80L50 75;M50 25L80 25L80 75L50 75;M50 25L80 25L80 75L50 75"></animate>*/}
            {/*        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" begin="-0.166s"*/}
            {/*                 keyTimes="0;0.5;0.5001;1" values="1;1;0;0"></animate>*/}
            {/*    </path>*/}
            {/*    <path d="M50 25L80 25L80 75L50 75" fill="#ffffff" stroke="#1a1a9a" strokeWidth={3}*/}
            {/*          strokeLinejoin="round" strokeLinecap="round">*/}
            {/*        <animate attributeName="d" dur="1s" repeatCount="indefinite" begin="-0.33s" keyTimes="0;0.5;0.501;1"*/}
            {/*                 values="M50 25L80 25L80 75L50 75;M50 25L50 20L50 80L50 75;M50 25L80 25L80 75L50 75;M50 25L80 25L80 75L50 75"></animate>*/}
            {/*        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" begin="-0.33s"*/}
            {/*                 keyTimes="0;0.5;0.5001;1" values="1;1;0;0"></animate>*/}
            {/*    </path>*/}
            {/*    <path d="M50 25L80 25L80 75L50 75" fill="#ffffff" stroke="#1a1a9a" strokeWidth={3}*/}
            {/*          strokeLinejoin="round" strokeLinecap="round">*/}
            {/*        <animate attributeName="d" dur="1s" repeatCount="indefinite" begin="-0.33s" keyTimes="0;0.499;0.5;1"*/}
            {/*                 values="M50 25L20 25L20 75L50 75;M50 25L20 25L20 75L50 75;M50 25L50 20L50 80L50 75;M50 25L20 25L20 75L50 75"></animate>*/}
            {/*        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" begin="-0.33s"*/}
            {/*                 keyTimes="0;0.4999;0.5;1" values="0;0;1;1"></animate>*/}
            {/*    </path>*/}
            {/*    <path d="M50 25L80 25L80 75L50 75" fill="#ffffff" stroke="#1a1a9a" strokeWidth={3}*/}
            {/*          strokeLinejoin="round" strokeLinecap="round">*/}
            {/*        <animate attributeName="d" dur="1s" repeatCount="indefinite" begin="-0.166s"*/}
            {/*                 keyTimes="0;0.499;0.5;1"*/}
            {/*                 values="M50 25L20 25L20 75L50 75;M50 25L20 25L20 75L50 75;M50 25L50 20L50 80L50 75;M50 25L20 25L20 75L50 75"></animate>*/}
            {/*        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" begin="-0.166s"*/}
            {/*                 keyTimes="0;0.4999;0.5;1" values="0;0;1;1"></animate>*/}
            {/*    </path>*/}
            {/*    <path d="M50 25L80 25L80 75L50 75" fill="#ffffff" stroke="#1a1a9a" strokeWidth={3}*/}
            {/*          strokeLinejoin="round" strokeLinecap="round">*/}
            {/*        <animate attributeName="d" dur="1s" repeatCount="indefinite" begin="0s" keyTimes="0;0.499;0.5;1"*/}
            {/*                 values="M50 25L20 25L20 75L50 75;M50 25L20 25L20 75L50 75;M50 25L50 20L50 80L50 75;M50 25L20 25L20 75L50 75"></animate>*/}
            {/*        <animate attributeName="opacity" dur="1s" repeatCount="indefinite" begin="0s"*/}
            {/*                 keyTimes="0;0.4999;0.5;1" values="0;0;1;1"></animate>*/}
            {/*    </path>*/}
            {/*</svg>*/}
            <div className="relative h-2 w-56 overflow-hidden rounded-full bg-gray-300">
                <div
                    className="absolute top-0 -left-[40%] bottom-0 w-1/3 animate-progress-loading rounded-full bg-indigo-600"></div>
            </div>
            <span className="mt-2.5 text-lg font-medium text-slate-600">{label}</span>
        </div>
    );
};

export default LoadingProgress;
