import { NextPageWithLayout } from "../../_app";
import AdminLayout from "../../../components/Layout/AdminLayout";
import { ReactElement } from "react";

const CreateCampaignPage: NextPageWithLayout = () => {
  return (
    <form className="mx-auto max-w-6xl space-y-8 divide-y divide-gray-200 bg-white p-10">
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Thông tin chung
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Thông tin cơ bản về hội sách
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label
                htmlFor="campaignName"
                className="block text-sm font-medium text-gray-700"
              >
                Tên hội sách
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="campaignName"
                  id="campaignName"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value=""
                />
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="campaignDesc"
                className="block text-sm font-medium text-gray-700"
              >
                Mô tả
              </label>
              <div className="mt-1">
                <textarea
                  id="campaignDesc"
                  name="campaignDesc"
                  rows={3}
                  className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                ></textarea>
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium text-gray-700"
              >
                Ảnh bìa
              </label>
              <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                  <div className="flex justify-center text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Tải ảnh lên</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF tối đa 1MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Thời gian và địa điểm
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Thông tin về thời gian và địa điểm tổ chức hội sách
            </p>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="startDate"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày bắt đầu
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="startDate"
                  id="startDate"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value=""
                />
              </div>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="endDate"
                className="block text-sm font-medium text-gray-700"
              >
                Ngày kết thúc
              </label>
              <div className="mt-1">
                <input
                  type="date"
                  name="endDate"
                  id="endDate"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value=""
                />
              </div>
            </div>
            <div className="sm:col-span-6">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Địa chỉ
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value=""
                />
              </div>
            </div>
          </div>
        </div>
        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Tổ chức
            </h3>
          </div>
          <div className="mt-3">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">
                Chọn các tổ chức mà hội sách này nhắm đến
              </legend>
              <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-1"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-1"
                      className="font-medium text-gray-700"
                    >
                      FPT
                    </label>
                    <p className="text-gray-500">Quận 9 - 0101456789</p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-6"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-6"
                      className="font-medium text-gray-700"
                    >
                      KMS Technology
                    </label>
                    <p className="text-gray-500">
                      2 Tản Viên, Phường 2, Tân Bình, Thành phố Hồ Chí Minh -
                      028 3811 9977
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-7"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-7"
                      className="font-medium text-gray-700"
                    >
                      Viettel
                    </label>
                    <p className="text-gray-500">
                      Lane 7, Ton That Thuyet Street, Yen Hoa Ward, Cau Giay
                      District, Hanoi, Vietnam - 024 6255 6789
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-8"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-8"
                      className="font-medium text-gray-700"
                    >
                      Zalo
                    </label>
                    <p className="text-gray-500">
                      182 Lê Đại Hành, Ho Chi Minh City - 1900 561 558
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-9"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-9"
                      className="font-medium text-gray-700"
                    >
                      NAB Innovation
                    </label>
                    <p className="text-gray-500">
                      7th Floor, Etown 5, Cong Hoa Str., Tan Binh Dist., Ho Chi
                      Minh City, Vietnam - 0101456789
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-10"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-10"
                      className="font-medium text-gray-700"
                    >
                      FPT University HCM
                    </label>
                    <p className="text-gray-500">
                      Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ
                      Đức, Thành phố Hồ Chí Minh - 028 7300 5588
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-11"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-11"
                      className="font-medium text-gray-700"
                    >
                      FPT University Hòa Lạc
                    </label>
                    <p className="text-gray-500">
                      Đất Thổ Cư Hòa Lạc, Km29 Đường Cao Tốc 08, Thạch Hoà,
                      Thạch Thất, Hà Nội - 024 7300 5588
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-12"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-12"
                      className="font-medium text-gray-700"
                    >
                      VinGroup
                    </label>
                    <p className="text-gray-500">
                      No 7, Bang Lang 1 Street, Viet Hung Ward, Long Bien
                      District, Ha Noi - +84 (24) 3974 9999
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-13"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-13"
                      className="font-medium text-gray-700"
                    >
                      Novaland
                    </label>
                    <p className="text-gray-500">
                      152 Dien Bien Phu, Ward 25, Binh Thanh Dist., HCMC -
                      (84)906 35 38 38
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="organization-14"
                      name="organizations"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-14"
                      className="font-medium text-gray-700"
                    >
                      HSBC Metropolitan
                    </label>
                    <p className="text-gray-500">
                      235 Đồng Khởi, Bến Nghé, Quận 1, Thành phố Hồ Chí Minh -
                      028 3724 7247
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="mt-3">
            <fieldset>
              <legend className="text-base font-medium text-gray-900">
                Tính công khai của hội sách
              </legend>
              <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="radio-public"
                      name="organizations"
                      type="radio"
                      className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-1"
                      className="font-medium text-gray-700"
                    >
                      Công khai
                    </label>
                    <p className="text-gray-500">
                      Hội sách sẽ được công khai với tất cả mọi người
                    </p>
                  </div>
                </div>
                <div className="relative flex items-start sm:col-span-6">
                  <div className="flex h-5 items-center">
                    <input
                      id="radio-private"
                      name="organizations"
                      type="radio"
                      className="h-4 w-4 rounded-full border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="organization-1"
                      className="font-medium text-gray-700"
                    >
                      Riêng tư
                    </label>
                    <p className="text-gray-500">
                      Hội sách sẽ chỉ khả dụng với các tổ chức đã được chọn
                    </p>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>

        <div className="pt-8">
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Tập khách hàng
            </h3>
          </div>
          {/*<div className="mt-3">*/}
          {/*    <fieldset>*/}
          {/*        <legend className="text-base font-medium text-gray-900">*/}
          {/*            Tinh chỉnh các thuộc tính nhằm tạo ra một tập khách hàng phù hợp*/}
          {/*        </legend>*/}
          {/*    </fieldset>*/}
          {/*</div>*/}
          <p className="mt-1 text-sm text-gray-500">
            Tinh chỉnh các thuộc tính nhằm tạo ra một tập khách hàng phù hợp
          </p>

          <div className="mt-6 grid grid-cols-6 gap-y-6 gap-x-4">
            <div className="col-span-6">
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Độ tuổi
              </label>
              <div className="mt-1">
                <div className="grid grid grid-cols-6 gap-x-4">
                  <input
                    type="number"
                    placeholder="Từ"
                    min={1}
                    max={100}
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Đến"
                    min={1}
                    max={100}
                    name="first-name"
                    id="first-name"
                    autoComplete="given-name"
                    className="col-span-3 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-5">
        <div className="flex justify-end">
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Tạo hội sách
          </button>
        </div>
      </div>
    </form>
  );
};

CreateCampaignPage.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};
export default CreateCampaignPage;
