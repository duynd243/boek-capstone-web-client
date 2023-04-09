import React from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/router";

type Props = {
    children: React.ReactNode;
}

const AdminBookProductDetailsLayout: React.FC<Props> = ({ children }) => {
    const router = useRouter();
    return (
        <div className="p-6 sm:p-10">
            <div className="mb-6">
                <button
                    className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                    onClick={() => router.back()}
                >
                    <IoChevronBack size={"17"} />
                    <span>Quay lại</span>
                </button>
            </div>
            {children}
        </div>
    );
};

export default AdminBookProductDetailsLayout;