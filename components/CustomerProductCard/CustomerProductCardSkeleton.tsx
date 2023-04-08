import React from "react";

type Props = {}

const CustomerProductCardSkeleton: React.FC<Props> = ({}) => {
    return (
        <div role="status" className="rounded animate-pulse">
            <div className="flex items-center justify-center h-80 mb-4 bg-gray-300 rounded ">
                {/*<svg className="w-12 h-12 text-gray-200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"*/}
                {/*     fill="currentColor" viewBox="0 0 640 512">*/}
                {/*    <path*/}
                {/*        d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />*/}
                {/*</svg>*/}

                {/*<svg className="w-16 h-16 text-gray-100" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em"*/}
                {/*     width="1em" xmlns="http://www.w3.org/2000/svg">*/}
                {/*    <path*/}
                {/*        d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zM668 345.9L621.5 312 572 347.4V124h96v221.9z">*/}

                {/*    </path>*/}
                {/*</svg>*/}

                <svg className="w-16 h-16 text-gray-100" stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em"
                     width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M542.22 32.05c-54.8 3.11-163.72 14.43-230.96 55.59-4.64 2.84-7.27 7.89-7.27 13.17v363.87c0 11.55 12.63 18.85 23.28 13.49 69.18-34.82 169.23-44.32 218.7-46.92 16.89-.89 30.02-14.43 30.02-30.66V62.75c.01-17.71-15.35-31.74-33.77-30.7zM264.73 87.64C197.5 46.48 88.58 35.17 33.78 32.05 15.36 31.01 0 45.04 0 62.75V400.6c0 16.24 13.13 29.78 30.02 30.66 49.49 2.6 149.59 12.11 218.77 46.95 10.62 5.35 23.21-1.94 23.21-13.46V100.63c0-5.29-2.62-10.14-7.27-12.99z"></path>
                </svg>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full  w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full  mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full "></div>

            <div className="h-6 mt-8 w-1/3 ml-auto bg-gray-200 rounded"></div>

            <div className="h-10 mt-8 bg-gray-200 rounded"></div>
        </div>
    );
};

export default CustomerProductCardSkeleton;