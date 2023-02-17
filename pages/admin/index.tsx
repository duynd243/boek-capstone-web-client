import React, {ReactElement} from "react";
import {NextPageWithLayout} from "../_app";
import AdminLayout from "../../components/Layout/AdminLayout";
import {IProvince} from "../../types/Address/IProvince";
import useAddress from "../../hooks/useAddress";
import SelectBox from "../../components/SelectBox";
import {IDistrict} from "../../types/Address/IDistrict";
import {IWard} from "../../types/Address/IWard";
import {z} from "zod";
import {Controller, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const Page: NextPageWithLayout = () => {
    const {
        provinces, districts, wards,
        handleProvinceChange,
        handleDistrictChange,
        handleWardChange,
        selectedProvince,
        selectedDistrict,
        selectedWard,
    } = useAddress();
    type P = {
        name: string;
        code: string;
    }

    const formSchema = z.object({
        provinceCode: z.number({required_error: 'Vui lòng chọn tỉnh / thành phố'}),
        districtCode: z.number().optional(),
        wardCode: z.number().optional(),
    })

    type formType = z.infer<typeof formSchema>;

    const {watch, control, handleSubmit, formState} = useForm<formType>({
        resolver: zodResolver(formSchema),
    })
    const {errors} = formState;

    console.log(errors);
    const onsubmit = (data: formType) => {
        console.log(data)
    }

    return <div>
        <h1>Admin Dashboard</h1>

        <form
            onSubmit={handleSubmit(onsubmit)}
            className={'flex flex-col gap-2'}>

            <Controller
                control={control}
                name='provinceCode'
                render={({field}) => {
                    return <SelectBox<IProvince> placeholder={'Chọn tỉnh / thành phố'}
                                          value={selectedProvince}
                                          onValueChange={(p)=>{
                                                field.onChange(p.code)
                                                handleProvinceChange(p)
                                          }}
                                          dataSource={provinces}
                                          displayKey={'nameWithType'}
                    />
                }}
            />
            {errors.provinceCode && <span className={'text-red-500'}>{errors.provinceCode.message}</span>}


            <SelectBox<IDistrict> placeholder={'Chọn quận / huyện'}
                                  searchable={false}
                                  value={selectedDistrict}
                                  onValueChange={handleDistrictChange}
                                  dataSource={districts}
                                  displayKey={'nameWithType'}
            />
            <SelectBox<IWard> placeholder={'Chọn phường / xã'}
                              value={selectedWard}
                              onValueChange={handleWardChange}
                              dataSource={wards}
                              displayKey={'nameWithType'}
            />
            <button type={'submit'}>Submit</button>
        </form>
        <pre>
            {JSON.stringify(watch(), null, 2)}
        </pre>

        {/*<Combobox value={selectedPerson} onChange={setSelectedPerson}>*/}
        {/*    <div className="relative">*/}
        {/*        <Combobox.Input*/}
        {/*            placeholder={'Search'}*/}
        {/*            className={defaultInputClass}*/}
        {/*            displayValue={(value: typeof people[number]) => value?.name ?? ''}*/}
        {/*            onChange={(e) => setQuery(e.target.value)}*/}
        {/*        />*/}
        {/*        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">*/}
        {/*            <BiChevronDown*/}
        {/*                className="h-5 w-5 text-gray-400 transition duration-200 ui-open:rotate-180"*/}
        {/*                aria-hidden="true"*/}
        {/*            />*/}
        {/*        </Combobox.Button>*/}

        {/*        <Transition*/}
        {/*            as={Fragment}*/}
        {/*            leave="transition ease-in duration-100"*/}
        {/*            leaveFrom="opacity-100"*/}
        {/*            leaveTo="opacity-0"*/}
        {/*            afterLeave={() => setQuery("")}*/}
        {/*        >*/}
        {/*            <Combobox.Options*/}
        {/*                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">*/}
        {/*                {filteredPeople && filteredPeople?.length > 0 ? (*/}
        {/*                    filteredPeople.map((option, index) => (*/}
        {/*                        <Combobox.Option*/}
        {/*                            className="relative cursor-default select-none rounded py-2 px-4 text-gray-700 ui-selected:font-medium ui-selected:text-gray-900 ui-active:bg-indigo-600 ui-active:text-white"*/}
        {/*                            key={index}*/}
        {/*                            value={option}*/}
        {/*                        >*/}
        {/*                            {({selected}) => (*/}
        {/*                                <div className="flex items-center justify-between">*/}
        {/*                                    <span className="text-sm">{option?.name}</span>*/}
        {/*                                    {selected && (*/}
        {/*                                        <HiCheckCircle*/}
        {/*                                            className="fill-indigo-600 text-lg ui-active:fill-white"/>*/}
        {/*                                    )}*/}
        {/*                                </div>*/}
        {/*                            )}*/}
        {/*                        </Combobox.Option>*/}
        {/*                    ))*/}
        {/*                ) : (*/}
        {/*                    <div className="py-1 text-center text-sm text-gray-400">*/}
        {/*                        Không có kết quả*/}
        {/*                    </div>*/}
        {/*                )}*/}
        {/*            </Combobox.Options>*/}
        {/*        </Transition>*/}
        {/*    </div>*/}
        {/*</Combobox>*/}

        {/*<SelectBox placeholder={'Chọn quận/huyện'}*/}
        {/*           value={selectedDistrictId}*/}
        {/*           onChange={(value) => {*/}
        {/*               console.log(value);*/}
        {/*           }}*/}
        {/*           dataSource={districts}*/}
        {/*           displayKey={'nameWithType'}*/}
        {/*/>*/}

    </div>;
};

Page.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default Page;
