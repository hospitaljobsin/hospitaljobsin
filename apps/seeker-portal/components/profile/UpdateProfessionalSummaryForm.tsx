"use client";

import type { UpdateProfessionalSummaryFormFragment$key } from "@/__generated__/UpdateProfessionalSummaryFormFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UpdateProfessionalSummaryFormMutation as UpdateProfessionalSummaryFormMutationType } from "__generated__/UpdateProfessionalSummaryFormMutation.graphql";
import { ScrollIcon } from "lucide-react";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { graphql, useFragment, useMutation } from "react-relay";
import { z } from "zod";
import MarkdownEditor from "../forms/text-editor/MarkdownEditor";

const ProfessionalSummaryFragment = graphql`
  fragment UpdateProfessionalSummaryFormFragment on Profile {
    professionalSummary
  }
`;

const UpdateProfessionalSummaryFormMutation = graphql`
  mutation UpdateProfessionalSummaryFormMutation($professionalSummary: String!) {
    updateProfileProfessionalSummary(professionalSummary: $professionalSummary) {
      ... on Account {
        ...IncompleteProfileBannerFragment
        profile {
          ...UpdateProfessionalSummaryFormFragment
        }
      }
    }
  }
`;

const formSchema = z.object({
	professionalSummary: z.string().min(1, "Summary is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateProfessionalSummaryForm({
	rootQuery,
	onSaveChanges,
}: {
	rootQuery: UpdateProfessionalSummaryFormFragment$key;
	onSaveChanges: () => void;
}) {
	const data = useFragment(ProfessionalSummaryFragment, rootQuery);
	const [commitMutation, isInFlight] =
		useMutation<UpdateProfessionalSummaryFormMutationType>(
			UpdateProfessionalSummaryFormMutation,
		);
	const [isPending, startTransition] = useTransition();

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			professionalSummary: data.professionalSummary ?? "",
		},
	});

	const onSubmit = (values: FormValues) => {
		commitMutation({
			variables: {
				professionalSummary: values.professionalSummary,
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
						<h1 className="w-full text-sm font-medium">
							Editing Professional Summary
						</h1>
					</div>
				</CardHeader>
				<CardBody>
					<Controller
						control={control}
						name="professionalSummary"
						render={({ field }) => (
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
