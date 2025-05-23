"use client";

import { Button, Input } from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useForm } from "react-hook-form";
import { z } from "zod/v4-mini";
import SignupContext from "./SignupContext";

const step3Schema = z.object({
	fullName: z.string().check(z.minLength(1, "This field is required")),
});

export default function Step3NameForm() {
	const { send } = SignupContext.useActorRef();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof step3Schema>>({
		resolver: standardSchemaResolver(step3Schema),
		defaultValues: { fullName: "" },
	});

	const onSubmit = async (data: z.infer<typeof step3Schema>) => {
		send({
			type: "SET_FULL_NAME",
			fullName: data.fullName,
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
			<div className="w-full flex flex-col gap-6">
				<Input
					label="Full Name"
					placeholder="Enter your full name"
					{...register("fullName")}
					autoComplete="off"
					errorMessage={errors.fullName?.message}
					isInvalid={!!errors.fullName}
				/>
				<Button fullWidth type="submit" isLoading={isSubmitting}>
					Continue
				</Button>
			</div>
		</form>
	);
}
