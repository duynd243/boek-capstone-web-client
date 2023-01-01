import React, { memo, useMemo } from "react";
import {
  MdFirstPage,
  MdLastPage,
  MdNavigateBefore,
  MdNavigateNext,
} from "react-icons/md";
import { IPaginationMetaData } from "../../../types/IBaseListResponse";

type Props = {
  colSpan: number;
  size: number;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  metadata: IPaginationMetaData;
  pageSizeOptions: number[];
};
const paginationButtonClasses =
  "rounded-md p-1.5 text-gray-500 hover:bg-slate-200 disabled:text-gray-400 disabled:hover:bg-transparent";
const TableFooter: React.FC<Props> = ({
  colSpan,
  size,
  setSize,
  page,
  setPage,
  metadata,
  pageSizeOptions,
}) => {
  const total = useMemo(() => metadata?.total, [metadata]);
  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSize(parseInt(e.target.value));
    setPage(1);
  };
  const lastPage = useMemo(
    () => Math.ceil(total ? total / size : 0),
    [total, size]
  );
  const fromItem = useMemo(() => (page - 1) * size + 1, [page, size]);
  const toItem = useMemo(
    () => Math.min(page * size, total),
    [page, size, total]
  );

  return (
    <tfoot>
      <tr>
        <td colSpan={colSpan}>
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 px-6 text-sm font-medium text-slate-600">
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
                {fromItem}-{toItem} / {total}
              </span>
              <button
                title="Trang đầu"
                className={paginationButtonClasses}
                onClick={() => setPage(1)}
                disabled={page === 1}
              >
                <span className="sr-only">First Page</span>
                <MdFirstPage size={22} />
              </button>
              <button
                title="Trang trước"
                className={paginationButtonClasses}
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <span className="sr-only">Previous</span>
                <MdNavigateBefore size={22} />
              </button>
              <span className="mx-3">Trang {page}</span>
              <button
                title="Trang sau"
                className={paginationButtonClasses}
                onClick={() => setPage(page + 1)}
                disabled={page === lastPage}
              >
                <span className="sr-only">Next</span>
                <MdNavigateNext size={22} />
              </button>
              <button
                title="Trang cuối"
                className={paginationButtonClasses}
                onClick={() => setPage(lastPage)}
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
