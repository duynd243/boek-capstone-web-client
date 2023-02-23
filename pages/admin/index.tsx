import React, {ReactElement} from "react";
import {NextPageWithLayout} from "../_app";
import AdminLayout from "../../components/Layout/AdminLayout";
import {IProvince} from "../../types/Address/IProvince";
import useAddress from "../../hooks/useAddress";
import SelectBox from "../../components/SelectBox";
import {IDistrict} from "../../types/Address/IDistrict";
import {z} from "zod";
import {Controller, FormProvider, useForm, useFormContext} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const NestedInput = () => {
    const { register } = useFormContext();
    return <input {...register('email')}/>
}

const Page: NextPageWithLayout = () => {

    const userSchema = z
        .object({
            email: z
                .string()
                .min(1, "The email is required.")
                .email({message: "The email is invalid."}),
            confirmEmail: z.string().min(1, "The email is required."),
            startDate: z.coerce.date({required_error: "The start date is required."}),
            endDate: z.coerce.date({required_error: "The end date is required."}),
        })
        // The refine method is used to add custom rules or rules over multiple fields.
        .refine((data) => data.email === data.confirmEmail, {
            message: "Emails don't match.",
            path: ["confirmEmail"] // Set the path of this error on the confirmEmail field.
        })
        .refine((data) => data.startDate < data.endDate, {
            path: ["endDate"], // Set the path of this error on the startDate and endDate fields.
            message: "The start date must be before the end date.",
        });

    type UserType = z.infer<typeof userSchema>;


    const methods = useForm<UserType>({
        resolver: zodResolver(userSchema), // Configuration the validation with the zod schema.

    });

    const onSubmit = (user: UserType) => {
        console.log("dans onSubmit", user);
    };

    console.log("errors", methods.formState.errors);

    const {errors} = methods.formState;


    return <div>
        <h1>Admin Dashboard</h1>
        <FormProvider {...methods}>
        <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className={'flex flex-col gap-2'}>
            <label htmlFor="email">Email</label>
            {/*<input*/}
            {/*    type="email"*/}
            {/*    id="email"*/}
            {/*    {...methods.register("email")}*/}
            {/*    className={'border border-gray-300 p-2 rounded-md'}*/}
            {/*/>*/}
            <NestedInput />
            {errors.email && <p className={'text-red-500'}>{errors.email.message}</p>}
            <label htmlFor="confirmEmail">Confirm Email</label>
            <input
                type="email"
                id="confirmEmail"
                {...methods.register("confirmEmail")}
                className={'border border-gray-300 p-2 rounded-md'}
            />
            {errors.confirmEmail && <p className={'text-red-500'}>{errors.confirmEmail.message}</p>}

            <label htmlFor="startDate">Start Date</label>
            <input
                type="date"
                id="startDate"
                {...methods.register("startDate")}
                className={'border border-gray-300 p-2 rounded-md'}
            />
            {errors.startDate && <p className={'text-red-500'}>{errors.startDate.message}</p>}

            <label htmlFor="endDate">End Date</label>
            <input
                type="date"
                id="endDate"
                {...methods.register("endDate")}
                className={'border border-gray-300 p-2 rounded-md'}
            />
            {errors.endDate && <p className={'text-red-500'}>{errors.endDate.message}</p>}
            <button type="submit" className={'bg-blue-500 text-white p-2 rounded-md'}>
                Submit
            </button>
        </form>
        </FormProvider>

    </div>;
};

Page.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default Page;
