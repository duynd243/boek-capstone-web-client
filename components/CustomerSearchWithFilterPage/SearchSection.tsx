import React, { useEffect, useState } from "react";

type Props = {
    title: string;
    initValue?: string;
    onSearch: (value: string) => void;
    placeholder?: string;
}

const SearchSection: React.FC<Props> = ({ title, initValue = "", onSearch, placeholder }) => {
    const [searchInput, setSearchInput] = useState(initValue);

    useEffect(() => {
        setSearchInput(initValue);
    }, [initValue]);

    return (
        <div>
            <div
                className="relative py-10"
                style={
                    {
                        backgroundImage: "url(https://i.guim.co.uk/img/media/d305370075686a053b46f5c0e6384e32b3c00f97/0_50_5231_3138/master/5231.jpg?width=1200&quality=85&auto=format&fit=max&s=dfc589d3712148263b1dd1cb02707e91)",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center center",
                        backgroundSize: "cover",
                    }
                }>
                {/*Fade*/}
                <div
                    className="absolute inset-0 bg-gray-900 opacity-60"
                    aria-hidden="true"
                />
                <h1 className="text-4xl font-bold text-white text-center relative z-10 mb-10 drop-shadow-lg">
                    {title}
                </h1>

                {/*Search and filter box*/}
                <div className="relative z-10 flex mt-10 items-center justify-center">
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        onSearch(searchInput);
                    }}
                          className="flex items-center justify-center w-full max-w-3xl bg-white rounded-full shadow-xl overflow-hidden">
                        <input
                            className="w-full py-4 px-6 text-gray-700 leading-tight focus:outline-none border-none outline-none focus:ring-0"
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder={placeholder || "Tìm kiếm..."}
                        />
                        <div className="p-2">
                            <button
                                className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-400 focus:outline-none w-12 h-12 flex items-center justify-center"
                                type="submit"
                            >
                                <svg
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M11 19l-7-7m0 0l7-7m-7 7h18"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default SearchSection;