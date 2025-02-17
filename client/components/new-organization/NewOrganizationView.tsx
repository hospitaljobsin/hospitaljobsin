"use client";
import {
	Button,
	Card,
	CardBody,
	CardFooter,
	CardHeader,
	Input,
	Textarea,
} from "@heroui/react";
import { useState } from "react";

export default function NewOrganizationView() {
	const [inviteLink, setInviteLink] = useState("");
	const [organizationName, setOrganizationName] = useState("");
	const [pricingTier, setPricingTier] = useState("");

	const handleInviteLinkChange = (e) => setInviteLink(e.target.value);
	const handleOrganizationNameChange = (e) =>
		setOrganizationName(e.target.value);
	const handlePricingTierChange = (e) => setPricingTier(e.target.value);

	return (
		<div className="flex flex-col w-full h-full">
			<Card shadow="none" className="p-6 gap-8">
				<CardHeader>Create an Organization</CardHeader>
				<CardBody className="flex flex-col gap-8">
					<Input
						label="Organization Full Name"
						labelPlacement="outside"
						placeholder="My Organization Name"
						value={organizationName}
						onChange={handleOrganizationNameChange}
					/>
					<Input
						label="Organization Slug"
						labelPlacement="outside"
						placeholder="my-organization-slug"
						value={organizationName}
						onChange={handleOrganizationNameChange}
					/>
					<div className="flex gap-12 w-full items-center">
						<Input
							label="Organization Logo"
							labelPlacement="outside"
							type="file"
							value={organizationName}
							onChange={handleOrganizationNameChange}
						/>
						<Input
							label="Organization Website"
							labelPlacement="outside"
							placeholder="https://example.com"
							value={organizationName}
							onChange={handleOrganizationNameChange}
						/>
					</div>
					<Textarea
						label="Organization Description"
						labelPlacement="outside"
						placeholder="Enter Organization Description"
						value={organizationName}
						onChange={handleOrganizationNameChange}
					/>
				</CardBody>
				<CardFooter>
					<Button fullWidth>Create Organization</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
