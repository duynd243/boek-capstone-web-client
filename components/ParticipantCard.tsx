import { faker } from "@faker-js/faker/locale/vi";
import { formatDistanceToNow } from "date-fns";
import vi from "date-fns/locale/vi";
import Image from "next/image";
import React, { Fragment } from "react";
import { FiMail, FiPhoneCall } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { CampaignService } from "../services/CampaignService";
import { IParticipant } from "../types/Participant/IParticipant";
import ConfirmModal from "./Modal/ConfirmModal";

type Props = {
    participant: IParticipant;
    showCampaignInfo?: boolean;
};

const ParticipantCard: React.FC<Props> = ({
    participant,
    showCampaignInfo,
}) => {
    const { loginUser } = useAuth();
    const campaignService = new CampaignService(loginUser?.accessToken);
    const [showCancelInvitationModal, setShowCancelInvitationModal] =
        React.useState(false);

    const handleCancelInvitation = async () => {
        if (participant?.id) {
            await campaignService.cancelInvitation(participant.id);
        }
    };
    return (
        <Fragment>
            <div className="bg-white shadow-sm border rounded-lg">
                <div
                    className={
                        "flex p-8 bg-slate-50 border-b justify-between items-center"
                    }
                >
                    <div className={"flex gap-3 items-center"}>
                        <Image
                            src={
                                participant?.issuer?.user?.imageUrl ||
                                faker.image.avatar()
                            }
                            width={100}
                            height={100}
                            className={"rounded-full object-cover w-12 h-12"}
                            alt={""}
                        />
                        <div>
                            <div className="font-medium">
                                {participant?.issuer?.user?.name}
                            </div>
                            <div
                                className="text-sm text-slate-500"
                                title={participant?.createdDate}
                            >
                                {participant?.createdDate &&
                                    formatDistanceToNow(
                                        new Date(participant?.createdDate),
                                        { addSuffix: true, locale: vi }
                                    )}
                            </div>
                        </div>
                    </div>
                    <div className={"flex gap-3 items-center"}>
                        <button
                            onClick={() => setShowCancelInvitationModal(true)}
                            type={"button"}
                            className={
                                "m-btn border-2 border-gray-500 bg-white text-slate-500"
                            }
                        >
                            Huỷ lời mời
                        </button>
                        {/* <button
                        type={"button"}
                        className={"m-btn text-white bg-indigo-600"}
                    >
                        Chấp nhận
                    </button> */}
                    </div>
                </div>

                <div className="px-8 py-4">
                    <div className={"my-6"}>
                        <div className="after:mt-4 after:block after:h-1 after:w-full after:rounded-lg after:bg-gray-200">
                            <ol className="grid grid-cols-3 text-sm font-medium text-gray-500">
                                <li className="relative text-left text-emerald-600">
                                    <span className="absolute left-0 -bottom-[1.75rem] rounded-full bg-emerald-600 text-white">
                                        <svg
                                            className="h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>

                                    <span className="hidden sm:block">
                                        Được mời tham gia
                                    </span>

                                    <svg
                                        className="ml-0 h-6 w-6 sm:hidden"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        stroke-width="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                                        />
                                    </svg>
                                </li>

                                <li className="relative text-center text-emerald-600">
                                    <span className="absolute left-1/2 -bottom-[1.75rem] -translate-x-1/2 rounded-full bg-emerald-600 text-white">
                                        <svg
                                            className="h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>

                                    <span className="hidden sm:block">
                                        Đang đợt xác nhận
                                    </span>

                                    <svg
                                        className="mx-auto h-6 w-6 sm:hidden"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </li>

                                <li className="relative text-right">
                                    <span className="hidden sm:block">
                                        Đồng ý tham gia
                                    </span>

                                    <svg
                                        className="ml-auto h-6 w-6 sm:hidden"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                        />
                                    </svg>
                                </li>
                            </ol>
                        </div>
                    </div>
                    {true && (
                        <div className="shadow rounded-md p-4 border">
                            <h1 className="font-medium text-slate-800">
                                Ghi chú
                            </h1>
                            <p className="text-sm text-slate-600">
                                {participant?.note}
                            </p>
                        </div>
                    )}
                </div>
                <div className="px-8 py-4 border-t">
                    <div className="flex gap-4 items-center">
                        <div className="flex items-center text-sm text-slate-600  rounded-full px-4 py-2 border shadow-sm">
                            <FiPhoneCall className={"text-blue-700"} />
                            <span className="ml-2">
                                {participant?.issuer?.user?.phone}
                            </span>
                        </div>
                        <div className="flex items-center text-sm text-slate-600  rounded-full px-4 py-2 border shadow-sm">
                            <FiMail className={"text-blue-700"} />
                            <span className="ml-2">
                                {participant?.issuer?.user?.email}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={showCancelInvitationModal}
                onClose={() => setShowCancelInvitationModal(false)}
                onConfirm={handleCancelInvitation}
                confirmText="Xác nhận hủy"
                title="Hủy lời mời tham gia"
                content={`Bạn có chắc chắn muốn hủy lời mời tham gia đối với nhà phát hành ${participant?.issuer?.user?.name}?`}
            />
        </Fragment>
    );
};

export default ParticipantCard;
