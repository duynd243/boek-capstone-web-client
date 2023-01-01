import React, { Fragment, ReactElement, useMemo } from "react";
import { NextPage } from "next";
import { NextPageWithLayout } from "../../../../_app";
import AdminLayout from "../../../../../components/Layout/AdminLayout";
import { bookCategories } from "../../index";
import { useRouter } from "next/router";
import PageHeading from "../../../../../components/Admin/PageHeading";
import SearchForm from "../../../../../components/Admin/SearchForm";
import CreateButton from "../../../../../components/Admin/CreateButton";
import { faker } from "@faker-js/faker/locale/vi";
import Link from "next/link";

const AdminGenresPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id: categoryId } = router.query as { id: string };
  const category = useMemo(() => {
    return bookCategories.find(
      (category) => category.id === Number(categoryId)
    );
  }, [categoryId]);
  const genres = useMemo(() => {
    return category?.genres || [];
  }, [category]);
  return (
    <Fragment>
      <PageHeading label={`Chủ đề thuộc ${category?.name}`}>
        <SearchForm />
        <CreateButton label="Thêm" />
      </PageHeading>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Tên chủ đề
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Số lượng sách
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                    >
                      Trạng thái
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {genres.map((genre) => (
                    <tr key={genre.id}>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-600">
                        {genre.name}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                        {faker.datatype.number({ min: 1, max: 100 })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {faker.datatype.boolean() ? (
                          <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold uppercase leading-5 text-green-800">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex rounded-full bg-red-100 px-2 text-xs font-semibold uppercase leading-5 text-red-800">
                            Bị vô hiệu hóa
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                        <a
                          href="#"
                          className="block text-indigo-600 hover:text-indigo-900"
                        >
                          Chỉnh sửa
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
AdminGenresPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default AdminGenresPage;
