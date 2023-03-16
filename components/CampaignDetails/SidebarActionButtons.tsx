import React, { Fragment, ReactElement, useState, useCallback } from "react";
import { IUser } from "../../old-types/user/IUser";
import SidebarBlockWrapper from "./SidebarBlockWrapper";
import {
  IoAddCircle,
  IoBan,
  IoCheckmarkDone,
  IoPersonAdd,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { Roles } from "../../constants/Roles";
import { ICampaign } from "../../old-types/campaign/ICampaign";
import {
  CampaignStatuses,
  ParticipationStatuses,
} from "../../constants/Statuses";
import { IssuerParticipationService } from "../../old-services/Issuer/Issuer_ParticipationService";
import { QueryClient, useMutation } from "@tanstack/react-query";
// import { toast } from 'react-toastify';
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import Link from "next/link";
import { GiBookCover } from 'react-icons/gi';
import { GiBookmarklet } from 'react-icons/gi';
import { GiBookPile } from 'react-icons/gi';
import { Menu } from '@headlessui/react';
import { Transition } from '@headlessui/react';
import CreateBookButton from './../CreateBookButton';
import { IoAdd } from "react-icons/io5";
import { number } from "yup";
import { Router } from "next/router";


type Props = {
  campaign: ICampaign | undefined;
  issuers: IUser[];
};

const SidebarActionButtons: React.FC<Props> = ({ campaign, issuers }) => {
  const { loginUser } = useAuth();
  const CREATE_BOOK_PRODUCT_BUTTONS = [
    {
      label: "Sách Lẻ",
      description: "Thêm sách bán lẻ vào hội sách",
      // href: "/issuer/campaigns/{[id]}/books/add-book",
      href: `/issuer/campaigns/${campaign?.id}/books/add-book`,
      icon: GiBookCover,
    },
    {
      label: "Sách Combo",
      description: "Thêm sách combo vào hội sách",
      href: `/issuer/campaigns/${campaign?.id}/books/add-combo`,
      icon: GiBookPile,
    },
    {
      label: "Sách Combo Cũ",
      description: "Thêm sách combo cũ vào hội sách",
      href: `/issuer/campaigns/${campaign?.id}/books/add-old-combo`,
      icon: GiBookPile,
    },
    {
      label: "Sách Series",
      description: "Thêm sách series vào hội sách",
      href: `/issuer/campaigns/${campaign?.id}/books/add-series`,
      icon: GiBookmarklet,
    },
  ];
  return (
    <Fragment>
    <SidebarBlockWrapper>
     
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
                {CREATE_BOOK_PRODUCT_BUTTONS.map((button, index) => (
                  <Menu.Item key={index}>
                    <CreateBookButton
                      icon={button.icon}
                      href={button.href}
                      label={button.label}
                      description={button.description}
                    />
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
    
    </SidebarBlockWrapper>
    </Fragment>
  );
};

export default SidebarActionButtons;
