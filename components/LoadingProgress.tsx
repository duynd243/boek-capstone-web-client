import React from "react";

type Props = {
  label?: string;
};

const LoadingProgress: React.FC<Props> = ({ label = "Đang tải..." }) => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="relative h-2 w-56 overflow-hidden rounded-full bg-gray-300">
        <div className="absolute top-0 -left-[40%] bottom-0 w-1/3 animate-progress-loading rounded-full bg-indigo-600"></div>
      </div>
      <span className="mt-2.5 text-lg font-medium text-slate-600">{label}</span>
    </div>
  );
};

export default LoadingProgress;
