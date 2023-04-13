import Image from "next/image";
import React, { Fragment, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { IParticipant } from "../../types/Participant/IParticipant";
import { AiFillShop } from "react-icons/ai";
import { getAvatarFromName, getFormattedTime, isValidImageSrc } from "../../utils/helper";
import DefaultAvatar from "../../assets/images/default-avatar.png";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import useParticipantCard from "./useParticipantCard";
import { Roles } from "../../constants/Roles";
import { getParticipantStatusById } from "../../constants/ParticipantStatuses";
import Link from "next/link";
import { TbZoomMoney } from "react-icons/tb";
import TransitionModal from "../Modal/TransitionModal";
import Modal from "../Modal/Modal";
import { CampaignService } from "../../services/CampaignService";
import { useQuery } from "@tanstack/react-query";

type Props = {
    participant: IParticipant;
    showCampaignInfo?: boolean;
};

const ParticipantCard: React.FC<Props> = ({
                                              participant,
                                              showCampaignInfo = true,
                                          }) => {
    const { loginUser } = useAuth();
    const { Buttons, Modals } = useParticipantCard(participant);
    const [showCommissionModal, setShowCommissionModal] = useState(false);
    const participantStatus = getParticipantStatusById(participant?.status);


    const { data: campaign } = useQuery(
        ["campaigns", participant?.campaignId],
        () => {
            if (participant?.campaignId) {
                if (loginUser?.role === Roles.SYSTEM.id) {
                    return new CampaignService(loginUser?.accessToken).getCampaignByIdByAdmin(participant?.campaignId);
                }
                return new CampaignService(loginUser?.accessToken).getCampaignByIdByIssuer(participant?.campaignId);
            }
        },
    );
    return (
        <Fragment>
            <div className="relative rounded overflow-hidden">
                <div className="p-4 bg-white">
                    <div className="flex gap-2 justify-between">
                        <div className="flex flex-1 min-w-0 gap-2.5 items-center">
                            {loginUser?.role === Roles.SYSTEM.id ? <Image
                                src={participant?.issuer?.user?.imageUrl && isValidImageSrc(participant?.issuer?.user?.imageUrl)
                                    ? participant?.issuer?.user?.imageUrl
                                    : DefaultAvatar.src} alt={""}
                                width={300}
                                height={300}
                                className={"rounded-full object-cover w-10 h-10"}
                            /> : <Image
                                src={participant?.campaign?.imageUrl && isValidImageSrc(participant?.campaign?.imageUrl)
                                    ? participant?.campaign?.imageUrl
                                    : DefaultAvatar.src} alt={""}
                                width={300}
                                height={300}
                                className={"rounded-sm object-cover w-14 h-14"}
                            />}
                            <div className="flex flex-col flex-1 min-w-0">
                                {loginUser?.role === Roles.ISSUER.id &&
                                    <Link href={`campaigns/${participant?.campaignId}`}
                                          className="font-semibold line-clamp-1 break-words text-indigo-500 hover:text-indigo-600 hover:underline underline-offset-2">
                                        {participant?.campaign?.name}
                                    </Link>
                                }
                                {loginUser?.role === Roles.SYSTEM.id &&
                                    <div className="font-semibold line-clamp-1 break-words">
                                        {participant?.issuer?.user?.name}
                                    </div>
                                }

                                <div
                                    className={`text-xs  font-medium text-slate-500 line-clamp-1 break-words ${loginUser?.role === Roles.ISSUER.id ? "mt-1" : ""}`}>
                                    {loginUser?.role === Roles.SYSTEM.id ? participant?.issuer?.user?.email : participant?.campaign?.address}
                                </div>
                            </div>
                        </div>
                        {participant?.updatedDate &&
                            <div className="min-w-fit text-sm text-right text-slate-500">
                                Cập nhật<br />
                                <span className="font-medium">
                            {formatDistance(new Date(participant?.updatedDate), new Date(), {
                                addSuffix: true,
                                locale: vi,
                            })}
                            </span>
                            </div>}
                    </div>

                    <div className="grid grid-cols-2 py-5 border-b">
                        <div className="flex flex-col mx-auto gap-2">
                            <div className="text-sm font-medium text-gray-500">
                                Thời gian khởi tạo
                            </div>
                            <div className="text-sm font-medium text-gray-700">
                                {getFormattedTime(participant?.createdDate, "HH:mm - dd/MM/yyyy")}
                            </div>
                        </div>

                        <div className="flex flex-col mx-auto justify-center gap-2">
                            <div className="text-sm font-medium text-gray-500">
                                Trạng thái
                            </div>
                            <span
                                className={`w-fit flex items-center h-6 px-3 text-xs font-semibold ${participantStatus?.label?.classNames}`}>
                                {participantStatus?.label?.text || "Không xác định"}
                            </span>
                        </div>


                    </div>

                    {loginUser?.role === Roles.SYSTEM.id &&
                        <div className="flex items-center justify-between mt-4 gap-3.5">
                            <div className="flex text-sm items-center gap-1.5 min-w-max">
                                <div className="text-white bg-blue-500 p-1.5 rounded-full">
                                    <AiFillShop />
                                </div>
                                <span className="font-medium">
                            Hội sách
                        </span>
                            </div>

                            <Link href={`campaigns/${participant?.campaignId}`}
                                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline line-clamp-1 break-words">
                                {participant?.campaign?.name}
                            </Link>
                        </div>}

                    <div className="bg-slate-50 rounded text-sm text-slate-600 mt-4 px-3 py-2 border border-slate-200">
                        📝 {participant?.note || "Không có ghi chú"}
                    </div>
                    <button
                        onClick={() => setShowCommissionModal(true)}
                        className="text-sm flex items-center justify-center gap-2 py-2 px-3 rounded w-full font-medium text-white bg-blue-500 mt-4 hover:bg-blue-600">
                        Xem chiết khấu <TbZoomMoney />
                    </button>
                </div>
                {Buttons.length > 0 &&
                    <div className="grid grid-cols-2 bg-gray-50 gap-2.5 p-4 text-sm">
                        {Buttons.map((Button, index) => {
                            let color = "bg-white border";
                            if (Button.type === "primary") {
                                color = "bg-indigo-500 text-white";
                            }
                            if (Button.type === "danger") {
                                color = "bg-white text-red-500 border";
                            }
                            return <button key={index} onClick={Button.onClick}
                                           className={`py-2 rounded font-medium ${Buttons.length === 1 ? "col-span-2" : ""} ${color}`}>
                                {Button.title}
                            </button>;
                        })}
                    </div>
                }
            </div>

            {Modals}

            <TransitionModal isOpen={showCommissionModal} onClose={() => setShowCommissionModal(false)}>
                <>
                    <Modal.Header title="Thể loại sách và chiết khấu" />

                    <div className="">
                        {campaign?.campaignCommissions && campaign?.campaignCommissions.map((commission) => (
                            <div
                                key={commission?.id}
                                className="relative flex h-full w-full space-x-4 rounded border border-slate-200 bg-white px-4 py-6 shadow-sm transition duration-300 hover:shadow">
                                <Image
                                    src={
                                        getAvatarFromName(
                                            commission?.genre?.name,
                                        )
                                    }
                                    width={500}
                                    height={500}
                                    alt=""
                                    className="rounded-full object-cover h-12 w-12"
                                />
                                {/*Org Info*/}
                                <div
                                    className={`grow min-w-0`}
                                >
                                    <div className={"mb-1 text-base font-bold text-slate-700"}>
                                        {commission?.genre?.name}
                                    </div>
                                    <div className={"text-sm text-slate-500"}>
                                        Chiết khấu: <span
                                        className={"font-semibold"}>{commission?.minimalCommission}%</span>
                                    </div>
                                </div>

                            </div>
                        ))}
                    </div>

                    <Modal.Footer>
                        <div className="flex flex-wrap justify-end space-x-2">
                            <Modal.SecondaryButton
                                onClick={() => setShowCommissionModal(false)}
                                type="button"
                            >
                                Đóng
                            </Modal.SecondaryButton>
                        </div>
                    </Modal.Footer>
                </>

            </TransitionModal>
        </Fragment>
    );
};

export default ParticipantCard;