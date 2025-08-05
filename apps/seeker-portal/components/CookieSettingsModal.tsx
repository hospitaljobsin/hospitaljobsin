"use client";
import { cookieConsentGiven, setCookieConsent } from "@/lib/cookie-consent";
import {
	Button,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Switch,
} from "@heroui/react";
import { useEffect, useState } from "react";

interface CookieSettings {
	necessary: boolean;
	analytics: boolean;
}

interface CookieSettingsModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export default function CookieSettingsModal({
	isOpen,
	onClose,
}: CookieSettingsModalProps) {
	const [cookieSettings, setCookieSettings] = useState<CookieSettings>({
		necessary: true, // Always enabled
		analytics: false,
	});

	const [isLoading, setIsLoading] = useState(false);

	// Load existing cookie preferences when modal opens
	useEffect(() => {
		if (isOpen) {
			const currentConsent = cookieConsentGiven();
			setCookieSettings({
				necessary: true, // Always enabled
				analytics: currentConsent === "yes",
			});
		}
	}, [isOpen]);

	const handleSave = async () => {
		setIsLoading(true);
		try {
			// Set analytics consent (marketing follows the same preference for now)
			const consent = cookieSettings.analytics ? "yes" : "no";
			await setCookieConsent(consent);
			onClose();
		} catch (error) {
			console.error("Failed to save cookie preferences:", error);
			// You might want to show an error message to the user here
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="lg"
			className="space-y-6 p-4"
		>
			<ModalContent>
				<ModalHeader className="flex flex-col gap-1">
					Cookie Settings
				</ModalHeader>
				<ModalBody>
					<div className="space-y-8">
						<div className="flex flex-col gap-2">
							<h3 className="text-sm font-medium mb-2">
								Manage your cookie preferences
							</h3>
							<p className="text-xs text-foreground-500">
								We use cookies to enhance your experience on our platform. You
								can customize your preferences below.
							</p>
						</div>

						<Divider />

						<div className="space-y-8">
							{/* Necessary Cookies */}
							<div className="flex items-center justify-between">
								<div className="flex-2">
									<h4 className="text-sm font-medium">Necessary Cookies</h4>
									<p className="text-xs text-foreground-500 mt-1">
										Essential for the site to work. These cannot be disabled.
									</p>
								</div>
								<Switch
									isSelected={cookieSettings.necessary}
									isDisabled
									className="ml-4"
								/>
							</div>

							<Divider />

							{/* Analytics Cookies */}
							<div className="flex items-center justify-between">
								<div className="flex-2">
									<h4 className="text-sm font-medium">Analytics Cookies</h4>
									<p className="text-xs text-foreground-500 mt-1">
										Help us understand how visitors interact with our website by
										collecting and reporting information. This data is used to
										improve our website and services.
									</p>
								</div>
								<Switch
									isSelected={cookieSettings.analytics}
									onValueChange={(value) =>
										setCookieSettings((prev) => ({ ...prev, analytics: value }))
									}
									className="ml-4"
								/>
							</div>
						</div>
					</div>
				</ModalBody>
				<ModalFooter>
					<Button
						color="primary"
						fullWidth
						onPress={handleSave}
						isLoading={isLoading}
						disabled={isLoading}
					>
						Save Preferences
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}
