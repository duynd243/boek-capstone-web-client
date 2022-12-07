import React, {useEffect, useState} from 'react'
import {MdNavigateBefore, MdNavigateNext} from "react-icons/md";
import {IPaginationMetaData} from "../../../types/IBaseListResponse";

type Props = {
    size: number,
    setSize: React.Dispatch<React.SetStateAction<number>>,
    page: number,
    setPage: React.Dispatch<React.SetStateAction<number>>,
    metadata: IPaginationMetaData,
    pageSizeOptions: number[],
}

const TableFooter: React.FC<Props> = (
    {
        size,
        setSize,
        page,
        setPage,
        metadata,
        pageSizeOptions
    }
) => {

    const total = metadata?.total;
    const [lastPage, setLastPage] = useState<number>(0);

    const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSize(parseInt(e.target.value));
        setPage(1);
    }
    useEffect(() => {
        setLastPage(Math.ceil(total ? (total / size) : 0));
    }, [size, total]);

    const fromItem = (page - 1) * size + 1;
    const toItem =
        total && page * size > total
            ? total
            : page * size;

    return (
        <tfoot>
        <tr>
            <td colSpan={2}>
                <div
                    className="flex flex-wrap items-center justify-between gap-3 py-3 px-6 text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500">
                              Số kết quả mỗi trang
                            </span>
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
                              {fromItem}-{toItem} /{" "}
                                {total}
                            </span>
                        <button
                            className="rounded-md p-1.5 text-gray-700 hover:bg-slate-200 hover:text-gray-600 disabled:text-gray-500 disabled:hover:bg-transparent"
                            onClick={() => setPage(page - 1)}
                            disabled={page === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <MdNavigateBefore size={22}/>
                        </button>
                        <span className="mx-3">Trang {page}</span>
                        <button
                            className="rounded-md p-1.5 text-gray-700 hover:bg-slate-200 hover:text-gray-600 disabled:text-gray-500 disabled:hover:bg-transparent"
                            onClick={() => setPage(page + 1)}
                            disabled={page === lastPage}
                        >
                            <span className="sr-only">Next</span>
                            <MdNavigateNext size={22}/>
                        </button>
                    </div>
                </div>
            </td>
        </tr>
        </tfoot>
    )
}

export default TableFooter