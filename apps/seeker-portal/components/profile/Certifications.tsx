import type { CertificationsFragment$key } from "@/__generated__/CertificationsFragment.graphql";
import { monthYearFormat } from "@/lib/intl";
import { Button, Card, CardBody, CardHeader, Link } from "@heroui/react";
import { EditIcon, ShieldCheckIcon } from "lucide-react";
import { graphql, useFragment } from "react-relay";

const CertificationsFragment = graphql`
  fragment CertificationsFragment on Profile {
    __typename
    certifications {
      name
      issuer
      certificationUrl
      createdAt
      expiresAt
    }
  }
`;

type Props = {
	rootQuery: CertificationsFragment$key;
	onEditProfile: () => void;
};

export default function Certifications({ rootQuery, onEditProfile }: Props) {
	const data = useFragment(CertificationsFragment, rootQuery);

	return (
		<div className="space-y-12">
			<Card className="p-4 sm:p-6 space-y-6" shadow="none">
				<CardHeader className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full items-start sm:items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<ShieldCheckIcon />
						<h1 className="w-full text-base sm:text-sm font-medium">
							Certifications
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
				<CardBody className="flex flex-col gap-8 sm:gap-10">
					{data.certifications.length < 1 ? (
						<h2 className="w-full text-foreground-500 text-base sm:text-lg">
							Add your certifications
						</h2>
					) : (
						<div className="flex flex-col gap-6 sm:gap-8 w-full">
							{data.certifications.map((cert, idx) => (
								<div
									className="flex flex-col gap-8 sm:gap-12 w-full"
									key={`${cert.name}-${cert.issuer}-${cert.certificationUrl}`}
								>
									<div className="flex flex-col gap-4 sm:gap-6 items-start w-full">
										<h3 className="w-full text-base sm:text-lg font-medium">
											{cert.name}
										</h3>
										<p className="text-medium text-foreground-500">
											{cert.issuer}
										</p>
										<Link
											href={cert.certificationUrl}
											isExternal
											showAnchorIcon
											className="text-base"
										>
											Show Certificate
										</Link>
										<div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 mt-2">
											<div className="flex gap-2 text-foreground-500 items-center text-sm">
												<p>Issued</p>
												<p>
													{monthYearFormat.format(new Date(cert.createdAt))}
												</p>
											</div>
											{cert.expiresAt && (
												<div className="flex gap-2 text-foreground-500 items-center text-sm">
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
