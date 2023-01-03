import React from "react";
import Link from "next/link";
import { NextPageWithLayout } from "../_app";
import { usePostStore } from "./index";

const Create: NextPageWithLayout = () => {
  const [title, setTitle] = React.useState("");
  const { addBook } = usePostStore();
  const handleChange = () => {
    addBook(title);
  };
  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
      />
      <button onClick={handleChange}>Click</button>
      <Link href={"/posts"}>Back</Link>
    </div>
  );
};
export default Create;
