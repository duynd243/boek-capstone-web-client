import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { AiFillBook, AiFillFilePdf } from "react-icons/ai";
import { FaFileAudio } from "react-icons/fa";
import CustomerProductCard from "../../components/CustomerProductCard";
import CustomerProductCardSkeleton from "../../components/CustomerProductCard/CustomerProductCardSkeleton";
import FilterSection from "../../components/CustomerSearchWithFilterPage/FilterSection";
import FilterSidebar from "../../components/CustomerSearchWithFilterPage/FilterSidebar";
import SearchSection from "../../components/CustomerSearchWithFilterPage/SearchSection";
import SortPanel from "../../components/CustomerSearchWithFilterPage/SortPanel";
import useCustomerSearchWithFilterPage from "../../components/CustomerSearchWithFilterPage/hook";
import { getSortedArray } from "../../components/CustomerSearchWithFilterPage/utils";
import EmptyState, { EMPTY_STATE_TYPE } from "../../components/EmptyState";
import ExpandableList from "../../components/ExpandableList";
import CustomerLayout from "../../components/Layout/CustomerLayout";
import Pagination from "../../components/Pagination";
import { BookFormats } from "../../constants/BookFormats";
import { AuthorService } from "../../services/AuthorService";
import { BookProductService } from "../../services/BookProductService";
import { CampaignService } from "../../services/CampaignService";
import { GenreService } from "../../services/GenreService";
import { LanguageService } from "../../services/LanguageService";
import { PublisherService } from "../../services/PublisherService";
import { getAvatarFromName } from "../../utils/helper";
import { getNumberArrayFromQueryKey, getStringArrayFromQueryKey } from "../../utils/query-helper";
import { NextPageWithLayout } from "../_app";
import { useAuth } from "../../context/AuthContext";
import { SelectBox as TremorSelectBox, SelectBoxItem as TremorSelectBoxItem } from "@tremor/react";

const sortOptions = [
    { name: "Mới nhất", value: "CreatedDate desc" },
    { name: "Giảm giá nhiều", value: "Discount desc" },
    { name: "Giá tăng dần", value: "SalePrice asc" },
    { name: "Giá giảm dần", value: "SalePrice desc" },
];

