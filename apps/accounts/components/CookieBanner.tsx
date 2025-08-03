"use client";

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import { cookieConsentGiven, setCookieConsent } from "../lib/cookie-consent";

export default function CookieBanner() {
	const [consentGiven, setConsentGiven] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setConsentGiven(cookieConsentGiven());
	}, []);

	useEffect(() => {
		if (consentGiven === "undecided") {
			setIsOpen(true);
		}
	}, [consentGiven]);

	useEffect(() => {
		if (consentGiven !== "") {
			posthog.set_config({
				persistence: consentGiven === "yes" ? "localStorage+cookie" : "memory",
			});
		}
	}, [consentGiven]);

	const handleAcceptCookies = () => {
		setCookieConsent("yes");
		setConsentGiven("yes");
		setIsOpen(false);
	};

	const handleDeclineCookies = () => {
		setCookieConsent("no");
		setConsentGiven("no");
		setIsOpen(false);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={() => {}}
			isDismissable={false}
			hideCloseButton
			shouldBlockScroll={false}
			classNames={{
				base: "fixed bottom-4 sm:right-4 m-0 max-w-sm",
				backdrop: "bg-transparent pointer-events-none",
				wrapper: "items-end justify-end pointer-events-none",
			}}
			placement="bottom"
			size="md"
		>
			<ModalContent className="bg-white border border-gray-200 shadow-lg rounded-lg pointer-events-auto">
				<ModalHeader className="pb-2">
					<h3 className="text-sm font-medium text-gray-900">
						Help us improve your experience
					</h3>
				</ModalHeader>
				<ModalBody className="pb-3">
					<p className="text-xs text-gray-600">
						We use cookies and similar technologies to make our site work,
						remember your preferences, and measure traffic.
					</p>
				</ModalBody>
				<ModalFooter className="gap-2">
					<Button
						size="sm"
						color="default"
						variant="light"
						onPress={handleDeclineCookies}
						className="text-xs"
					>
						Reject all
					</Button>
					<Button
						size="sm"
						color="primary"
						onPress={handleAcceptCookies}
						className="text-xs"
					>
						Accept all
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
