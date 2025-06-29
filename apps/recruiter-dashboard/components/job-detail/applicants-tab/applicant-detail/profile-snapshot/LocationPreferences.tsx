import type { LocationPreferencesFragment$key } from "@/__generated__/LocationPreferencesFragment.graphql";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { MapPinHouseIcon, SparklesIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const LocationPreferencesFragment = graphql`
  fragment LocationPreferencesFragment on JobApplicant {
	profileSnapshot {
        locationsOpenToWork
        openToRelocationAnywhere
        address
	}
    analysis {
      __typename
      ... on JobApplicantAnalysis {
        analysedFields {
          locationsOpenToWork { analysis score }
          openToRelocationAnywhere { analysis score }
          address { analysis score }
        }
      }
    }
  }
`;
type Props = {
	rootQuery: LocationPreferencesFragment$key;
};

export default function LocationPreferences({ rootQuery }: Props) {
	const query = useFragment(LocationPreferencesFragment, rootQuery);
	const data = query.profileSnapshot;
	const analysis =
		query.analysis?.__typename === "JobApplicantAnalysis"
			? query.analysis.analysedFields
			: undefined;

	useCopilotReadable({
		description: "The current applicant's location preferences",
		value: data,
	});
	const locations = data.locationsOpenToWork || [];
	const openToRelocation = data.openToRelocationAnywhere;

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<MapPinHouseIcon />
						<h1 className="w-full text-sm font-medium">Location Preferences</h1>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-8">
					<div className="flex flex-col gap-6 w-full items-center justify-start">
						{analysis?.address && (
							<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
								<div className="flex items-center gap-4 text-medium">
									<SparklesIcon size={18} /> {analysis.address.score}%
								</div>
								<p>{analysis.address.analysis}</p>
							</div>
						)}
						<h1 className="w-full font-medium">Current Address</h1>
						{!data.address ? (
							<h2 className="w-full text-foreground-500">
								No address provided
							</h2>
						) : (
							<h2 className="w-full text-foreground-500">{data.address}</h2>
						)}
					</div>
					<div className="flex items-start flex-col gap-4">
						{analysis?.openToRelocationAnywhere && (
							<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
								<div className="flex items-center gap-4 text-medium">
									<SparklesIcon size={18} />{" "}
									{analysis.openToRelocationAnywhere.score}%
								</div>
								<p>{analysis.openToRelocationAnywhere.analysis}</p>
							</div>
						)}
						{data.openToRelocationAnywhere ? (
							<span>Open to relocation anywhere</span>
						) : (
							<span>Not open to relocation anywhere</span>
						)}
					</div>
					<div className="mt-4 flex flex-col w-full gap-4">
						{analysis?.locationsOpenToWork && (
							<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
								<div className="flex items-center gap-4 text-medium">
									<SparklesIcon size={18} />{" "}
									{analysis.locationsOpenToWork.score}%
								</div>
								<p>{analysis.locationsOpenToWork.analysis}</p>
							</div>
						)}
						<div className="block mb-2 font-medium">
							Preferred work locations
						</div>
						{data.locationsOpenToWork && data.locationsOpenToWork.length > 0 ? (
							<div className="text-foreground-500">
								{data.locationsOpenToWork.join(", ")}
							</div>
						) : (
							<div className="text-foreground-500 text-sm">
								No locations set.
							</div>
						)}
					</div>

					{!data.openToRelocationAnywhere &&
						(!data.locationsOpenToWork ||
							data.locationsOpenToWork.length === 0) && (
							<div className="text-foreground-500 text-sm">
								No location preferences set.
							</div>
						)}
				</CardBody>
			</Card>
		</div>
	);
}
