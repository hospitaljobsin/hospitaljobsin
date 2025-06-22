import type { NewJobContentFragment$key } from "@/__generated__/NewJobContentFragment.graphql";
import PageNewJobQuery, {
	type pageNewJobQuery,
} from "@/__generated__/pageNewJobQuery.graphql";
import links from "@/lib/links";
import { Button, Card, CardBody, Input, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { PreloadedQuery } from "react-relay";
import { graphql, useFragment, usePreloadedQuery } from "react-relay";
import invariant from "tiny-invariant";
import { z } from "zod";
import JobCreationForm from "./JobCreationForm";

const OPTIONS = [
	{
		key: "scratch",
		title: "Create from Scratch",
		description:
			"Describe the job you want to create and let AI generate the details.",
	},
	{
		key: "import",
		title: "Import Existing Job",
		description: "Import and edit an existing job (coming soon).",
	},
];

const POLL_INTERVAL = 2000;

interface KickoffResponse {
	kickoff_id: string;
}
interface JobStatusResponse {
	status: string;
	data?: Record<string, unknown>;
	error?: string;
}

const formSchema = z.object({
	outline: z.string().min(1, "This field is required").max(2000),
});

export const NewJobContentFragment = graphql`
	fragment NewJobContentFragment on Query @argumentDefinitions(slug: { type: "String!" }) {
		organization(slug: $slug) {
			__typename
			... on Organization {
				...JobCreationFormFragment
			}
		}
	}
`;

// MOCK: Replace this with real API integration when backend is ready
const MOCK_JOB_DATA = {
	title: "ICU Nurse",
	description:
		"We are seeking a dedicated ICU nurse to join our hospital team. Responsibilities include patient care in the ICU, monitoring vital signs, and collaborating with physicians.",
	vacancies: 3,
	skills: ["Critical Care", "Patient Monitoring", "Teamwork"],
	location: "New Delhi, India",
	minSalary: 40000,
	maxSalary: 60000,
	minExperience: 2,
	maxExperience: 5,
	expiresAt: null,
	jobType: "FULL_TIME",
	workMode: "OFFICE",
};

const MOCK_MODE = true; // Set to false when backend is ready

export default function NewJobContent({
	initialQueryRef,
}: { initialQueryRef: PreloadedQuery<pageNewJobQuery> }) {
	const data = usePreloadedQuery(PageNewJobQuery, initialQueryRef);
	const orgData = useFragment<NewJobContentFragment$key>(
		NewJobContentFragment,
		data,
	);
	const router = useRouter();
	const [selected, setSelected] = useState<string | null>(null);
	const [kickoffId, setKickoffId] = useState<string | null>(null);
	const [jobStatus, setJobStatus] = useState<JobStatusResponse | null>(null);
	const [polling, setPolling] = useState(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, isValid, errors },
		reset,
	} = useForm<z.infer<typeof formSchema>>({ mode: "onChange" });

	invariant(
		orgData.organization.__typename === "Organization",
		"Expected 'Organization' node type.",
	);

	// Polling effect
	useEffect(() => {
		if (MOCK_MODE) return; // Skip polling in mock mode
		if (!kickoffId) return;
		setPolling(true);
		setApiError(null);
		setJobStatus(null);
		let cancelled = false;
		let pollTimeout: NodeJS.Timeout;

		const poll = async () => {
			try {
				const res = await fetch(links.aiGenerateJobStatus(kickoffId));
				if (!res.ok) throw new Error("Failed to fetch job status");
				const status: JobStatusResponse = await res.json();
				if (cancelled) return;
				setJobStatus(status);
				if (status.status === "done" || status.status === "failed") {
					setPolling(false);
					return;
				}
				pollTimeout = setTimeout(poll, POLL_INTERVAL);
			} catch (err) {
				setApiError("Error polling job status");
				setPolling(false);
			}
		};
		poll();
		return () => {
			cancelled = true;
			if (pollTimeout) clearTimeout(pollTimeout);
		};
	}, [kickoffId]);

	// Helper to map AI data to form default values
	function mapAIToFormDefaults(data: Record<string, unknown>) {
		const jobTypeValues = [
			"CONTRACT",
			"FULL_TIME",
			"INTERNSHIP",
			"PART_TIME",
		] as const;
		const workModeValues = ["HYBRID", "OFFICE", "REMOTE"] as const;
		return {
			title: (data.title as string) || "",
			description: (data.description as string) || "",
			vacancies: typeof data.vacancies === "number" ? data.vacancies : null,
			skills: Array.isArray(data.skills)
				? (data.skills as string[]).map((value) => ({ value }))
				: [],
			location: (data.location as string) || null,
			minSalary: typeof data.minSalary === "number" ? data.minSalary : null,
			maxSalary: typeof data.maxSalary === "number" ? data.maxSalary : null,
			minExperience:
				typeof data.minExperience === "number" ? data.minExperience : null,
			maxExperience:
				typeof data.maxExperience === "number" ? data.maxExperience : null,
			expiresAt: typeof data.expiresAt === "string" ? data.expiresAt : null,
			jobType: jobTypeValues.includes(
				data.jobType as (typeof jobTypeValues)[number],
			)
				? (data.jobType as (typeof jobTypeValues)[number])
				: null,
			workMode: workModeValues.includes(
				data.workMode as (typeof workModeValues)[number],
			)
				? (data.workMode as (typeof workModeValues)[number])
				: null,
		};
	}

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		setApiError(null);
		setKickoffId(null);
		setJobStatus(null);
		// MOCK: Simulate backend job generation
		setTimeout(() => {
			setJobStatus({
				status: "done",
				data: MOCK_JOB_DATA,
				error: undefined,
			});
			setKickoffId("mock-kickoff-id");
		}, 1000);
		reset();
		// Uncomment below for real API integration
		/*
		try {
			const res = await fetch(links.aiGenerateJob, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ outline: data.outline }),
			});
			if (!res.ok) throw new Error("Failed to start job generation");
			const json: KickoffResponse = await res.json();
			setKickoffId(json.kickoff_id);
			reset();
		} catch (err) {
			setApiError("Error starting job generation");
		}
		*/
	};

	// If job creation is done and data exists, show only the form and nothing else
	if (jobStatus && jobStatus.status === "done" && jobStatus.data) {
		return (
			<div className="w-full h-full flex justify-center items-start pl-6">
				<JobCreationForm
					defaultValues={mapAIToFormDefaults(jobStatus.data)}
					organization={orgData.organization}
					onSuccess={(slug: string) =>
						router.push(links.organizationJobDetail(slug))
					}
				/>
			</div>
		);
	}

	return (
		<div className="max-w-2xl mx-auto py-10 px-4">
			<h1 className="sm:text-lg text-sm font-medium text-foreground-500 mb-8">
				How would you like to create a job?
			</h1>
			<div className="space-y-6">
				<div className="grid grid-cols-1 gap-6">
					{OPTIONS.map((opt) => (
						<Card
							shadow="none"
							key={opt.key}
							isPressable
							isHoverable={false}
							isDisabled={opt.key === "import"}
							className={`transition-all duration-150 p-6 ${selected === opt.key ? "border-primary-500 ring-2 ring-primary-200" : "hover:border-primary-300"}`}
							onClick={() => setSelected(opt.key)}
						>
							<CardBody>
								<h2 className="text-lg font-medium mb-2">{opt.title}</h2>
								<p className="text-foreground-600">{opt.description}</p>
							</CardBody>
						</Card>
					))}
				</div>

				{selected === "scratch" && !kickoffId && (
					<Card className="mt-6 p-6" shadow="none">
						<CardBody>
							<form
								className="space-y-4"
								onSubmit={handleSubmit(onSubmit)}
								autoComplete="off"
							>
								<label htmlFor="job-outline-input" className="block">
									<span className="block text-sm font-medium text-foreground-700 mb-1">
										Job Outline
									</span>
									<Input
										id="job-outline-input"
										type="text"
										placeholder="e.g. ICU nurse posting with 5 vacancies"
										{...register("outline", { required: true })}
										disabled={isSubmitting}
										isRequired
									/>
								</label>
								<Button
									type="submit"
									color="primary"
									isLoading={isSubmitting}
									disabled={!isValid || isSubmitting}
								>
									Generate with AI
								</Button>
							</form>
						</CardBody>
					</Card>
				)}

				{selected === "scratch" && kickoffId && (
					<div className="mt-4 flex flex-col items-center gap-4">
						{!MOCK_MODE && polling && (
							<Spinner size="lg" label="Generating job with AI..." />
						)}
						{jobStatus && (
							<div className="text-center">
								<div className="font-medium mb-2">
									Status: {jobStatus.status}
								</div>
								{jobStatus.status === "failed" && (
									<>
										<div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
											Error: {jobStatus.error || "Unknown error"}
										</div>
										<Button
											color="primary"
											className="mt-4"
											onPress={() => {
												setKickoffId(null);
												setJobStatus(null);
												setApiError(null);
											}}
										>
											Retry
										</Button>
									</>
								)}
							</div>
						)}
						{apiError && (
							<div className="p-4 bg-red-50 border border-red-200 rounded text-red-800">
								{apiError}
							</div>
						)}
					</div>
				)}

				{selected === "import" && (
					<div className="mt-4">
						<span className="text-primary-600 font-medium">
							Import flow is coming soon.
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
