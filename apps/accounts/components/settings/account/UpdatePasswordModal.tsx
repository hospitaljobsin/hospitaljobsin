import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useFragment, useMutation } from "react-relay";
import { graphql } from "relay-runtime";
import { z } from "zod/v4-mini";
import type { UpdatePasswordModalFragment$key } from "@/__generated__/UpdatePasswordModalFragment.graphql";
import type { UpdatePasswordModalMutation } from "@/__generated__/UpdatePasswordModalMutation.graphql";

const UpdatePasswordModalFragment = graphql`
  fragment UpdatePasswordModalFragment on Account {
    authProviders
  }
`;

const UpdatePasswordMutation = graphql`
  mutation UpdatePasswordModalMutation($newPassword: String!) {
	updatePassword(newPassword: $newPassword) {
		__typename
		... on Account {
            id
			...PasswordFragment
            ...UpdatePasswordModalFragment
		}
		... on PasswordNotStrongError {
			message
		}
	}
  }
`;

const formSchema = z
	.object({
		newPassword: z.string().check(
			z.minLength(1, "This field is required"),
			z.minLength(8, "Password must be at least 8 characters long."),
			z.refine((password) => /[a-z]/.test(password), {
				message: "Password must contain at least one lowercase letter.",
			}),
			z.refine((password) => /[A-Z]/.test(password), {
				message: "Password must contain at least one uppercase letter.",
			}),
			z.refine((password) => /\d/.test(password), {
				message: "Password must contain at least one number.",
			}),
			z.refine((password) => /[!@#$%^&*()\-_=+]/.test(password), {
				message:
					"Password must contain at least one special character (!@#$%^&*()-_=+).",
			}),
		),
		confirmNewPassword: z
			.string()
			.check(z.minLength(1, "This field is required")),
	})
	.check(
		z.refine((data) => data.newPassword === data.confirmNewPassword, {
			message: "Passwords don't match",
			path: ["confirmNewPassword"],
		}),
	);

export default function UpdatePasswordModal({
	isOpen,
	onOpenChange,
	onClose,
	account,
}: {
	isOpen: boolean;
	onOpenChange: (isOpen: boolean) => void;
	onClose: () => void;
	account: UpdatePasswordModalFragment$key;
}) {
	const [commitMutation, isMutationInFlight] =
		useMutation<UpdatePasswordModalMutation>(UpdatePasswordMutation);
	const data = useFragment(UpdatePasswordModalFragment, account);

	const {
		handleSubmit,
		register,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<z.infer<typeof formSchema>>({
		resolver: standardSchemaResolver(formSchema),
		defaultValues: {
			newPassword: "",
			confirmNewPassword: "",
		},
	});

	const [isPasswordVisible, setIsPasswordVisible] = useState(false);
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false);

	function onSubmit(formData: z.infer<typeof formSchema>) {
		commitMutation({
			variables: {
				newPassword: formData.newPassword,
			},
			onCompleted(response) {
				if (response.updatePassword.__typename === "Account") {
					onClose();
				} else if (
					response.updatePassword.__typename === "PasswordNotStrongError"
				) {
					setError("newPassword", {
						message: response.updatePassword.message,
					});
				}
			},
		});
	}

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			size="xl"
			scrollBehavior="inside"
			className="overflow-y-auto"
		>
			<ModalContent className="flex flex-col w-full gap-6 p-4 sm:p-6">
				<ModalHeader className="flex flex-col gap-4 w-full">
					{data.authProviders.includes("PASSWORD") ? (
						<h2 className="text-lg font-medium">Update password</h2>
					) : (
						<h2 className="text-lg font-medium">Set password</h2>
					)}
				</ModalHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-12 w-full">
					<ModalBody className="w-full flex flex-col gap-6 items-start">
						<Input
							label="New Password"
							placeholder="Enter new password"
							{...register("newPassword")}
							autoComplete="new-password"
							type={isPasswordVisible ? "text" : "password"}
							endContent={
								<button
									type="button"
									onClick={() => setIsPasswordVisible(!isPasswordVisible)}
									className="focus:outline-none"
								>
									{isPasswordVisible ? (
										<EyeIcon className="text-2xl text-default-400" />
									) : (
										<EyeOffIcon className="text-2xl text-default-400" />
									)}
								</button>
							}
							errorMessage={errors.newPassword?.message}
							isInvalid={!!errors.newPassword}
						/>
						<Input
							label="Confirm New Password"
							placeholder="Confirm new password"
							{...register("confirmNewPassword")}
							autoComplete="new-password"
							type={isConfirmPasswordVisible ? "text" : "password"}
							endContent={
								<button
									type="button"
									onClick={() =>
										setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
									}
									className="focus:outline-none"
								>
									{isConfirmPasswordVisible ? (
										<EyeIcon className="text-2xl text-default-400" />
									) : (
										<EyeOffIcon className="text-2xl text-default-400" />
									)}
								</button>
							}
							errorMessage={errors.confirmNewPassword?.message}
							isInvalid={!!errors.confirmNewPassword}
						/>
					</ModalBody>
					<ModalFooter className="w-full pt-0">
						<Button variant="light" onPress={onClose}>
							Cancel
						</Button>
						<Button
							color="primary"
							type="submit"
							isLoading={isMutationInFlight || isSubmitting}
						>
							{data.authProviders.includes("PASSWORD")
								? "Update password"
								: "Set password"}
						</Button>
					</ModalFooter>
				</form>
			</ModalContent>
		</Modal>
	);
}
