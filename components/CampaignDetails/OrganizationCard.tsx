import { Transition } from "@headlessui/react";
import Image from "next/image";
import React from "react";
import { BsCalendarWeek } from "react-icons/bs";
import { HiMapPin, HiOutlineChevronDown } from "react-icons/hi2";
import { ICampaignOrganization } from "../../types/Campaign_Organization/ICampaignOrganization";
import { getAvatarFromName, getFormattedTime } from "../../utils/helper";

type Props = {
    campaignOrganization: ICampaignOrganization;
};

const ScheduleNode: React.FC<{
    type: "start" | "end";
    time?: string;
}> = ({ type, time }) => {
    return (
        <div className="relative">
            {type === "start" && (
                <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                />
            )}
            <div className="relative flex space-x-3">
                <div>
                    <span
                        className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                            type === "start" ? "bg-blue-500" : "bg-pink-500"
                        }`}
                    >
                        <BsCalendarWeek
                            className="h-4 w-4 text-white"
                            aria-hidden="true"
                        />
                    </span>
                </div>
                <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                        <p className="text-sm text-slate-600">
                            {type === "start" ? "Diễn ra từ" : "Kết thúc vào"}{" "}
                            <span className="font-medium">
                                {getFormattedTime(time, "HH' giờ 'mm 'phút'")}
                            </span>
                        </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap font-medium text-emerald-600">
                        {getFormattedTime(time, "eeee, dd/MM/yyyy")}
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrganizationCard: React.FC<Props> = ({ campaignOrganization }) => {


    const schedules = campaignOrganization?.schedules || [];
    const [isShowSchedule, setIsShowSchedule] = React.useState<boolean>(false);
    return (
        <div>
            <div
                className="relative flex h-full w-full space-x-4 rounded border border-slate-200 bg-white px-4 py-6 shadow-sm transition duration-300 hover:shadow">
                <Image
                    src={
                        campaignOrganization?.organization?.imageUrl ||
                        getAvatarFromName(
                            campaignOrganization?.organization?.name,
                        )
                    }
                    width={500}
                    height={500}
                    alt=""
                    className="rounded-full object-cover h-12 w-12"
                />
                {/*Org Info*/}
                <div
                    className={`grow min-w-0 ${
                        schedules?.length > 0 ? "pr-4" : ""
                    }`}
                >
                    <div className={"mb-1 text-base font-bold text-slate-700"}>
                        {campaignOrganization?.organization?.name}
                    </div>
                    <div className={"text-sm text-slate-500"}>
                        {campaignOrganization?.organization?.address} -{" "}
                        {campaignOrganization?.organization?.phone}
                    </div>
                </div>
                {schedules?.length > 0 && (
                    <button
                        onClick={() => setIsShowSchedule(!isShowSchedule)}
                        className="absolute top-1/2 -translate-y-1/2 right-4 flex items-center justify-center w-8 h-8 rounded-full transition duration-300 hover:bg-slate-100"
                    >
                        <HiOutlineChevronDown
                            className={`text-slate-500 transition duration-300
                        ${isShowSchedule && "rotate-180"}`}
                        />
                    </button>
                )}
            </div>

            {schedules?.length > 0 && (
                <Transition
                    show={isShowSchedule}
                    enter="transition ease-out duration-300"
                    enterFrom="opacity-0 transform scale-95"
                    enterTo="opacity-100 transform scale-100"
                    leave="transition ease-in duration-300"
                    leaveFrom="opacity-100 transform scale-100"
                    leaveTo="opacity-0 transform scale-95"
                >
                    <div className="space-y-3">
                        {schedules.map((schedule) => (
                            <div
                                className="flow-root mt-2 bg-white rounded shadow p-8 space-y-8"
                                key={schedule.id}
                            >
                                <div className="mb-4 items-center flex gap-2 font-medium text-slate-600">
                                    <HiMapPin className="fill-red-500 w-6 h-6" />
                                    <span>{schedule?.address}</span>
                                </div>
                                <div role="list" className="space-y-8">
                                    <ScheduleNode
                                        type="start"
                                        time={schedule?.startDate}
                                    />
                                    <ScheduleNode
                                        type="end"
                                        time={schedule?.endDate}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </Transition>
            )}
        </div>
    );
};

export default OrganizationCard;
