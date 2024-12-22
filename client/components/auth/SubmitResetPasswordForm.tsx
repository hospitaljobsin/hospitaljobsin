"use client";

import links from "@/lib/links";
import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import { resetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const submitResetPasswordSchema = z.object({
	email: z.string().email(),
});

export default function SubmitResetPasswordFrom() {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof submitResetPasswordSchema>>({
		resolver: zodResolver(submitResetPasswordSchema),
	});

	async function onSubmit(values: z.infer<typeof submitResetPasswordSchema>) {
		try {
			await resetPassword({ username: values.email });
		} catch (error) {
			setErrorMessage(getErrorMessage(error));
			return;
		}

		router.replace(links.resetPasswordConfirm);
	}
	return (
		<Card className="p-6 space-y-6">
			<CardHeader>
				<h1 className="text-center text-2xl w-full">
					Request a Password Reset
				</h1>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
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
						<Button fullWidth isLoading={isSubmitting} type="submit">
							Send Code
						</Button>
					</div>

					<div className="flex h-8 items-end space-x-1">
						<div
							className="flex h-8 items-end space-x-1"
							aria-live="polite"
							aria-atomic="true"
						>
							{errorMessage && (
								<p className="text-sm text-red-500">{errorMessage}</p>
							)}
						</div>
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
