"use client";

import { Tab, Tabs } from "@heroui/react";
import { FingerprintIcon, RectangleEllipsisIcon } from "lucide-react";
import { useState } from "react";
import PasskeyRegistration from "./PasskeyRegistration";
import PasswordRegistration from "./PasswordRegistration";

export default function Step4RegistrationForm() {
	const [selected, setSelected] = useState("passkey");
	return (
		<>
			<p className="w-full text-center text-foreground-600">
				How do you want to secure your account?
			</p>
			<Tabs
				fullWidth
				aria-label="Registration Options"
				selectedKey={selected}
				size="md"
				onSelectionChange={(selected) => setSelected(selected.toString())}
			>
				<Tab
					key="passkey"
					title={
						<div className="flex items-center space-x-2">
							<FingerprintIcon size={20} />
							<span>Passkey</span>
						</div>
					}
				>
					<PasskeyRegistration />
				</Tab>
				<Tab
					key="password"
					title={
						<div className="flex items-center space-x-2">
							<RectangleEllipsisIcon size={20} />
							<span>Password</span>
						</div>
					}
				>
					<PasswordRegistration />
				</Tab>
			</Tabs>
		</>
	);
}
