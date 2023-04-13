import React, { Fragment, useState } from "react";
import { BsSearch } from "react-icons/bs";
import Image from "next/image";
import { getAvatarFromName } from "../../utils/helper";
import Modal from "./Modal";
import TransitionModal from "./TransitionModal";
import { IUser } from "../../types/User/IUser";
import EmptyState, { EMPTY_STATE_TYPE } from "../EmptyState";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    joinedIssuers: (IUser | undefined)[];
}

const JoinedIssuerModal: React.FC<Props> = ({ isOpen, onClose, joinedIssuers }) => {
    const [search, setSearch] = useState("");
    const searchedIssuers = joinedIssuers.filter((issuer) => {
        return issuer?.name?.toLowerCase().includes(search.toLowerCase());
    });

    return (
        <TransitionModal
            isOpen={isOpen}
            onClose={onClose}
            closeOnOverlayClick={true}
        >
            <Fragment>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-900">
                            Nhà phát hành tham gia
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
                        <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhà phát hành"
                            className="h-12 w-full border-0 pl-11 pr-4 text-sm bg-slate-100 rounded text-gray-800 placeholder-gray-400 focus:ring-0"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="overflow-y-auto h-96">
                        {searchedIssuers?.length > 0 ? (
                            searchedIssuers.map((issuer) => (
                                <div
                                    key={issuer?.id}
                                    className="flex items-center justify-between p-4 border-b border-gray-200"
                                >
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Image
                                                width={200}
                                                height={200}
                                                className="h-10 w-10 rounded-full object-cover"
                                                src={
                                                    issuer?.imageUrl ||
                                                    getAvatarFromName(
                                                        issuer?.name,
                                                    )
                                                }
                                                alt=""
                                            />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {issuer?.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {issuer?.email}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <EmptyState
                                status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                            />
                        )}
                    </div>

                </div>
                <Modal.Footer>
                    <div className="flex flex-wrap justify-end">
                        <Modal.SecondaryButton type="button" onClick={onClose}>
                            Đóng
                        </Modal.SecondaryButton>
                    </div>
                </Modal.Footer>
            </Fragment>
        </TransitionModal>
    );
};

export default JoinedIssuerModal;