"use client";

import links from "@/lib/links";
import { zodResolver } from "@hookform/resolvers/zod";
import { Google } from "@lobehub/icons";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
} from "@nextui-org/react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { graphql, useMutation } from "react-relay";
import { z } from "zod";
import type { LoginFormMutation as LoginFormMutationType } from "./__generated__/LoginFormMutation.graphql";

const LoginFormMutation = graphql`
  mutation LoginFormMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      __typename
      ... on InvalidCredentialsError {
        message
      }
    }
  }
`;

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(1),
});

export default function LoginForm() {
	const router = useRouter();
	const params = useSearchParams();

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);

	const redirectTo = params.get("return_to") || links.landing;
	const [commitMutation, isMutationInFlight] =
		useMutation<LoginFormMutationType>(LoginFormMutation);
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		reValidateMode: "onBlur",
	});

	function onSubmit(values: z.infer<typeof loginSchema>) {
		commitMutation({
			variables: {
				email: values.email,
				password: values.password,
			},
			onCompleted(response) {
				if (response.login.__typename === "InvalidCredentialsError") {
					setError("email", { message: response.login.message });
					setError("password", { message: response.login.message });
				} else {
					router.replace(redirectTo);
				}
			},
			updater(store) {
				store.invalidateStore();
			},
		});
	}

	return (
		<Card className="p-6 space-y-6" shadow="sm">
			<CardHeader>
				<h1 className="text-2xl text-center w-full">Log in to continue</h1>
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
						<Input
							id="password"
							label="Password"
							placeholder="Enter password"
							type={isPasswordVisible ? "text" : "password"}
							endContent={
								<button
									aria-label="toggle password visibility"
									className="focus:outline-none"
									type="button"
									onClick={() => setIsPasswordVisible(!isPasswordVisible)}
								>
									{isPasswordVisible ? (
										<EyeIcon className="text-2xl text-default-400 pointer-events-none" />
									) : (
										<EyeOffIcon className="text-2xl text-default-400 pointer-events-none" />
									)}
								</button>
							}
							{...register("password")}
							errorMessage={errors.password?.message}
							isInvalid={!!errors.password}
							description={
								<div className="w-full flex justify-start">
									<Link
										href={links.resetPasswordSubmit}
										className="mt-2 cursor-pointer text-blue-500"
									>
										Forgot password?
									</Link>
								</div>
							}
						/>

						<Button
							fullWidth
							isLoading={isSubmitting || isMutationInFlight}
							type="submit"
						>
							Log in
						</Button>
					</div>
				</form>
			</CardBody>
			<CardFooter className="flex flex-col w-full gap-8">
				<div className="w-full flex items-center justify-center gap-6">
					<Divider className="flex-1" />
					<p>or</p>
					<Divider className="flex-1" />
				</div>
				<Button
					fullWidth
					variant="bordered"
					startContent={<Google.Color size={20} />}
				>
					Log in with Google
				</Button>
				<div className="flex justify-center w-full">
					<Link
						href={links.signup}
						className="mt-2 cursor-pointer text-blue-500"
					>
						{"Don't have an account? "} Sign up.
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
