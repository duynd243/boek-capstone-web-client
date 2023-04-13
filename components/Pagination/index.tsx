import React from "react";
import NavigationButton from "./NavigationButton";
import PageButton from "./PageButton";

type Props = {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    visiblePageButtonLimit: number;
};

const Pagination: React.FC<Props> = ({
                                         totalItems,
                                         pageSize,
                                         currentPage,
                                         onPageChange,
                                         visiblePageButtonLimit,
                                     }) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const start = currentPage - (visiblePageButtonLimit - 1) / 2;
    const end = currentPage + (visiblePageButtonLimit - 1) / 2;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <nav className="flex items-center">
            <div className="inline-flex flex-wrap text-sm font-medium space-x-1">
                <div className="mr-2 space-x-1">
                    <NavigationButton
                        type="first"
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                    />
                    <NavigationButton
                        type="prev"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    />
                </div>
                {currentPage > visiblePageButtonLimit / 2 + 1 && (
                    <PageButton value="..." />
                )}

                {pages
                    .filter((page) => page >= start && page <= end)
                    .map((pageNumber) => (
                        <PageButton
                            key={pageNumber}
                            isActive={pageNumber === currentPage}
                            value={pageNumber}
                            onClick={() => onPageChange(pageNumber)}
                        />
                    ))}

                {currentPage < totalPages - visiblePageButtonLimit / 2 && (
                    <PageButton value="..." />
                )}
                <div className="ml-2 space-x-1">
                    <NavigationButton
                        type="next"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    />
                    <NavigationButton
                        type="last"
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                    />
                </div>
            </div>
        </nav>
    );
};

export default Pagination;
