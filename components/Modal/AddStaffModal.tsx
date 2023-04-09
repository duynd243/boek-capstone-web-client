import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import Image from "next/image";
import React, {useContext, useState} from "react";
import {AiFillMinusCircle} from "react-icons/ai";
import {BsSearch} from "react-icons/bs";
import {useAuth} from "../../context/AuthContext";
import {CampaignContext} from "../../context/CampaignContext";
import CampaignStaffService, {AddStaffsRequestParams} from "../../services/CampaignStaffService";
import {IUser} from "../../types/User/IUser";
import {getAvatarFromName} from "../../utils/helper";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import EmptyState, {EMPTY_STATE_TYPE} from "../EmptyState";
import {toast} from "react-hot-toast";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const AddStaffModal: React.FC<Props> = ({isOpen, onClose}) => {
    const {loginUser} = useAuth();
    const campaignStaffService = new CampaignStaffService(
        loginUser?.accessToken
    );
    const queryClient = useQueryClient();

    const campaign = useContext(CampaignContext);
    const [search, setSearch] = useState<string>("");

    const [selectedStaffs, setSelectedStaffs] = useState<IUser[]>([]);

    const afterModalClose = () => {
        setSelectedStaffs([]);
        onClose();
    };
    const {data: staffs, isLoading} = useQuery(
        ["unattended_staffs", campaign?.id],
        () => campaignStaffService.getUnattendedStaffsByCampaignId(Number(campaign?.id)), {
            enabled: isOpen && campaign?.id !== undefined
        }
    );

    const addStaffsMutation = useMutation(
        (params: AddStaffsRequestParams) => campaignStaffService.addStaffs(params), {
            onSuccess: async () => {
                await queryClient.invalidateQueries(["campaign_staffs", campaign?.id]);
                afterModalClose();
            }
        }
    );

    const searchedStaffs = staffs !== null && Array.isArray(staffs) ? staffs?.filter((staff) => {
        return staff?.name?.toLowerCase().includes(search?.toLowerCase());
    }) : [];

    const handleSelectStaff = (staff: IUser) => {
        setSelectedStaffs([...selectedStaffs, staff]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!campaign?.id) return;
        try {
            await toast.promise(
                addStaffsMutation.mutateAsync({
                    campaignId: campaign?.id,
                    staffIds: selectedStaffs
                        ?.filter((staff) => staff?.id !== undefined)
                        ?.map((staff) => staff?.id)
                }),
                {
                    loading: "Đang thêm nhân viên",
                    success: "Thêm nhân viên thành công",
                    error: (err) => err?.message || "Có lỗi xảy ra"
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    function renderStaffs() {
        if (isLoading) {
            return (
                <div>Loading...</div>
            )
        } else {
            if (staffs && staffs?.length > 0) {
                if (searchedStaffs?.length > 0) {
                    return searchedStaffs.map((staff) => {
                        const isSelected = selectedStaffs?.find(i => i?.id === staff?.id) !== undefined;
                        return <div
                            key={staff?.id}
                            className="flex gap-3 items-center justify-between p-4 border-b border-gray-200"
                        >
                            <div className='flex gap-4 flex-1 min-w-0'>
                                <Image
                                    width={200}
                                    height={200}
                                    className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                                    src={
                                        staff?.imageUrl ||
                                        getAvatarFromName(
                                            staff?.name
                                        )
                                    }
                                    alt=""
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2 break-words">
                                        {staff?.name}
                                    </p>
                                    <p className="text-sm text-gray-500 line-clamp-2 break-words">
                                        {staff?.email}
                                    </p>
                                </div>
                            </div>
                            <div className='flex justify-end items-center'>
                                <button
                                    onClick={() =>
                                        handleSelectStaff(staff)
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
                        </div>
                    })

                } else {
                    return (
                        <EmptyState
                            status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                        />
                    )
                }

            } else {
                return (
                    <EmptyState
                        status={EMPTY_STATE_TYPE.NO_DATA}
                        customMessage={"Không có nhân viên nào để thêm"}
                    />
                )
            }
        }
    }

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
                            disabled={isLoading}
                            type="text"
                            placeholder="Tìm kiếm nhân viên"
                            className="h-12 w-full border-0 pl-11 pr-4 text-sm bg-slate-100 rounded text-gray-800 placeholder-gray-400 focus:ring-0 disabled:opacity-50"
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
                        {renderStaffs()}

                    </div>
                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <Modal.SecondaryButton
                            disabled={
                                addStaffsMutation.isLoading
                            }
                            type="button" onClick={onClose}>
                            Đóng
                        </Modal.SecondaryButton>
                        <Modal.PrimaryButton
                            type="submit"
                            disabled={
                                selectedStaffs.length === 0 ||
                                addStaffsMutation.isLoading
                            }
                        >
                            {addStaffsMutation.isLoading ?
                                'Đang thêm...' : `Thêm ${selectedStaffs.length > 0 ? `(${selectedStaffs.length})` : ""}`}
                        </Modal.PrimaryButton>
                    </div>
                </Modal.Footer>
            </form>
        </TransitionModal>
    );
};

export default AddStaffModal;
