import { useCallback, useState } from "react";
import useSearchQuery from "./useSearchQuery";

export default function useTableManagementPage() {
    const [page, setPage] = useState(1);
    const pageSizeOptions = [5, 10, 20, 50];
    const [size, setSize] = useState(pageSizeOptions[0]);
    const { search, setSearch } = useSearchQuery("search", () => setPage(1));
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const onSizeChange = useCallback((newSize: number) => {
        setSize(newSize);
        setPage(1);
    }, []);

    return {
        page,
        setPage,
        size,
        onSizeChange,
        pageSizeOptions,
        search,
        setSearch,
        showCreateModal,
        setShowCreateModal,
        showUpdateModal,
        setShowUpdateModal,
        showDeleteModal,
        setShowDeleteModal,
    };
}
