"use client";

import links from "@/lib/links";
import { getErrorMessage } from "@/utils/get-error-message";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
import { confirmResetPassword } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const confirmResetPasswordSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	code: z.string().min(6),
});

export default function ConfirmResetPasswordForm() {
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof confirmResetPasswordSchema>>({
		resolver: zodResolver(confirmResetPasswordSchema),
	});

	async function onSubmit(values: z.infer<typeof confirmResetPasswordSchema>) {
		try {
			await confirmResetPassword({
				username: values.email,
				confirmationCode: values.code,
				newPassword: values.password,
			});
		} catch (error) {
			setErrorMessage(getErrorMessage(error));
			return;
		}

		router.replace(links.login);
	}
	return (
		<Card shadow="sm">
			<CardHeader>
				<h1 className={"w-full text-center text-2xl"}>Reset your password</h1>
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
								label="New Password"
								placeholder="Enter password"
								type="password"
								{...register("password")}
								errorMessage={errors.password?.message}
								isInvalid={!!errors.password}
							/>
							<Input
								id="code"
								label="Confirmation Code"
								placeholder="Enter code"
								type="text"
								{...register("code")}
								errorMessage={errors.code?.message}
								isInvalid={!!errors.code}
							/>
							<Button fullWidth isLoading={isSubmitting} type="submit">
								Reset Password
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
					</div>
				</form>
			</CardBody>
		</Card>
	);
}
