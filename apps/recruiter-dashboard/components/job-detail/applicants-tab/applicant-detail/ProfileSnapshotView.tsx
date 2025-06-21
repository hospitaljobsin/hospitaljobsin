"use client";
import type { ProfileSnapshotViewFragment$key } from "@/__generated__/ProfileSnapshotViewFragment.graphql";
import { Card, CardBody, CardHeader } from "@heroui/react";
import {
	BookIcon,
	BriefcaseIcon,
	IdCardIcon,
	LanguagesIcon,
	MapPinHouseIcon,
	ShieldCheckIcon,
	UserIcon,
} from "lucide-react";
import { graphql, useFragment } from "react-relay";

const ProfileSnapshotViewFragment = graphql`
	fragment ProfileSnapshotViewFragment on ProfileSnapshot {
		gender
		dateOfBirth
		address
		maritalStatus
		category
		locationsOpenToWork
		openToRelocationAnywhere
		education {
			degree
			institution
			startedAt
			completedAt
		}
		licenses {
			name
			issuer
			licenseNumber
			issuedAt
			expiresAt
			verificationStatus
			verifiedAt
		}
		languages {
			name
			proficiency
		}
		jobPreferences
		workExperience {
			title
			organization
			startedAt
			completedAt
			employmentType
			skills
		}
		salaryExpectations {
			preferredMonthlySalaryInr
			negotiable
		}
		certifications {
			name
			issuer
			certificationUrl
			createdAt
			expiresAt
		}
	}
`;

