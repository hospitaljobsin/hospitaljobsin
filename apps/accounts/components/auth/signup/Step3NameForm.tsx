"use client";

import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import SignupContext from "./SignupContext";

const step3Schema = z.object({
	fullName: z.string().min(1, "This field is required"),
});

export default function Step3NameForm() {
	const { send } = SignupContext.useActorRef();
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: zodResolver(step3Schema),
		defaultValues: { password: "", fullName: "" },
	});

	const onSubmit = async (data: { password: string; fullName: string }) => {
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
