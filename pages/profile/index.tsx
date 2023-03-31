import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import CustomerLayout from "../../components/Layout/CustomerLayout";
import AdminSettingsLayout from "../../components/Layout/AdminSettingsLayout";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { UserService } from "../../services/UserService";
import { getFormattedTime } from "../../utils/helper";
import { RiCake2Line, RiMapPin2Line, RiUserAddLine } from "react-icons/ri";
import { AiOutlineCamera, AiOutlineInfo } from "react-icons/ai";
import { Tab } from "@headlessui/react";
import Form from "../../components/Form";
import { Controller, useForm } from "react-hook-form";
import useAddress from "../../hooks/useAddress";
import SelectBox from "../../components/SelectBox";
import { IProvince } from "../../types/Address/IProvince";
import { IDistrict } from "../../types/Address/IDistrict";
import { IWard } from "../../types/Address/IWard";
import TransitionModal from "../../components/Modal/TransitionModal";
import { LevelService } from "../../services/LevelService";
import { OrganizationService } from "../../services/OrganizationService";
import EmptyState, { EMPTY_STATE_TYPE } from "../../components/EmptyState";

const Index: NextPageWithLayout = () => {
    const { loginUser, user, logOut } = useAuth();

    const [showLevelModal, setShowLevelModal] = React.useState(false);

    const userService = new UserService(loginUser?.accessToken);

    const organizationService = new OrganizationService(loginUser?.accessToken);


    const { data: userProfile } = useQuery(
        ["userProfile", loginUser?.id],
        () => userService.getLoggedInUser(),
    );

    const { data: followingOrganizations } = useQuery(
        ["following_organizations", loginUser?.id],
        () => organizationService.getFollowingOrganizationsByCustomer(),
    );


    const {
        data: levelData,
        isLoading,
        isFetching,
    } = useQuery(
        ["levels"],
        () =>
            new LevelService().getLevels({
                page: 1,
                size: 1000,
                withCustomers: false,
                status: true,
            }),
        {
            keepPreviousData: true,
        },
    );


    const {
        selectedProvince,
        selectedDistrict,
        selectedWard,
        provinces,
        districts,
        wards,
        provincesLoading,
        districtsLoading,
        wardsLoading,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
    } = useAddress({
        defaultProvinceCode: userProfile?.user?.addressViewModel?.provinceCode,
        defaultDistrictCode: userProfile?.user?.addressViewModel?.districtCode,
        defaultWardCode: userProfile?.user?.addressViewModel?.wardCode,
    });


    const { register, control, watch, setValue, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: loginUser?.name,
            email: loginUser?.email,
            phone: loginUser?.phone,
            addressRequest: {
                detail: userProfile?.user?.addressViewModel?.detail,
                provinceCode: userProfile?.user?.addressViewModel?.provinceCode,
                districtCode: userProfile?.user?.addressViewModel?.districtCode,
                wardCode: userProfile?.user?.addressViewModel?.wardCode,
            },
        },
    });
    return (
        <div
            className={`grow flex flex-col`}
        >
             <button onClick={logOut}>Logout</button>
            {/* Profile background */}
            <div className="relative h-44 bg-slate-200">
                <img className="object-cover h-full w-full shadow-inner"
                     src={"https://unitrain.edu.vn/wp-content/uploads/2017/02/maxresdefault--818x460.jpg"}
                     width="979" height="220"
                     alt="Profile background" />
                {/* Close button */}
                <button
                    className="md:hidden absolute top-4 left-4 sm:left-6 text-white opacity-80 hover:opacity-100"
                    onClick={() => setProfileSidebarOpen(!true)}
                    aria-controls="profile-sidebar"
                    aria-expanded={true}
                >
                    <span className="sr-only">Close sidebar</span>
                    <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
                    </svg>
                </button>
            </div>

            {/* Content */}
            <div className="relative px-4 sm:px-6 pb-8">
                {/* Pre-header */}
                <div className="-mt-16 mb-6 sm:mb-3">
                    <div className="flex flex-col items-center sm:flex-row sm:justify-between sm:items-end">
                        {/* Avatar */}
                        <div className="inline-flex -ml-1 -mt-1 mb-4 sm:mb-0 relative group">
                            <img className="rounded-full border-4 border-white"
                                 src={loginUser?.imageUrl || user?.photoURL} width="128"
                                 height="128" alt="Avatar" />

                            <div
                                className="cursor-pointer absolute flex flex-col items-center justify-center bg-black/0 group-hover:bg-black/30 inset-0 rounded-full border-4 border-white  transition duration-150 ease-in-out">
                                <AiOutlineCamera className="hidden group-hover:block text-white text-2xl" />
                                <span className="hidden group-hover:block text-xs text-white">
                                    Thay đổi
                                </span>

                            </div>

                        </div>

                        {/* Actions */}
                        <div className="flex space-x-2 sm:mb-2">
                            <div className="flex items-center space-x-2">
                                <div
                                    className="text-sm text-green-600 font-medium bg-green-100 rounded-sm px-3 py-1 border border-green-200">
                                    {userProfile?.level?.name}
                                </div>
                                <div
                                    className="text-sm text-amber-600 font-medium bg-amber-100 rounded-sm px-3 py-1 border border-amber-200">
                                    <span className={"font-normal"}>
                                        Điểm: </span>
                                    {userProfile?.point}
                                </div>
                                <button onClick={
                                    () => setShowLevelModal(true)
                                } className="border bg-white rounded shadow-sm items-center justify-center">
                                    <AiOutlineInfo className="text-slate-600 text-lg m-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <header className="text-center sm:text-left mb-6">
                    {/* Name */}
                    <div className="inline-flex items-start mb-2">
                        <h1 className="text-2xl text-slate-800 font-bold">
                            {loginUser?.name}
                        </h1>
                        <svg className="w-4 h-4 fill-current shrink-0 text-amber-500 ml-2" viewBox="0 0 16 16">
                            <path
                                d="M13 6a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5A.75.75 0 0 1 13 6ZM6 16a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 1 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z" />
                        </svg>
                    </div>
                    {/* Bio */}
                    {/*<div className="text-sm mb-3">Fitness Fanatic, Design Enthusiast, Mentor, Meetup Organizer & PHP*/}
                    {/*    Lover.*/}
                    {/*</div>*/}
                    {/* Meta */}
                    <div className="space-y-2.5">

                        <div className="flex items-center">
                            <RiUserAddLine className="text-slate-500" />
                            <span className="text-sm font-medium whitespace-nowrap text-slate-500 ml-2">
                                Tham gia Boek từ {getFormattedTime(userProfile?.user?.createdDate, "dd-MM-yyyy")}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <RiCake2Line className="text-slate-500" />
                            <span className="text-sm font-medium whitespace-nowrap text-slate-500 ml-2">
                                {getFormattedTime(userProfile?.dob, "dd-MM-yyyy")}
                            </span>
                        </div>

                        <div className="flex items-center">
                            <RiMapPin2Line className="text-slate-500" />
                            <span className="text-sm font-medium whitespace-nowrap text-slate-500 ml-2">{
                                userProfile?.user?.address || "Chưa cập nhật"
                            }</span>
                        </div>
                    </div>
                </header>

                <Tab.Group>
                    {/* Tabs */}
                    <Tab.List as={"div"} className="relative mb-6">
                        <div className="absolute bottom-0 w-full h-px bg-slate-200" aria-hidden="true"></div>
                        <ul className="relative text-sm font-medium flex flex-nowrap -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-scroll no-scrollbar">
                            <Tab as={"div"}
                                 className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8 focus:outline-none cursor-pointer">
                                <span
                                    className="block pb-3 ui-selected:text-indigo-500 text-slate-500 ui-selected:hover:text-slate-600 whitespace-nowrap ui-selected:border-b-2 ui-selected:border-indigo-500">
                                    Thông tin cá nhân
                                </span>
                            </Tab>


                            <Tab as={"div"}
                                 className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8 focus:outline-none cursor-pointer">
                                <span
                                    className="block pb-3 ui-selected:text-indigo-500 text-slate-500 ui-selected:hover:text-slate-600 whitespace-nowrap ui-selected:border-b-2 ui-selected:border-indigo-500">
                                    Tổ chức
                                </span>
                            </Tab>


                            <Tab as={"div"}
                                 className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8 focus:outline-none cursor-pointer">
                                <span
                                    className="block pb-3 ui-selected:text-indigo-500 text-slate-500 ui-selected:hover:text-slate-600 whitespace-nowrap ui-selected:border-b-2 ui-selected:border-indigo-500">
                                    Nhóm tham gia
                                </span>
                            </Tab>


                            {/*<li className="mr-6 last:mr-0 first:pl-4 sm:first:pl-6 lg:first:pl-8 last:pr-4 sm:last:pr-6 lg:last:pr-8">*/}
                            {/*    <a className="block pb-3 text-slate-500 hover:text-slate-600 whitespace-nowrap"*/}
                            {/*       href="#0">*/}
                            {/*        Connections*/}
                            {/*    </a>*/}
                            {/*</li>*/}

                        </ul>
                    </Tab.List>
                    <Tab.Panels>
                        <Tab.Panel>
                            {/* Profile content */}
                            {/*<div className="flex flex-col xl:flex-row xl:space-x-16">*/}
                            {/*    /!* Main content *!/*/}
                            {/*    <div className="space-y-5 mb-8 xl:mb-0">*/}
                            {/*        /!* About Me *!/*/}
                            {/*        <div>*/}
                            {/*            <h2 className="text-slate-800 font-semibold mb-2">About Me</h2>*/}
                            {/*            <div className="text-sm space-y-2">*/}
                            {/*                <p>*/}
                            {/*                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod*/}
                            {/*                    tempor*/}
                            {/*                    incididunt ut labore et dolore magna aliqua. Ut enim*/}
                            {/*                    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut*/}
                            {/*                    aliquip ex ea*/}
                            {/*                    commodo consequat. Duis aute irure dolor in*/}
                            {/*                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla*/}
                            {/*                    pariatur.*/}
                            {/*                </p>*/}
                            {/*                <p>Consectetur adipiscing elit, sed do eiusmod tempor magna aliqua.</p>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}

                            {/*        /!* Departments *!/*/}
                            {/*        <div>*/}
                            {/*            <h2 className="text-slate-800 font-semibold mb-2">Departments</h2>*/}
                            {/*            /!* Cards *!/*/}
                            {/*            <div className="grid xl:grid-cols-2 gap-4">*/}
                            {/*                /!* Card *!/*/}
                            {/*                <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">*/}
                            {/*                    /!* Card header *!/*/}
                            {/*                    <div className="grow flex items-center truncate mb-2">*/}
                            {/*                        <div*/}
                            {/*                            className="w-8 h-8 shrink-0 flex items-center justify-center bg-slate-700 rounded-full mr-2">*/}
                            {/*                            <img className="ml-1" src={faker.image.avatar()} width="14"*/}
                            {/*                                 height="14"*/}
                            {/*                                 alt="Icon 03"/>*/}
                            {/*                        </div>*/}
                            {/*                        <div className="truncate">*/}
                            {/*                    <span*/}
                            {/*                        className="text-sm font-medium text-slate-800">Acme Marketing</span>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                    /!* Card content *!/*/}
                            {/*                    <div className="text-sm mb-3">Duis aute irure dolor in reprehenderit in*/}
                            {/*                        voluptate*/}
                            {/*                        velit esse cillum dolore.*/}
                            {/*                    </div>*/}
                            {/*                    /!* Card footer *!/*/}
                            {/*                    <div className="flex justify-between items-center">*/}
                            {/*                        /!* Avatars group *!/*/}
                            {/*                        <div className="flex -space-x-3 -ml-0.5">*/}
                            {/*                            <img className="rounded-full border-2 border-white box-content"*/}
                            {/*                                 src={faker.image.avatar()} width="24" height="24"*/}
                            {/*                                 alt="Avatar"/>*/}
                            {/*                            <img className="rounded-full border-2 border-white box-content"*/}
                            {/*                                 src={faker.image.avatar()} width="24" height="24"*/}
                            {/*                                 alt="Avatar"/>*/}
                            {/*                            <img className="rounded-full border-2 border-white box-content"*/}
                            {/*                                 src={faker.image.avatar()} width="24" height="24"*/}
                            {/*                                 alt="Avatar"/>*/}
                            {/*                            <img className="rounded-full border-2 border-white box-content"*/}
                            {/*                                 src={faker.image.avatar()} width="24" height="24"*/}
                            {/*                                 alt="Avatar"/>*/}
                            {/*                        </div>*/}
                            {/*                        /!* Link *!/*/}
                            {/*                        <div>*/}
                            {/*                            <a className="text-sm font-medium text-indigo-500 hover:text-indigo-600"*/}
                            {/*                               href="#0">*/}
                            {/*                                View -&gt;*/}
                            {/*                            </a>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}

                            {/*                /!* Card *!/*/}
                            {/*                <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">*/}
                            {/*                    /!* Card header *!/*/}
                            {/*                    <div className="grow flex items-center truncate mb-2">*/}
                            {/*                        <div*/}
                            {/*                            className="w-8 h-8 shrink-0 flex items-center justify-center bg-slate-700 rounded-full mr-2">*/}
                            {/*                            <img className="ml-1" src={faker.image.avatar()} width="14"*/}
                            {/*                                 height="14"*/}
                            {/*                                 alt="Icon 02"/>*/}
                            {/*                        </div>*/}
                            {/*                        <div className="truncate">*/}
                            {/*                            <span className="text-sm font-medium text-slate-800">Acme Product</span>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                    /!* Card content *!/*/}
                            {/*                    <div className="text-sm mb-3">Duis aute irure dolor in reprehenderit in*/}
                            {/*                        voluptate*/}
                            {/*                        velit esse cillum dolore.*/}
                            {/*                    </div>*/}
                            {/*                    /!* Card footer *!/*/}
                            {/*                    <div className="flex justify-between items-center">*/}
                            {/*                        /!* Avatars group *!/*/}
                            {/*                        <div className="flex -space-x-3 -ml-0.5">*/}
                            {/*                            <img className="rounded-full border-2 border-white box-content"*/}
                            {/*                                 src={faker.image.avatar()} width="24" height="24"*/}
                            {/*                                 alt="Avatar"/>*/}
                            {/*                            <img className="rounded-full border-2 border-white box-content"*/}
                            {/*                                 src={faker.image.avatar()} width="24" height="24"*/}
                            {/*                                 alt="Avatar"/>*/}
                            {/*                            <img className="rounded-full border-2 border-white box-content"*/}
                            {/*                                 src={faker.image.avatar()} width="24" height="24"*/}
                            {/*                                 alt="Avatar"/>*/}
                            {/*                        </div>*/}
                            {/*                        /!* Link *!/*/}
                            {/*                        <div>*/}
                            {/*                            <a className="text-sm font-medium text-indigo-500 hover:text-indigo-600"*/}
                            {/*                               href="#0">*/}
                            {/*                                View -&gt;*/}
                            {/*                            </a>*/}
                            {/*                        </div>*/}
                            {/*                    </div>*/}
                            {/*                </div>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}

                            {/*        /!* Work History *!/*/}
                            {/*        <div>*/}
                            {/*            <h2 className="text-slate-800 font-semibold mb-2">Work History</h2>*/}
                            {/*            <div className="bg-white p-4 border border-slate-200 rounded-sm shadow-sm">*/}
                            {/*                <ul className="space-y-3">*/}
                            {/*                    /!* Item *!/*/}
                            {/*                    <li className="sm:flex sm:items-center sm:justify-between">*/}
                            {/*                        <div className="sm:grow flex items-center text-sm">*/}
                            {/*                            /!* Icon *!/*/}
                            {/*                            <div*/}
                            {/*                                className="w-8 h-8 rounded-full shrink-0 bg-amber-500 my-2 mr-3">*/}
                            {/*                                <svg className="w-8 h-8 fill-current text-amber-50"*/}
                            {/*                                     viewBox="0 0 32 32">*/}
                            {/*                                    <path*/}
                            {/*                                        d="M21 14a.75.75 0 0 1-.75-.75 1.5 1.5 0 0 0-1.5-1.5.75.75 0 1 1 0-1.5 1.5 1.5 0 0 0 1.5-1.5.75.75 0 1 1 1.5 0 1.5 1.5 0 0 0 1.5 1.5.75.75 0 1 1 0 1.5 1.5 1.5 0 0 0-1.5 1.5.75.75 0 0 1-.75.75Zm-7 10a1 1 0 0 1-1-1 4 4 0 0 0-4-4 1 1 0 0 1 0-2 4 4 0 0 0 4-4 1 1 0 0 1 2 0 4 4 0 0 0 4 4 1 1 0 0 1 0 2 4 4 0 0 0-4 4 1 1 0 0 1-1 1Z"/>*/}
                            {/*                                </svg>*/}
                            {/*                            </div>*/}
                            {/*                            /!* Position *!/*/}
                            {/*                            <div>*/}
                            {/*                                <div className="font-medium text-slate-800">Senior Product*/}
                            {/*                                    Designer*/}
                            {/*                                </div>*/}
                            {/*                                <div*/}
                            {/*                                    className="flex flex-nowrap items-center space-x-2 whitespace-nowrap">*/}
                            {/*                                    <div>Remote</div>*/}
                            {/*                                    <div className="text-slate-400">·</div>*/}
                            {/*                                    <div>April, 2020 - Today</div>*/}
                            {/*                                </div>*/}
                            {/*                            </div>*/}
                            {/*                        </div>*/}
                            {/*                        /!* Tags *!/*/}
                            {/*                        <div className="sm:ml-2 mt-2 sm:mt-0">*/}
                            {/*                            <ul className="flex flex-wrap sm:justify-end -m-1">*/}
                            {/*                                <li className="m-1">*/}
                            {/*                                    <button*/}
                            {/*                                        className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">*/}
                            {/*                                        Marketing*/}
                            {/*                                    </button>*/}
                            {/*                                </li>*/}
                            {/*                                <li className="m-1">*/}
                            {/*                                    <button*/}
                            {/*                                        className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">*/}
                            {/*                                        +4*/}
                            {/*                                    </button>*/}
                            {/*                                </li>*/}
                            {/*                            </ul>*/}
                            {/*                        </div>*/}
                            {/*                    </li>*/}

                            {/*                    /!* Item *!/*/}
                            {/*                    <li className="sm:flex sm:items-center sm:justify-between">*/}
                            {/*                        <div className="sm:grow flex items-center text-sm">*/}
                            {/*                            /!* Icon *!/*/}
                            {/*                            <div*/}
                            {/*                                className="w-8 h-8 rounded-full shrink-0 bg-indigo-500 my-2 mr-3">*/}
                            {/*                                <svg className="w-8 h-8 fill-current text-indigo-50"*/}
                            {/*                                     viewBox="0 0 32 32">*/}
                            {/*                                    <path*/}
                            {/*                                        d="M8.994 20.006a1 1 0 0 1-.707-1.707l4.5-4.5a1 1 0 0 1 1.414 0l3.293 3.293 4.793-4.793a1 1 0 1 1 1.414 1.414l-5.5 5.5a1 1 0 0 1-1.414 0l-3.293-3.293L9.7 19.713a1 1 0 0 1-.707.293Z"/>*/}
                            {/*                                </svg>*/}
                            {/*                            </div>*/}
                            {/*                            /!* Position *!/*/}
                            {/*                            <div>*/}
                            {/*                                <div className="font-medium text-slate-800">Product*/}
                            {/*                                    Designer*/}
                            {/*                                </div>*/}
                            {/*                                <div*/}
                            {/*                                    className="flex flex-nowrap items-center space-x-2 whitespace-nowrap">*/}
                            {/*                                    <div>Milan, IT</div>*/}
                            {/*                                    <div className="text-slate-400">·</div>*/}
                            {/*                                    <div>April, 2018 - April 2020</div>*/}
                            {/*                                </div>*/}
                            {/*                            </div>*/}
                            {/*                        </div>*/}
                            {/*                        /!* Tags *!/*/}
                            {/*                        <div className="sm:ml-2 mt-2 sm:mt-0">*/}
                            {/*                            <ul className="flex flex-wrap sm:justify-end -m-1">*/}
                            {/*                                <li className="m-1">*/}
                            {/*                                    <button*/}
                            {/*                                        className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">*/}
                            {/*                                        Marketing*/}
                            {/*                                    </button>*/}
                            {/*                                </li>*/}
                            {/*                                <li className="m-1">*/}
                            {/*                                    <button*/}
                            {/*                                        className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">*/}
                            {/*                                        +4*/}
                            {/*                                    </button>*/}
                            {/*                                </li>*/}
                            {/*                            </ul>*/}
                            {/*                        </div>*/}
                            {/*                    </li>*/}

                            {/*                    /!* Item *!/*/}
                            {/*                    <li className="sm:flex sm:items-center sm:justify-between">*/}
                            {/*                        <div className="sm:grow flex items-center text-sm">*/}
                            {/*                            /!* Icon *!/*/}
                            {/*                            <div*/}
                            {/*                                className="w-8 h-8 rounded-full shrink-0 bg-indigo-500 my-2 mr-3">*/}
                            {/*                                <svg className="w-8 h-8 fill-current text-indigo-50"*/}
                            {/*                                     viewBox="0 0 32 32">*/}
                            {/*                                    <path*/}
                            {/*                                        d="M8.994 20.006a1 1 0 0 1-.707-1.707l4.5-4.5a1 1 0 0 1 1.414 0l3.293 3.293 4.793-4.793a1 1 0 1 1 1.414 1.414l-5.5 5.5a1 1 0 0 1-1.414 0l-3.293-3.293L9.7 19.713a1 1 0 0 1-.707.293Z"/>*/}
                            {/*                                </svg>*/}
                            {/*                            </div>*/}
                            {/*                            /!* Position *!/*/}
                            {/*                            <div>*/}
                            {/*                                <div className="font-medium text-slate-800">Product*/}
                            {/*                                    Designer*/}
                            {/*                                </div>*/}
                            {/*                                <div*/}
                            {/*                                    className="flex flex-nowrap items-center space-x-2 whitespace-nowrap">*/}
                            {/*                                    <div>Milan, IT</div>*/}
                            {/*                                    <div className="text-slate-400">·</div>*/}
                            {/*                                    <div>April, 2018 - April 2020</div>*/}
                            {/*                                </div>*/}
                            {/*                            </div>*/}
                            {/*                        </div>*/}
                            {/*                        /!* Tags *!/*/}
                            {/*                        <div className="sm:ml-2 mt-2 sm:mt-0">*/}
                            {/*                            <ul className="flex flex-wrap sm:justify-end -m-1">*/}
                            {/*                                <li className="m-1">*/}
                            {/*                                    <button*/}
                            {/*                                        className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">*/}
                            {/*                                        Marketing*/}
                            {/*                                    </button>*/}
                            {/*                                </li>*/}
                            {/*                                <li className="m-1">*/}
                            {/*                                    <button*/}
                            {/*                                        className="inline-flex items-center justify-center text-xs font-medium leading-5 rounded-full px-2.5 py-0.5 border border-slate-200 hover:border-slate-300 shadow-sm bg-white text-slate-500 duration-150 ease-in-out">*/}
                            {/*                                        +4*/}
                            {/*                                    </button>*/}
                            {/*                                </li>*/}
                            {/*                            </ul>*/}
                            {/*                        </div>*/}
                            {/*                    </li>*/}
                            {/*                </ul>*/}
                            {/*            </div>*/}
                            {/*        </div>*/}
                            {/*    </div>*/}

                            {/*    /!* Sidebar *!/*/}
                            {/*    <aside className="xl:min-w-56 xl:w-56 space-y-3">*/}
                            {/*        <div className="text-sm">*/}
                            {/*            <h3 className="font-medium text-slate-800">Title</h3>*/}
                            {/*            <div>Senior Product Designer</div>*/}
                            {/*        </div>*/}
                            {/*        <div className="text-sm">*/}
                            {/*            <h3 className="font-medium text-slate-800">Location</h3>*/}
                            {/*            <div>Milan, IT - Remote</div>*/}
                            {/*        </div>*/}
                            {/*        <div className="text-sm">*/}
                            {/*            <h3 className="font-medium text-slate-800">Email</h3>*/}
                            {/*            <div>carolinmcneail@acme.com</div>*/}
                            {/*        </div>*/}
                            {/*        <div className="text-sm">*/}
                            {/*            <h3 className="font-medium text-slate-800">Birthdate</h3>*/}
                            {/*            <div>4 April, 1987</div>*/}
                            {/*        </div>*/}
                            {/*        <div className="text-sm">*/}
                            {/*            <h3 className="font-medium text-slate-800">Joined Acme</h3>*/}
                            {/*            <div>7 April, 2017</div>*/}
                            {/*        </div>*/}
                            {/*    </aside>*/}
                            {/*</div>*/}

                            <div className="space-y-4">
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <Form.Input
                                        register={register}
                                        fieldName={"name"}
                                        label="Họ và tên"
                                        placeholder={"Nhập họ và tên"}
                                    />
                                    <Form.Input
                                        register={register}
                                        fieldName={"phone"}
                                        label="Số điện thoại"
                                        placeholder={"Nhập số điện thoại"}
                                    />
                                </div>

                                <Form.Input

                                    register={register}
                                    fieldName={"addressRequest.detail"}
                                    label="Địa chỉ"
                                    placeholder={"Nhập địa chỉ"}
                                    isTextArea={true}
                                />
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <Form.Label label="Tỉnh / Thành phố" />
                                        <Controller
                                            control={control}
                                            name="addressRequest.provinceCode"
                                            render={({ field }) => (
                                                <SelectBox<IProvince>
                                                    value={selectedProvince}
                                                    placeholder={provincesLoading ? "Đang tải..." : "Chọn tỉnh / thành phố"}
                                                    onValueChange={(p) => {
                                                        if (
                                                            p.code ===
                                                            watch("addressRequest.provinceCode")
                                                        )
                                                            return;

                                                        field.onChange(p.code);
                                                        setValue(
                                                            "addressRequest.districtCode" as any,
                                                            undefined,
                                                        );
                                                        setValue(
                                                            "addressRequest.wardCode" as any,
                                                            undefined,
                                                        );
                                                        handleProvinceChange(p);
                                                    }}
                                                    displayKey="nameWithType"
                                                    dataSource={provinces}
                                                    disabled={provincesLoading}
                                                />
                                            )}
                                        />
                                    </div>
                                    <div>
                                        <Form.Label label="Quận / Huyện" />
                                        <Controller
                                            control={control}
                                            name="addressRequest.districtCode"
                                            render={({ field }) => (
                                                <SelectBox<IDistrict>
                                                    value={selectedDistrict}
                                                    placeholder={districtsLoading ? "Đang tải..." : "Chọn quận / huyện"}
                                                    onValueChange={(d) => {
                                                        if (
                                                            d.code ===
                                                            watch("addressRequest.districtCode")
                                                        )
                                                            return;
                                                        field.onChange(d.code);
                                                        setValue(
                                                            "addressRequest.wardCode" as any,
                                                            undefined,
                                                        );
                                                        handleDistrictChange(d);
                                                    }}
                                                    displayKey="nameWithType"
                                                    dataSource={districts}
                                                    disabled={districtsLoading}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <Form.Label label="Phường / Xã" />
                                        <Controller
                                            control={control}
                                            name="addressRequest.wardCode"
                                            render={({ field }) => (
                                                <SelectBox<IWard>
                                                    value={selectedWard}
                                                    placeholder={wardsLoading ? "Đang tải..." : "Chọn phường / xã"}
                                                    onValueChange={(w) => {
                                                        if (
                                                            w.code ===
                                                            watch("addressRequest.wardCode")
                                                        )
                                                            return;
                                                        field.onChange(w.code);
                                                        handleWardChange(w);
                                                    }}
                                                    displayKey="nameWithType"
                                                    dataSource={wards}
                                                    disabled={wardsLoading}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Tab.Panel>

                        <Tab.Panel>
                            {followingOrganizations?.data && followingOrganizations.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {followingOrganizations.data.map((o) => (
                                        <OrganizationCard
                                            key={o.id}
                                            organization={o}
                                            onUnfollow={() => {

                                            }
                                            }
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full">
                                    <EmptyState status={EMPTY_STATE_TYPE.NO_DATA}
                                                customMessage={"Bạn chưa theo dõi tổ chức nào"}
                                    />
                                </div>
                            )}
                        </Tab.Panel>
                        <Tab.Panel>
                            456
                        </Tab.Panel>

                    </Tab.Panels>

                </Tab.Group>

                <TransitionModal isOpen={showLevelModal}
                                 onClose={() => setShowLevelModal(false)}
                >
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        123
                    </div>
                </TransitionModal>
            </div>
        </div>
    );
};

Index.getLayout = function getLayout(page: ReactElement) {
    return <CustomerLayout>
        <AdminSettingsLayout childrenWrapperClassName={"lg:col-span-9"}>
            {page}
        </AdminSettingsLayout>
    </CustomerLayout>;
};

export default Index;