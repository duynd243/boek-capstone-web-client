import React from "react";
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

type Props = {
  campaign: ICampaign | undefined;
  issuers: IUser[];
};

const SidebarActionButtons: React.FC<Props> = ({ campaign, issuers }) => {
  const { loginUser } = useAuth();

  return (
    <SidebarBlockWrapper>
      <div className="space-y-2">
        ...
      </div>
    </SidebarBlockWrapper>
  );
};

export default SidebarActionButtons;
