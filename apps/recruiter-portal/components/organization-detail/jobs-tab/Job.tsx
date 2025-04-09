import type { JobFragment$key } from "@/__generated__/JobFragment.graphql";
import { getRelativeTimeString } from "@/lib/intl";
import links from "@/lib/links";
import { useRouter } from "@bprogress/next";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { useParams } from "next/navigation";
import { useFragment } from "react-relay";
import { graphql } from "relay-runtime";

export const JobFragment = graphql`
  fragment JobFragment on Job {
    slug
    title
    skills
    createdAt
	applicationCount
	vacancies
  }
`;

type Props = {
	job: JobFragment$key;
};

export default function Job({ job }: Props) {
	const router = useRouter();
	const orgSlug = useParams<{ slug: string }>().slug;
	const data = useFragment(JobFragment, job);

	return (
		<Card
			fullWidth
			className="p-4 sm:p-6 cursor-pointer space-y-6"
			isPressable
			as="div"
			disableRipple
			onPress={() => {
				router.push(links.organizationJobDetail(orgSlug, data.slug));
			}}
			shadow="none"
		>
			<CardHeader className="flex flex-col gap-6 w-full items-start">
				<h4 className="text-lg/7 sm:text-xl/8 font-medium text-balance">
					{data.title}
				</h4>
				<div className="flex flex-wrap gap-2 sm:gap-4 w-full justify-start">
					{data.skills.map((skill) => (
						<Chip variant="flat" key={skill}>
							{skill}
						</Chip>
					))}
				</div>
			</CardHeader>
			<CardBody className="flex flex-col gap-10 w-full">
				<div className="w-full flex flex-wrap justify-between items-center gap-4 sm:gap-8 px-6 sm:px-8">
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">Applied</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">Shortlisted</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">Interviewed</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">On Hold</p>
					</div>
					<div className="flex flex-col items-center gap-2">
						<h2 className="text-2xl font-medium text-foreground-700">
							{data.applicationCount}
						</h2>
						<p className="text-md text-foreground-500">Offered</p>
					</div>
				</div>
			</CardBody>
			<CardFooter className="flex flex-col sm:flex-row items-end sm:items-center justify-end gap-6 sm:gap-8 w-full text-center sm:text-left">
				{data.vacancies && (
					<p className="text-foreground-500 text-sm sm:text-base font-normal whitespace-nowrap">
						<span className="font-medium">{data.vacancies}</span> vacancies
					</p>
				)}
				<p
					className="text-foreground-500 text-sm sm:text-base font-normal whitespace-nowrap"
					suppressHydrationWarning
				>
					Posted {getRelativeTimeString(data.createdAt)}
				</p>
			</CardFooter>
		</Card>
	);
}
