import { useState } from "react";
import { useAdopt } from "@/app/providers/adopt";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCatSay } from "@/app/shared/services/cat-service";
import { Radio, Button, Spin } from "antd";

// Component
import { FormInputNumber } from "@/app/shared/components/InputNumber";
import { FormInput } from "@/app/shared/components/Input";
import { FormTextArea } from "@/app/shared/components/TextArea";
import { FormCheckbox } from "@/app/shared/components/Checkbox";
import { FormSelect } from "@/app/shared/components/Select";

const adoptionSchema = z.object({
  fullName: z.string().min(3, "Name is required"),
  age: z.number().min(18, "Must be at least 18"),
  phone: z.string().min(10, "Invalid phone"),
  lineId: z.string().optional(),

  homeType: z.enum(["house", "condo", "other"], {
    errorMap: () => ({ message: "Select home type" }),
  }),

  hasPets: z.string(),
  petDetails: z.string().optional(),

  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree",
  }),
});

/**
 * Adopt component
 * @param {object} cat - Cat information
 * @return {jsx} Adopt form
 */
export function Adopt() {
  const { id } = useParams();
  const {
    data: cat = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cat", id],
    queryFn: ({ signal }) => getCatSay(id, "Meow..", signal),
    staleTime: 1000 * 60, // 1 min
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
    gcTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
  const { catIsAdopted, addAdopt } = useAdopt();
  const [hasPets, setHasPets] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adoptionSchema),
  });

  const onSubmit = (data) => {
    const adopt = { ...data, id:cat.id,cat:cat };
    addAdopt(adopt);
  };

  return (
    <div className="page">
      {error && <p>Error...</p>}
      {isLoading ? (
        <div className="flex justify-center mt-2!">
          <Spin percent={"auto"} size="large" />
        </div>
      ) : (
        <div className="container">
          <h1 className="page-title">Adopt : {cat.name}</h1>

          <div className="product-detail bg-white shadow-lg rounded-xl p-6">
            {/* Header */}
            <div className="product-detail-image col-span-2">
              <img src={cat.url || null} alt={cat.name} />
            </div>

            {/* Step */}
            <div className="col-span-2 flex justify-center gap-4 mb-6 text-sm">
              <span className="font-semibold text-blue-600">
                STEP 1: Applicant Info
              </span>
              <span>→</span>
              <span>STEP 2: Home Env</span>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 col-span-2"
            >
              {/* Name + Age */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName">Full Name</label>                 
                  <FormInput name="fullName" control={control} />
                  <p className="text-red-500">{errors.fullName?.message}</p>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="age">Age</label>
                  <FormInputNumber name="age" control={control} />
                  <p className="text-red-500">{errors.age?.message}</p>
                </div>
              </div>

              {/* Phone + Line */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone">Phone</label>
                  {/* <input {...register("phone")} className="input" /> */}                
                  <FormInput name="phone" control={control} />
                  <p className="text-red-500">{errors.phone?.message}</p>
                </div>

                <div>
                  <label htmlFor="lineId">Line ID</label>
                  {/* <input {...register("lineId")} className="input" /> */}            
                  <FormInput name="lineId" control={control} />
                </div>
              </div>

              {/* Home Type */}
              <div>
                <label className="block mb-1" htmlFor="homeType">
                  Your Home Style
                </label>

                <Controller
                  name="homeType"
                  control={control}
                  render={({ field }) => (
                    <Radio.Group
                      {...field}
                      className="w-full"
                      onChange={(e) => field.onChange(e.target.value)}
                      options={[
                        { value: "house", label: "House" },
                        {
                          value: "condo",
                          label: "Condo",
                        },
                        {
                          value: "other",
                          label: "Other",
                        },
                      ]}
                    />
                  )}
                />
                <p className="text-red-500">{errors.homeType?.message}</p>
              </div>

              {/* Pets */}
              <div className="flex flex-col">
                <label htmlFor="hasPets">Do you have other pets?</label>
                {/* <select {...register("hasPets")} className="input">
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select> */}

        
                <FormSelect
                  name="hasPets"
                  control={control}
                  handleChange={setHasPets}
                  options={[
                    { value: "", label: "Select" },
                    {
                      value: "true",
                      label: "Yes",
                    },
                    {
                      value: "false",
                      label: "No",
                    },
                  ]}
                />
              </div>

              {/* Conditional field */}
              {hasPets === "true" && (
                <div>
                  <label htmlFor="petDetails">Pet Details</label>
                  {/* <input {...register("petDetails")} className="input" /> */}               
                  <FormTextArea name="petDetails" control={control} />
                </div>
              )}

              {/* Upload */}
              {/* <div>
                <label>Home Photos</label>
                <input type="file" multiple className="input" />
              </div> */}

              {/* Agree */}
              <div className="flex flex-col">
                <div className="flex gap-2">             
                  <FormCheckbox name="agree" control={control} />
                  <label htmlFor="agree">
                    {/* <input type="checkbox" {...register("agree")} /> */}I
                    agree to provide monthly updates for 6 months.
                  </label>
                </div>
                <p className="text-red-500">{errors.agree?.message}</p>
              </div>
              {/* Submit */}
              <div className="text-center">
                <Button disabled={!!catIsAdopted(cat)} htmlType="submit" variant="solid" color="primary">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

