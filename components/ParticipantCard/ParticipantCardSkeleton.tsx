import React from "react";
import { IoPerson } from "react-icons/io5";

type Props = {}

const ParticipantCardSkeleton: React.FC<Props> = ({}) => {
    return (
        <div role="status"
             className="p-4 bg-white border border-gray-200 rounded shadow animate-pulse md:p-6">
            <div className="flex items-center mb-4 space-x-3">
                {/*<svg className="text-gray-200 w-14 h-14" aria-hidden="true"*/}
                {/*     fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                {/*    <path fillRule="evenodd"*/}
                {/*          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"*/}
                {/*          clipRule="evenodd"></path>*/}
                {/*</svg>*/}

                <IoPerson className="text-white rounded bg-gray-200 w-10 h-10 p-2" />
                <div>
                    <div className="h-2.5 bg-gray-200 rounded-full w-32 mb-2"></div>
                    <div className="w-48 h-2 bg-gray-200 rounded-full"></div>
                </div>
            </div>
            <div className="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full mb-2.5"></div>
            <div className="h-2 bg-gray-200 rounded-full"></div>

            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default ParticipantCardSkeleton;