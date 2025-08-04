"use client";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import Cookies from "js-cookie";
import posthog from "posthog-js";
import { useEffect, useState } from "react";
import type { PreloadedQuery } from "react-relay";
import { usePreloadedQuery, useQueryLoader } from "react-relay";
import { graphql } from "relay-runtime";
import { cookieConsentGiven, setCookieConsent } from "../lib/cookie-consent";
import useIsAuthenticated from "../lib/hooks/useIsAuthenticated";

// GraphQL query to fetch viewer with termsAndPolicy
export const CookieBannerConsentQuery = graphql`
  query CookieBannerConsentQuery {
    viewer {
      __typename
      ... on Account {
        __typename
        id
        termsAndPolicy {
          type
        }
      }
      ... on NotAuthenticatedError {
        __typename
      }
    }
  }
`;

export default function CookieBanner() {
	const { isAuthenticated } = useIsAuthenticated();
	const [consentGiven, setConsentGiven] = useState<string>("undecided");
	const [isOpen, setIsOpen] = useState(false);
	const [queryReference, loadQuery, disposeQuery] = useQueryLoader(
		CookieBannerConsentQuery,
	);

	// Check browser cookie first - if it exists, use it and skip server request
	useEffect(() => {
		const browserConsent = cookieConsentGiven();
		if (browserConsent !== "undecided") {
			// User has already made a choice, use browser cookie
			setConsentGiven(browserConsent);
		} else if (isAuthenticated && !queryReference) {
			// No browser cookie and user is authenticated, fetch from server
			loadQuery({});
		} else if (!isAuthenticated) {
			// Anonymous user with no browser cookie
			setConsentGiven("undecided");
		}
	}, [isAuthenticated, loadQuery, queryReference]);

	// Show banner only if consent is undecided
	useEffect(() => {
		if (consentGiven === "undecided") {
			setIsOpen(true);
		} else {
			setIsOpen(false);
		}
	}, [consentGiven]);

	// Configure PostHog based on consent
	useEffect(() => {
		if (consentGiven !== "") {
			posthog.set_config({
				persistence: consentGiven === "yes" ? "localStorage+cookie" : "memory",
			});
		}
	}, [consentGiven]);

	const handleAcceptCookies = async () => {
		try {
			await setCookieConsent("yes");
			setConsentGiven("yes");
			setIsOpen(false);
		} catch (error) {
			console.error("Failed to set cookie consent:", error);
		}
	};

	const handleDeclineCookies = async () => {
		try {
			await setCookieConsent("no");
			setConsentGiven("no");
			setIsOpen(false);
		} catch (error) {
			console.error("Failed to set cookie consent:", error);
		}
	};

	// For authenticated users with query reference, render the content component
	if (isAuthenticated && queryReference) {
		return (
			<CookieBannerContent
				queryReference={queryReference}
				disposeQuery={disposeQuery}
				consentGiven={consentGiven}
				setConsentGiven={setConsentGiven}
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				handleAcceptCookies={handleAcceptCookies}
				handleDeclineCookies={handleDeclineCookies}
			/>
		);
	}

	// For anonymous users or when browser cookie is already set, render the modal directly
	return (
		<CookieBannerModal
			isOpen={isOpen}
			handleAcceptCookies={handleAcceptCookies}
			handleDeclineCookies={handleDeclineCookies}
		/>
	);
}

// Component to handle authenticated user data
function CookieBannerContent({
	queryReference,
	setConsentGiven,
	isOpen,
	handleAcceptCookies,
	handleDeclineCookies,
}: {
	queryReference: PreloadedQuery<any>;
	disposeQuery: () => void;
	consentGiven: string;
	setConsentGiven: (consent: string) => void;
	isOpen: boolean;
	setIsOpen: (open: boolean) => void;
	handleAcceptCookies: () => Promise<void>;
	handleDeclineCookies: () => Promise<void>;
}) {
	const data = usePreloadedQuery(CookieBannerConsentQuery, queryReference);

	// Determine consent status from server data
	useEffect(() => {
		if (data.viewer.__typename === "Account") {
			const consentType = data.viewer.termsAndPolicy.type;
			// Map server enum to local consent format
			const consentMap: Record<string, string> = {
				ACCEPTANCE: "yes",
				REJECTION: "no",
				UNDECIDED: "undecided",
			};
			setConsentGiven(consentMap[consentType] || "undecided");
			Cookies.set(
				"analytics_preference",
				consentMap[consentType] || "undecided",
			);
		}
	}, [data.viewer, setConsentGiven]);

	return (
		<CookieBannerModal
			isOpen={isOpen}
			handleAcceptCookies={handleAcceptCookies}
			handleDeclineCookies={handleDeclineCookies}
		/>
	);
}

// Modal component
function CookieBannerModal({
	isOpen,
	handleAcceptCookies,
	handleDeclineCookies,
}: {
	isOpen: boolean;
	handleAcceptCookies: () => Promise<void>;
	handleDeclineCookies: () => Promise<void>;
}) {
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
