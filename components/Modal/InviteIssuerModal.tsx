import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useContext, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { CampaignContext } from "../../context/CampaignContext";
import { InviteIssuerParams, ParticipantService } from "../../services/ParticipantService";
import { IUser } from "../../types/User/IUser";
import TransitionModal from "./TransitionModal";
import { BsSearch } from "react-icons/bs";
import { AiFillMinusCircle } from "react-icons/ai";
import { getAvatarFromName } from "../../utils/helper";
import Image from "next/image";
import Modal from "./Modal";
import EmptyState, { EMPTY_STATE_TYPE } from "../EmptyState";
import LoadingSpinner from "../LoadingSpinner";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const InviteIssuerModal: React.FC<Props> = ({ isOpen, onClose }) => {
    const { loginUser } = useAuth();
    const campaign = useContext(CampaignContext);
    const queryClient = useQueryClient();
    const participantService = new ParticipantService(loginUser?.accessToken);
    const campaignService = new ParticipantService(loginUser?.accessToken);
    const inviteIssuerMutation = useMutation((data: InviteIssuerParams) =>
            participantService.inviteIssuerByAdmin(data), {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["admin_campaign", campaign?.id]);
                await queryClient.invalidateQueries(["unparticipated-issuers", campaign?.id]);
                onClose();
            },
        },
    );
    const [search, setSearch] = useState<string>("");
    const [selectedIssuers, setSelectedIssuers] = useState<IUser[]>([]);

    const { data: issuers, isLoading } = useQuery(
        ["unparticipated-issuers", campaign?.id],
        () => {
            if (campaign?.id === undefined) return [];
            return campaignService.getUnparticipatedIssuersOfCampaign(campaign?.id);
        },
    );

    const searchedIssuers = issuers?.filter((issuer) => {
        return issuer?.name?.toLowerCase().includes(search.toLowerCase());
    });

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
                },
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
                                Nhà phát hành sẽ được mời
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
                                                                    selectedIssuer,
                                                                ) =>
                                                                    selectedIssuer?.id !==
                                                                    issuer?.id,
                                                            ),
                                                        )
                                                    }
                                                    type="button"
                                                    className="relative mt-2 mr-2"
                                                >
                                                    <AiFillMinusCircle
                                                        className="h-4 w-4 text-red-500 hover:text-red-700" />
                                                </button>
                                            </div>
                                            <Image
                                                src={
                                                    issuer?.imageUrl ||
                                                    getAvatarFromName(
                                                        issuer?.name,
                                                    )
                                                }
                                                alt={""}
                                                width={200}
                                                height={200}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                            <span className="text-sm text-gray-500 line-clamp-1 px-2">
                                                {issuer?.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="overflow-y-auto h-96 max-w-full">
                        {isLoading ? (
                            <div className={'animate-pulse flex flex-col gap-4 items-center justify-center'}>
                                {Array.from(Array(5).keys()).map((i, idx) => (
                                <div
                                    key={idx}
                                    className={'h-10 w-full bg-gray-200 rounded'} />
                                ))}
                            </div>
                        ) : (
                        searchedIssuers && searchedIssuers?.length > 0 ? (
                                searchedIssuers.map((issuer) => {
                                    const isSelected = selectedIssuers?.find(i => i?.id === issuer?.id) !== undefined;
                                    return <div
                                        key={issuer.id}
                                        className="flex gap-3 items-center justify-between p-4 border-b border-gray-200"
                                    >
                                        <div className="flex gap-4 flex-1 min-w-0">
                                            <Image
                                                width={200}
                                                height={200}
                                                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                                                src={
                                                    issuer?.imageUrl ||
                                                    getAvatarFromName(
                                                        issuer?.name,
                                                    )
                                                }
                                                alt=""
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 line-clamp-2 break-words">
                                                    {issuer?.name}
                                                </p>
                                                <p className="text-sm text-gray-500 line-clamp-2 break-words">
                                                    {issuer?.email}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex justify-end items-center">
                                            <button
                                                onClick={() =>
                                                    handleSelectIssuer(issuer)
                                                }
                                                disabled={isSelected}
                                                type="button"
                                                className="text-sm font-medium w-max text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                                            >
                                                {isSelected
                                                    ? "Đã chọn"
                                                    : "Chọn"}
                                            </button>
                                        </div>
                                    </div>;
                                })
                            ) :
                            issuers && issuers?.length > 0 ? (
                                <EmptyState
                                    status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                                />
                            ) : (
                                <EmptyState
                                    status={EMPTY_STATE_TYPE.NO_DATA}
                                    customMessage={"Không có nhà phát hành nào để mời"}
                                />
                            )
                        )}
                    </div>
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <Modal.SecondaryButton
                            disabled={
                                inviteIssuerMutation.isLoading
                            }
                            type="button" onClick={onClose}>
                            Đóng
                        </Modal.SecondaryButton>
                        <Modal.PrimaryButton
                            type="submit"
                            disabled={
                                selectedIssuers.length === 0 ||
                                inviteIssuerMutation.isLoading
                            }
                        >
                            {inviteIssuerMutation.isLoading ?
                                "Đang gửi..." : `Gửi lời mời ${selectedIssuers.length > 0 ? `(${selectedIssuers.length})` : ""}`}
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default InviteIssuerModal;