const CustomerProductsPage: NextPageWithLayout = () => {
    const router = useRouter();

    const { loginUser } = useAuth();

    const [page, setPage] = useState(1);
    const pageSize = 9;
    const {
        onParamsChange,
        issuers,
    } = useCustomerSearchWithFilterPage(setPage);

    const [selectedSortOption, setSelectedSortOption] = useState(sortOptions[0]);
    const searchFromQuery = getStringArrayFromQueryKey(router.query.title)[0] || "";

    const [campaignId, setCampaignId] = useState(getNumberArrayFromQueryKey(router.query.campaign)[0] || undefined);
    const [formatIds, setFormatIds] = useState<number[]>(
        getNumberArrayFromQueryKey(router.query.format),
    );
    const [genreIds, setGenreIds] = useState<number[]>(
        getNumberArrayFromQueryKey(router.query.genre),
    );
    const [languages, setLanguages] = useState<string[]>(
        getStringArrayFromQueryKey(router.query.language).filter((x) => x !== ""),
    );

    const [issuerIds, setIssuerIds] = useState<string[]>(
        getStringArrayFromQueryKey(router.query.issuer).filter((x) => x !== ""),
    );

    const [publisherIds, setPublisherIds] = useState<number[]>(
        getNumberArrayFromQueryKey(router.query.publisher),
    );

    const [authorIds, setAuthorIds] = useState<number[]>(
        getNumberArrayFromQueryKey(router.query.author),
    );

    const bookProductService = new BookProductService(loginUser?.accessToken);
    const authorService = new AuthorService();
    const publisherService = new PublisherService();
    const languageService = new LanguageService();
    const genreService = new GenreService();
    const campaignService = new CampaignService();

    const queryParams = {
        title: searchFromQuery,
        campaignId,
        formats: formatIds,
        "Book.GenreIds": genreIds,
        "Book.Languages": languages,
        "Book.IssuerIds": issuerIds,
        "Book.PublisherIds": publisherIds,
        "Book.BookAuthors.AuthorIds": authorIds,
        sort: selectedSortOption.value,
        size: pageSize,
        page,
    };

    const {
        data,
        isInitialLoading: productsLoading,
    } = useQuery(["customer_products", queryParams],
        () => bookProductService.getBookProductsByCustomer(queryParams),
        {
            onError: (error: any) => {
                toast.error(error?.message || "Xảy ra lỗi!\nVui lòng thử lại sau hoặc chọn các bộ lọc khác.", {
                    duration: 5000,
                });
            },
        },
    );

    const {
        data: authors,
    } = useQuery(["authors"],
        () => authorService.getAllAuthors(),
    );

    const {
        data: publishers,
    } = useQuery(["publishers"],
        () => publisherService.getAllPublishers(),
    );


    const {
        data: genres,
    } = useQuery(["genres"],
        () => genreService.getChildGenres({
            status: true,
        }),
    );

    const {
        data: languagesList,
    } = useQuery(["languages"],
        () => languageService.getLanguages(),
    );

    const {
        data: campaigns,
    } = useQuery(["campaigns"],
        () => campaignService.getAllCampaignsByCustomer({
            sort: "CreatedDate desc",
        }),
    );

    const sortedAuthors = getSortedArray((authors || []), "id", authorIds);
    const sortedIssuers = getSortedArray((issuers || []), "id", issuerIds);
    const sortedPublishers = getSortedArray((publishers || []), "id", publisherIds);

    const haveFilters = useMemo(() => {
        return campaignId || formatIds.length > 0 || genreIds.length > 0 || languages.length > 0 || issuerIds.length > 0 || publisherIds.length > 0 || authorIds.length > 0;
    }, [campaignId, formatIds, genreIds, languages, issuerIds, publisherIds, authorIds]);

    const clearFilters = async () => {
        setCampaignId(undefined);
        setFormatIds([]);
        setGenreIds([]);
        setLanguages([]);
        setIssuerIds([]);
        setPublisherIds([]);
        setAuthorIds([]);
        setPage(1);
        await router.push({
                pathname: router.pathname,
                query: {
                    title: searchFromQuery,
                },
            },
        );
    };
    return (
        <Fragment>
            <SearchSection title={"Kho sách"}
                           onSearch={async (value) => await onParamsChange("title", value)}
                           placeholder={"Tìm kiếm sách bán..."}
                           initValue={searchFromQuery} />
            <div className={"max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
                <div className={"flex flex-col md:flex-row gap-6 relative"}>
                    <FilterSidebar onClearFilters={clearFilters}
                                   clearFiltersDisabled={!haveFilters}
                    >
                        <FilterSection label={"Hội sách"}
                                       count={campaignId ? 1 : 0}
                                       defaultOpen={!!campaignId}
                        >

                            <TremorSelectBox
                                value={campaignId ? campaignId.toString() : "all"}
                                placeholder={"Chọn hội sách"}
                                onValueChange={async (value) => {
                                    setCampaignId(value === "all" ? undefined : parseInt(value));
                                    await onParamsChange("campaign", value === "all" ? undefined : parseInt(value));
                                }}>

                                {([
                                    { id: "all", name: "Tất cả hội sách" },
                                    ...campaigns || [],
                                ])?.map((campaign) => <TremorSelectBoxItem key={campaign?.id}
                                                                           value={campaign?.id?.toString()}
                                                                           text={campaign?.name} />)
                                }
                            </TremorSelectBox>
                        </FilterSection>
                        <FilterSection
                            count={formatIds?.length}
                            label={"Định dạng sách"}
                            defaultOpen={formatIds.length > 0}
                        >
                            <div className={"flex flex-wrap gap-2 text-sm text-gray-500"}>
                                {Object.values(BookFormats).map((format) => {
                                    const checked = formatIds.includes(format.id);
                                    return <Fragment key={format.id}>
                                        <input
                                            type="checkbox"
                                            id={`format-${format.id}`}
                                            className={"hidden"}
                                            checked={checked}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newFormatIds = [...formatIds, format.id];
                                                    setFormatIds(newFormatIds);
                                                    await onParamsChange("format", newFormatIds);
                                                } else {
                                                    const newFormatIds = formatIds.filter((x) => x !== format.id);
                                                    setFormatIds(newFormatIds);
                                                    await onParamsChange("format", newFormatIds);
                                                }
                                            }
                                            }
                                        />
                                        <label htmlFor={`format-${format.id}`}>
                                            <div
                                                className={`flex gap-1 border py-2 px-3 rounded-md cursor-pointer ${checked ? "bg-blue-50 text-blue-500 border-blue-400" : ""}`}>
                                                {format.id === BookFormats.PAPER.id && <AiFillBook
                                                    className="flex-shrink-0 h-5 w-5 text-blue-600" />}
                                                {format.id === BookFormats.PDF.id && <AiFillFilePdf
                                                    className="flex-shrink-0 h-5 w-5 text-rose-600" />}
                                                {format.id === BookFormats.AUDIO.id && <FaFileAudio
                                                    className="flex-shrink-0 h-5 w-5 text-amber-500" />}
                                                <span className="font-medium">
                                                                {format.displayName}
                                                            </span>
                                            </div>
                                        </label>
                                    </Fragment>;
                                })}
                            </div>
                        </FilterSection>

                        <FilterSection label={"Nhà phát hành"}
                                       count={issuerIds?.length}
                                       defaultOpen={issuerIds.length > 0}
                        >
                            <div className={"space-y-3"}>
                                <ExpandableList items={sortedIssuers} renderItem={
                                    (issuer) => <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={"h-full flex flex-col"}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        layout key={issuer.id}>
                                        <input
                                            type="checkbox"
                                            id={`issuer-${issuer.id}`}
                                            className={"hidden"}
                                            checked={issuerIds.includes(issuer.id)}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newIssuerIds = [...issuerIds, issuer.id];
                                                    setIssuerIds(newIssuerIds);
                                                    await onParamsChange("issuer", newIssuerIds);
                                                } else {
                                                    const newIssuerIds = issuerIds.filter((x) => x !== issuer.id);
                                                    setIssuerIds(newIssuerIds);
                                                    await onParamsChange("issuer", newIssuerIds);
                                                }
                                            }
                                            }
                                        />
                                        <label htmlFor={`issuer-${issuer.id}`}>
                                            <div
                                                className={`flex items-center gap-2 border py-2 px-3 text-sm rounded-md cursor-pointer ${issuerIds.includes(issuer.id) ? "bg-blue-50 text-blue-500 border-blue-400" : ""}`}>
                                                <Image src={issuer?.imageUrl ||
                                                    getAvatarFromName(issuer.name)
                                                } alt={""}
                                                       width={40}
                                                       height={40}
                                                       className={"rounded-full object-cover h-6 w-6"} />
                                                <span className="font-medium">
                                                                    {issuer.name}
                                                                </span>
                                            </div>
                                        </label>
                                    </motion.div>
                                } />

                            </div>
                        </FilterSection>

                        <FilterSection label={"Tác giả"}
                                       count={authorIds?.length}
                                       defaultOpen={authorIds.length > 0}
                        >
                            <div className={"space-y-3"}>
                                <ExpandableList items={sortedAuthors} renderItem={
                                    (author) => <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={"h-full flex flex-col"}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        layout key={author.id}>
                                        <input
                                            type="checkbox"
                                            id={`author-${author.id}`}
                                            className={"hidden"}
                                            checked={authorIds.includes(author.id)}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newAuthorIds = [...authorIds, author.id];
                                                    setAuthorIds(newAuthorIds);
                                                    await onParamsChange("author", newAuthorIds);
                                                } else {
                                                    const newAuthorIds = authorIds.filter((x) => x !== author.id);
                                                    setAuthorIds(newAuthorIds);
                                                    await onParamsChange("author", newAuthorIds);
                                                }
                                            }
                                            }
                                        />
                                        <label htmlFor={`author-${author.id}`}>
                                            <div
                                                className={`flex items-center gap-2 border py-2 px-3 text-sm rounded-md cursor-pointer ${authorIds.includes(author.id) ? "bg-blue-50 text-blue-500 border-blue-400" : ""}`}>
                                                <Image src={author?.imageUrl ||
                                                    getAvatarFromName(author.name)
                                                } alt={""}
                                                       width={40}
                                                       height={40}
                                                       className={"rounded-full object-cover h-6 w-6"} />
                                                <span className="font-medium">
                                                                    {author.name}
                                                                </span>
                                            </div>
                                        </label>
                                    </motion.div>
                                } />
                            </div>
                        </FilterSection>

                        <FilterSection label={"Nhà xuất bản"}
                                       count={publisherIds?.length}
                                       defaultOpen={publisherIds.length > 0}
                        >
                            <div className={"space-y-3"}>
                                <ExpandableList items={sortedPublishers} renderItem={
                                    (publisher) => <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className={"h-full flex flex-col"}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        layout key={publisher.id}>
                                        <input
                                            type="checkbox"
                                            id={`publisher-${publisher.id}`}
                                            className={"hidden"}
                                            checked={publisherIds.includes(publisher.id)}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newPublisherIds = [...publisherIds, publisher.id];
                                                    setPublisherIds(newPublisherIds);
                                                    await onParamsChange("publisher", newPublisherIds);
                                                } else {
                                                    const newPublisherIds = publisherIds.filter((x) => x !== publisher.id);
                                                    setPublisherIds(newPublisherIds);
                                                    await onParamsChange("publisher", newPublisherIds);
                                                }
                                            }
                                            }
                                        />
                                        <label htmlFor={`publisher-${publisher.id}`}>
                                            <div
                                                className={`flex items-center gap-2 border py-2 px-3 text-sm rounded-md cursor-pointer ${publisherIds.includes(publisher.id) ? "bg-blue-50 text-blue-500 border-blue-400" : ""}`}>
                                                <Image src={publisher?.imageUrl ||
                                                    getAvatarFromName(publisher.name)
                                                } alt={""}
                                                       width={40}
                                                       height={40}
                                                       className={"rounded-full object-cover h-6 w-6"} />
                                                <span className="font-medium">
                                                                    {publisher.name}
                                                                </span>
                                            </div>
                                        </label>
                                    </motion.div>
                                } />

                            </div>
                        </FilterSection>

                        <FilterSection label={"Ngôn ngữ"}
                                       count={languages?.length}
                                       defaultOpen={languages.length > 0}
                        >
                            <div className={"space-y-3"}>
                                <ExpandableList items={languagesList || []} renderItem={
                                    (language) => <div
                                        className={"flex items-center justify-between gap-2 text-sm outline-none"}>

                                        <label htmlFor={`language-${language}`}>
                                                    <span>
                                                        {language}
                                                    </span>
                                        </label>

                                        <input
                                            type="checkbox"
                                            id={`language-${language}`}
                                            className={"rounded-sm bg-gray-100 border-gray-200 shrink-0"}
                                            checked={languages.includes(language)}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newLanguages = [...languages, language];
                                                    setLanguages(newLanguages);
                                                    await onParamsChange("language", newLanguages);
                                                } else {
                                                    const newLanguages = languages.filter((x) => x !== language);
                                                    setLanguages(newLanguages);
                                                    await onParamsChange("language", newLanguages);
                                                }
                                            }
                                            }
                                        />
                                    </div>
                                } />

                            </div>
                            {/*<div>*/}
                            {/*    <TremorMultiSelectBox*/}
                            {/*        placeholder={"Chọn ngôn ngữ"}*/}
                            {/*        title={"Ngôn ngữ"}*/}
                            {/*        value={languages}*/}
                            {/*        onValueChange={async (newLanguages) => {*/}
                            {/*            setLanguages(newLanguages);*/}
                            {/*            await onParamsChange("language", newLanguages);*/}
                            {/*        }}>*/}
                            {/*        {(languagesList || [])?.map((language, index) => <TremorMultiSelectBoxItem*/}
                            {/*                key={index}*/}
                            {/*                value={language}*/}
                            {/*                text={language}*/}
                            {/*            />,*/}
                            {/*        )}*/}
                            {/*    </TremorMultiSelectBox>*/}
                            {/*</div>*/}
                        </FilterSection>

                        <FilterSection label={"Thể loại"}
                                       count={genreIds?.length}
                                       defaultOpen={genreIds.length > 0}
                        >
                            <div className={"space-y-3"}>
                                <ExpandableList items={genres || []} renderItem={
                                    (genre) => <div
                                        className={"flex items-center justify-between gap-2 text-sm outline-none"}>

                                        <label htmlFor={`genre-${genre?.id}`}>
                                                    <span>
                                                        {genre?.name}
                                                    </span>
                                        </label>

                                        <input
                                            type="checkbox"
                                            id={`genre-${genre?.id}`}
                                            className={"rounded-sm bg-gray-100 border-gray-200 shrink-0"}
                                            checked={genreIds.includes(genre?.id)}
                                            onChange={async (e) => {
                                                if (e.target.checked) {
                                                    const newGenreIds = [...genreIds, genre?.id];
                                                    setGenreIds(newGenreIds);
                                                    await onParamsChange("genre", newGenreIds);
                                                } else {
                                                    const newGenreIds = genreIds.filter((x) => x !== genre?.id);
                                                    setGenreIds(newGenreIds);
                                                    await onParamsChange("genre", newGenreIds);
                                                }
                                            }
                                            }
                                        />
                                    </div>
                                } />

                            </div>
                        </FilterSection>


                    </FilterSidebar>
                    <div className="md:self-start md:grow">
                        <SortPanel
                            hideResult={productsLoading}
                            showingListLength={(data?.data.length || 0)}
                            totalListLength={(data?.metadata?.total || 0)}
                            value={selectedSortOption.value}
                            sortOptions={sortOptions}
                            onSortChange={value => {
                                const option = sortOptions.find((x) => x.value === value);
                                if (option) {
                                    setSelectedSortOption(option);
                                    setPage(1);
                                }
                            }}
                            itemName={"sản phẩm"}
                        />

                        {!productsLoading && data?.data.length === 0 && (
                            <div className={"my-24"}>
                                <EmptyState status={EMPTY_STATE_TYPE.SEARCH_NOT_FOUND}
                                            searchNotFoundMessage={"Hãy thử tìm kiếm với từ khoá hoặc bộ lọc khác."}
                                />
                            </div>
                        )}
                        {!productsLoading && data?.data && data?.data.length > 0 && (
                            <div className="mt-6 md:self-start grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data?.data.map((product) => (
                                    <CustomerProductCard
                                        key={product.id}
                                        product={product} />
                                ))}
                            </div>
                        )}
                        {productsLoading && (
                            <div className="mt-6 md:self-start grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(9)].map((_, index) =>
                                    <CustomerProductCardSkeleton key={index} />,
                                )}
                            </div>
                        )}
                        {!productsLoading && data?.data && data?.data.length > 0 &&
                            <div className="mt-6 flex justify-end">
                                <Pagination
                                    currentPage={page}
                                    pageSize={pageSize}
                                    totalItems={data?.metadata?.total || 0}
                                    onPageChange={p => setPage(p)}
                                    visiblePageButtonLimit={4}
                                />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </Fragment>

    );
};

CustomerProductsPage.getLayout = (page) => {
    return <CustomerLayout
        childrenWrapperClassName={"relative"}
    >{page}</CustomerLayout>;
};

export default CustomerProductsPage;