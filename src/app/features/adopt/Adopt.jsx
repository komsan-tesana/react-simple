import { useState } from "react";
import { useAdopt } from "@/app/providers/adopt";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCatSay } from "@/app/shared/services/cat-service";
import { Radio, Button, Spin, Steps, Card, Result } from "antd";
import { UserOutlined, HomeOutlined, CheckCircleOutlined } from "@ant-design/icons";

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

const stepItems = [
  { title: "Applicant Info", icon: <UserOutlined /> },
  { title: "Home Environment", icon: <HomeOutlined /> },
  { title: "Review & Submit", icon: <CheckCircleOutlined /> },
];

export function Adopt() {
  const { id } = useParams();
  const {
    data: cat = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cat", id],
    queryFn: ({ signal }) => getCatSay(id, "Meow..", signal),
    staleTime: 1000 * 60,
    cacheTime: 1000 * 60 * 5,
    keepPreviousData: true,
    gcTime: 1000 * 60 * 5,
    placeholderData: (previousData) => previousData,
  });
  const { catIsAdopted, addAdopt } = useAdopt();
  const [hasPets, setHasPets] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(adoptionSchema),
  });

  const onSubmit = (data) => {
    const adopt = { ...data, id: cat.id, cat: cat };
    addAdopt(adopt);
    setIsSubmitted(true);
  };

  const nextStep = async () => {
    let fieldsToValidate = [];
    if (currentStep === 0) {
      fieldsToValidate = ["fullName", "age", "phone"];
    } else if (currentStep === 1) {
      fieldsToValidate = ["homeType", "hasPets"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 2));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  if (isSubmitted) {
    return (
      <div className="page">
        <div className="container">
          <Result
            status="success"
            title="Application Submitted!"
            subTitle={`Thank you for your interest in adopting ${cat.name}. We will contact you soon.`}
            extra={[
              <Button type="primary" key="home" href="/">
                Back to Home
              </Button>,
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      {error && (
        <div className="container">
          <Card>
            <Result
              status="error"
              title="Error Loading Cat"
              subTitle="Please try again later."
            />
          </Card>
        </div>
      )}
      {isLoading ? (
        <div className="container flex-center">
          <Spin size="large" />
        </div>
      ) : (
        <div className="container">
          <h1 className="page-title">Adopt {cat.name}</h1>

          <Card className="adopt-card">
            <div className="adopt-cat-header">
              <img
                src={cat.url || null}
                alt={cat.name}
                className="adopt-cat-image"
              />
              <div className="adopt-cat-info">
                <h2>{cat.name}</h2>
                <p>{cat.tags?.join(", ") || "No tags"}</p>
              </div>
            </div>

            <Steps
              current={currentStep}
              items={stepItems}
              className="adopt-steps"
              size="small"
            />

            <form onSubmit={handleSubmit(onSubmit)} className="adopt-form">
              {currentStep === 0 && (
                <div className="form-step">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="fullName">Full Name *</label>
                      <FormInput name="fullName" control={control} placeholder="Enter your full name" />
                      {errors.fullName && (
                        <span className="form-error">{errors.fullName.message}</span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="age">Age *</label>
                      <FormInputNumber name="age" control={control} placeholder="18+" />
                      {errors.age && (
                        <span className="form-error">{errors.age.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="phone">Phone *</label>
                      <FormInput name="phone" control={control} placeholder="Enter phone number" />
                      {errors.phone && (
                        <span className="form-error">{errors.phone.message}</span>
                      )}
                    </div>

                    <div className="form-field">
                      <label htmlFor="lineId">Line ID</label>
                      <FormInput name="lineId" control={control} placeholder="Optional" />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="form-step">
                  <div className="form-field">
                    <label>Your Home Style *</label>
                    <Controller
                      name="homeType"
                      control={control}
                      render={({ field }) => (
                        <Radio.Group
                          {...field}
                          className="home-type-group"
                          onChange={(e) => field.onChange(e.target.value)}
                        >
                          <Radio.Button value="house">House</Radio.Button>
                          <Radio.Button value="condo">Condo</Radio.Button>
                          <Radio.Button value="other">Other</Radio.Button>
                        </Radio.Group>
                      )}
                    />
                    {errors.homeType && (
                      <span className="form-error">{errors.homeType.message}</span>
                    )}
                  </div>

                  <div className="form-field">
                    <label>Do you have other pets? *</label>
                    <FormSelect
                      name="hasPets"
                      control={control}
                      handleChange={setHasPets}
                      options={[
                        { value: "", label: "Select" },
                        { value: "true", label: "Yes" },
                        { value: "false", label: "No" },
                      ]}
                    />
                  </div>

                  {hasPets === "true" && (
                    <div className="form-field">
                      <label htmlFor="petDetails">Pet Details</label>
                      <FormTextArea
                        name="petDetails"
                        control={control}
                        placeholder="Please describe your other pets"
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-step">
                  <div className="agreement-section">
                    <p className="agreement-title">Agreement</p>
                    <p className="agreement-text">
                      I agree to provide monthly updates about the cat for at least 6 months 
                      after adoption. This helps us ensure the cat is well-cared for.
                    </p>
                    <div className="agreement-checkbox">
                      <FormCheckbox name="agree" control={control} />
                      <label htmlFor="agree">
                        I agree to the terms and conditions
                      </label>
                    </div>
                    {errors.agree && (
                      <span className="form-error">{errors.agree.message}</span>
                    )}
                  </div>
                </div>
              )}

              <div className="form-actions">
                {currentStep > 0 && (
                  <Button onClick={prevStep}>
                    Previous
                  </Button>
                )}
                {currentStep < 2 ? (
                  <Button type="primary" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="submit"
                    disabled={!!catIsAdopted(cat)}
                  >
                    Submit Application
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}

