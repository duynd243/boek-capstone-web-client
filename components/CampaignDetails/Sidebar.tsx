import Link from "next/link";
import React, {useContext, useState, Fragment} from "react";
import {MdEdit} from "react-icons/md";
import {TiUserAdd} from "react-icons/ti";
import {CampaignFormats} from "../../constants/CampaignFormats";
import {CampaignStatuses} from "../../constants/CampaignStatuses";
import {Roles} from "../../constants/Roles";
import {useAuth} from "../../context/AuthContext";
import {CampaignContext} from "../../context/CampaignContext";
import SidebarIssuersTable from "./SidebarIssuersTable";
import SidebarStaffsTable from "./SidebarStaffsTable";
import {ParticipantStatuses} from "../../constants/ParticipantStatuses";
import ConfirmModal from "../Modal/ConfirmModal";
import {ParticipantService} from "../../services/ParticipantService";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {toast} from "react-hot-toast";
import { Menu, Transition } from '@headlessui/react';
import { IoAdd } from 'react-icons/io5';
import { GiBookCover, GiBookPile } from 'react-icons/gi';
import { GiBookmarklet } from 'react-icons/gi';
import CreateBookButton from './../CreateBookButton';


const CREATE_BOOK_BUTTONS = [
    {
      label: "Thêm Sách Lẻ",
      description: "Thêm sách lẻ vào hội sách",
      href: "books/add-book",
      icon: GiBookCover,
    },
    {
      label: "Thêm Sách Combo",
      description: "Thêm sách combo vào hội sách",
      href: "books/add-combo",
      icon: GiBookPile,
    },
    {
        label: "Thêm Sách Combo Cũ",
        description: "Thêm sách combo cũ vào hội sách",
        href: "books/add-old-combo",
        icon: GiBookPile,
      },
    {
      label: "Sách Series",
      description: "Thêm sách series vào hội sách",
      href: "books/add-series",
      icon: GiBookmarklet,
    },
  ];
const Sidebar: React.FC = () => {
    const [showRequestJoinModal, setShowRequestJoinModal] = useState(false);
    const {loginUser} = useAuth();
    const participantService = new ParticipantService(loginUser?.accessToken);
    const queryClient = useQueryClient();
    const sendRequestJoinMutation = useMutation((campaignId: number) => participantService.requestToJoinByIssuer(campaignId), {
        onSuccess: async () => {
            await queryClient.invalidateQueries(['issuer_campaigns']);
            setShowRequestJoinModal(false);
        }
    });
    const campaign = useContext(CampaignContext);
    const joinedIssuers =
        campaign?.participants
            ?.filter(
                (p) =>
                    p?.status === ParticipantStatuses.RequestApproved.id ||
                    p?.status === ParticipantStatuses.InvitationAccepted.id
            )
            ?.map((p) => p?.issuer?.user) || [];

    const pendingIssuers =
        campaign?.participants
            ?.filter(
                (p) =>
                    p?.status === ParticipantStatuses.PendingInvitation.id ||
                    p?.status === ParticipantStatuses.PendingRequest.id
            )
            ?.map((p) => p?.issuer?.user) || [];


    const isJoined = !!joinedIssuers?.find((i) => i?.id === loginUser?.id);

    const handleSendRequestJoin = async () => {
        if (!campaign?.id) return;
        await toast.promise(sendRequestJoinMutation.mutateAsync(campaign.id), {
            loading: 'Đang gửi yêu cầu',
            success: () => {
                return 'Gửi yêu cầu thành công';
            },
            error: (err) => err?.message || 'Đã có lỗi xảy ra',
        });
    }

    return (
        <div>
            <div className="space-y-4 lg:sticky lg:top-20">
                {loginUser?.role === Roles.SYSTEM.id &&
                    campaign?.status === CampaignStatuses?.NOT_STARTED.id && (
                        <Link
                            href={`${campaign?.id}/edit`}
                            className="m-btn bg-blue-600 text-white w-full"
                        >
                            <MdEdit className="mr-2.5" size={17}/>
                            Cập nhật thông tin
                        </Link>
                    )}

                {(loginUser?.role === Roles.ISSUER.id &&
                    campaign?.status === CampaignStatuses?.NOT_STARTED.id && !isJoined) && (
                    <>
                        <button
                            onClick={() => setShowRequestJoinModal(true)}
                            className="m-btn bg-blue-600 text-white w-full"
                        >
                            <TiUserAdd className="mr-2.5" size={17}/>
                            Yêu cầu tham gia
                        </button>

                        <ConfirmModal
                            isOpen={showRequestJoinModal}
                            color={'blue'}
                            onClose={() => setShowRequestJoinModal(false)}
                            onConfirm={handleSendRequestJoin}
                            confirmText="Gửi yêu cầu"
                            title="Chấp nhận lời mời tham gia"
                            content={`Bạn có chắc chắn muốn gửi yêu cầu tham gia hội sách ${campaign?.name}?`}/>
                    </>
                )}
                 {(loginUser?.role === Roles.ISSUER.id &&
                    campaign?.status === CampaignStatuses?.NOT_STARTED.id && isJoined) && (
                        <Menu as={"div"} className={"relative"}>
                        <Menu.Button
                          as={"button"}
                          className="m-btn gap-1 bg-indigo-500 text-white hover:bg-indigo-600 w-full"
                        >
                          <IoAdd size={16} />
                          <span className="hidden sm:block">Thêm sách</span>
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="max-w-screen absolute right-0 z-10 mt-2 w-80 origin-top-right overflow-hidden rounded-lg bg-white p-2.5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="relative flex flex-col gap-2 bg-white">
                              {CREATE_BOOK_BUTTONS.map((button, index) => (
                                <Menu.Item key={index}>
                                  <CreateBookButton
                                    icon={button.icon}
                                    href={`${campaign?.id}/${button.href}`}
                                    label={button.label}
                                    description={button.description}
                                  />
                                </Menu.Item>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                )}

                <SidebarIssuersTable/>

                {loginUser?.role === Roles.SYSTEM.id &&
                    campaign?.format === CampaignFormats?.OFFLINE.id && (
                        <SidebarStaffsTable/>
                    )}
            </div>
        </div>
    );
};

export default Sidebar;