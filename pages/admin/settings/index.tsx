import React, {ReactElement, useState} from "react";
import AdminLayout from "../../../components/Layout/AdminLayout";
import {NextPageWithLayout} from "../../_app";
import {getAvatarFromName} from "../../../utils/helper";

const user = {
    name: "Debbie Lewis",
    handle: "deblewis",
    email: "debbielewis@example.com",
    imageUrl: getAvatarFromName("Duy Nguyễn"),
};
const navigation = [
    {name: "Dashboard", href: "#", current: true},
    {name: "Jobs", href: "#", current: false},
    {name: "Applicants", href: "#", current: false},
    {name: "Company", href: "#", current: false},
];
const subNavigation = [
    {name: "Hồ sơ", href: "#", current: true},
    {name: "Cài đặt khác", href: "#", current: false},
];
const userNavigation = [
    {name: "Your Profile", href: "#"},
    {name: "Settings", href: "#"},
    {name: "Sign out", href: "#"},
];

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export const ProfilePicture = () => {
    return (
        <div className="flex items-center">
            <div
                className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                aria-hidden="true"
            >
                <img
                    className="h-full w-full rounded-full"
                    src={user.imageUrl}
                    alt=""
                />
            </div>
            <div className="ml-5 rounded-md shadow-sm">
                <div
                    className="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:bg-gray-50">
                    <label
                        htmlFor="mobile-user-photo"
                        className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                    >
                        <span>Thay đổi</span>
                        <span className="sr-only"> user photo</span>
                    </label>
                    <input
                        id="mobile-user-photo"
                        name="user-photo"
                        type="file"
                        className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                    />
                </div>
            </div>
        </div>
    );
};

