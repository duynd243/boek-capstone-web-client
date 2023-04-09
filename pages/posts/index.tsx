import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { NextPage } from "next";
import { create } from "zustand";

interface IPostStore {
  data: {
    title: string;
    content: string;
    books: string[];
  };
  setPost: (data: any) => void;
  addBook: (book: any) => void;
}

export const usePostStore = create<IPostStore>()((set) => ({
  data: {
    title: "",
    content: "",
    books: [],
  },
  setPost: (data: any) =>
    set((state) => ({
      data: {
        ...state.data,
        ...data,
      },
    })),
  addBook: (book: string) =>
    set((state) => ({
      data: { ...state.data, books: state.data.books.concat(book) },
    })),
}));

const Posts: NextPage = () => {
  const { data: postData, setPost: setPostData } = usePostStore();

  const form = useFormik({
    initialValues: {
      title: postData?.title || "",
      content: postData?.content || "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Tiêu đề không được để trống"),
      content: Yup.string().required("Nội dung không được để trống"),
    }),
    onSubmit: (values) => {
      console.log(values);
      setPostData(values);
    },
  });
  return (
    <form className={"mx-auto w-56"} onSubmit={form.handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="title"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Tiêu đề
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={form.values.title}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        />
        {form.touched.title && form.errors.title && (
          <p className="text-xs italic text-red-500">{form.errors.title}</p>
        )}
      </div>
      <div className="mb-4">
        <label
          htmlFor="content"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          Nội dung
        </label>
        <textarea
          id="content"
          name="content"
          value={form.values.content}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
        />
        {form.touched.content && form.errors.content && (
          <p className="text-xs italic text-red-500">{form.errors.content}</p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="focus:shadow-outline rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
          Đăng bài
        </button>
        <Link
          href={"/posts/create"}
          className="focus:shadow-outline rounded bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700 focus:outline-none"
        >
          Tạo
        </Link>
      </div>
      {/* <div>{JSON.stringify(postData)}</div> */}
    </form>
  );
};
export default Posts;
