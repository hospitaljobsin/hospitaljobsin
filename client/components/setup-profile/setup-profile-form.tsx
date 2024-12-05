"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Input,
} from "@nextui-org/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Education schema:
// type: Doctorate, Master's, Bachelor's, Associate's, High School, Other
// university/ institution name
// course name
// specialization
// course type - full time/ part time/ correspondence (distance learning)
// course start date
// course end date

// Personal Info schema:
// gender
// date of birth
// address- {line1, line2, city, state, country, pincode}
// is differently abled
// Category (SC/ST/OBC/General)

// Current Job Schema:
// current organization
// current salary

// Misc:
// total job experience

// Interested in applying for schema:
// work location- office/ remote
// salary expectations

// Links schema:
// linkedin URL
// other doctor specific sites?

const setupProfileSchema = z.object({
  personalInfo: z.object({}),
  education: z.array(z.string()),
});

export default function SetupProfileform() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof setupProfileSchema>>({
    resolver: zodResolver(setupProfileSchema),
  });

  async function onSubmit(values: z.infer<typeof setupProfileSchema>) {}

  return (
    <Card>
      <CardHeader>
        <h1 className={`text-2xl text-center w-full`}>Log in to continue</h1>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="flex-1 rounded-lg px-6 pb-4 pt-8">
            <div className="w-full flex flex-col gap-6">
              <Input
                id="email"
                label="Email"
                placeholder="Enter your email address"
                type="email"
                {...register("email")}
                errorMessage={errors.email?.message}
                isInvalid={!!errors.email}
              />
              <Input
                id="password"
                label="Password"
                placeholder="Enter password"
                type="password"
                {...register("password")}
                errorMessage={errors.password?.message}
                isInvalid={!!errors.password}
                description={
                  <div className="w-full flex justify-start">
                    <Link
                      href="/auth/reset-password/submit"
                      className="mt-2 cursor-pointer text-blue-500"
                    >
                      Forgot password?
                    </Link>
                  </div>
                }
              />

              <Button fullWidth isLoading={isSubmitting} type="submit">
                Log in
              </Button>
            </div>
          </div>
        </form>
      </CardBody>{" "}
      <Divider />
    </Card>
  );
}
