import React, { memo, useMemo } from "react";
import { MdFirstPage, MdLastPage, MdNavigateBefore, MdNavigateNext } from "react-icons/md";

type Props = {
    colSpan: number;
    size: number;
    totalElements: number;
    onSizeChange: (size: number) => void;
    page: number;
    onPageChange: (page: number) => void;
    pageSizeOptions: number[];
};
const paginationButtonClasses =
    "rounded-md p-1.5 text-gray-500 hover:bg-slate-200 disabled:text-gray-400 disabled:hover:bg-transparent";
const TableFooter: React.FC<Props> = ({
                                          colSpan,
                                          size,
                                          onSizeChange,
                                          totalElements,
                                          page,
                                          onPageChange,
                                          pageSizeOptions,
                                      }) => {
    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSizeChange(parseInt(e.target.value));
    };
    const lastPage = useMemo(
        () => Math.ceil(totalElements ? totalElements / size : 0),
        [totalElements, size],
    );
    const fromItem = useMemo(() => (page - 1) * size + 1, [page, size]);
    const toItem = useMemo(
        () => Math.min(page * size, totalElements),
        [page, size, totalElements],
    );

    return (
        <tfoot>
        <tr>
            <td colSpan={colSpan}>
                <div
                    className="flex flex-wrap items-center justify-between gap-3 py-3 px-6 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Số kết quả mỗi trang</span>
                        <select
                            className="form-select rounded-md border-gray-300 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            value={size}
                            onChange={handleSizeChange}
                        >
                            {pageSizeOptions.map((pageSize) => (
                                <option key={pageSize} value={pageSize}>
                                    {pageSize}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center">
              <span className="mr-2">
                {fromItem}-{toItem} / {totalElements}
              </span>
                        <button
                            title="Trang đầu"
                            className={paginationButtonClasses}
                            onClick={onPageChange.bind(null, 1)}
                            disabled={page === 1}
                        >
                            <span className="sr-only">First Page</span>
                            <MdFirstPage size={22} />
                        </button>
                        <button
                            title="Trang trước"
                            className={paginationButtonClasses}
                            onClick={onPageChange.bind(null, page - 1)}
                            disabled={page === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <MdNavigateBefore size={22} />
                        </button>
                        <span className="mx-3">Trang {page}</span>
                        <button
                            title="Trang sau"
                            className={paginationButtonClasses}
                            onClick={onPageChange.bind(null, page + 1)}
                            disabled={page === lastPage}
                        >
                            <span className="sr-only">Next</span>
                            <MdNavigateNext size={22} />
                        </button>
                        <button
                            title="Trang cuối"
                            className={paginationButtonClasses}
                            onClick={onPageChange.bind(null, lastPage)}
                            disabled={page === lastPage}
                        >
                            <span className="sr-only">Last Page</span>
                            <MdLastPage size={22} />
                        </button>
                    </div>
                </div>
            </td>
        </tr>
        </tfoot>
    );
};

export default memo(TableFooter);
