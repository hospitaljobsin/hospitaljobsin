"use client";

import type { UpdateAboutMeFormFragment$key } from "@/__generated__/UpdateAboutMeFormFragment.graphql";
import type { UpdateAboutMeFormMutation as UpdateAboutMeFormMutationType } from "@/__generated__/UpdateAboutMeFormMutation.graphql";
import { Button, Card, CardBody, CardHeader, Input, cn } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollIcon } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";
import MarkdownEditor from "../forms/text-editor/MarkdownEditor";

const ProfessionalSummaryFragment = graphql`
  fragment UpdateAboutMeFormFragment on Profile {
    professionalSummary
	headline
  }
`;

const UpdateAboutMeFormMutation = graphql`
  mutation UpdateAboutMeFormMutation($professionalSummary: String!, $headline: String!) {
    updateProfileAboutMe(professionalSummary: $professionalSummary, headline: $headline) {
      ... on Account {
        ...IncompleteProfileBannerFragment
        profile {
          ...UpdateAboutMeFormFragment
        }
      }
    }
  }
`;

const formSchema = z.object({
	professionalSummary: z.string(),
	headline: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateAboutMeForm({
	rootQuery,
	onSaveChanges,
}: {
	rootQuery: UpdateAboutMeFormFragment$key;
	onSaveChanges: () => void;
}) {
	const data = useFragment(ProfessionalSummaryFragment, rootQuery);
	const [commitMutation, isInFlight] =
		useMutation<UpdateAboutMeFormMutationType>(UpdateAboutMeFormMutation);
	const [isPending, startTransition] = useTransition();

	const {
		handleSubmit,
		control,
		register,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			professionalSummary: data.professionalSummary ?? "",
			headline: data.headline ?? "",
		},
	});

	const onSubmit = (values: FormValues) => {
		commitMutation({
			variables: {
				professionalSummary: values.professionalSummary,
				headline: values.headline,
			},
			onCompleted: () => {
				onSaveChanges();
			},
		});
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-8 sm:space-y-12">
			<Card className="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full" shadow="none">
				<CardHeader>
					<div className="flex items-center gap-2 text-foreground-400">
						<ScrollIcon className="w-5 h-5 sm:w-6 sm:h-6" />
						<h1 className="w-full text-base sm:text-sm font-medium">
							Editing About Me
						</h1>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-8 sm:gap-12">
					<Input
						{...register("headline")}
						label="Headline"
						placeholder="Enter your headline"
						type="text"
						errorMessage={errors.headline?.message}
						isInvalid={!!errors.headline}
						className="w-full"
					/>
					<Controller
						control={control}
						name="professionalSummary"
						render={({ field }) => (
							<div className="flex flex-col gap-2 sm:gap-4 w-full">
								<h2
									className={cn(
										"text-sm inline-flex gap-0.5 text-foreground-600",
										{
											"text-danger": errors.professionalSummary,
										},
									)}
								>
									Professional Summary
								</h2>
								<MarkdownEditor
									initialValue={field.value}
									onValueChange={(value) => {
										field.onChange(value);
									}}
									isInvalid={errors.professionalSummary != null}
									description={
										errors.professionalSummary ? (
											<p className="text-tiny text-danger">
												{errors.professionalSummary.message}
											</p>
										) : (
											<p className="text-tiny text-foreground-400">
												Markdown editing is supported.
											</p>
										)
									}
								/>
							</div>
						)}
					/>
				</CardBody>
			</Card>
			<div className="flex flex-col-reverse sm:flex-row justify-end gap-4 w-full">
				<Button
					variant="bordered"
					onPress={onSaveChanges}
					className="w-full sm:w-auto"
				>
					Cancel
				</Button>
				<Button
					type="submit"
					isLoading={isInFlight || isPending}
					className="w-full sm:w-auto"
				>
					Save Changes
				</Button>
			</div>
		</form>
	);
}
