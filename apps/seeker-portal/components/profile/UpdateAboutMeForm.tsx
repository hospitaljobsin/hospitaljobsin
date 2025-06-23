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
	professionalSummary: z.string().min(1, "Summary is required"),
	headline: z.string().min(1, "Headline is required"),
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
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex items-center gap-2 text-foreground-400">
						<ScrollIcon />
						<h1 className="w-full text-sm font-medium">Editing About Me</h1>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-12">
					<Input
						{...register("headline")}
						label="Headline"
						placeholder="Enter your headline"
						type="text"
						errorMessage={errors.headline?.message}
						isInvalid={!!errors.headline}
					/>
					<Controller
						control={control}
						name="professionalSummary"
						render={({ field }) => (
							<div className="flex flex-col gap-4 w-full">
								<h2
									className={cn("text-small inline-flex gap-0.5", {
										"text-danger": errors.professionalSummary,
									})}
								>
									Professional Summary <p className="text-danger">*</p>
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
			<div className="flex justify-end gap-2">
				<Button variant="light" onPress={onSaveChanges}>
					Cancel
				</Button>
				<Button type="submit" isLoading={isInFlight || isPending}>
					Save Changes
				</Button>
			</div>
		</form>
	);
}
