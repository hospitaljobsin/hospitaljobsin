import type { CertificationsFragment$key } from "@/__generated__/CertificationsFragment.graphql";
import { monthYearFormat } from "@/lib/intl";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardBody, CardHeader, Link } from "@heroui/react";
import { ShieldCheckIcon, SparklesIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const CertificationsFragment = graphql`
  fragment CertificationsFragment on JobApplicant {
	profileSnapshot {
	__typename
    certifications {
      name
      issuer
      certificationUrl
      createdAt
      expiresAt
    }
	}
    analysis {
      __typename
      ... on JobApplicantAnalysis {
        analysedFields {
          certifications { analysis score }
        }
      }
    }
  }
`;

type Props = {
	rootQuery: CertificationsFragment$key;
};

export default function Certifications({ rootQuery }: Props) {
	const query = useFragment(CertificationsFragment, rootQuery);
	const data = query.profileSnapshot;
	const analysis =
		query.analysis?.__typename === "JobApplicantAnalysis"
			? query.analysis.analysedFields?.certifications
			: undefined;

	useCopilotReadable({
		description: "The current applicant's certifications",
		value: data.certifications,
	});

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<ShieldCheckIcon />
						<h1 className="w-full text-sm font-medium">Certifications</h1>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{analysis && (
						<div className="text-xs text-primary-600 mb-2 flex flex-col items-start gap-4 border border-foreground-200 rounded-md p-4 bg-primary-100">
							<div className="flex items-center gap-4 text-medium">
								<SparklesIcon size={18} /> {analysis.score}%
							</div>
							<p>{analysis.analysis}</p>
						</div>
					)}
					{data.certifications.length < 1 ? (
						<h2 className="w-full text-foreground-500">No certifications</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.certifications.map((cert, idx) => (
								<div
									className="flex flex-col gap-12 w-full"
									key={`${cert.name}-${cert.issuer}-${cert.certificationUrl}`}
								>
									<div className="flex gap-4 flex-col items-start w-full">
										<h3 className="w-full text-lg font-medium">{cert.name}</h3>
										<p className="text-medium text-foreground-500">
											{cert.issuer}
										</p>
										<Link
											href={cert.certificationUrl}
											isExternal
											showAnchorIcon
										>
											Show Certificate
										</Link>
										<div className="w-full flex items-center gap-6">
											<div className="flex gap-2 text-foreground-500 items-center">
												<p>Issued</p>
												<p>
													{monthYearFormat.format(new Date(cert.createdAt))}
												</p>
											</div>
											{cert.expiresAt && (
												<div className="flex gap-2 text-foreground-500 items-center">
													<p>Expires</p>
													<p>
														{monthYearFormat.format(new Date(cert.expiresAt))}
													</p>
												</div>
											)}
										</div>
									</div>
									{idx < data.certifications.length - 1 && (
										<div className="w-full">
											<hr className="border-foreground-200" />
										</div>
									)}
								</div>
							))}
						</div>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
