import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useContext, useState } from "react";
import {
    IoArrowForward,
    IoChevronBack,
    IoLocationSharp,
} from "react-icons/io5";
import { useAuth } from "../../context/AuthContext";
import { PostService } from "../../old-services/PostService";
import { IPostResponse } from "../../old-types/response/IPostResponse";
import { getFormattedDate } from "../../utils/helper";
import ContentHeader from "./ContentHeader";
import OrganizationCard from "./OrganizationCard";
import PostCard from "./PostCard";
import Separator from "./Seperator";
import StatusLabel from "./StatusLabel";
// import ParticipationTable from '../Admin/ParticipationTable';
import { useRouter } from "next/router";
import { HiStatusOnline } from "react-icons/hi";
import { CampaignFormats } from "../../constants/CampaignFormats";
import { CampaignContext } from "../../context/CampaignContext";
import EmptySection from "./EmptySection";

const MainContent: React.FC = () => {
    const { loginUser } = useAuth();
    const postService = new PostService(loginUser?.accessToken);

    const router = useRouter();

    const campaign = useContext(CampaignContext);

    const campaignOrganizations = campaign?.campaignOrganizations;

    const [postPageSize, setPostPageSize] = useState(4);

    const {
        data: posts,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
        isInitialLoading,
    } = useInfiniteQuery(
        ["posts", campaign?.id],
        ({ pageParam = 1 }) =>
            postService.getPosts({
                page: pageParam,
                campaignId: campaign?.id,
                size: postPageSize,
            }),
        {
            getNextPageParam: (lastPage) => {
                const currentPage = lastPage?.metadata?.page;
                const totalPages = Math.ceil(
                    lastPage?.metadata?.total / postPageSize
                );
                return currentPage < totalPages ? currentPage + 1 : undefined;
            },
        }
    );

    return (
        <div>
            <div className="mb-6">
                <button
                    className="flex w-fit items-center justify-between rounded border-slate-200 bg-slate-100 px-3.5 py-1.5 text-base font-medium text-slate-600 transition duration-150 ease-in-out hover:border-slate-300 hover:bg-slate-200"
                    onClick={() => router.back()}
                >
                    <IoChevronBack size={"17"} />
                    <span>Quay lại</span>
                </button>
            </div>
            <div className="mb-2 flex flex-wrap items-center gap-1 text-sm font-semibold uppercase text-indigo-500">
                {getFormattedDate(campaign?.startDate).fullDate}
                <IoArrowForward className={"fill-indigo-500"} />
                {getFormattedDate(campaign?.endDate).fullDate}
            </div>
            <header className="mb-4">
                {/* Title */}
                <h1 className="mb-2 text-2xl font-bold text-slate-800 md:text-3xl">
                    {campaign?.name}
                </h1>
            </header>

            {/* Meta */}
            <div className="mb-6 space-y-3 sm:flex flex-wrap gap-4 sm:items-center sm:justify-between sm:space-y-0">
                {/* Location */}
                <div className="flex items-center gap-1 sm:mr-4">
                    {campaign?.format === CampaignFormats.OFFLINE.id && (
                        <>
                            <IoLocationSharp
                                size={20}
                                className={"fill-red-700"}
                            />
                            <div className="whitespace-nowrap text-sm">
                                Diễn ra tại{" "}
                                <span className="font-semibold text-slate-800">
                                    {campaign?.address}
                                </span>
                            </div>
                        </>
                    )}

                    {campaign?.format === CampaignFormats.ONLINE.id && (
                        <>
                            <HiStatusOnline
                                size={20}
                                className={"fill-green-700"}
                            />
                            <div className="whitespace-nowrap text-sm">
                                <span className="font-semibold text-slate-800">
                                    Hội sách tổ chức trực tuyến
                                </span>
                            </div>
                        </>
                    )}
                </div>
                {/* Right side */}
                <StatusLabel statusId={campaign?.status} />
            </div>

            {/* Image */}
            <figure className="mb-6">
                <Image
                    className="w-full rounded"
                    src={
                        campaign?.imageUrl ||
                        `https://picsum.photos/1920/1080?random={${Math.random()}}`
                    }
                    width={1000}
                    height={1000}
                    alt=""
                />
            </figure>

            {/* Description */}
            <div>
                <ContentHeader text={"Mô tả hội sách"} />
                <p className="mt-2 mb-6 break-words">{campaign?.description}</p>
            </div>
            <Separator />

            {/*Organizations*/}
            <div>
                <ContentHeader
                    text={`${
                        campaign?.isRecurring
                            ? "Tổ chức và lịch trình"
                            : "Tổ chức"
                    } (${campaignOrganizations?.length || 0})`}
                />
                {campaignOrganizations && campaignOrganizations?.length > 0 ? (
                    <div className="my-6 space-y-4">
                        {campaignOrganizations.map((org) => (
                            <OrganizationCard
                                campaignOrganization={org}
                                key={org.id}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptySection
                        text={"Sự kiện này chưa có tổ chức nào tham gia"}
                    />
                )}
            </div>
            <Separator />

            {/*ParticipationTable*/}
            {/* {loginUser?.role === Roles.SYSTEM.id && (
                <ParticipationSection campaign={campaign} />
            )} */}

            {/* Posts */}
            <div>
                <ContentHeader
                    text={`Sách đang được bán (${
                        posts?.pages[0]?.metadata.total || 0
                    })`}
                />
                {isInitialLoading ? (
                    <div className={"my-6"}>Đang tải...</div>
                ) : posts && posts?.pages.length > 0 ? (
                    <div className="my-6">
                        <div className="grid grid-cols-12 gap-6">
                            {posts?.pages?.map((value) =>
                                value.data.map((post: IPostResponse) => (
                                    <PostCard data={post} key={post?.id} />
                                ))
                            )}
                        </div>
                        {hasNextPage && (
                            <button
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                                className="mx-auto mt-4 block rounded bg-indigo-50 px-4 py-2 text-base font-medium text-indigo-500 transition disabled:bg-gray-50 disabled:text-gray-500"
                            >
                                {isFetchingNextPage
                                    ? "Đang tải..."
                                    : "Xem thêm bài đăng"}
                            </button>
                        )}
                    </div>
                ) : (
                    <EmptySection text={"Sự kiện này chưa có bài đăng nào"} />
                )}
            </div>

            <Separator />

            {/*/!* Comments *!/*/}
            {/*<div>*/}
            {/*    <ContentHeader text={'Bình luận (3)'} />*/}

            {/*    <ul className="my-6 space-y-5">*/}
            {/*        /!* Comment *!/*/}
            {/*        <li className="flex items-start">*/}
            {/*            <a className="shrink-0 mr-3 block" href="#0">*/}
            {/*                <Image*/}
            {/*                    className="rounded-full"*/}
            {/*                    src={DefaultAvatar.src}*/}
            {/*                    width="32"*/}
            {/*                    height="32"*/}
            {/*                    alt="User 07"*/}
            {/*                />*/}
            {/*            </a>*/}
            {/*            <div className="grow">*/}
            {/*                <div className="text-slate-800 mb-2 text-sm font-semibold">*/}
            {/*                    Taylor Nieman*/}
            {/*                </div>*/}
            {/*                <div className="italic">*/}
            {/*                    “Lorem ipsum dolor sit amet, consectetur*/}
            {/*                    adipiscing elit, sed do eiusmod tempor*/}
            {/*                    incididunt ut labore et dolore magna aliqua. Ut*/}
            {/*                    enim ad minim veniam.”*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </li>*/}
            {/*        /!* Comment *!/*/}
            {/*        <li className="flex items-start">*/}
            {/*            <a className="shrink-0 mr-3 block" href="#0">*/}
            {/*                <Image*/}
            {/*                    className="rounded-full"*/}
            {/*                    src={DefaultAvatar.src}*/}
            {/*                    width="32"*/}
            {/*                    height="32"*/}
            {/*                    alt="User 08"*/}
            {/*                />*/}
            {/*            </a>*/}
            {/*            <div className="grow">*/}
            {/*                <div className="text-slate-800 mb-2 text-sm font-semibold">*/}
            {/*                    Meagan Loyst*/}
            {/*                </div>*/}
            {/*                <div className="italic">*/}
            {/*                    “Lorem ipsum dolor sit amet, consectetur*/}
            {/*                    adipiscing elit, sed do eiusmod tempor*/}
            {/*                    incididunt ut labore et dolore magna aliqua. Ut*/}
            {/*                    enim ad minim veniam.”*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </li>*/}
            {/*        /!* Comment *!/*/}
            {/*        <li className="flex items-start">*/}
            {/*            <a className="shrink-0 mr-3 block" href="#0">*/}
            {/*                <Image*/}
            {/*                    className="rounded-full"*/}
            {/*                    src={DefaultAvatar.src}*/}
            {/*                    width="32"*/}
            {/*                    height="32"*/}
            {/*                    alt="User 02"*/}
            {/*                />*/}
            {/*            </a>*/}
            {/*            <div className="grow">*/}
            {/*                <div className="text-slate-800 mb-2 text-sm font-semibold">*/}
            {/*                    Frank Malik*/}
            {/*                </div>*/}
            {/*                <div className="italic">*/}
            {/*                    “Lorem ipsum dolor sit amet, consectetur*/}
            {/*                    adipiscing elit, sed do eiusmod tempor*/}
            {/*                    incididunt ut labore et dolore magna aliqua. Ut*/}
            {/*                    enim ad minim veniam.”*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</div>*/}

            {/*<Separator />*/}

            {/*/!* Similar Meetups *!/*/}
            {/*{loginUser?.role === Roles.CUSTOMER.id && (*/}
            {/*    <div>*/}
            {/*        <ContentHeader text={'Các sự kiện liên quan'} />*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
    );
};

export default MainContent;
