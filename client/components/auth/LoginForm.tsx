"use client";

import links from "@/lib/links";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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

	const redirectTo = params.get("return_to") || "/";
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
				if (response.login?.__typename === "InvalidCredentialsError") {
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
							type="password"
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
			</CardBody>{" "}
			<Divider />
			<CardFooter>
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
