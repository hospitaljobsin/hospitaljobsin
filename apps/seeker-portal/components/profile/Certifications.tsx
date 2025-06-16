import type { CertificationsFragment$key } from "@/__generated__/CertificationsFragment.graphql";
import { Button, Card, CardBody, CardHeader } from "@heroui/react";
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
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader className="flex gap-6 w-full items-center justify-between">
					<div className="flex items-center gap-2 text-foreground-400">
						<ShieldCheckIcon />
						<h1 className="w-full text-sm font-medium">Certifications</h1>
					</div>
					<Button
						startContent={<EditIcon size={24} />}
						onPress={onEditProfile}
						variant="light"
					>
						Edit
					</Button>
				</CardHeader>
				<CardBody className="flex flex-col gap-10">
					{data.certifications.length < 1 ? (
						<h2 className="w-full text-foreground-500">
							Add your certifications
						</h2>
					) : (
						<div className="flex flex-col gap-8 w-full">
							{data.certifications.map((cert) => (
								<div
									className="flex gap-4 flex-col items-center w-full"
									key={`${cert.name}-${cert.issuer}-${cert.certificationUrl}`}
								>
									<h3 className="w-full text-foreground-500 text-lg font-medium">
										{cert.name}
									</h3>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Issuer:</p>
										<p className="italic">{cert.issuer}</p>
									</div>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>URL:</p>
										<a
											href={cert.certificationUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-blue-600 underline"
										>
											{cert.certificationUrl}
										</a>
									</div>
									<div className="w-full flex gap-2 text-foreground-500">
										<p>Issued:</p>
										<p>{cert.createdAt}</p>
									</div>
									{cert.expiresAt && (
										<div className="w-full flex gap-2 text-foreground-500">
											<p>Expires:</p>
											<p>{cert.expiresAt}</p>
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
