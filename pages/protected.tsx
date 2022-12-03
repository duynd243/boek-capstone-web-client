import React from "react";
import { NextPage } from "next";
import { useAuth } from "../context/AuthContext";
import Image from "next/image";
import Link from "next/link";

const Protected: NextPage = () => {
  const { logOut, loginUser, user } = useAuth();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Image
        src={user?.photoURL}
        alt={user?.displayName}
        className={"mb-6"}
        width={100}
        height={100}
      />

      <button
        className="btn mb-4 rounded-md bg-indigo-600 px-5 py-3 text-white hover:opacity-95"
        onClick={async () => {
          if (loginUser && loginUser.accessToken) {
            try {
              await navigator.clipboard.writeText(loginUser.accessToken);
              alert("Đã copy rồi nha chế ơi");
            } catch (e) {
              console.log(e);
            }
          } else {
            alert("No access token");
          }
        }}
      >
        Copy Token
      </button>
      <button
        className="btn mb-4 rounded-md bg-indigo-600 px-5 py-3 text-white hover:opacity-95"
        onClick={async () => {
          if (user) {
            const idToken = await user.getIdToken();
            if (idToken) {
              try {
                await navigator.clipboard.writeText(idToken);
                alert("Đã copy rồi nha chế ơi");
              } catch (e) {
                console.log(e);
              }
            } else {
              alert("No id token");
            }
          }
        }}
      >
        Copy Firebase Id Token
      </button>
      <button
        onClick={logOut}
        className={"mb-2 rounded bg-red-500 py-2 px-3 text-white"}
      >
        Logout
      </button>
      <Link href={"/"} className="btn">
        Go Home
      </Link>
    </div>
  );
};

export default Protected;
