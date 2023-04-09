import React, { useState } from "react";
import TransitionModal from "./TransitionModal";
import { BsSearch } from "react-icons/bs";
import Image from "next/image";
import { getAvatarFromName } from "../../utils/helper";
import EmptyState, { EMPTY_STATE_TYPE } from "../EmptyState";
import Modal from "./Modal";
import useDebounce from "../../hooks/useDebounce";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OrganizationService } from "../../services/OrganizationService";
import { IOrganization } from "../../types/Organization/IOrganization";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { IoPeople } from "react-icons/io5";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    followedOrganizationIds: number[];
}

const FollowOrganizationModal: React.FC<Props> = ({ isOpen, followedOrganizationIds, onClose }) => {
    const { loginUser } = useAuth();
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search, 500);
    const organizationService = new OrganizationService(loginUser?.accessToken);

    const queryClient = useQueryClient();

    const onModalClose = () => {
        setSearch("");
        onClose();
    };

    const { data: organizationData, isLoading } = useQuery(
        ["organizations", debouncedSearch],
        () =>
            organizationService.getOrganizations({
                name: debouncedSearch,
                size: 1000,
                status: true,
                withCustomers: true,
                withCampaigns: true,
            }),
        {
            select: (data) =>
                data?.data?.filter((organization) => !followedOrganizationIds.includes(organization?.id)),
        },
    );

    const followOrganizationMutation = useMutation(
        (organizationId: number) => organizationService.followOrganization(organizationId),
        {
            onSuccess: async (data) => {
                await queryClient.invalidateQueries(["following_organizations"]);
                onModalClose();
            },
        },
    );

    const onItemSelect = async (organization: IOrganization) => {
        await toast.promise(followOrganizationMutation.mutateAsync(organization?.id), {
            loading: `Đang thêm tổ chức ${organization?.name} vào danh sách theo dõi`,
            success: () => `Đã thêm tổ chức ${organization?.name} vào danh sách theo dõi`,
            error: (err) => err?.message || "Có lỗi xảy ra",
        });
    };


    return (
        <TransitionModal
            maxWidth={"max-w-lg"}
            isOpen={isOpen}
            closeOnOverlayClick={false}
            onClose={onModalClose}
        >
            <div className="overflow-hidden rounded-xl">
                <div>
                    <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm tổ chức"
                        className="h-12 w-full border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-96 overflow-y-auto">
                    {!isLoading && organizationData ? (
                        organizationData?.map((org) => {
                            return (
                                <div
                                    key={org?.id}
                                    className={`relative flex justify-between border-b border-gray-300 p-4 cursor-pointer`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Image
                                            width={500}
                                            height={500}
                                            className="h-12 w-12 rounded object-cover"
                                            src={org?.imageUrl || getAvatarFromName(org?.name)}
                                            alt=""
                                        />
                                        <div>
                                            <div className="mb-1 text-sm font-medium text-gray-900">
                                                {org?.name}
                                            </div>
                                            <div className='flex items-center text-sm text-gray-600'>
                                                <IoPeople/>
                                                <span className="ml-1">{org?.customers?.length} người thuộc về tổ chức</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/*{isSelected && (*/}
                                    {/*    <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">*/}
                                    {/*        <BsCheckCircle className="text-green-500" />*/}
                                    {/*    </div>*/}
                                    {/*)}*/}

                                    <button
                                        disabled={followOrganizationMutation.isLoading}
                                        onClick={() => onItemSelect(org)}
                                        className="text-indigo-600 text-sm font-medium disabled:opacity-50"
                                    >
                                        Theo dõi
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <EmptyState
                            status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                            keyword={search}
                        />
                    )}
                </div>

                <Modal.Footer>
                    <div className="flex flex-wrap justify-end space-x-2">
                        <button
                            onClick={onModalClose}
                            className="m-btn bg-gray-100 text-slate-600 hover:bg-gray-200"
                        >
                            Đóng
                        </button>
                    </div>
                </Modal.Footer>
            </div>
        </TransitionModal>
    );
};

export default FollowOrganizationModal;