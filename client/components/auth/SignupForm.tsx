"use client";

import { env } from "@/lib/env";
import links from "@/lib/links";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Divider,
	Input,
} from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Google } from "@lobehub/icons";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next-nprogress-bar";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import z from "zod";
import type { SignupFormMutation as SignupFormMutationType } from "./__generated__/SignupFormMutation.graphql";

const SignupFormMutation = graphql`
  mutation SignupFormMutation($email: String!, $password: String!, $fullName: String!) {
    register(email: $email, password: $password, fullName: $fullName) {
      __typename
      ... on EmailInUseError {
        message
      }
    }
  }
`;

const signUpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(6),
	fullName: z.string().min(1),
});

export default function SignUpForm() {
	const router = useRouter();

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [commitMutation, isMutationInFlight] =
		useMutation<SignupFormMutationType>(SignupFormMutation);
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
	});

	async function onSubmit(values: z.infer<typeof signUpSchema>) {
		commitMutation({
			variables: {
				email: values.email,
				password: values.password,
				fullName: values.fullName,
			},
			onCompleted(response) {
				if (response.register.__typename === "EmailInUseError") {
					setError("email", { message: response.register.message });
				} else {
					router.replace(links.confirmSignup);
				}
			},
		});
	}

	return (
		<Card className="p-6 space-y-6" shadow="sm">
			<CardHeader>
				<h1 className="text-2xl text-center w-full">Create an account</h1>
			</CardHeader>
			<CardBody>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
					<div className="w-full flex flex-col gap-6">
						<Input
							label="Full Name"
							labelPlacement="outside"
							placeholder="Enter your full name"
							type="text"
							id="fullName"
							{...register("fullName")}
							errorMessage={errors.fullName?.message}
							isInvalid={!!errors.fullName}
						/>
						<Input
							label="Email"
							labelPlacement="outside"
							placeholder="Enter your email address"
							type="email"
							id="email"
							{...register("email")}
							errorMessage={errors.email?.message}
							isInvalid={!!errors.email}
						/>

						<Input
							label="Password"
							labelPlacement="outside"
							placeholder="Enter password"
							type={isPasswordVisible ? "text" : "password"}
							id="password"
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
						/>
						<Button
							fullWidth
							type="submit"
							isLoading={isSubmitting || isMutationInFlight}
						>
							Create account
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
					onPress={() => {
						window.location.href = `${env.NEXT_PUBLIC_API_URL}/auth/signin/google?redirect_uri=${encodeURIComponent(window.location.origin)}`;
					}}
				>
					Sign in with Google
				</Button>
				<div className="flex justify-center w-full">
					<Link href={links.login} className="cursor-pointer text-blue-500">
						Already have an account? Log in.
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
