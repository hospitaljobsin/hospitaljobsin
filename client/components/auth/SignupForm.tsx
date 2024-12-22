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
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import z from "zod";

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
	const [commitMutation, isMutationInFlight] = useMutation(SignupFormMutation);
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
				if (response.register?.__typename === "EmailInUseError") {
					setError("email", { message: response.register.message });
				} else {
					router.replace(links.confirmSignup);
				}
			},
		});
	}

	return (
		<Card className="p-6 space-y-6">
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
							type="password"
							id="password"
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
			<Divider />
			<CardFooter>
				<div className="flex justify-center w-full">
					<Link href={links.login} className="cursor-pointer text-blue-500">
						Already have an account? Log in.
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
