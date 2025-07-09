import type { LicensesFragment$key } from "@/__generated__/LicensesFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
import { EditIcon, IdCardIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const LicensesFragment = graphql`
  fragment LicensesFragment on Profile {
    __typename
    licenses {
      name
      issuer
      licenseNumber
	  registrationYear
      verificationStatus
      verifiedAt
    }
  }
`;

type Props = {
	rootQuery: LicensesFragment$key;
	onEditProfile: () => void;
};

export default function Licenses({ rootQuery, onEditProfile }: Props) {
	const data = useFragment(LicensesFragment, rootQuery);

	return (
		<div className="space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full items-start sm:items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400 w-full">
						<IdCardIcon />
						<h1 className="w-full text-base sm:text-sm font-medium">
							Licenses
						</h1>
					</div>
					<Button
						startContent={<EditIcon size={24} />}
						onPress={onEditProfile}
						variant="flat"
						className="w-full sm:w-auto"
					>
						Edit
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{data.licenses.length < 1 ? (
						<h2 className="w-full text-foreground-500">Add your licenses</h2>
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
										<p>Registration Year:</p>
										<p>{lic.registrationYear}</p>
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
