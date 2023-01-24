import React, {useState} from "react";
import {BsCheckCircle, BsSearch} from "react-icons/bs";
import Modal from "../Modal/Modal";
import TransitionModal from "../Modal/TransitionModal";
import useDebounce from "../../hooks/useDebounce";
import {useQuery} from "@tanstack/react-query";
import {GenreService} from "../../services/GenreService";
import {IGenre} from "../../types/Genre/IGenre";
import EmptyState, {EMPTY_STATE_TYPE} from "../EmptyState";
import Image from "next/image";
import {getAvatarFromName} from "../../utils/helper";
import {IRequestCommission} from "../../pages/admin/campaigns/create";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    selectedCommissions: IRequestCommission[];
    onItemSelect: (genre: IGenre) => void;
};

const SelectCommissionsModal: React.FC<Props> = ({
                                                     isOpen,
                                                     onClose,
                                                     selectedCommissions,
                                                     onItemSelect,
                                                 }) => {

    const [search, setSearch] = useState<string>("");
    const debouncedSearch = useDebounce(search, 500);
    const genreService = new GenreService();

    const onModalClose = () => {
        setSearch("");
        onClose();
    };

    const {data: genres, isLoading} = useQuery(
        ["genres", debouncedSearch],
        () =>
            genreService.getGenres({
                name: debouncedSearch,
                withBooks: false,
                size: 1000,
                status: true,
            }),
        {
            keepPreviousData: true,
            select: (data) => data?.data?.filter((genre) => genre?.parentId === null),
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
                        placeholder="Tìm kiếm nhóm"
                        className="h-12 w-full border-0 pl-11 pr-4 text-sm text-gray-800 placeholder-gray-400 focus:ring-0"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="h-96 overflow-y-auto">
                    {!isLoading && genres ? (
                        genres?.map((genre) => {
                            const isSelected = selectedCommissions?.find(
                                (g) => g?.genreId === genre?.id
                            );
                            return (
                                <div
                                    onClick={() => {
                                        if (!isSelected) {
                                            onItemSelect(genre);
                                        }
                                    }}
                                    key={genre?.id}
                                    className={`relative flex justify-between border-b border-gray-300 p-4 pr-12 ${
                                        isSelected
                                            ? "cursor-not-allowed bg-slate-100"
                                            : "cursor-pointer"
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <Image
                                            width={500}
                                            height={500}
                                            className="h-12 w-12 rounded object-cover"
                                            src={getAvatarFromName(genre?.name)}
                                            alt=""
                                        />
                                        <div>
                                            <div className="mb-1 text-sm font-medium text-gray-900">
                                                {genre?.name}
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
                    </div>
                </Modal.Footer>
            </div>
        </TransitionModal>
    );
};

export default SelectCommissionsModal;