export default function ProfileSnapshotView(props: {
	profileSnapshot: ProfileSnapshotViewFragment$key;
}) {
	const data = useFragment(ProfileSnapshotViewFragment, props.profileSnapshot);

	const calculateAge = (dob: string | Date) => {
		const birthDate = new Date(dob);
		const today = new Date();
		let age = today.getFullYear() - birthDate.getFullYear();
		const m = today.getMonth() - birthDate.getMonth();
		if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
			age--;
		}
		return age;
	};

	return (
		<div className="w-full space-y-12">
			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex gap-2 items-center">
						<UserIcon size={16} className="text-foreground-500" />
						<h2 className="text-foreground-500 text-sm">Personal Details</h2>
					</div>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
						<div className="flex flex-col gap-2">
							<h3 className="w-full text-lg font-medium">Age</h3>
							<p className="w-full text-foreground-500">
								{data.dateOfBirth
									? `${calculateAge(
											data.dateOfBirth,
										)} yrs (${new Date(data.dateOfBirth).toLocaleDateString()})`
									: "Not provided"}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="w-full text-lg font-medium">Gender</h3>
							<p className="w-full text-foreground-500">
								{data.gender ?? "Not provided"}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="w-full text-lg font-medium">Marital Status</h3>
							<p className="w-full text-foreground-500">
								{data.maritalStatus ?? "Not provided"}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="w-full text-lg font-medium">Category</h3>
							<p className="w-full text-foreground-500">
								{data.category ?? "Not provided"}
							</p>
						</div>
						<div className="flex flex-col gap-2 col-span-1 md:col-span-2">
							<h3 className="w-full text-lg font-medium">Address</h3>
							<p className="w-full text-foreground-500">
								{data.address ?? "Not provided"}
							</p>
						</div>
					</div>
				</CardBody>
			</Card>

			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex gap-2 items-center">
						<BriefcaseIcon size={16} className="text-foreground-500" />
						<h2 className="text-foreground-500 text-sm">Work Experience</h2>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-8 w-full">
					{data.workExperience.length > 0 ? (
						data.workExperience.map((exp, idx) => (
							<div
								key={`${exp.title}-${exp.organization}`}
								className="flex flex-col gap-4 w-full"
							>
								<h3 className="w-full text-lg font-medium">
									{exp.title} at {exp.organization}
								</h3>
								<p className="text-sm text-foreground-500">
									{new Date(exp.startedAt).toLocaleDateString()} -{" "}
									{exp.completedAt
										? new Date(exp.completedAt).toLocaleDateString()
										: "Present"}
								</p>
								<p className="text-sm">
									Employment Type: {exp.employmentType ?? "N/A"}
								</p>
								{exp.skills.length > 0 && (
									<p className="text-sm">Skills: {exp.skills.join(", ")}</p>
								)}
								{idx < data.workExperience.length - 1 && (
									<div className="w-full pt-4">
										<hr className="border-foreground-200" />
									</div>
								)}
							</div>
						))
					) : (
						<p className="w-full text-foreground-500">
							No work experience provided.
						</p>
					)}
				</CardBody>
			</Card>

			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex gap-2 items-center">
						<BookIcon size={16} className="text-foreground-500" />
						<h2 className="text-foreground-500 text-sm">Education</h2>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-8 w-full">
					{data.education.length > 0 ? (
						data.education.map((edu, idx) => (
							<div
								key={`${edu.degree}-${edu.institution}`}
								className="flex flex-col gap-4 w-full"
							>
								<h3 className="w-full text-lg font-medium">{edu.degree}</h3>
								<p className="w-full text-foreground-500">{edu.institution}</p>
								<p className="text-sm text-foreground-500">
									{new Date(edu.startedAt).toLocaleDateString()} -{" "}
									{edu.completedAt
										? new Date(edu.completedAt).toLocaleDateString()
										: "Ongoing"}
								</p>
								{idx < data.education.length - 1 && (
									<div className="w-full pt-4">
										<hr className="border-foreground-200" />
									</div>
								)}
							</div>
						))
					) : (
						<p className="w-full text-foreground-500">
							No education history provided.
						</p>
					)}
				</CardBody>
			</Card>

			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex gap-2 items-center">
						<LanguagesIcon size={16} className="text-foreground-500" />
						<h2 className="text-foreground-500 text-sm">Languages</h2>
					</div>
				</CardHeader>
				<CardBody className="flex flex-col gap-8 w-full">
					{data.languages.length > 0 ? (
						data.languages.map((lang) => (
							<div key={lang.name} className="flex flex-col gap-2 w-full">
								<h3 className="w-full text-lg font-medium">{lang.name}</h3>
								<p className="w-full text-foreground-500 italic">
									{lang.proficiency}
								</p>
							</div>
						))
					) : (
						<p className="w-full text-foreground-500">No languages provided.</p>
					)}
				</CardBody>
			</Card>

			<Card className="p-6 space-y-6" shadow="none">
				<CardHeader>
					<div className="flex gap-2 items-center">
						<MapPinHouseIcon size={16} className="text-foreground-500" />
						<h2 className="text-foreground-500 text-sm">
							Preferences & Skills
						</h2>
					</div>
				</CardHeader>
				<CardBody>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
						<div className="flex flex-col gap-2 col-span-1 md:col-span-2">
							<h3 className="w-full text-lg font-medium">Job Preferences</h3>
							<p className="w-full text-foreground-500">
								{data.jobPreferences.join(", ") || "N/A"}
							</p>
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="w-full text-lg font-medium">Salary Expectation</h3>
							{data.salaryExpectations ? (
								<p className="w-full text-foreground-500">
									₹{data.salaryExpectations.preferredMonthlySalaryInr}/month{" "}
									{data.salaryExpectations.negotiable ? "(Negotiable)" : ""}
								</p>
							) : (
								<p className="w-full text-foreground-500">Not provided</p>
							)}
						</div>
						<div className="flex flex-col gap-2">
							<h3 className="w-full text-lg font-medium">Relocation</h3>
							<p className="w-full text-foreground-500">
								{data.openToRelocationAnywhere
									? "Open to relocation anywhere"
									: "Not open to relocation"}
							</p>
						</div>
						{!data.openToRelocationAnywhere &&
							data.locationsOpenToWork.length > 0 && (
								<div className="flex flex-col gap-2 col-span-1 md:col-span-2">
									<h3 className="w-full text-lg font-medium">
										Preferred Locations
									</h3>
									<p className="w-full text-foreground-500">
										{data.locationsOpenToWork.join(", ") || "N/A"}
									</p>
								</div>
							)}
					</div>
				</CardBody>
			</Card>

			{data.certifications.length > 0 && (
				<Card className="p-6 space-y-6" shadow="none">
					<CardHeader>
						<div className="flex gap-2 items-center">
							<ShieldCheckIcon size={16} className="text-foreground-500" />
							<h2 className="text-foreground-500 text-sm">Certifications</h2>
						</div>
					</CardHeader>
					<CardBody className="flex flex-col gap-8 w-full">
						{data.certifications.map((cert, idx) => (
							<div
								key={`${cert.name}-${cert.issuer}`}
								className="flex flex-col gap-4 w-full"
							>
								<h3 className="w-full text-lg font-medium">{cert.name}</h3>
								<p className="text-medium text-foreground-500">
									from {cert.issuer}
								</p>
								<a
									href={cert.certificationUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-blue-500 hover:underline"
								>
									Show Certificate
								</a>
								<p className="text-sm text-foreground-500">
									Issued: {new Date(cert.createdAt).toLocaleDateString()}
									{cert.expiresAt &&
										` - Expires: ${new Date(
											cert.expiresAt,
										).toLocaleDateString()}`}
								</p>
								{idx < data.certifications.length - 1 && (
									<div className="w-full pt-4">
										<hr className="border-foreground-200" />
									</div>
								)}
							</div>
						))}
					</CardBody>
				</Card>
			)}

			{data.licenses.length > 0 && (
				<Card className="p-6 space-y-6" shadow="none">
					<CardHeader>
						<div className="flex gap-2 items-center">
							<IdCardIcon size={16} className="text-foreground-500" />
							<h2 className="text-foreground-500 text-sm">Licenses</h2>
						</div>
					</CardHeader>
					<CardBody className="flex flex-col gap-8 w-full">
						{data.licenses.map((lic, idx) => (
							<div
								key={`${lic.name}-${lic.licenseNumber}`}
								className="flex flex-col gap-4 w-full"
							>
								<h3 className="w-full text-lg font-medium">
									{lic.name} ({lic.licenseNumber})
								</h3>
								<p className="w-full text-foreground-500">from {lic.issuer}</p>
								<p className="text-sm capitalize">
									Status: {lic.verificationStatus}
								</p>
								<p className="text-sm text-foreground-500">
									Issued: {new Date(lic.issuedAt).toLocaleDateString()}
									{lic.expiresAt &&
										` - Expires: ${new Date(
											lic.expiresAt,
										).toLocaleDateString()}`}
								</p>
								{idx < data.licenses.length - 1 && (
									<div className="w-full pt-4">
										<hr className="border-foreground-200" />
									</div>
								)}
							</div>
						))}
					</CardBody>
				</Card>
			)}
		</div>
	);
}
