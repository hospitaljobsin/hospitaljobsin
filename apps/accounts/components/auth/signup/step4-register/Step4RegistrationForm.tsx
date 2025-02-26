"use client";

import { Tab, Tabs } from "@heroui/react";
import { useState } from "react";
import PasskeyRegistration from "./PasskeyRegistration";
import PasswordRegistration from "./PasswordRegistration";

export default function Step4RegistrationForm() {
	const [selected, setSelected] = useState("passkey");
	return (
		<Tabs
			fullWidth
			aria-label="Registration Options"
			selectedKey={selected}
			size="md"
			onSelectionChange={(selected) => setSelected(selected.toString())}
		>
			<Tab key="passkey" title="Passkey">
				<PasskeyRegistration />
			</Tab>
			<Tab key="password" title="Password">
				<PasswordRegistration />
			</Tab>
		</Tabs>
	);
}
