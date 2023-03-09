import {useQuery} from "@tanstack/react-query";
import Image from "next/image";
import React, {useContext, useState} from "react";
import {AiFillMinusCircle} from "react-icons/ai";
import {BsSearch} from "react-icons/bs";
import {useAuth} from "../../context/AuthContext";
import {CampaignContext} from "../../context/CampaignContext";
import CampaignStaffService from "../../services/CampaignStaffService";
import {UserService} from "../../services/UserService";
import {IUser} from "../../types/User/IUser";
import {getAvatarFromName} from "../../utils/helper";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    currentStaffs: (IUser | undefined)[];
};

const AddStaffModal: React.FC<Props> = ({currentStaffs, isOpen, onClose}) => {
    const {loginUser} = useAuth();
    const campaignStaffService = new CampaignStaffService(
        loginUser?.accessToken
    );

    const campaign = useContext(CampaignContext);
    const [search, setSearch] = useState<string>("");

    const [selectedStaffs, setSelectedStaffs] = useState<IUser[]>([]);

    const {data: staffs, isLoading} = useQuery(
        ["staffs", campaign?.id],
        () => {
            return new UserService(
                loginUser?.accessToken
            ).getUnattendedStaffsByCampaignId(campaign?.id);
        }
    );
    const currentStaffIds = currentStaffs?.map((staff) => staff?.id);
    const availableStaffs = []

    const afterModalClose = () => {
        setSelectedStaffs([]);
        onClose();
    };
    const handleSelectStaff = (staff: IUser) => {
        setSelectedStaffs([...selectedStaffs, staff]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (campaign?.id === undefined) return;
        try {
            // await toast.promise(
            //     inviteIssuerMutation.mutateAsync({
            //         campaignId: campaign?.id,
            //         Staffs: selectedStaffs?.map((issuer) => issuer?.id),
            //     }),
            //     {
            //         loading: "Đang gửi lời mời",
            //         success: "Gửi lời mời thành công",
            //         error: (err) => err?.message || "Gửi lời mời thất bại",
            //     }
            // );
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <TransitionModal
            afterLeave={afterModalClose}
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={false}
        >
            <form onSubmit={handleSubmit}>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                            Thêm nhân viên
                        </h3>

                        <button
                            type="button"
                            className="text-gray-400 hover:text-gray-500"
                            onClick={onClose}
                        >
                            <span className="sr-only">Close</span>
                            <svg
                                className="h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className={"relative my-3"}>
                        <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhà phát hành"
                            className="h-12 w-full border-0 pl-11 pr-4 text-sm bg-slate-100 rounded text-gray-800 placeholder-gray-400 focus:ring-0"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {selectedStaffs?.length > 0 && (
                        <div className={"flex flex-col"}>
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                Các nhân viên đã chọn
                            </label>
                            <div className="mt-1">
                                <div className="flex overflow-x-scroll gap-2 my-3 pb-3">
                                    {selectedStaffs?.map((issuer) => (
                                        <div
                                            key={issuer.id}
                                            className="max-w-xs flex flex-col gap-3 items-center justify-center h-28 aspect-square rounded relative border"
                                        >
                                            <div className="absolute top-0 right-0 z-10">
                                                <button
                                                    onClick={() =>
                                                        setSelectedStaffs(
                                                            selectedStaffs.filter(
                                                                (
                                                                    selectedIssuer
                                                                ) =>
                                                                    selectedIssuer?.id !==
                                                                    issuer?.id
                                                            )
                                                        )
                                                    }
                                                    type="button"
                                                    className="relative mt-2 mr-2"
                                                >
                                                    <AiFillMinusCircle
                                                        className="h-4 w-4 text-red-500 hover:text-red-700"/>
                                                </button>
                                            </div>
                                            <Image
                                                src={
                                                    issuer?.imageUrl ||
                                                    getAvatarFromName(
                                                        issuer?.name
                                                    )
                                                }
                                                alt={""}
                                                width={200}
                                                height={200}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <span className="text-sm text-gray-500 line-clamp-1">
                                                {issuer?.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-y-scroll h-96">
                        {!isLoading && availableStaffs ? (
                            availableStaffs.map((staff) => (
                                <div
                                    key={staff.id}
                                    className="flex items-center justify-between p-4 border-b border-gray-200"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                width={200}
                                                height={200}
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={
                                                    staff?.imageUrl ||
                                                    getAvatarFromName(
                                                        staff?.name
                                                    )
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {staff?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {staff?.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => {
                                                if (staff) {
                                                    handleSelectStaff(staff);
                                                }
                                            }}
                                            type="button"
                                            className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center p-4 border-b border-gray-200">
                                <div className="flex items-center">
                                    Chưa có nhân viên nào
                                </div>
                            </div>
                        )}
                    </div>

                    {/*<div className='mt-4'>*/}
                    {/*    <div className='flex flex-col'>*/}
                    {/*        <label htmlFor='email' className='text-sm font-medium text-gray-700'>*/}
                    {/*            Email*/}
                    {/*        </label>*/}
                    {/*        <div className='mt-1'>*/}
                    {/*            <input*/}
                    {/*                type='text'*/}
                    {/*                name='email'*/}
                    {/*                id='email'*/}
                    {/*                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'*/}
                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className='flex flex-col mt-4'>*/}
                    {/*        <label htmlFor='role' className='text-sm font-medium text-gray-700'>*/}
                    {/*            Vai trò*/}
                    {/*        </label>*/}
                    {/*        <div className='mt-1'>*/}
                    {/*            <select*/}
                    {/*                id='role'*/}
                    {/*                name='role'*/}
                    {/*                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'*/}
                    {/*            >*/}
                    {/*                <option>Chọn vai trò</option>*/}
                    {/*                <option>Chủ sở hữu</option>*/}
                    {/*                <option>Quản trị viên</option>*/}
                    {/*            </select>*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className='flex flex-col mt-4'>*/}
                    {/*        <label htmlFor='message' className='text-sm font-medium text-gray-700'>*/}
                    {/*            Tin nhắn*/}
                    {/*        </label>*/}
                    {/*        <div className='mt-1'>*/}
                    {/*            <textarea*/}
                    {/*                id='message'*/}
                    {/*                name='message'*/}
                    {/*                rows={3}*/}
                    {/*                className='shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md'*/}

                    {/*            />*/}
                    {/*        </div>*/}
                    {/*    </div>*/}
                    {/*    <div className='mt-4'>*/}
                    {/*        <button*/}
                    {/*            type='button'*/}
                    {/*            className='m-btn bg-indigo-500 text-white w-full'*/}
                    {/*        >*/}
                    {/*            Gửi lời mời*/}
                    {/*        </button>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <Modal.SecondaryButton type="button" onClick={onClose}>
                            Đóng
                        </Modal.SecondaryButton>
                        <Modal.PrimaryButton
                            type="submit"
                            // disabled={
                            //     selectedStaffs.length === 0 ||
                            //     inviteIssuerMutation.isLoading
                            // }
                        >
                            Thêm{" "}
                            {selectedStaffs.length > 0 &&
                                `(${selectedStaffs.length})`}
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default AddStaffModal;
