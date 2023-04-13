import React from "react";

type Props = {};

const LoadingTopPage: React.FC<Props> = ({}) => {
    return (
        <div className="fixed top-0 left-0 z-50 h-1 w-full overflow-hidden">
            <div className="absolute top-0 -left-[40%] bottom-0 w-1/3 animate-progress-loading bg-blue-600"></div>
        </div>
    );
};

export default LoadingTopPage;