const Settings: NextPageWithLayout = () => {
    const [availableToHire, setAvailableToHire] = useState(true);
    const [privateAccount, setPrivateAccount] = useState(false);
    const [allowCommenting, setAllowCommenting] = useState(true);
    const [allowMentions, setAllowMentions] = useState(true);

    return (
        <main className="relative ">
            <div className="mx-auto max-w-6xl px-4 pb-6 sm:px-6 lg:px-8 lg:pb-16">
                <div className="overflow-hidden rounded-lg bg-white shadow">
                    <div className="divide-y divide-gray-200 lg:grid lg:grid-cols-12 lg:divide-y-0 lg:divide-x">
                        <aside className="py-6 lg:col-span-3">
                            <nav className="space-y-1">
                                {subNavigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700"
                                                : "border-transparent text-gray-900 hover:bg-gray-50 hover:text-gray-900",
                                            "group flex items-center border-l-4 px-3 py-2 text-sm font-medium"
                                        )}
                                        aria-current={item.current ? "page" : undefined}
                                    >
                                        {/*<item.icon*/}
                                        {/*  className={classNames(*/}
                                        {/*    item.current*/}
                                        {/*      ? 'text-indigo-500 group-hover:text-indigo-500'*/}
                                        {/*      : 'text-gray-400 group-hover:text-gray-500',*/}
                                        {/*    'flex-shrink-0 -ml-1 mr-3 h-6 w-6'*/}
                                        {/*  )}*/}
                                        {/*  aria-hidden="true"*/}
                                        {/*/>*/}
                                        <span className="truncate">{item.name}</span>
                                    </a>
                                ))}
                            </nav>
                        </aside>

                        <form
                            className="divide-y divide-gray-200 lg:col-span-9"
                            action="#"
                            method="POST"
                        >
                            {/* Profile section */}
                            <div className="py-6 px-4 sm:p-6 lg:pb-8">
                                <div>
                                    <h2 className="text-lg font-medium leading-6 text-gray-900">
                                        Hồ sơ
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Thông tin này sẽ được hiển thị công khai vì vậy hãy cẩn thận
                                        những gì bạn chia sẻ.
                                    </p>
                                </div>

                                <div className="mt-6 flex flex-col lg:flex-row">
                                    <div className="flex-grow space-y-6">
                                        <div>
                                            <label
                                                htmlFor="username"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Email
                                            </label>
                                            <div className="mt-1 flex rounded-md shadow-sm">
                                                <input
                                                    disabled={true}
                                                    defaultValue="duyndse150396@fpt.edu.vn"
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-12">
                                            <label
                                                htmlFor="url"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Họ và tên
                                            </label>
                                            <input
                                                defaultValue={"Duy System"}
                                                type="text"
                                                name="fullName"
                                                id="fullName"
                                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="about"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Địa chỉ
                                            </label>
                                            <div className="mt-1">
                        <textarea
                            id="about"
                            name="about"
                            rows={3}
                            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            defaultValue={""}
                        />
                                            </div>
                                            <p className="mt-2 text-sm text-gray-500">
                                                Brief description for your profile. URLs are
                                                hyperlinked.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex-grow lg:mt-0 lg:ml-6 lg:flex-shrink-0 lg:flex-grow-0">
                                        <p
                                            className="text-sm font-medium text-gray-700"
                                            aria-hidden="true"
                                        >
                                            Ảnh đại diện
                                        </p>
                                        <div className="mt-1 lg:hidden">
                                            <div className="flex items-center">
                                                <div
                                                    className="inline-block h-12 w-12 flex-shrink-0 overflow-hidden rounded-full"
                                                    aria-hidden="true"
                                                >
                                                    <img
                                                        className="h-full w-full rounded-full"
                                                        src={user.imageUrl}
                                                        alt=""
                                                    />
                                                </div>
                                                <div className="ml-5 rounded-md shadow-sm">
                                                    <div
                                                        className="group relative flex items-center justify-center rounded-md border border-gray-300 py-2 px-3 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:bg-gray-50">
                                                        <label
                                                            htmlFor="mobile-user-photo"
                                                            className="pointer-events-none relative text-sm font-medium leading-4 text-gray-700"
                                                        >
                                                            <span>Change</span>
                                                            <span className="sr-only"> user photo</span>
                                                        </label>
                                                        <input
                                                            id="mobile-user-photo"
                                                            name="user-photo"
                                                            type="file"
                                                            className="absolute h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="relative hidden overflow-hidden rounded-full lg:block">
                                            <img
                                                className="relative h-40 w-40 rounded-full"
                                                src={user.imageUrl}
                                                alt=""
                                            />
                                            <label
                                                htmlFor="desktop-user-photo"
                                                className="absolute inset-0 flex h-full w-full items-center justify-center bg-black bg-opacity-75 text-sm font-medium text-white opacity-0 focus-within:opacity-100 hover:opacity-100"
                                            >
                                                <span>Change</span>
                                                <span className="sr-only"> user photo</span>
                                                <input
                                                    type="file"
                                                    id="desktop-user-photo"
                                                    name="user-photo"
                                                    className="absolute inset-0 h-full w-full cursor-pointer rounded-md border-gray-300 opacity-0"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-12 gap-6">
                                    <div className="col-span-12 sm:col-span-6">
                                        <label
                                            htmlFor="code"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Mã số
                                        </label>
                                        <input
                                            disabled={true}
                                            defaultValue={"A123456"}
                                            type="text"
                                            name="code"
                                            id="code"
                                            autoComplete="given-name"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-100 sm:text-sm"
                                        />
                                    </div>

                                    <div className="col-span-12 sm:col-span-6">
                                        <label
                                            htmlFor="phoneNumber"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Số điện thoại
                                        </label>
                                        <input
                                            defaultValue={"0123456789"}
                                            type="text"
                                            name="phoneNumber"
                                            id="phoneNumber"
                                            autoComplete="family-name"
                                            className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Privacy section */}
                            <div className="divide-y divide-gray-200 pt-6">
                                {/*        <div className="px-4 sm:px-6">*/}
                                {/*            <div>*/}
                                {/*                <h2 className="text-lg font-medium leading-6 text-gray-900">*/}
                                {/*                    Privacy*/}
                                {/*                </h2>*/}
                                {/*                <p className="mt-1 text-sm text-gray-500">*/}
                                {/*                    Ornare eu a volutpat eget vulputate. Fringilla commodo*/}
                                {/*                    amet.*/}
                                {/*                </p>*/}
                                {/*            </div>*/}
                                {/*            <ul role="list" className="mt-2 divide-y divide-gray-200">*/}
                                {/*                <Switch.Group*/}
                                {/*                    as="li"*/}
                                {/*                    className="flex items-center justify-between py-4"*/}
                                {/*                >*/}
                                {/*                    <div className="flex flex-col">*/}
                                {/*                        <Switch.Label*/}
                                {/*                            as="p"*/}
                                {/*                            className="text-sm font-medium text-gray-900"*/}
                                {/*                            passive*/}
                                {/*                        >*/}
                                {/*                            Available to hire*/}
                                {/*                        </Switch.Label>*/}
                                {/*                        <Switch.Description className="text-sm text-gray-500">*/}
                                {/*                            Nulla amet tempus sit accumsan. Aliquet turpis sed sit*/}
                                {/*                            lacinia.*/}
                                {/*                        </Switch.Description>*/}
                                {/*                    </div>*/}
                                {/*                    <Switch*/}
                                {/*                        checked={availableToHire}*/}
                                {/*                        onChange={setAvailableToHire}*/}
                                {/*                        className={classNames(*/}
                                {/*                            availableToHire ? "bg-indigo-500" : "bg-gray-200",*/}
                                {/*                            "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                                {/*                        )}*/}
                                {/*                    >*/}
                                {/*<span*/}
                                {/*    aria-hidden="true"*/}
                                {/*    className={classNames(*/}
                                {/*        availableToHire ? "translate-x-5" : "translate-x-0",*/}
                                {/*        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"*/}
                                {/*    )}*/}
                                {/*/>*/}
                                {/*                    </Switch>*/}
                                {/*                </Switch.Group>*/}
                                {/*                <Switch.Group*/}
                                {/*                    as="li"*/}
                                {/*                    className="flex items-center justify-between py-4"*/}
                                {/*                >*/}
                                {/*                    <div className="flex flex-col">*/}
                                {/*                        <Switch.Label*/}
                                {/*                            as="p"*/}
                                {/*                            className="text-sm font-medium text-gray-900"*/}
                                {/*                            passive*/}
                                {/*                        >*/}
                                {/*                            Make account private*/}
                                {/*                        </Switch.Label>*/}
                                {/*                        <Switch.Description className="text-sm text-gray-500">*/}
                                {/*                            Pharetra morbi dui mi mattis tellus sollicitudin*/}
                                {/*                            cursus pharetra.*/}
                                {/*                        </Switch.Description>*/}
                                {/*                    </div>*/}
                                {/*                    <Switch*/}
                                {/*                        checked={privateAccount}*/}
                                {/*                        onChange={setPrivateAccount}*/}
                                {/*                        className={classNames(*/}
                                {/*                            privateAccount ? "bg-indigo-500" : "bg-gray-200",*/}
                                {/*                            "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                                {/*                        )}*/}
                                {/*                    >*/}
                                {/*<span*/}
                                {/*    aria-hidden="true"*/}
                                {/*    className={classNames(*/}
                                {/*        privateAccount ? "translate-x-5" : "translate-x-0",*/}
                                {/*        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"*/}
                                {/*    )}*/}
                                {/*/>*/}
                                {/*                    </Switch>*/}
                                {/*                </Switch.Group>*/}
                                {/*                <Switch.Group*/}
                                {/*                    as="li"*/}
                                {/*                    className="flex items-center justify-between py-4"*/}
                                {/*                >*/}
                                {/*                    <div className="flex flex-col">*/}
                                {/*                        <Switch.Label*/}
                                {/*                            as="p"*/}
                                {/*                            className="text-sm font-medium text-gray-900"*/}
                                {/*                            passive*/}
                                {/*                        >*/}
                                {/*                            Allow commenting*/}
                                {/*                        </Switch.Label>*/}
                                {/*                        <Switch.Description className="text-sm text-gray-500">*/}
                                {/*                            Integer amet, nunc hendrerit adipiscing nam. Elementum*/}
                                {/*                            ame*/}
                                {/*                        </Switch.Description>*/}
                                {/*                    </div>*/}
                                {/*                    <Switch*/}
                                {/*                        checked={allowCommenting}*/}
                                {/*                        onChange={setAllowCommenting}*/}
                                {/*                        className={classNames(*/}
                                {/*                            allowCommenting ? "bg-indigo-500" : "bg-gray-200",*/}
                                {/*                            "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                                {/*                        )}*/}
                                {/*                    >*/}
                                {/*<span*/}
                                {/*    aria-hidden="true"*/}
                                {/*    className={classNames(*/}
                                {/*        allowCommenting ? "translate-x-5" : "translate-x-0",*/}
                                {/*        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"*/}
                                {/*    )}*/}
                                {/*/>*/}
                                {/*                    </Switch>*/}
                                {/*                </Switch.Group>*/}
                                {/*                <Switch.Group*/}
                                {/*                    as="li"*/}
                                {/*                    className="flex items-center justify-between py-4"*/}
                                {/*                >*/}
                                {/*                    <div className="flex flex-col">*/}
                                {/*                        <Switch.Label*/}
                                {/*                            as="p"*/}
                                {/*                            className="text-sm font-medium text-gray-900"*/}
                                {/*                            passive*/}
                                {/*                        >*/}
                                {/*                            Allow mentions*/}
                                {/*                        </Switch.Label>*/}
                                {/*                        <Switch.Description className="text-sm text-gray-500">*/}
                                {/*                            Adipiscing est venenatis enim molestie commodo eu*/}
                                {/*                            gravid*/}
                                {/*                        </Switch.Description>*/}
                                {/*                    </div>*/}
                                {/*                    <Switch*/}
                                {/*                        checked={allowMentions}*/}
                                {/*                        onChange={setAllowMentions}*/}
                                {/*                        className={classNames(*/}
                                {/*                            allowMentions ? "bg-indigo-500" : "bg-gray-200",*/}
                                {/*                            "relative ml-4 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                                {/*                        )}*/}
                                {/*                    >*/}
                                {/*<span*/}
                                {/*    aria-hidden="true"*/}
                                {/*    className={classNames(*/}
                                {/*        allowMentions ? "translate-x-5" : "translate-x-0",*/}
                                {/*        "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"*/}
                                {/*    )}*/}
                                {/*/>*/}
                                {/*                    </Switch>*/}
                                {/*                </Switch.Group>*/}
                                {/*            </ul>*/}
                                {/*        </div>*/}
                                <div className="mt-4 flex justify-end py-4 px-4 sm:px-6">
                                    {/*<button*/}
                                    {/*    type="button"*/}
                                    {/*    className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"*/}
                                    {/*>*/}
                                    {/*    Cancel*/}
                                    {/*</button>*/}
                                    <button
                                        type="submit"
                                        className="ml-5 inline-flex justify-center rounded-md border border-transparent bg-indigo-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Cập nhật thông tin
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};
Settings.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};

export default Settings;
