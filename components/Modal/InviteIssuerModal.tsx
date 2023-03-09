import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillMinusCircle } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { Roles } from "../../constants/Roles";
import { useAuth } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";
import useDebounce from "../../hooks/useDebounce";
import {
    InviteIssuerParams,
    ParticipantService,
} from "../../services/ParticipantService";
import { UserService } from "../../services/UserService";
import { IUser } from "../../types/User/IUser";
import { getAvatarFromName } from "../../utils/helper";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const InviteIssuerModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { loginUser } = useAuth();
    const participantService = new ParticipantService(loginUser?.accessToken);
    const inviteIssuerMutation = useMutation((data: InviteIssuerParams) =>
        participantService.inviteIssuerByAdmin(data)
    );
    const [search, setSearch] = useState<string>("");

    const [selectedIssuers, setSelectedIssuers] = useState<IUser[]>([]);
    const debouncedSearch = useDebounce(search, 500);

    const { data: issuers, isLoading } = useQuery(
        ["issuers", debouncedSearch],
        () => {
            return new UserService(loginUser?.accessToken).getUsersByAdmin({
                name: debouncedSearch,
                size: 1000,
                status: true,
                role: Roles.ISSUER.id,
            });
        },
        {
            select: (data) => data?.data,
        }
    );

    const campaign = useContext(CampaignContext);
    const currentParticipantIssuerIds =
        campaign?.participants?.map((participant) => participant?.issuerId) ||
        [];
    const availableIssuers = issuers?.filter(
        (issuer) =>
            !selectedIssuers?.find(
                (selectedIssuer) => selectedIssuer?.id === issuer?.id
            ) && !currentParticipantIssuerIds?.find((id) => id === issuer?.id)
    );

    const afterModalClose = () => {
        setSelectedIssuers([]);
        onClose();
    };
    const handleSelectIssuer = (issuer: IUser) => {
        setSelectedIssuers([...selectedIssuers, issuer]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (campaign?.id === undefined) return;
        try {
            await toast.promise(
                inviteIssuerMutation.mutateAsync({
                    campaignId: campaign?.id,
                    issuers: selectedIssuers?.map((issuer) => issuer?.id),
                }),
                {
                    loading: "Đang gửi lời mời",
                    success: "Gửi lời mời thành công",
                    error: (err) => err?.message || "Gửi lời mời thất bại",
                }
            );
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
                            Mời nhà phát hành tham gia
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
                        <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhà phát hành"
                            className="h-12 w-full border-0 pl-11 pr-4 text-sm bg-slate-100 rounded text-gray-800 placeholder-gray-400 focus:ring-0"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    {selectedIssuers?.length > 0 && (
                        <div className={"flex flex-col"}>
                            <label
                                htmlFor="email"
                                className="text-sm font-medium text-gray-700"
                            >
                                Nhà phát hành sẽ được mời mời
                            </label>
                            <div className="mt-1">
                                <div className="flex overflow-x-scroll gap-2 my-3 pb-3">
                                    {selectedIssuers?.map((issuer) => (
                                        <div
                                            key={issuer.id}
                                            className="max-w-xs flex flex-col gap-3 items-center justify-center h-28 aspect-square rounded relative border"
                                        >
                                            <div className="absolute top-0 right-0 z-10">
                                                <button
                                                    onClick={() =>
                                                        setSelectedIssuers(
                                                            selectedIssuers.filter(
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
                                                    <AiFillMinusCircle className="h-4 w-4 text-red-500 hover:text-red-700" />
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
                        {!isLoading && availableIssuers ? (
                            availableIssuers.map((issuer) => (
                                <div
                                    key={issuer.id}
                                    className="flex items-center justify-between p-4 border-b border-gray-200"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                width={200}
                                                height={200}
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={
                                                    issuer?.imageUrl ||
                                                    getAvatarFromName(
                                                        issuer?.name
                                                    )
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {issuer?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {issuer?.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() =>
                                                handleSelectIssuer(issuer)
                                            }
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
                                    Chưa có nhà phát hành
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
                            disabled={
                                selectedIssuers.length === 0 ||
                                inviteIssuerMutation.isLoading
                            }
                        >
                            Gửi lời mời{" "}
                            {selectedIssuers.length > 0 &&
                                `(${selectedIssuers.length})`}
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default InviteIssuerModal;
