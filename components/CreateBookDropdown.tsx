import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import { Transition } from "@headlessui/react";
import DefaultAvatar from "../assets/images/default-avatar.png";
import { findRole } from "../constants/Roles";
import Link from "next/link";



type Props = {
  align: "left" | "right";
};

const CreateBookDropdown: React.FC<Props> = ({ align }) => {
  const { loginUser, user, logOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  const trigger = useRef<HTMLButtonElement>(null);
  const dropdown = useRef<HTMLDivElement>(null);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: { target: any }) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger?.current?.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="m-btn gap-1 bg-indigo-500 text-white hover:bg-indigo-600"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <div className="flex items-center truncate">
          <span className="ml-2 hidden truncate text-sm font-medium group-hover:text-slate-800 lg:block">
            Thêm Sách
          </span>
          <svg
            className="ml-1 h-3 w-3 shrink-0 fill-current text-white"
            viewBox="0 0 12 12"
          >
            <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
          </svg>
        </div>
      </button>

      <Transition
        className={`absolute top-full z-10 mt-3 min-w-[11rem] origin-top-right overflow-hidden rounded border border-slate-200 bg-white py-1.5 shadow-lg ${
          align === "right" ? "right-0" : "left-0"
        }`}
        show={dropdownOpen}
        enter="transition ease-out duration-200 transform"
        enterFrom="opacity-0 -translate-y-2"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={dropdown}
          onFocus={() => setDropdownOpen(true)}
          onBlur={() => setDropdownOpen(false)}
        >
          {/* <div className="mb-1 border-b border-slate-200 px-3 pt-0.5 pb-2">
            <div className="font-medium text-slate-800">
              {loginUser?.name || user?.displayName}
            </div>
            <div className="text-xs italic text-slate-500">
              {findRole(loginUser?.role)?.displayName}
            </div>
          </div> */}
          <ul>
            <li>
              <Link
                className="flex items-center py-1 px-3 text-sm font-medium text-indigo-500 hover:text-indigo-600"
                href="/issuer/books/create"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Thêm Sách Lẻ
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center py-1 px-3 text-sm font-medium text-indigo-500 hover:text-indigo-600"
                href="/issuer/books/createcombo"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                Thêm Sách Combo
              </Link>
            </li>
            <li>
              <Link
                className="flex items-center py-1 px-3 text-sm font-medium text-indigo-500 hover:text-indigo-600"
                href="/issuer/books/createseries"
                onClick={() => {
                  setDropdownOpen(!dropdownOpen);
                }}
              >
                Thêm Sách Series
              </Link>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  );
};

export default CreateBookDropdown;
