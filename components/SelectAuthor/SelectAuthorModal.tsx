import React, {useState} from "react";
import {BsCheckCircle, BsSearch} from "react-icons/bs";
import Image from "next/image";
import EmptyState, {EMPTY_STATE_TYPE} from "../EmptyState";
import Modal from "../Modal/Modal";
import TransitionModal from "../Modal/TransitionModal";
import useDebounce from "../../hooks/useDebounce";
import {useQuery} from "@tanstack/react-query";
import {IGroup} from "../../types/Group/IGroup";
import {GroupService} from "../../services/GroupService";
import {useAuth} from "../../context/AuthContext";
import {getAvatarFromName} from "../../utils/helper";
import { IAuthor } from './../../types/Author/IAuthor';
import { AuthorService } from './../../old-services/AuthorService';
import Link from "next/link";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    selectedAuthors: IAuthor[];
    onItemSelect: (organization: IAuthor) => void;
};

const SelectAuthorModal: React.FC<Props> = ({
                                                       isOpen,
                                                       onClose,
                                                       selectedAuthors,
                                                       onItemSelect,
                                                   }) => {
    const {loginUser} = useAuth();
    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search, 500);
    const authorService = new AuthorService();

    const onModalClose = () => {
        setSearch("");
        onClose();
    };

    const {data: authors, isLoading} = useQuery(
        ["authors", debouncedSearch],
        () =>
            authorService.getAuthors({
                name: debouncedSearch,
                status: true,
            }), {
            keepPreviousData: true,
            select: (data) => data?.data
        }
    );

    return (
        <TransitionModal
            maxWidth={"max-w-lg"}
            isOpen={isOpen}
            closeOnOverlayClick={false}
            onClose={onModalClose}
        >
            <div className="overflow-hidden rounded-xl">
                <div>
                    <BsSearch className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"/>
                    <input
                        type="text"
                        placeholder="Tìm kiếm tác giả"
                        className="h-12 w-full border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-96 overflow-y-auto">
                    {!isLoading && authors ? (
                        authors?.map((group) => {
                            const isSelected = selectedAuthors?.find(
                                (o) => o?.id === group?.id
                            );
                            return (
                                <div
                                    onClick={() => {
                                        if (!isSelected) {
                                            onItemSelect(group);
                                        }
                                    }}
                                    key={group?.id}
                                    className={`relative flex justify-between border-b border-gray-300 p-4 pr-12 ${
                                        isSelected
                                            ? "cursor-not-allowed bg-slate-100"
                                            : "cursor-pointer"
                                    }`}
                                >
                                    <div className="flex gap-4">
                                        <Image
                                            width={500}
                                            height={500}
                                            className="h-16 w-16 object-cover"
                                            src={getAvatarFromName(group?.name)}
                                            alt=""
                                        />
                                        <div>
                                            <div className="mb-1 text-sm font-medium text-gray-900">
                                                {group?.name}
                                            </div>
                                            <div className="text-sm font-medium text-gray-500">
                                                {group?.description}
                                            </div>
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <div className="absolute top-1/2 right-4 -translate-y-1/2 transform">
                                            <BsCheckCircle className="text-green-500"/>
                                        </div>
                                    )}
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
                        <Link
                            href="/issuer/authors"
                            className="m-btn bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                            Thêm tác giả mới
                        </Link>
                    </div>
                </Modal.Footer>
            </div>
        </TransitionModal>
    );
};

export default SelectAuthorModal;
