"use client";
import {
	Card,
	CardBody,
	CardHeader,
	Input,
	Radio,
	RadioGroup,
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
		<div className="flex flex-col w-full h-full gap-12">
			<Card shadow="none" className="p-6">
				<CardHeader>Create an Organization</CardHeader>
				<CardBody className="flex flex-col gap-6">
					<Input
						label="Organization Name"
						labelPlacement="outside"
						placeholder="Enter Organization Name"
						value={organizationName}
						onChange={handleOrganizationNameChange}
					/>
					<RadioGroup label="Select Pricing Tier">
						<Radio value="free" description="Free plan includes">
							Free
						</Radio>
						<Radio value="premium" description="Premium plan includes">
							Premium
						</Radio>
					</RadioGroup>
				</CardBody>
			</Card>
		</div>
	);
}
