import type { LicensesFragment$key } from "@/__generated__/LicensesFragment.graphql";
import { useCopilotReadable } from "@copilotkit/react-core";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { IdCardIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const LicensesFragment = graphql`
  fragment LicensesFragment on ProfileSnapshot {
    __typename
    licenses {
      name
      issuer
      licenseNumber
      issuedAt
      expiresAt
      verificationStatus
      verifiedAt
    }
  }
`;

type Props = {
	rootQuery: LicensesFragment$key;
};

export default function Licenses({ rootQuery }: Props) {
	const data = useFragment(LicensesFragment, rootQuery);

	useCopilotReadable({
		description: "The current applicant's licenses",
		value: data.licenses,
	});

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<IdCardIcon />
						<h1 className="w-full text-sm font-medium">Licenses</h1>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{data.licenses.length < 1 ? (
						<h2 className="w-full text-foreground-500">No licenses</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.licenses.map((lic) => (
								<div
									className="flex gap-4 flex-col items-center w-full"
									key={`${lic.name}-${lic.issuer}-${lic.licenseNumber}`}
								>
									<h3 className="w-full text-foreground-500 text-lg font-medium">
										{lic.name}
									</h3>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Issuer:</p>
										<p className="italic">{lic.issuer}</p>
									</div>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>License Number:</p>
										<p className="italic">{lic.licenseNumber}</p>
									</div>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Issued:</p>
										<p>{lic.issuedAt}</p>
									</div>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Expires:</p>
										<p>{lic.expiresAt}</p>
									</div>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Verification Status:</p>
										<p>{lic.verificationStatus}</p>
									</div>
									{lic.verifiedAt && (
										<div className="w-full flex gap-2 text-foreground-500">
											<p>Verified At:</p>
											<p>{lic.verifiedAt}</p>
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
