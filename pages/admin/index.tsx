import { zodResolver } from "@hookform/resolvers/zod";
import { ReactElement } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AdminLayout from "../../components/Layout/AdminLayout";
import { NextPageWithLayout } from "../_app";
const Page: NextPageWithLayout = () => {
    const BaseSchema = z.object({
        name: z.string(),
        description: z.string(),
        startDate: z.coerce.date().refine((date) => date > new Date(), {
            message: "Start date must be in the future",
        }),
        endDate: z.coerce.date(),
        continuous: z.literal(true),
        address: z.object({
            detail: z.string().min(1, { message: "Address is required" }),
            city: z.string().min(1, { message: "City is required" }),
        }),
    });
    const NonContinuousSchema = BaseSchema.extend({
        continuous: z.literal(false),
    });

    const FormSchema = z
        .discriminatedUnion("continuous", [NonContinuousSchema, BaseSchema])
        .refine(
            (data) => {
                // startDate must be before endDate
                return data.startDate < data.endDate;
            },
            {
                message: "Start date must be before end date",
                path: ["endDate"],
            }
        );

    type FormType = Partial<z.infer<typeof FormSchema>>;
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            address: {
                detail: "",
                city: "",
            },
        },
    });

    const onSubmit = (data: FormType) => {
        console.log(data);
    };

   // console.log(errors);

    try {
        FormSchema.parse({
            name: "",
            description: "22",
            startDate: "2023-03-01",
            endDate: "2023-02-22",
            continuous: false,
        });
    } catch (error) {
        //console.log(error);
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            {/* <form
                className="flex flex-col space-y-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <label htmlFor="name">Name</label>
                <input type="text" id="name" {...register("name")} />
                {errors.name && <p>{errors.name.message}</p>}
                <label htmlFor="description">Description</label>
                <input
                    type="text"
                    id="description"
                    {...register("description")}
                />
                {errors.description && <p>{errors.description.message}</p>}
                <label htmlFor="startDate">Start Date</label>
                <input type="date" id="startDate" {...register("startDate")} />
                {errors.startDate && <p>{errors.startDate.message}</p>}
                <label htmlFor="endDate">End Date</label>
                <input type="date" id="endDate" {...register("endDate")} />
                {errors.endDate && <p>{errors.endDate.message}</p>}

                {/* <label htmlFor="address">Address</label>
                <input
                    type="text"
                    id="address"
                    {...register("address.detail")}
                />
                {errors.address?.detail && (
                    <p>{errors.address?.detail?.message}</p>
                )}
                <input type="text" id="city" {...register("address.city")} />
                {errors.address?.city && <p>{errors.address?.city?.message}</p>}

                <label htmlFor="continuous">Continuous</label>
                <input
                    type="checkbox"
                    id="continuous"
                    {...register("continuous")}
                />
                <button type="submit">Submit</button>
            </form>
            <pre>{JSON.stringify(errors, null, 2)}</pre> */}
        </div>
    );
};

Page.getLayout = function getLayout(page: ReactElement) {
    return <AdminLayout>{page}</AdminLayout>;
};
export default Page;
